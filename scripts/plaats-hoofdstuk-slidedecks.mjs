/**
 * Zet de presentaties van één hoofdstuk als slidedeck-lesblok in de
 * bibliotheek: per PDF een pakket in `slidedeckPackages`, het bestand in
 * Storage, een lesblok op volgnummer 1 van de paragraaf en de publieke
 * snapshot die de leerling te zien krijgt.
 *
 * Welke PDF bij welke paragraaf hoort staat in hetzelfde bronbestand dat
 * scripts/bouw-hoofdstuk-seed.mjs gebruikt, in het veld `slidedeck`:
 *
 *   { "code": "3.1", "slidedeck": { "sleutel": "h3-warmte", "bestand": "h3-3.1-warmte.pdf", "titel": "Presentatie 3.1" } }
 *
 * Draai eerst de generator en de seed-import: dit script verwacht dat de
 * paragrafen al in Firestore staan. Gebruik lichte PDF's (scripts/comprimeer-
 * slidedeck.py); een deck van 20 MB laat een leerling seconden wachten.
 *
 * Alle id's zijn afgeleid en dus stabiel: nogmaals draaien overschrijft,
 * verdubbelt niet. Toewijzen aan klassen gebeurt hier niet.
 *
 * Gebruik (Admin SDK via Application Default Credentials):
 *
 *   node scripts/plaats-hoofdstuk-slidedecks.mjs --bron <bestand> --toon-plan   # offline
 *   node scripts/plaats-hoofdstuk-slidedecks.mjs --bron <bestand>               # dry run
 *   node scripts/plaats-hoofdstuk-slidedecks.mjs --bron <bestand> --apply       # uploaden + schrijven
 *
 * Opties:
 *   --bronmap <map>   map met de PDF's (standaard: meta.deckMap, anders sources/slidedecks)
 *   --maker <uid>     uid dat als maker/uploader wordt vastgelegd
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import {
  PROJECT_ID,
  STORAGE_BUCKET,
  bouwSlidedeckBlok,
  bouwSlidedeckPakket,
  cleanForFirestore,
  controleerPlan,
  leesPdf,
  maakPdfReferentie,
  megabytes,
  telPdfPaginas,
  uploadPdf
} from './lib/slidedeckPlaatsing.mjs';

const SCRIPT_NAAM = 'scripts/plaats-hoofdstuk-slidedecks.mjs';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const toonPlan = argumenten.includes('--toon-plan');
const optie = (naam, standaard = '') => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};

const bronPad = optie('--bron');
if (!bronPad) {
  console.error('Geef het bronbestand op: --bron docs/seeds/<bestand>.json');
  process.exit(1);
}

const bron = JSON.parse(fs.readFileSync(path.resolve(bronPad), 'utf8'));
const meta = bron.meta || {};
const bronmap = path.resolve(optie('--bronmap', meta.deckMap || 'sources/slidedecks'));
const maker = optie('--maker', SCRIPT_NAAM);

const seed = JSON.parse(fs.readFileSync(path.resolve(meta.seedBestand), 'utf8'));
const vak = seed.vakken.find((item) => item.id === meta.vakId);
const leerjaar = seed.leerjaren.find((item) => item.id === meta.leerjaarId);
const niveau = seed.niveaus.find((item) => item.id === meta.niveauId);
const hoofdstukId = bron.hoofdstuk.id || `hoofdstuk-${meta.blokPrefix}-h${bron.hoofdstuk.nummer}`;
const hoofdstuk = seed.hoofdstukken.find((item) => item.id === hoofdstukId);

if (!vak || !leerjaar || !niveau || !hoofdstuk) {
  console.error(`Hoofdstuk ${hoofdstukId} staat nog niet in ${meta.seedBestand}. Draai eerst scripts/bouw-hoofdstuk-seed.mjs.`);
  process.exit(1);
}

// Eén deck per paragraaf, in de volgorde van de bron.
const DECKS = bron.paragrafen
  .filter((paragraaf) => paragraaf.slidedeck)
  .map((paragraaf) => {
    const id = paragraaf.id || `paragraaf-${meta.blokPrefix}-${String(paragraaf.code).replace(/\./g, '')}`;
    const paragraafDoc = seed.paragrafen.find((item) => item.id === id);
    if (!paragraafDoc) throw new Error(`Paragraaf ${id} ontbreekt in de seed.`);
    return { ...paragraaf.slidedeck, code: paragraaf.code, paragraaf: paragraafDoc };
  });

if (DECKS.length === 0) {
  console.log('Geen enkele paragraaf in dit bronbestand heeft een slidedeck. Niets te doen.');
  process.exit(0);
}

// deckPrefix mag afwijken van blokPrefix, zodat pakket-id's van een bestaand
// hoofdstuk hetzelfde blijven als toen ze werden aangemaakt.
const deckPrefix = meta.deckPrefix || meta.blokPrefix;
const codeKort = (code) => String(code).replace(/\./g, '');
const pakketId = (deck) => `slidedeck-${deckPrefix}-${deck.sleutel}`;
const blokId = (deck) => `block-${meta.blokPrefix}-${codeKort(deck.code)}-slidedeck-1`;
const storagePad = (deck) => `slidedecks/${pakketId(deck)}/generated-deck.pdf`;

const bouwPlan = (nu) => {
  const pakketten = [];
  const blokken = [];
  const uploads = [];

  DECKS.forEach((deck) => {
    const referentie = maakPdfReferentie(storagePad(deck), nu);
    const pakket = bouwSlidedeckPakket({
      id: pakketId(deck),
      deck,
      bestand: deck.bestandInfo,
      pdfReferentie: referentie,
      nu,
      maker,
      scriptNaam: SCRIPT_NAAM,
      learningGoals: (deck.paragraaf.learningGoals || []).join(' '),
      linkedContext: {
        vakId: vak.id,
        vakTitle: vak.name,
        leerjaarId: leerjaar.id,
        leerjaarTitle: leerjaar.name || leerjaar.title || '',
        niveauId: niveau.id,
        niveauTitle: niveau.name || niveau.title || '',
        hoofdstukId: hoofdstuk.id,
        hoofdstukTitle: hoofdstuk.title,
        paragraafId: deck.paragraaf.id,
        paragraafTitle: deck.paragraaf.title,
        contentBlockId: blokId(deck)
      }
    });
    pakketten.push(pakket);
    blokken.push({
      paragraaf: deck.paragraaf,
      blok: bouwSlidedeckBlok({ id: blokId(deck), paragraaf: deck.paragraaf, deck, volgnummer: 1, pakket, maker })
    });
    uploads.push({
      bestand: deck.bestand,
      bestandInfo: deck.bestandInfo,
      storagePath: referentie.storagePath,
      token: referentie.token
    });
  });

  const snapshots = blokken.map(({ blok }) => buildPublicContentBlockSnapshot(blok));
  return { pakketten, blokken, snapshots, uploads };
};

/* ---------- hoofdprogramma ---------- */

console.log(`Slidedecks plaatsen voor hoofdstuk ${hoofdstuk.number} "${hoofdstuk.title}" (${toonPlan ? 'TOON PLAN' : apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);
console.log(`Bronmap: ${bronmap}`);
console.log('');

for (const deck of DECKS) {
  deck.bestandInfo = leesPdf(path.join(bronmap, deck.bestand));
  deck.bestandInfo.paginas = await telPdfPaginas(deck.bestandInfo.buffer);
  console.log(
    `- ${deck.code} ${deck.titel}: ${deck.bestand} (${megabytes(deck.bestandInfo.grootte)}, ` +
    `${deck.bestandInfo.paginas} dia's) -> ${storagePad(deck)} -> ${blokId(deck)}`
  );
}
console.log('');

const nu = new Date().toISOString();
const plan = bouwPlan(nu);
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
    publiekeSnapshots: plan.snapshots
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

// Staat de structuur uit de seed-import er echt, en wat staat er al?
for (const deck of DECKS) {
  const snap = await db.collection('paragraaf').doc(deck.paragraaf.id).get();
  if (!snap.exists) {
    console.error(`Paragraaf ${deck.paragraaf.id} bestaat niet in Firestore. Importeer eerst de seed.`);
    process.exit(1);
  }
  const bestaandeBlokken = await db.collection('contentBlocks').where('paragraafId', '==', deck.paragraaf.id).get();
  const eigenDeck = bestaandeBlokken.docs.some((docSnap) => docSnap.id === blokId(deck));
  const pakketBestaat = (await db.collection('slidedeckPackages').doc(pakketId(deck)).get()).exists;
  console.log(
    `- ${deck.paragraaf.id}: bestaat, ${bestaandeBlokken.size} lesblok(ken) aanwezig, ` +
    `deckblok ${eigenDeck ? 'al aanwezig (wordt overschreven)' : 'nog niet aanwezig'}, pakket ${pakketBestaat ? 'bestaat al' : 'nieuw'}`
  );
}

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om te uploaden en te schrijven.');
  process.exit(0);
}

console.log('');
for (const upload of plan.uploads) {
  process.stdout.write(`Uploaden ${upload.bestand} (${megabytes(upload.bestandInfo.grootte)}) -> ${upload.storagePath}... `);
  await uploadPdf(bucket, { storagePath: upload.storagePath, buffer: upload.bestandInfo.buffer, token: upload.token });
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
console.log('');
console.log('Klaar. Toewijzen aan de klassen doet scripts/zet-binask-klaar-eoa.mjs (Binask).');
process.exit(0);
