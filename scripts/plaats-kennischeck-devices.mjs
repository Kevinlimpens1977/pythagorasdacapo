/**
 * Plaatst de kennischeck "Devices, software en hardware" als afsluitend
 * toetsblok in paragraaf 2.2 van Digitale vaardigheden leerjaar 1, in de drie
 * leerroutes (bb, kb, tl), en wijst de lesstof toe aan alle brugklassen.
 *
 * Eén bron (docs/seeds/kennischeck-devices.json), drie routekopieën: precies
 * zoals alle andere DV-lesstof is opgeslagen. Vaste id's, dus opnieuw draaien
 * overschrijft en verdubbelt niet.
 *
 * Toewijzing (--wijs-toe), voor elke klas waarvan de naam met H1 begint:
 *   - hoofdstuk 1 (1.1 t/m 1.5, tl ook 1.6) en paragraaf 2.1 en 2.2 van de
 *     eigen route; een klas zonder route krijgt de kb-variant.
 *
 *   node scripts/plaats-kennischeck-devices.mjs --toon-plan
 *   node scripts/plaats-kennischeck-devices.mjs                # dry run
 *   node scripts/plaats-kennischeck-devices.mjs --apply --wijs-toe
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwToetsitems, telTypes } from './lib/toetsitems-uit-seed.mjs';

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/plaats-kennischeck-devices.mjs';
const ROUTES = ['bb', 'kb', 'tl'];
const ROUTE_ZONDER_NIVEAU = 'kb';
const KLAS_PREFIX = 'H1';
const niveauId = (route) => `niveau-dv-vmbo1-${route}`;
const paragraafId = (route, code) => `paragraaf-dv-${route}-${code.replace('.', '-')}`;
const TOEWIJZING = {
  bb: ['1.1', '1.2', '1.3', '1.4', '1.5', '2.1', '2.2'],
  kb: ['1.1', '1.2', '1.3', '1.4', '1.5', '2.1', '2.2'],
  tl: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '2.1', '2.2']
};

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const wijsToe = argumenten.includes('--wijs-toe');
const toonPlan = argumenten.includes('--toon-plan');
const optie = (naam, standaard) => {
  const index = argumenten.indexOf(naam);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : standaard;
};
const seedPad = path.resolve(optie('--seed', 'docs/seeds/kennischeck-devices.json'));
const maker = optie('--maker', SCRIPT_NAAM);

const seed = JSON.parse(fs.readFileSync(seedPad, 'utf8'));
const meta = seed.meta;
const slug = meta.slug;
const doelCode = meta.paragraafCode || '2.2';
const blokId = (route) => `block-dv-${route}-${doelCode.replace('.', '')}-toets-${slug}`;

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

/* ---------- afbeeldingen in de intro ---------- */

// Zes apparaten als eenvoudige tekening (inline SVG, geen externe bron).
const devicesSvg = () => {
  const ink = '#0B0D0F';
  const blue = '#087EB5';
  const paper = '#FFF7E8';
  const kaart = (x, label, tekening) =>
    `<g transform="translate(${x} 0)"><rect x="4" y="4" width="132" height="150" rx="12" fill="#fff" stroke="${ink}" stroke-width="3"/>` +
    `${tekening}<text x="70" y="140" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="${ink}">${label}</text></g>`;
  const laptop = `<rect x="30" y="40" width="80" height="50" rx="4" fill="${blue}" stroke="${ink}" stroke-width="3"/><rect x="36" y="46" width="68" height="38" fill="${paper}"/><rect x="18" y="92" width="104" height="10" rx="3" fill="#d3c7ae" stroke="${ink}" stroke-width="3"/>`;
  const smartphone = `<rect x="50" y="28" width="40" height="78" rx="8" fill="${ink}"/><rect x="55" y="36" width="30" height="58" fill="${paper}"/><circle cx="70" cy="100" r="3" fill="${paper}"/>`;
  const tablet = `<rect x="36" y="30" width="68" height="80" rx="8" fill="${ink}"/><rect x="42" y="38" width="56" height="62" fill="${paper}"/>`;
  const desktop = `<rect x="22" y="34" width="66" height="46" rx="4" fill="${blue}" stroke="${ink}" stroke-width="3"/><rect x="28" y="40" width="54" height="34" fill="${paper}"/><rect x="46" y="82" width="18" height="10" fill="#d3c7ae"/><rect x="36" y="92" width="38" height="6" rx="2" fill="${ink}"/><rect x="94" y="34" width="24" height="70" rx="3" fill="#d3c7ae" stroke="${ink}" stroke-width="3"/>`;
  const boek = `<path d="M30 40 h38 v70 h-38 z" fill="#F47A20" stroke="${ink}" stroke-width="3"/><path d="M72 40 h38 v70 h-38 z" fill="#FFD33D" stroke="${ink}" stroke-width="3"/><line x1="70" y1="40" x2="70" y2="110" stroke="${ink}" stroke-width="3"/>`;
  const koptelefoon = `<path d="M34 90 v-24 a36 36 0 0 1 72 0 v24" fill="none" stroke="${ink}" stroke-width="6"/><rect x="26" y="78" width="18" height="30" rx="6" fill="${blue}" stroke="${ink}" stroke-width="3"/><rect x="96" y="78" width="18" height="30" rx="6" fill="${blue}" stroke="${ink}" stroke-width="3"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 860 160" width="860" height="160" role="img">` +
    kaart(0, 'Laptop', laptop) + kaart(144, 'Smartphone', smartphone) + kaart(288, 'Tablet', tablet) +
    kaart(432, 'Desktop-pc', desktop) + kaart(576, 'Boek', boek) + kaart(720, 'Koptelefoon', koptelefoon) + '</svg>';
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
};

// Drie foto's van Wikimedia Commons (vrije licenties), dezelfde bronnen als de
// theorie van 2.1. Volgorde A/B/C wijkt bewust af van de volgorde in de vraag.
const FOTOS = [
  { letter: 'A', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/C-Media_8738_PCI_Sound_Card_-_C-Media_CMI8738_PCI.jpg/960px-C-Media_8738_PCI_Sound_Card_-_C-Media_CMI8738_PCI.jpg', alt: 'Foto A: een groene printplaat met chips, een rond zilverkleurig deksel en gekleurde aansluitingen aan de zijkant.' },
  { letter: 'B', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Intel_CPU_Core_i7_6700K_Skylake_top.jpg/960px-Intel_CPU_Core_i7_6700K_Skylake_top.jpg', alt: 'Foto B: een vierkante chip met een metalen deksel en kleine letters erop.' },
  { letter: 'C', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/MSI_GeForce_GT_1030_2G_LP_OC_Graphics_Card_20200604-001.jpg/960px-MSI_GeForce_GT_1030_2G_LP_OC_Graphics_Card_20200604-001.jpg', alt: 'Foto C: een langwerpige kaart met een ventilator in het midden en een metalen strip met aansluitingen.' }
];
const fotoPaneel = () =>
  `<div style="display:flex;flex-wrap:wrap;gap:12px">${FOTOS.map((foto) =>
    `<figure style="flex:1 1 180px;margin:0;border:3px solid #0B0D0F;border-radius:12px;padding:8px;background:#fff">` +
    `<img src="${foto.src}" alt="${foto.alt}" loading="lazy" style="width:100%;height:150px;object-fit:contain;display:block">` +
    `<figcaption style="text-align:center;font-weight:700;margin-top:6px">Foto ${foto.letter}</figcaption></figure>`
  ).join('')}</div><p style="font-size:0.85em">Foto's: Wikimedia Commons (vrije licentie).</p>`;

const introHtml = () => meta.intro
  .replace('__DEVICES_SVG__', devicesSvg())
  .replace(/<figure class="kennischeck-figuur"><img src="__HARDWARE_SVG__"[^>]*><\/figure>/, fotoPaneel());

/* ---------- blok ---------- */

const items = bouwToetsitems(seed.vragen, { slug, leerdoel: meta.leerdoel || '' });

const bouwBlok = (route, order) => ({
  id: blokId(route),
  vakId: 'vak-digitale-vaardigheden',
  leerjaarId: 'leerjaar-digitale-vaardigheden-vmbo1',
  niveauId: niveauId(route),
  hoofdstukId: `hoofdstuk-dv-${route}-h2`,
  paragraafId: paragraafId(route, doelCode),
  type: 'toets',
  order,
  title: meta.titel,
  status: 'published',
  content: {
    html: introHtml(),
    assessmentType: 'toets',
    items,
    attemptPolicy: { maxAttempts: meta.pogingen ?? 2, scoring: 'best', allowTeacherReset: true },
    tokenConfig: { enabled: meta.tokens !== false, totalTokens: meta.tokens !== false ? 25 : 0 },
    sourceBasis: [],
    sourceNotes: meta.bron || '',
    crops: []
  },
  settings: normalizeContentBlockSettings({ allowAiHelp: false, scaffoldingRole: 'bewijs_leveren' }, 'toets'),
  linkedVraagId: null,
  createdBy: maker,
  isArchived: false
});

const controleer = (blokken) => {
  const fouten = [];
  blokken.forEach((blok) => {
    const readiness = validateContentBlockReadiness(blok);
    if (readiness.errors.length > 0) fouten.push(`${blok.id}: ${readiness.errors.map((issue) => issue.message).join(' ')}`);
  });
  return fouten;
};

console.log(`Kennischeck devices plaatsen (${toonPlan ? 'TOON PLAN' : apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Seed: ${seedPad}`);
console.log(`Vragen: ${items.length} (${telTypes(items)})`);
console.log(`Pogingen: ${meta.pogingen ?? 2}, tokens: ${meta.tokens !== false ? 'aan' : 'uit'}, Digidocent: uit`);

if (toonPlan) {
  const blokken = ROUTES.map((route) => bouwBlok(route, 16));
  const fouten = controleer(blokken);
  if (fouten.length > 0) { fouten.forEach((f) => console.error(`- ${f}`)); process.exit(1); }
  console.log('Readiness-controle: publiceerbaar.');
  console.log(JSON.stringify({ lesblokken: blokken, publiekeSnapshots: blokken.map(buildPublicContentBlockSnapshot) }, null, 2));
  process.exit(0);
}

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const plan = [];
for (const route of ROUTES) {
  const pid = paragraafId(route, doelCode);
  const paragraaf = await db.collection('paragraaf').doc(pid).get();
  if (!paragraaf.exists) {
    console.error(`Paragraaf ${pid} bestaat niet. Importeer eerst hoofdstuk 2.`);
    process.exit(1);
  }
  const blokken = await db.collection('contentBlocks').where('paragraafId', '==', pid).get();
  const bestaand = blokken.docs.find((d) => d.id === blokId(route));
  const hoogste = Math.max(0, ...blokken.docs.filter((d) => d.id !== blokId(route)).map((d) => Number(d.data().order) || 0));
  const order = bestaand ? Number(bestaand.data().order) || hoogste + 1 : hoogste + 1;
  console.log(`- ${route}: "${paragraaf.data().title}" heeft ${blokken.size} blokken; kennischeck wordt blok ${order} ${bestaand ? '(bestaat al, wordt overschreven)' : '(nieuw)'}`);
  plan.push({ route, blok: bouwBlok(route, order) });
}
const fouten = controleer(plan.map((s) => s.blok));
if (fouten.length > 0) { fouten.forEach((f) => console.error(`- ${f}`)); process.exit(1); }
console.log('Readiness-controle: publiceerbaar.');

const klassenSnap = await db.collection('klassen').get();
const klassen = klassenSnap.docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .filter((klas) => String(klas.name || '').toUpperCase().startsWith(KLAS_PREFIX))
  .map((klas) => {
    const route = ROUTES.find((r) => niveauId(r) === klas.niveauId) || ROUTE_ZONDER_NIVEAU;
    const doel = TOEWIJZING[route].map((code) => paragraafId(route, code));
    const nieuw = doel.filter((pid) => !(klas.enabledParagrafen || []).includes(pid));
    return { ...klas, route, doel, nieuw };
  });
console.log('');
console.log('Brugklassen:');
klassen.forEach((klas) => console.log(`- ${klas.name}: route ${klas.route}${klas.niveauId ? '' : ' (geen route, kb-variant)'}, ${klas.nieuw.length} nieuwe paragrafen erbij (${klas.nieuw.map((p) => p.split('-').slice(-2).join('.')).join(', ') || 'niets'})`));
console.log('');
console.log(`Toewijzen (--wijs-toe): ${wijsToe ? 'JA' : 'nee'}`);

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const batch = db.batch();
for (const { blok } of plan) {
  batch.set(db.collection('contentBlocks').doc(blok.id), cleanForFirestore({ ...blok, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() }));
  const snapshot = buildPublicContentBlockSnapshot(blok);
  batch.set(db.collection('publicContentBlocks').doc(snapshot.id), cleanForFirestore({ ...snapshot, updatedAt: FieldValue.serverTimestamp() }));
}
await batch.commit();
console.log(`Geschreven: ${plan.length} toetsblokken + ${plan.length} publieke snapshots.`);

if (wijsToe) {
  for (const klas of klassen) {
    if (klas.nieuw.length === 0) continue;
    await db.collection('klassen').doc(klas.id).set({ enabledParagrafen: FieldValue.arrayUnion(...klas.doel), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    console.log(`Toegewezen aan ${klas.name}: ${klas.nieuw.length} paragrafen erbij`);
  }
}
console.log('');
console.log('Klaar.');
process.exit(0);
