/**
 * Plaatst bestaande Binask-presentaties (PDF) als slidedeck-lesblokken in de
 * paragraaf "Ga van start..." (1.1) van EOA leerroute 3, leerjaar 1 en 2.
 *
 * Per deck-PDF ontstaat een slidedeckpakket (`slidedeckPackages`), met de PDF
 * in Storage onder `slidedecks/<pakketId>/generated-deck.pdf`. Dat ene pakket
 * wordt in beide paragrafen als lesblok gebruikt: 3 pakketten, 6 lesblokken.
 * Daarnaast komt in leerjaar 2 een leesopdracht: een PDF als mediablok
 * (`mediaBlocks/<blokId>/...`), na de decks. Elk lesblok krijgt ook een
 * publieke snapshot (`publicContentBlocks`), anders ziet een leerling niets.
 * Alles krijgt een vaste id, zodat het script veilig nogmaals mag draaien
 * (bestaande documenten worden overschreven, niet verdubbeld).
 *
 * De pakketten worden meteen goedgekeurd (`reviewStatus: approved`) en de
 * lesblokken meteen gepubliceerd: het is bestaand docentmateriaal, geen
 * AI-output. Voordat er iets wordt geschreven, controleert het script elk
 * lesblok met dezelfde readiness-regels als het beheerscherm.
 *
 * Gebruik (Admin SDK via Application Default Credentials, net als
 * reset-leeromgeving.mjs en backfill-public-content-snapshots.mjs):
 *
 *   node scripts/plaats-binask-slidedecks.mjs --toon-plan       # offline, laat de documenten zien
 *   node scripts/plaats-binask-slidedecks.mjs                   # dry run tegen Firestore
 *   node scripts/plaats-binask-slidedecks.mjs --apply           # uploaden + schrijven
 *   node scripts/plaats-binask-slidedecks.mjs --apply --wijs-toe   # ook toewijzen aan ER3L1A/ER3L2A
 *
 * Opties:
 *   --bronmap <map>         map met de PDF's (standaard: sources/)
 *   --maker <uid>           uid dat als maker/uploader wordt vastgelegd
 *   --alleen-leerjaar <1|2> alleen dat leerjaar (en alleen die klas) bijwerken
 */

import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import { normalizeAssessmentItems } from '../src/lib/assessmentBlockUtils.js';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { buildSlidedeckCmsBlockSyncPatch } from '../src/lib/slidedeckCmsSync.js';
import {
  buildInitialSlidedeckReviewMetadata,
  buildSlidedeckDeckUploadMetadata,
  validateSlidedeckPackageForCms
} from '../src/lib/slidedeckReview.js';
import { normalizeSlidedeckReviewChecklist } from '../src/lib/slidedeckReviewChecklist.js';

const PROJECT_ID = 'pythagoras-eoa';
const STORAGE_BUCKET = 'pythagoras-eoa.firebasestorage.app';
const SCRIPT_NAAM = 'scripts/plaats-binask-slidedecks.mjs';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const wijsToe = argumenten.includes('--wijs-toe');
const toonPlan = argumenten.includes('--toon-plan');
const optie = (naam, standaard) => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};
const bronmap = path.resolve(optie('--bronmap', 'sources'));
const maker = optie('--maker', SCRIPT_NAAM);
const alleenLeerjaar = optie('--alleen-leerjaar', '');

// Volgorde = volgorde in de les. Elk deck komt in beide leerjaren.
const DECKS = [
  { sleutel: 'inleiding', bestand: 'inleiding binask.pdf', titel: 'Inleiding Binask' },
  { sleutel: 'deel1', bestand: 'bi na sk deel1.pdf', titel: 'Bi na sk deel 1' },
  { sleutel: 'deel2', bestand: 'bi na sk deel2.pdf', titel: 'Bi na sk deel 2' }
];

// Leesopdrachten: een PDF als mediablok, na de decks, alleen in het genoemde leerjaar.
const LEESOPDRACHTEN = [
  {
    sleutel: 'introductie-deel2',
    bestand: 'introductie binask deel2.pdf',
    titel: 'Lees door: Introductie Binask deel 2',
    leerjaar: '2',
    instructie: '<p>Lees deze presentatie rustig door. Je hebt hem nodig bij de volgende les.</p>'
  }
];

// Vragenronde als laatste blok in elk leerjaar: 30 meerkeuzevragen uit het
// oefenspel "Biologie, Natuurkunde of Scheikunde?". Resultaten gaan per vraag
// naar de voortgang van de docent; Digidocent staat uit (allowAiHelp: false).
const VRAGENRONDE = JSON.parse(fs.readFileSync(path.resolve('docs/seeds/binask-vragenronde-natuurwetenschappen.json'), 'utf8'));

const seed = JSON.parse(fs.readFileSync(path.resolve('docs/seeds/binask-eoa.seed.json'), 'utf8'));
const vak = seed.vakken[0];
const leerjaarKort = (paragraaf) => paragraaf.leerjaarId.replace('leerjaar-binask-eoa-', '');
const PARAGRAFEN = seed.paragrafen
  .filter((paragraaf) => paragraaf.code === '1.1')
  .filter((paragraaf) => !alleenLeerjaar || leerjaarKort(paragraaf) === alleenLeerjaar);
const KLAS_ROUTES = (seed.meta?.klasRoutes || [])
  .filter((route) => PARAGRAFEN.some((paragraaf) => paragraaf.niveauId === route.niveauId));

if (PARAGRAFEN.length === 0) {
  console.error('Geen paragraaf 1.1 gevonden in de seed voor deze selectie.');
  process.exit(1);
}

const pakketId = (deck) => `slidedeck-binask-eoa-${deck.sleutel}`;
const blokId = (paragraaf, type, volgnummer) => `block-binask-eoa-${leerjaarKort(paragraaf)}-11-${type}-${volgnummer}`;
const storagePad = (deck) => `slidedecks/${pakketId(deck)}/generated-deck.pdf`;
const mediaStoragePad = (paragraaf, opdracht, volgnummer) =>
  `mediaBlocks/${blokId(paragraaf, 'media', volgnummer)}/${opdracht.bestand.replace(/[^a-zA-Z0-9._-]+/g, '-')}`;
const downloadUrl = (pad, token) =>
  `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodeURIComponent(pad)}?alt=media&token=${token}`;

const cleanForFirestore = (value) => {
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

const leesBestand = (bestandsnaam) => {
  const pad = path.join(bronmap, bestandsnaam);
  if (!fs.existsSync(pad)) {
    throw new Error(`PDF niet gevonden: ${pad}`);
  }
  const buffer = fs.readFileSync(pad);
  if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new Error(`Geen PDF-bestand: ${pad}`);
  }
  return { pad, buffer, grootte: buffer.length };
};

const megabytes = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

/* ---------- documenten opbouwen (puur, zonder Firebase) ---------- */

const bouwPakket = (deck, bestand, pdfReferentie, nu) => {
  const sourceText = `Bestaande docentpresentatie, aangeleverd als PDF: ${deck.bestand}`;
  const review = buildInitialSlidedeckReviewMetadata({
    learningGoals: 'Kennismaken met Binask in Helix',
    sourceText
  });
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

  return {
    id: pakketId(deck),
    title: deck.titel,
    learningGoals: 'Kennismaken met Binask in Helix',
    sourceText,
    linkedContext: {
      vakId: vak.id,
      vakTitle: vak.name,
      leerjaarId: '',
      leerjaarTitle: '',
      niveauId: '',
      niveauTitle: 'Leerroute 3 (leerjaar 1 en 2)',
      hoofdstukId: '',
      hoofdstukTitle: '',
      paragraafId: '',
      paragraafTitle: 'Ga van start... (1.1)',
      contentBlockId: ''
    },
    promptTemplateId: null,
    promptTemplateName: '',
    promptSnapshot: '',
    // De aangeleverde PDF is zowel bron als deck: er is geen aparte bron-PDF.
    sourcePdf: { ...pdfReferentie },
    sourceAssets: [],
    generatedDeckPdf: {
      fileName: deck.bestand,
      size: bestand.grootte,
      ...pdfReferentie
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
    plaatsingMeta: { script: SCRIPT_NAAM, geplaatstOp: nu }
  };
};

const bouwBlok = (paragraaf, deck, volgnummer, pakket) => {
  const basis = {
    id: blokId(paragraaf, 'slidedeck', volgnummer),
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
  // Dezelfde patch die het beheerscherm toepast na een deck-upload.
  const patch = buildSlidedeckCmsBlockSyncPatch({ block: basis, deckPackage: pakket });
  return { ...basis, ...patch };
};

// Een PDF als mediablok, zoals het beheerscherm hem na een upload opslaat
// (zie buildMediaFromUpload in src/lib/mediaUtils.js).
const bouwLeesopdrachtBlok = (paragraaf, opdracht, volgnummer, pdfReferentie) => ({
  id: blokId(paragraaf, 'media', volgnummer),
  vakId: paragraaf.vakId,
  leerjaarId: paragraaf.leerjaarId,
  niveauId: paragraaf.niveauId,
  hoofdstukId: paragraaf.hoofdstukId,
  paragraafId: paragraaf.id,
  type: 'media',
  order: volgnummer,
  title: opdracht.titel,
  status: 'published',
  content: {
    html: opdracht.instructie,
    caption: '',
    altText: '',
    mediaKind: 'pdf',
    mediaUrl: pdfReferentie.downloadURL,
    pdfUrl: pdfReferentie.downloadURL,
    videoUrl: '',
    imageUrl: '',
    storagePath: pdfReferentie.storagePath,
    fileName: opdracht.bestand,
    contentType: 'application/pdf',
    size: opdracht.bestandInfo.grootte,
    crops: []
  },
  settings: normalizeContentBlockSettings({}, 'media'),
  linkedVraagId: null,
  createdBy: maker,
  isArchived: false
});

const leesopdrachtenVoor = (paragraaf) =>
  LEESOPDRACHTEN.filter((opdracht) => opdracht.leerjaar === leerjaarKort(paragraaf));

// Vaste optievolgorde, zodat het juiste antwoord niet uit de positie te lezen is.
const VAKKEN = ['biologie', 'natuurkunde', 'scheikunde'];

const bouwVragenrondeItems = () => {
  const { categorieen, leerdoel } = VRAGENRONDE.meta;
  return VRAGENRONDE.vragen.map((vraag) => {
    const juist = categorieen[vraag.categorie];
    return {
      id: `nw-${String(vraag.nr).padStart(2, '0')}`,
      type: 'meerkeuze',
      prompt: vraag.vraag,
      answer: {
        type: 'meerkeuze',
        options: VAKKEN.map((vak) => {
          const isJuist = vak === vraag.categorie;
          return {
            id: `nw-${String(vraag.nr).padStart(2, '0')}-${vak}`,
            text: categorieen[vak].label,
            correct: isJuist,
            // Bij een fout gekozen vak: waarom dát vak hier niet past, zonder het
            // juiste vak te noemen (dat komt pas in de uitleg na afronding).
            explanation: isJuist ? vraag.uitleg : `Niet ${categorieen[vak].label.toLowerCase()}. ${categorieen[vak].nietRegel || juist.regel}`,
            misconception: ''
          };
        })
      },
      feedback: vraag.uitleg,
      tokens: 0,
      taxonomy: {
        learningGoal: leerdoel,
        cognitiveSkill: 'herkennen',
        masteryLevel: 'basis',
        scaffoldingRole: 'zelf_proberen'
      }
    };
  });
};

const bouwVragenrondeBlok = (paragraaf, volgnummer) => ({
  id: blokId(paragraaf, 'quiz', volgnummer),
  vakId: paragraaf.vakId,
  leerjaarId: paragraaf.leerjaarId,
  niveauId: paragraaf.niveauId,
  hoofdstukId: paragraaf.hoofdstukId,
  paragraafId: paragraaf.id,
  type: 'quiz',
  order: volgnummer,
  title: VRAGENRONDE.meta.titel,
  status: 'published',
  content: {
    html: VRAGENRONDE.meta.intro,
    assessmentType: 'quiz',
    items: normalizeAssessmentItems(bouwVragenrondeItems()),
    attemptPolicy: { maxAttempts: null, scoring: 'best', allowTeacherReset: true },
    tokenConfig: { enabled: true, totalTokens: 15 },
    sourceBasis: [],
    sourceNotes: VRAGENRONDE.meta.bron,
    crops: []
  },
  settings: normalizeContentBlockSettings({ allowAiHelp: false }, 'quiz'),
  linkedVraagId: null,
  createdBy: maker,
  isArchived: false
});

const bouwPlan = (pdfReferenties, nu) => {
  const pakketten = DECKS.map((deck) => bouwPakket(deck, deck.bestandInfo, pdfReferenties[deck.sleutel], nu));
  const blokken = [];
  const uploads = DECKS.map((deck) => ({
    bestand: deck.bestand,
    bestandInfo: deck.bestandInfo,
    storagePath: storagePad(deck),
    token: pdfReferenties[deck.sleutel].token
  }));
  PARAGRAFEN.forEach((paragraaf) => {
    DECKS.forEach((deck, index) => {
      blokken.push({ paragraaf, blok: bouwBlok(paragraaf, deck, index + 1, pakketten[index]) });
    });
    leesopdrachtenVoor(paragraaf).forEach((opdracht, index) => {
      const volgnummer = DECKS.length + index + 1;
      const storagePath = mediaStoragePad(paragraaf, opdracht, volgnummer);
      const token = randomUUID();
      const referentie = { storagePath, downloadURL: downloadUrl(storagePath, token), uploadedAt: nu };
      uploads.push({ bestand: opdracht.bestand, bestandInfo: opdracht.bestandInfo, storagePath, token });
      blokken.push({ paragraaf, blok: bouwLeesopdrachtBlok(paragraaf, opdracht, volgnummer, referentie) });
    });
    const laatsteVolgnummer = DECKS.length + leesopdrachtenVoor(paragraaf).length + 1;
    blokken.push({ paragraaf, blok: bouwVragenrondeBlok(paragraaf, laatsteVolgnummer) });
  });
  const snapshots = blokken.map(({ blok }) => buildPublicContentBlockSnapshot(blok));
  return { pakketten, blokken, snapshots, uploads };
};

const controleerPlan = ({ pakketten, blokken }) => {
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

/* ---------- hoofdprogramma ---------- */

console.log(`Binask slidedecks plaatsen (${toonPlan ? 'TOON PLAN' : apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);
console.log(`Bronmap: ${bronmap}`);
console.log('');

console.log(`Leerjaren: ${PARAGRAFEN.map(leerjaarKort).join(', ')}`);
DECKS.forEach((deck) => {
  deck.bestandInfo = leesBestand(deck.bestand);
  console.log(`- deck ${deck.titel}: ${deck.bestand} (${megabytes(deck.bestandInfo.grootte)}) -> ${storagePad(deck)}`);
});
LEESOPDRACHTEN.forEach((opdracht) => {
  opdracht.bestandInfo = leesBestand(opdracht.bestand);
  const actief = PARAGRAFEN.some((paragraaf) => leerjaarKort(paragraaf) === opdracht.leerjaar);
  console.log(`- leesopdracht ${opdracht.titel}: ${opdracht.bestand} (${megabytes(opdracht.bestandInfo.grootte)}), leerjaar ${opdracht.leerjaar}${actief ? '' : ' (buiten selectie)'}`);
});
console.log('');

const nu = new Date().toISOString();
const pdfReferenties = Object.fromEntries(DECKS.map((deck) => {
  const token = randomUUID();
  return [deck.sleutel, {
    storagePath: storagePad(deck),
    downloadURL: downloadUrl(storagePad(deck), token),
    uploadedAt: nu,
    token
  }];
}));

const plan = bouwPlan(pdfReferenties, nu);
const planFouten = controleerPlan(plan);

if (planFouten.length > 0) {
  console.error('De opgebouwde documenten komen niet door de readiness-controle:');
  planFouten.forEach((fout) => console.error(`- ${fout}`));
  process.exit(1);
}
console.log(`Readiness-controle: ${plan.pakketten.length} pakketten en ${plan.blokken.length} lesblokken zijn publiceerbaar.`);
console.log('');

if (toonPlan) {
  console.log(JSON.stringify({
    pakketten: plan.pakketten,
    lesblokken: plan.blokken.map(({ blok }) => blok),
    publiekeSnapshots: plan.snapshots,
    toewijzing: KLAS_ROUTES.map((route) => ({
      klas: route.klasNaam,
      paragraaf: PARAGRAFEN.find((paragraaf) => paragraaf.niveauId === route.niveauId)?.id
    }))
  }, null, 2));
  process.exit(0);
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET
  });
}

const db = getFirestore();
const bucket = getStorage().bucket();

// Bestaat de structuur uit de vorige sessie echt?
for (const paragraaf of PARAGRAFEN) {
  const snap = await db.collection('paragraaf').doc(paragraaf.id).get();
  if (!snap.exists) {
    console.error(`Paragraaf ${paragraaf.id} bestaat niet in Firestore. Importeer eerst de Binask-seed.`);
    process.exit(1);
  }
  const bestaandeBlokken = await db.collection('contentBlocks').where('paragraafId', '==', paragraaf.id).get();
  const eigen = bestaandeBlokken.docs.filter((docSnap) => docSnap.id.startsWith('block-binask-eoa-')).length;
  console.log(`- ${paragraaf.id}: bestaat, ${bestaandeBlokken.size} lesblok(ken) aanwezig (${eigen} van dit script)`);
}

const klassen = [];
for (const route of KLAS_ROUTES) {
  const snap = await db.collection('klassen').where('name', '==', route.klasNaam).get();
  const paragraaf = PARAGRAFEN.find((item) => item.niveauId === route.niveauId);
  if (snap.size !== 1 || !paragraaf) {
    console.log(`- klas ${route.klasNaam}: ${snap.size} gevonden, toewijzing wordt overgeslagen`);
    continue;
  }
  const data = snap.docs[0].data();
  const alToegewezen = (data.enabledParagrafen || []).includes(paragraaf.id);
  klassen.push({ ...route, klasId: snap.docs[0].id, paragraafId: paragraaf.id });
  console.log(`- klas ${route.klasNaam} (${snap.docs[0].id}): route "${data.niveauId || 'geen'}", paragraaf ${paragraaf.id} ${alToegewezen ? 'al toegewezen' : 'nog niet toegewezen'}`);
}
console.log('');
console.log(`Paragraaf toewijzen (--wijs-toe): ${wijsToe ? 'JA' : 'nee'}`);

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om te uploaden en te schrijven.');
  process.exit(0);
}

console.log('');
for (const upload of plan.uploads) {
  process.stdout.write(`Uploaden ${upload.bestand} (${megabytes(upload.bestandInfo.grootte)}) -> ${upload.storagePath}... `);
  await bucket.file(upload.storagePath).save(upload.bestandInfo.buffer, {
    resumable: true,
    contentType: 'application/pdf',
    metadata: {
      cacheControl: 'public, max-age=86400',
      metadata: { firebaseStorageDownloadTokens: upload.token }
    }
  });
  console.log('klaar');
}

const batch = db.batch();
for (const pakket of plan.pakketten) {
  batch.set(db.collection('slidedeckPackages').doc(pakket.id), cleanForFirestore({
    ...pakket,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }));
}
for (const { blok } of plan.blokken) {
  batch.set(db.collection('contentBlocks').doc(blok.id), cleanForFirestore({
    ...blok,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }));
}
for (const snapshot of plan.snapshots) {
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), cleanForFirestore({
    ...snapshot,
    updatedAt: FieldValue.serverTimestamp()
  }));
}
await batch.commit();
console.log(`Geschreven: ${plan.pakketten.length} pakketten, ${plan.blokken.length} lesblokken, ${plan.snapshots.length} publieke snapshots.`);

if (wijsToe) {
  for (const klas of klassen) {
    await db.collection('klassen').doc(klas.klasId).set({
      enabledParagrafen: FieldValue.arrayUnion(klas.paragraafId),
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`Toegewezen: ${klas.paragraafId} aan ${klas.klasNaam} (${klas.klasId})`);
  }
}

console.log('');
console.log('Klaar.');
process.exit(0);
