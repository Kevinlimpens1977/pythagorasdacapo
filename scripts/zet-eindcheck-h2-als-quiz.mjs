/**
 * Zet de "Eindcheck hoofdstuk 2" (Binask 2.5) om van een leesblok naar een
 * digitale quiz die de server nakijkt (Kevin, 27 sep 2026): acht keer waar of
 * niet waar en twee rekenvragen met een getal.
 *
 *   node scripts/zet-eindcheck-h2-als-quiz.mjs            dry run
 *   node scripts/zet-eindcheck-h2-als-quiz.mjs --apply    schrijven
 *
 * Het blok houdt zijn id en volgorde. De oude versie gaat als back-up naar
 * exports/reset-backups/. Met --apply wordt ook de publieke snapshot (zonder
 * antwoorden) opnieuw geschreven.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { normalizeContentBlockSettings } from '../src/lib/contentBlockUtils.js';
import { validateContentBlockReadiness } from '../src/lib/contentReadiness.js';
import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { bouwToetsitems, telTypes } from './lib/toetsitems-uit-seed.mjs';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const BLOK_ID = 'block-binask-eoa-1-25-theory-5';

const VRAGEN = [
  { type: 'waar-niet-waar', vraag: '1 kg = 1000 g.', juist: true, uitleg: 'Kilo betekent 1000: 1 kg = 1000 g.' },
  { type: 'waar-niet-waar', vraag: '1 ml = 1 cm³.', juist: true, uitleg: '1 ml en 1 cm³ zijn even groot.' },
  { type: 'waar-niet-waar', vraag: 'Massa meet je met een maatcilinder.', juist: false, uitleg: 'Massa meet je met een weegschaal. Met een maatcilinder meet je volume.' },
  { type: 'waar-niet-waar', vraag: 'V = lengte × breedte × hoogte bij een rechthoekig blok.', juist: true, uitleg: 'Zo bereken je het volume van een balk.' },
  { type: 'waar-niet-waar', vraag: 'Dichtheid is een stofeigenschap.', juist: true, uitleg: 'Elke stof heeft zijn eigen dichtheid. Zo kun je een stof herkennen.' },
  { type: 'waar-niet-waar', vraag: 'ρ = m / V.', juist: true, uitleg: 'Dichtheid = massa : volume.' },
  { type: 'waar-niet-waar', vraag: 'm = ρ × V.', juist: true, uitleg: 'Leg de hand op m in de driehoek: m = ρ × V.' },
  { type: 'waar-niet-waar', vraag: 'V = ρ / m.', juist: false, uitleg: 'Het is andersom: V = m / ρ.' },
  { type: 'numeriek', vraag: 'Een blok heeft m = 80 g en V = 40 cm³. Bereken de dichtheid.', antwoord: 2, tolerantie: 0.01, eenheid: 'g/cm³', hint: 'ρ = m / V = 80 / 40.' },
  { type: 'numeriek', vraag: 'Een stof heeft ρ = 2,7 g/cm³ en V = 50 cm³. Bereken de massa.', antwoord: 135, tolerantie: 0.01, eenheid: 'g', hint: 'm = ρ × V = 2,7 × 50.' }
];

const INTRO = '<p>Maak de tien vragen zonder hulp. Je ziet meteen of je antwoord goed is.</p>'
  + '<p>Bij vraag 9 en 10 vul je alleen het getal in: de eenheid staat er al achter. Reken eerst uit op papier: formule, invullen, uitkomst.</p>';

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const snap = await db.collection('contentBlocks').doc(BLOK_ID).get();
if (!snap.exists) throw new Error(`Blok ${BLOK_ID} bestaat niet.`);
const oud = snap.data();

const items = bouwToetsitems(VRAGEN.map((vraag, index) => ({ nr: index + 1, ...vraag })), {
  slug: 'binask-h2-eindcheck',
  leerdoel: 'Massa, volume en dichtheid: begrippen en formules toepassen'
});

const blok = {
  ...oud,
  id: BLOK_ID,
  type: 'quiz',
  title: 'Eindcheck hoofdstuk 2 - ongeveer 10 minuten',
  content: {
    html: INTRO,
    assessmentType: 'quiz',
    items,
    attemptPolicy: { maxAttempts: 2, scoring: 'best', allowTeacherReset: true },
    tokenConfig: { enabled: true, totalTokens: 20 },
    sourceBasis: oud.content?.sourceBasis || [],
    sourceNotes: 'Eindcheck uit de bron-pdf van Kevin, als digitale quiz (27 sep 2026).',
    crops: []
  },
  settings: normalizeContentBlockSettings({ ...(oud.settings || {}), allowAiHelp: false }, 'quiz'),
  linkedVraagId: null
};

const readiness = validateContentBlockReadiness(blok);
console.log(`Blok ${BLOK_ID}: ${oud.type} -> quiz, ${items.length} vragen (${JSON.stringify(telTypes(items))}).`);
console.log(`Klaar voor gebruik: ${readiness.ready !== false ? 'ja' : 'NEE'}${readiness.issues?.length ? ` (${readiness.issues.join('; ')})` : ''}`);
for (const item of items) {
  const juist = item.answer.type === 'numeriek' ? `${item.answer.expected} ${item.answer.unit}` : item.answer.options.find((optie) => optie.correct)?.text;
  console.log(`  ${item.id}  ${item.prompt}  ->  ${juist}`);
}

const voortgang = await db.collection('studentProgress').where('blockId', '==', BLOK_ID).get().catch(() => ({ size: 0 }));
console.log(`Voortgang van leerlingen op dit blok: ${voortgang.size}.`);

if (!apply) {
  console.log('\nDry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}

const map = path.resolve('exports/reset-backups');
fs.mkdirSync(map, { recursive: true });
const backup = path.join(map, `${BLOK_ID}-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
fs.writeFileSync(backup, JSON.stringify(oud, null, 2));

const schoon = (waarde) => JSON.parse(JSON.stringify(waarde));
await db.collection('contentBlocks').doc(BLOK_ID).set({ ...schoon(blok), updatedAt: FieldValue.serverTimestamp() });
const snapshot = buildPublicContentBlockSnapshot(blok);
await db.collection('publicContentBlocks').doc(snapshot.id).set({ ...schoon(snapshot), updatedAt: FieldValue.serverTimestamp() });
console.log(`\nGeschreven. Back-up: ${backup}`);
