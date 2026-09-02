/**
 * Plaatst een nulmeting als toetsblok voor alle brugklassen vmbo.
 *
 * Digitale vaardigheden leerjaar 1 heeft drie leerroutes (bb, kb, tl), elk met
 * een eigen hoofdstuk 1. Een klas met een route ziet alleen lesstof van die
 * route, dus de nulmeting komt als eigen paragraaf "Nulmeting" (order 0, vóór
 * 1.1) in elk van de drie hoofdstukken, met identieke inhoud. Daarna wordt de
 * paragraaf toegewezen aan elke klas waarvan de naam met H1 begint; een klas
 * zonder route krijgt de kb-variant.
 *
 * De vragen staan in docs/seeds/nulmeting-brugklas.json; de velden per
 * vraagtype staan in scripts/lib/toetsitems-uit-seed.mjs.
 *
 * Vaste id's: opnieuw draaien overschrijft, verdubbelt niet.
 *
 *   node scripts/plaats-nulmeting-brugklas.mjs --toon-plan   # offline
 *   node scripts/plaats-nulmeting-brugklas.mjs               # dry run tegen Firestore
 *   node scripts/plaats-nulmeting-brugklas.mjs --apply --wijs-toe
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwToetsitems, telTypes } from './lib/toetsitems-uit-seed.mjs';

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/plaats-nulmeting-brugklas.mjs';
const VAK_ID = 'vak-digitale-vaardigheden';
const LEERJAAR_ID = 'leerjaar-digitale-vaardigheden-vmbo1';
const ROUTES = [
  { sleutel: 'bb', niveauId: 'niveau-dv-vmbo1-bb', hoofdstukId: 'hoofdstuk-dv-bb-h1' },
  { sleutel: 'kb', niveauId: 'niveau-dv-vmbo1-kb', hoofdstukId: 'hoofdstuk-dv-kb-h1' },
  { sleutel: 'tl', niveauId: 'niveau-dv-vmbo1-tl', hoofdstukId: 'hoofdstuk-dv-tl-h1' }
];
const ROUTE_ZONDER_NIVEAU = 'kb';
const KLAS_PREFIX = 'H1';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const wijsToe = argumenten.includes('--wijs-toe');
const toonPlan = argumenten.includes('--toon-plan');
const optie = (naam, standaard) => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};
const seedPad = path.resolve(optie('--seed', 'docs/seeds/nulmeting-brugklas.json'));
const maker = optie('--maker', SCRIPT_NAAM);

const seed = JSON.parse(fs.readFileSync(seedPad, 'utf8'));
const meta = seed.meta || {};
const slug = meta.slug || 'nulmeting';

const paragraafId = (route) => `paragraaf-dv-${route.sleutel}-${slug}`;
const blokId = (route) => `block-dv-${route.sleutel}-${slug}-toets-1`;

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

/* ---------- paragraaf en blok ---------- */

const bouwParagraaf = (route, nu) => ({
  id: paragraafId(route),
  vakId: VAK_ID,
  leerjaarId: LEERJAAR_ID,
  niveauId: route.niveauId,
  hoofdstukId: route.hoofdstukId,
  code: meta.code || '1.0',
  title: meta.paragraafTitel || 'Nulmeting',
  beschrijving: meta.beschrijving || '',
  order: 0,
  published: true,
  aiCompanionEnabled: false,
  cropCount: 0,
  isArchived: false,
  optioneel: false,
  verplicht: true,
  learningGoals: meta.leerdoelen || [],
  evidenceProduct: meta.bewijsproduct || 'Ingevulde nulmeting',
  estimatedMinutes: meta.minuten || 30,
  reviewStatus: 'approved',
  seedMeta: { seedId: slug, importedAt: nu, script: SCRIPT_NAAM }
});

const bouwBlok = (route, items) => ({
  id: blokId(route),
  vakId: VAK_ID,
  leerjaarId: LEERJAAR_ID,
  niveauId: route.niveauId,
  hoofdstukId: route.hoofdstukId,
  paragraafId: paragraafId(route),
  type: 'toets',
  order: 1,
  title: meta.titel || 'Nulmeting',
  status: 'published',
  content: {
    html: meta.intro || '',
    assessmentType: 'toets',
    items,
    attemptPolicy: { maxAttempts: meta.pogingen ?? 1, scoring: 'best', allowTeacherReset: true },
    tokenConfig: { enabled: meta.tokens === true, totalTokens: meta.tokens === true ? 25 : 0 },
    sourceBasis: [],
    sourceNotes: meta.bron || '',
    crops: []
  },
  settings: normalizeContentBlockSettings({ allowAiHelp: false, scaffoldingRole: 'bewijs_leveren' }, 'toets'),
  linkedVraagId: null,
  createdBy: maker,
  isArchived: false
});

const nu = new Date().toISOString();
const items = bouwToetsitems(seed.vragen, { slug, leerdoel: meta.leerdoel || '' });
const plan = ROUTES.map((route) => ({ route, paragraaf: bouwParagraaf(route, nu), blok: bouwBlok(route, items) }));
plan.forEach((stap) => { stap.snapshot = buildPublicContentBlockSnapshot(stap.blok); });

const fouten = [];
plan.forEach(({ blok }) => {
  const readiness = validateContentBlockReadiness(blok);
  if (readiness.errors.length > 0) fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
});

console.log(`Nulmeting brugklas plaatsen (${toonPlan ? 'TOON PLAN' : apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Seed: ${seedPad}`);
console.log(`Vragen: ${items.length} (${telTypes(items)})`);
console.log(`Pogingen: ${meta.pogingen ?? 1}, tokens: ${meta.tokens === true ? 'aan' : 'uit'}, Digidocent: uit`);
if (fouten.length > 0) {
  console.error('Readiness-controle faalt:');
  fouten.forEach((fout) => console.error(`- ${fout}`));
  process.exit(1);
}
console.log('Readiness-controle: alle drie de toetsblokken zijn publiceerbaar.');
console.log('');

if (toonPlan) {
  console.log(JSON.stringify({ paragrafen: plan.map((s) => s.paragraaf), lesblokken: plan.map((s) => s.blok), publiekeSnapshots: plan.map((s) => s.snapshot) }, null, 2));
  process.exit(0);
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

for (const route of ROUTES) {
  const hoofdstuk = await db.collection('hoofdstuk').doc(route.hoofdstukId).get();
  if (!hoofdstuk.exists) {
    console.error(`Hoofdstuk ${route.hoofdstukId} bestaat niet.`);
    process.exit(1);
  }
  const bestaand = await db.collection('paragraaf').doc(paragraafId(route)).get();
  console.log(`- ${route.sleutel}: hoofdstuk "${hoofdstuk.data().title}", paragraaf ${paragraafId(route)} ${bestaand.exists ? 'bestaat al (wordt overschreven)' : 'is nieuw'}`);
}

const klassenSnap = await db.collection('klassen').get();
const klassen = klassenSnap.docs
  .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
  .filter((klas) => String(klas.name || '').toUpperCase().startsWith(KLAS_PREFIX))
  .map((klas) => {
    const route = ROUTES.find((r) => r.niveauId === klas.niveauId) || ROUTES.find((r) => r.sleutel === ROUTE_ZONDER_NIVEAU);
    return { ...klas, route, doelParagraaf: paragraafId(route), alToegewezen: (klas.enabledParagrafen || []).includes(paragraafId(route)) };
  });
console.log('');
console.log('Brugklassen:');
klassen.forEach((klas) => console.log(`- ${klas.name} (${klas.id}): route ${klas.niveauId || 'geen -> ' + ROUTE_ZONDER_NIVEAU} -> ${klas.doelParagraaf} ${klas.alToegewezen ? '(al toegewezen)' : ''}`));
console.log('');
console.log(`Toewijzen (--wijs-toe): ${wijsToe ? 'JA' : 'nee'}`);

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const batch = db.batch();
for (const { paragraaf, blok, snapshot } of plan) {
  batch.set(db.collection('paragraaf').doc(paragraaf.id), cleanForFirestore({ ...paragraaf, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }), { merge: true });
  batch.set(db.collection('contentBlocks').doc(blok.id), cleanForFirestore({ ...blok, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }));
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), cleanForFirestore({ ...snapshot, updatedAt: FieldValue.serverTimestamp() }));
}
await batch.commit();
console.log(`Geschreven: ${plan.length} paragrafen, ${plan.length} toetsblokken, ${plan.length} publieke snapshots.`);

if (wijsToe) {
  for (const klas of klassen) {
    await db.collection('klassen').doc(klas.id).set({ enabledParagrafen: FieldValue.arrayUnion(klas.doelParagraaf), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    console.log(`Toegewezen: ${klas.doelParagraaf} aan ${klas.name}`);
  }
}
console.log('');
console.log('Klaar.');
process.exit(0);
