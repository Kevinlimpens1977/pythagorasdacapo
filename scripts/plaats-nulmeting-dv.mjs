/**
 * Nulmeting digitale vaardigheden (pakket van 3 september 2026) klaarzetten
 * voor alle eerstejaarsklassen die Digitale vaardigheden volgen.
 *
 * Per leerroute van leerjaar 1 (uit Firestore, niet hardgecodeerd) komt één
 * paragraaf "Nulmeting digitale vaardigheden" vóór 1.1 in hoofdstuk 1, met
 * twee toetsblokken: deel A en deel B, elk 27 vragen, één poging, geen tokens,
 * geen Digidocent, geen herkansing. De inleidingsafbeelding gaat naar Storage
 * en staat als <img> in de algemene inleiding van het blok. De mapping van
 * vraag naar deelvaardigheid staat als privéveld `content.nulmeting` op het
 * blok; de publieke snapshot stript dat (publicContentBlockView).
 *
 * Klasselectie: elke niet-gearchiveerde klas waarvan `niveauId` een niveau van
 * leerjaar 1 van het vak Digitale vaardigheden is. Een klas zonder route wordt
 * gemeld en overgeslagen.
 *
 * Vaste id's: opnieuw draaien overschrijft, verdubbelt niet.
 *
 *   node scripts/plaats-nulmeting-dv.mjs --toon-plan
 *   node scripts/plaats-nulmeting-dv.mjs                  # dry run
 *   node scripts/plaats-nulmeting-dv.mjs --apply --wijs-toe
 *   node scripts/plaats-nulmeting-dv.mjs --verwijder --apply   # blokken, paragraaf en toewijzing weg
 */

import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';

import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwNulmetingMapping } from '../src/lib/nulmetingProfiel.js';
import { bouwToetsitems, telTypes } from './lib/toetsitems-uit-seed.mjs';

const PROJECT_ID = 'pythagoras-eoa';
const STORAGE_BUCKET = 'pythagoras-eoa.firebasestorage.app';
const SCRIPT_NAAM = 'scripts/plaats-nulmeting-dv.mjs';
const VAK_ID = 'vak-digitale-vaardigheden';
const LEERJAAR_ID = 'leerjaar-digitale-vaardigheden-vmbo1';
const SEED_DIR = path.resolve('docs/seeds/nulmeting-dv');
const SLUG = 'nulmeting-dv';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const wijsToe = argumenten.includes('--wijs-toe');
const toonPlan = argumenten.includes('--toon-plan');
const verwijder = argumenten.includes('--verwijder');
const optie = (naam, standaard) => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};
const maker = optie('--maker', SCRIPT_NAAM);

const lees = (naam) => JSON.parse(fs.readFileSync(path.join(SEED_DIR, naam), 'utf8'));
const DELEN = [
  { letter: 'a', seed: lees('nulmeting-a.json'), afbeelding: 'intro-les-a.webp', situaties: 'A, B en C' },
  { letter: 'b', seed: lees('nulmeting-b.json'), afbeelding: 'intro-les-b.webp', situaties: 'D, E en F' }
];
const analysemodel = lees('analysemodel.json');

// Inhoudelijke bewaking uit het pakket: exact 27 per deel, 6 per deelvaardigheid.
DELEN.forEach((deel) => {
  if (deel.seed.vragen.length !== 27) throw new Error(`Deel ${deel.letter} heeft ${deel.seed.vragen.length} vragen, verwacht 27.`);
});
const mapping = bouwNulmetingMapping({ analysemodel, slugA: DELEN[0].seed.meta.slug, slugB: DELEN[1].seed.meta.slug });
const perDeel = {};
Object.values(mapping).forEach((regel) => { perDeel[regel.deelvaardigheidId] = (perDeel[regel.deelvaardigheidId] || 0) + 1; });
if (Object.keys(mapping).length !== 54 || Object.values(perDeel).some((n) => n !== 6) || Object.keys(perDeel).length !== 9) {
  throw new Error(`Mapping klopt niet: ${JSON.stringify(perDeel)}`);
}

const paragraafId = (route) => `paragraaf-dv-${route}-${SLUG}`;
const blokId = (route, deel) => `block-dv-${route}-${SLUG}-toets-${deel.letter}`;
const storagePad = (deel) => `mediaBlocks/${SLUG}/${deel.afbeelding}`;
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

const introHtml = (deel, afbeeldingUrl) =>
  `${deel.seed.meta.intro}` +
  `<figure style="margin:16px 0"><img src="${afbeeldingUrl}" alt="Situaties ${deel.situaties} bij deel ${deel.letter.toUpperCase()} van de nulmeting" loading="eager" style="width:100%;height:auto;border:3px solid #0B0D0F;border-radius:12px;display:block"></figure>` +
  `<p><strong>Tip:</strong> scrol terug naar deze afbeelding als een vraag naar situatie ${deel.situaties} verwijst.</p>`;

const bouwParagraaf = (route, niveauId, hoofdstukId, nu) => ({
  id: paragraafId(route),
  vakId: VAK_ID,
  leerjaarId: LEERJAAR_ID,
  niveauId,
  hoofdstukId,
  code: '1.0',
  title: 'Nulmeting digitale vaardigheden',
  beschrijving: 'Twee delen van 27 vragen over de negen onderdelen van digitale geletterdheid. Geen cijfer: het geeft je persoonlijke startprofiel.',
  order: 0,
  published: true,
  aiCompanionEnabled: false,
  cropCount: 0,
  isArchived: false,
  optioneel: false,
  verplicht: true,
  learningGoals: [DELEN[0].seed.meta.leerdoel, DELEN[1].seed.meta.leerdoel],
  evidenceProduct: 'Persoonlijk startprofiel over negen deelvaardigheden',
  estimatedMinutes: 60,
  reviewStatus: 'approved',
  seedMeta: { seedId: SLUG, importedAt: nu, script: SCRIPT_NAAM }
});

const bouwBlok = (route, niveauId, hoofdstukId, deel, order, afbeeldingUrl) => {
  const items = bouwToetsitems(deel.seed.vragen, { slug: deel.seed.meta.slug, leerdoel: deel.seed.meta.leerdoel });
  const eigenMapping = Object.fromEntries(Object.entries(mapping).filter(([, regel]) => regel.les === deel.letter.toUpperCase()));
  return {
    id: blokId(route, deel),
    vakId: VAK_ID,
    leerjaarId: LEERJAAR_ID,
    niveauId,
    hoofdstukId,
    paragraafId: paragraafId(route),
    type: 'toets',
    order,
    title: deel.seed.meta.titel,
    status: 'published',
    content: {
      html: introHtml(deel, afbeeldingUrl),
      assessmentType: 'toets',
      items,
      attemptPolicy: { maxAttempts: deel.seed.meta.pogingen ?? 1, scoring: 'best', allowTeacherReset: true },
      tokenConfig: { enabled: false, totalTokens: 0 },
      retryPolicy: { enabled: false, aiHelp: false },
      sourceBasis: [],
      sourceNotes: `Nulmeting digitale vaardigheden, pakket 3 september 2026 (${analysemodel.kerndoelenBron}).`,
      crops: [],
      // Privé: de koppeling vraag -> deelvaardigheid voor het startprofiel.
      // De publieke snapshot neemt dit veld niet over.
      nulmeting: {
        versie: analysemodel.versie,
        deel: deel.letter.toUpperCase(),
        slug: deel.seed.meta.slug,
        mapping: eigenMapping,
        // De regels en deelvaardigheden reizen mee, zodat de Cloud Function
        // het profiel kan berekenen zonder het pakket te kennen.
        analysemodel: {
          versie: analysemodel.versie,
          doel: analysemodel.doel,
          kerndoelenBron: analysemodel.kerndoelenBron,
          regels: analysemodel.regels,
          deelvaardigheden: analysemodel.deelvaardigheden
        }
      }
    },
    settings: normalizeContentBlockSettings({ allowAiHelp: false, scaffoldingRole: 'bewijs_leveren' }, 'toets'),
    linkedVraagId: null,
    createdBy: maker,
    isArchived: false
  };
};

const controleer = (blokken) => {
  const fouten = [];
  blokken.forEach((blok) => {
    const readiness = validateContentBlockReadiness(blok);
    if (readiness.errors.length > 0) fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
    const snapshot = buildPublicContentBlockSnapshot(blok);
    if (snapshot.content.nulmeting?.mapping || snapshot.content.nulmeting?.analysemodel) fouten.push(`${blok.id}: mapping lekt naar de publieke snapshot`);
    if (snapshot.content.items.some((item) => item.answerKeyAvailable !== false)) fouten.push(`${blok.id}: sleutel lekt`);
  });
  return fouten;
};

console.log(`Nulmeting DV klaarzetten (${toonPlan ? 'TOON PLAN' : verwijder ? (apply ? 'VERWIJDEREN' : 'VERWIJDEREN, DRY RUN') : apply ? 'APPLY' : 'DRY RUN'})`);
DELEN.forEach((deel) => console.log(`- deel ${deel.letter.toUpperCase()}: ${deel.seed.vragen.length} vragen (${telTypes(bouwToetsitems(deel.seed.vragen, { slug: deel.seed.meta.slug }))}), afbeelding ${deel.afbeelding}`));
console.log(`- mapping: 54 vragen, 9 deelvaardigheden x 6`);

if (toonPlan) {
  const tokens = Object.fromEntries(DELEN.map((deel) => [deel.letter, randomUUID()]));
  const blokken = DELEN.map((deel, index) => bouwBlok('kb', 'niveau-dv-vmbo1-kb', 'hoofdstuk-dv-kb-h1', deel, index + 1, downloadUrl(storagePad(deel), tokens[deel.letter])));
  const fouten = controleer(blokken);
  if (fouten.length) { fouten.forEach((f) => console.error(`- ${f}`)); process.exit(1); }
  console.log('Readiness-controle: publiceerbaar, mapping en sleutels blijven privé.');
  console.log(JSON.stringify({ paragraaf: bouwParagraaf('kb', 'niveau-dv-vmbo1-kb', 'hoofdstuk-dv-kb-h1', new Date().toISOString()), lesblokken: blokken }, null, 2));
  process.exit(0);
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
const { getStorage } = requireFromFunctions('firebase-admin/storage');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID, storageBucket: STORAGE_BUCKET });
const db = getFirestore();
const bucket = getStorage().bucket();

// Routes en klassen uit de data.
const niveaus = (await db.collection('niveau').where('leerjaarId', '==', LEERJAAR_ID).get()).docs
  .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  .filter((niveau) => niveau.isArchived !== true);
const routes = [];
for (const niveau of niveaus) {
  const hoofdstuk = (await db.collection('hoofdstuk').where('niveauId', '==', niveau.id).where('number', '==', 1).get()).docs[0];
  if (!hoofdstuk) { console.log(`- niveau ${niveau.id}: geen hoofdstuk 1, overgeslagen`); continue; }
  const route = String(niveau.leerweg || niveau.id.split('-').pop());
  routes.push({ route, niveauId: niveau.id, hoofdstukId: hoofdstuk.id, label: niveau.name || niveau.label });
}
console.log(`Routes leerjaar 1 DV: ${routes.map((r) => `${r.route} (${r.label})`).join(', ')}`);

const klassen = (await db.collection('klassen').get()).docs
  .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  .filter((klas) => klas.archived !== true && klas.isArchived !== true);
const doelKlassen = klassen.filter((klas) => routes.some((r) => r.niveauId === klas.niveauId));
const zonderRoute = klassen.filter((klas) => !klas.niveauId && /^H1/i.test(klas.name || ''));
console.log('Klassen met een DV-route leerjaar 1:');
doelKlassen.forEach((klas) => {
  const route = routes.find((r) => r.niveauId === klas.niveauId);
  const al = (klas.enabledParagrafen || []).includes(paragraafId(route.route));
  console.log(`- ${klas.name} (${klas.id}): route ${route.route} -> ${paragraafId(route.route)}${al ? ' (al toegewezen)' : ''}`);
});
zonderRoute.forEach((klas) => console.log(`- ${klas.name}: GEEN route, wordt overgeslagen`));

if (verwijder) {
  if (!apply) { console.log('Dry run; --apply verwijdert blokken, paragrafen, snapshots en toewijzingen.'); process.exit(0); }
  for (const r of routes) {
    for (const deel of DELEN) {
      await db.collection('contentBlocks').doc(blokId(r.route, deel)).delete();
      await db.collection('publicContentBlocks').doc(blokId(r.route, deel)).delete();
    }
    await db.collection('paragraaf').doc(paragraafId(r.route)).delete();
    console.log(`Verwijderd: ${paragraafId(r.route)} + 2 blokken`);
  }
  for (const klas of doelKlassen) {
    const route = routes.find((x) => x.niveauId === klas.niveauId);
    await db.collection('klassen').doc(klas.id).update({ enabledParagrafen: FieldValue.arrayRemove(paragraafId(route.route)), updatedAt: FieldValue.serverTimestamp() });
  }
  console.log('Toewijzingen verwijderd. Klaar.');
  process.exit(0);
}

console.log(`Toewijzen (--wijs-toe): ${wijsToe ? 'JA' : 'nee'}`);
if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

// Back-up van de klasdocumenten die geraakt worden.
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(path.join(backupDir, `klassen-voor-nulmeting-dv-${new Date().toISOString().slice(0, 10)}.json`), JSON.stringify(doelKlassen, null, 2));

// Afbeeldingen één keer naar Storage; dezelfde URL in alle routes.
const afbeeldingUrls = {};
for (const deel of DELEN) {
  const pad = storagePad(deel);
  const bestand = bucket.file(pad);
  const [bestaat] = await bestand.exists();
  let token = randomUUID();
  if (bestaat) {
    const [meta] = await bestand.getMetadata();
    token = meta.metadata?.firebaseStorageDownloadTokens || token;
  }
  await bestand.save(fs.readFileSync(path.join(SEED_DIR, deel.afbeelding)), {
    resumable: false,
    contentType: 'image/webp',
    metadata: { cacheControl: 'public, max-age=604800', metadata: { firebaseStorageDownloadTokens: token } }
  });
  afbeeldingUrls[deel.letter] = downloadUrl(pad, token);
  console.log(`Afbeelding ${deel.afbeelding} -> ${pad}`);
}

const nu = new Date().toISOString();
const batch = db.batch();
let blokTelling = 0;
for (const r of routes) {
  const paragraaf = bouwParagraaf(r.route, r.niveauId, r.hoofdstukId, nu);
  const blokken = DELEN.map((deel, index) => bouwBlok(r.route, r.niveauId, r.hoofdstukId, deel, index + 1, afbeeldingUrls[deel.letter]));
  const fouten = controleer(blokken);
  if (fouten.length) { fouten.forEach((f) => console.error(`- ${f}`)); process.exit(1); }
  batch.set(db.collection('paragraaf').doc(paragraaf.id), cleanForFirestore({ ...paragraaf, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }), { merge: true });
  for (const blok of blokken) {
    batch.set(db.collection('contentBlocks').doc(blok.id), cleanForFirestore({ ...blok, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }));
    const snapshot = buildPublicContentBlockSnapshot(blok);
    batch.set(db.collection('publicContentBlocks').doc(snapshot.id), cleanForFirestore({ ...snapshot, updatedAt: FieldValue.serverTimestamp() }));
    blokTelling += 1;
  }
}
await batch.commit();
console.log(`Geschreven: ${routes.length} paragrafen, ${blokTelling} toetsblokken + snapshots.`);

if (wijsToe) {
  for (const klas of doelKlassen) {
    const route = routes.find((x) => x.niveauId === klas.niveauId);
    await db.collection('klassen').doc(klas.id).set({ enabledParagrafen: FieldValue.arrayUnion(paragraafId(route.route)), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    console.log(`Toegewezen aan ${klas.name}`);
  }
}
console.log('Klaar.');
process.exit(0);
