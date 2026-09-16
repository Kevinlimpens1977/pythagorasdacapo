/**
 * Gedeelde bouwstenen om een bestaande docentpresentatie (PDF) als
 * slidedeckpakket plus slidedeck-lesblok in de bibliotheek te zetten. Dit is
 * wat scripts/plaats-binask-slidedecks.mjs voor hoofdstuk 1 deed; de
 * hoofdstuk-2-plaatsing gebruikt dezelfde bouwstenen, zodat er één manier
 * blijft waarop een PDF in Storage en een pakket in `slidedeckPackages` komt.
 *
 * Alles hier is puur (geen Firebase), behalve `uploadPdf`. Zo kan een
 * plaatsingsscript zijn plan eerst offline opbouwen en door dezelfde
 * readiness-controle halen als het beheerscherm.
 */

import fs from 'node:fs';
import { randomUUID } from 'node:crypto';

import { normalizeContentBlockSettings } from '../../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../../src/lib/contentReadiness.js';
import { buildSlidedeckCmsBlockSyncPatch } from '../../src/lib/slidedeckCmsSync.js';
import {
  buildInitialSlidedeckReviewMetadata,
  buildSlidedeckDeckUploadMetadata,
  validateSlidedeckPackageForCms
} from '../../src/lib/slidedeckReview.js';
import { normalizeSlidedeckReviewChecklist } from '../../src/lib/slidedeckReviewChecklist.js';

export const PROJECT_ID = 'pythagoras-eoa';
export const STORAGE_BUCKET = 'pythagoras-eoa.firebasestorage.app';

export const downloadUrl = (pad, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(pad)}?alt=media&token=${token}`;

export const cleanForFirestore = (value) => {
  if (Array.isArray(value)) return value.map(cleanForFirestore);
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, cleanForFirestore(child)])
    );
  }
  return value;
};

export const megabytes = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

export const leesPdf = (pad) => {
  if (!fs.existsSync(pad)) {
    throw new Error(`PDF niet gevonden: ${pad}`);
  }
  const buffer = fs.readFileSync(pad);
  if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new Error(`Geen PDF-bestand: ${pad}`);
  }
  return { pad, buffer, grootte: buffer.length };
};

/**
 * Het aantal pagina's in een PDF, geteld met dezelfde pdf.js als de app.
 * Dat getal gaat mee het pakket in, zodat de presentatieweergave "3 / 14" kan
 * tonen in plaats van "3 / ?" wanneer zij de PDF zelf niet kan inlezen.
 */
export const telPdfPaginas = async (buffer) => {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await getDocument({
    data: new Uint8Array(buffer),
    disableRange: true,
    disableStream: true,
    disableAutoFetch: true
  }).promise;
  const aantal = document.numPages;
  await document.destroy();
  return aantal;
};

/** Storagepad + downloadlink met een vers token, zoals de app ze na een upload opslaat. */
export const maakPdfReferentie = (storagePath, nu) => {
  const token = randomUUID();
  return { storagePath, downloadURL: downloadUrl(storagePath, token), uploadedAt: nu, token };
};

const LEGE_CONTEXT = {
  vakId: '',
  vakTitle: '',
  leerjaarId: '',
  leerjaarTitle: '',
  niveauId: '',
  niveauTitle: '',
  hoofdstukId: '',
  hoofdstukTitle: '',
  paragraafId: '',
  paragraafTitle: '',
  contentBlockId: ''
};

/**
 * Het pakketdocument voor `slidedeckPackages`. De aangeleverde PDF is zowel
 * bron als deck; het pakket wordt meteen goedgekeurd, want het is bestaand
 * docentmateriaal en geen AI-output.
 */
export const bouwSlidedeckPakket = ({
  id,
  deck,
  bestand,
  pdfReferentie,
  nu,
  maker,
  scriptNaam,
  learningGoals,
  linkedContext = {}
}) => {
  const sourceText = `Bestaande docentpresentatie, aangeleverd als PDF: ${deck.bestand}`;
  const review = buildInitialSlidedeckReviewMetadata({ learningGoals, sourceText });
  const upload = buildSlidedeckDeckUploadMetadata({
    file: { name: deck.bestand, size: bestand.grootte },
    userId: maker
  });
  const goedkeuring = {
    action: 'review_status_updated',
    reviewStatus: 'approved',
    note: 'Bestaande docentpresentatie, geen NotebookLM-output; direct goedgekeurd door het plaatsingsscript.',
    reviewChecklist: normalizeSlidedeckReviewChecklist({
      sourceFaithful: true,
      answersChecked: true,
      languageLevelChecked: true,
      privacyChecked: true
    }),
    userId: maker,
    createdAt: nu
  };
  const { token: _token, ...referentie } = pdfReferentie;

  return {
    id,
    title: deck.titel,
    learningGoals,
    sourceText,
    linkedContext: { ...LEGE_CONTEXT, ...linkedContext },
    promptTemplateId: null,
    promptTemplateName: '',
    promptSnapshot: '',
    sourcePdf: { ...referentie },
    sourceAssets: [],
    generatedDeckPdf: {
      fileName: deck.bestand,
      size: bestand.grootte,
      // 0 = onbekend; de viewer valt dan terug op "?" zoals voorheen.
      pageCount: Math.max(0, Math.round(Number(bestand.paginas || 0))) || 0,
      ...referentie
    },
    status: 'deckUploaded',
    ...review,
    reviewStatus: 'approved',
    reviewChecklist: goedkeuring.reviewChecklist,
    teacherDecisionNote: '',
    generationManifest: {
      ...review.generationManifest,
      ...upload.generationManifest,
      generatedAt: nu
    },
    teacherDecisionLog: [
      { ...upload.teacherDecisionLog[0], createdAt: nu },
      goedkeuring
    ],
    createdBy: maker,
    deckUploadedBy: maker,
    plaatsingMeta: { script: scriptNaam, geplaatstOp: nu }
  };
};

/** Het slidedeck-lesblok, met dezelfde patch die het beheerscherm na een deck-upload toepast. */
export const bouwSlidedeckBlok = ({ id, paragraaf, deck, volgnummer, pakket, maker }) => {
  const basis = {
    id,
    vakId: paragraaf.vakId,
    leerjaarId: paragraaf.leerjaarId,
    niveauId: paragraaf.niveauId,
    hoofdstukId: paragraaf.hoofdstukId,
    paragraafId: paragraaf.id,
    type: 'slidedeck',
    order: volgnummer,
    title: deck.titel,
    status: 'published',
    content: {
      html: '',
      slidedeckPackageId: pakket.id,
      deckTitle: deck.titel,
      generatedDeckUrl: '',
      generatedDeckStoragePath: '',
      sourcePdfUrl: '',
      sourcePdfStoragePath: ''
    },
    settings: normalizeContentBlockSettings({}, 'slidedeck'),
    linkedVraagId: null,
    createdBy: maker,
    isArchived: false
  };
  const patch = buildSlidedeckCmsBlockSyncPatch({ block: basis, deckPackage: pakket });
  return { ...basis, ...patch };
};

/** Dezelfde readiness-regels als het beheerscherm; geeft een lijst fouten (leeg = goed). */
export const controleerPlan = ({ pakketten = [], blokken = [] }) => {
  const fouten = [];
  pakketten.forEach((pakket) => {
    const check = validateSlidedeckPackageForCms(pakket);
    if (!check.canUseInCms) {
      fouten.push(`${pakket.id}: ${check.errors.map((issue) => issue.message).join(' ')}`);
    }
  });
  blokken.forEach(({ blok }) => {
    const readiness = validateContentBlockReadiness(blok);
    if (readiness.errors.length > 0) {
      fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
    }
    if (blok.status !== 'published') {
      fouten.push(`${blok.id}: status is "${blok.status}", verwacht "published".`);
    }
  });
  return fouten;
};

/** Zet een PDF in Storage met het downloadtoken dat in de downloadlink zit. */
export const uploadPdf = async (bucket, { storagePath, buffer, token }) =>
  bucket.file(storagePath).save(buffer, {
    resumable: true,
    contentType: 'application/pdf',
    metadata: {
      cacheControl: 'public, max-age=86400',
      metadata: { firebaseStorageDownloadTokens: token }
    }
  });
