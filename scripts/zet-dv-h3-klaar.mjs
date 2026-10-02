/**
 * Zet DV hoofdstuk 3 klaar voor de klassen, op slot (Kevin, 30 sep 2026):
 * - de gewone H1-klassen krijgen de basisparagrafen 3.1-3.3;
 * - H1i1 (inclusie) krijgt de inclusieparagrafen, met dezelfde nummers;
 * - bij alle klassen staat hoofdstuk 3 op slot tot Kevin hem opent.
 * De inclusieparagrafen krijgen variantVan en variantProfiel, zodat het
 * variantplan (docs/PLAN-INCLUSIEVARIANTEN.md) ze later herkent.
 *
 *   node scripts/zet-dv-h3-klaar.mjs            dry run
 *   node scripts/zet-dv-h3-klaar.mjs --apply    schrijven
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const H3 = 'hoofdstuk-dv-klas1-h3';
const BASIS = ['paragraaf-dv-klas1-31', 'paragraaf-dv-klas1-32', 'paragraaf-dv-klas1-33'];
const INCLUSIE = ['paragraaf-dv-klas1-incl-31', 'paragraaf-dv-klas1-incl-32', 'paragraaf-dv-klas1-incl-33'];
const INCLUSIEKLAS = 'H1i1';

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

for (const id of [...BASIS, ...INCLUSIE]) {
  if (!(await db.collection('paragraaf').doc(id).get()).exists) throw new Error(`${id} bestaat niet; importeer eerst de seeds.`);
}

const plannen = [];
for (const doc of (await db.collection('klassen').get()).docs) {
  const k = doc.data();
  const naam = k.naam || k.name || doc.id;
  if (!/^H1/.test(naam)) continue;
  const doel = naam === INCLUSIEKLAS ? INCLUSIE : BASIS;
  const nieuw = doel.filter((id) => !(k.enabledParagrafen || []).includes(id));
  const slot = (k.vergrendeldeHoofdstukken || []).includes(H3);
  plannen.push({ ref: doc.ref, naam, doel, nieuw, slot });
  console.log(`${naam.padEnd(6)} krijgt ${naam === INCLUSIEKLAS ? 'inclusie' : 'basis'}: ${nieuw.length ? nieuw.join(', ') : 'al toegewezen'}; H3 op slot: ${slot ? 'al' : 'wordt gezet'}`);
}
console.log(`\nInclusieparagrafen krijgen variantVan en variantProfiel 'inclusie'.`);

if (!apply) {
  console.log('Dry run: niets geschreven. Draai met --apply om te schrijven.');
  process.exit(0);
}

const batch = db.batch();
INCLUSIE.forEach((id, i) => batch.set(db.collection('paragraaf').doc(id), { variantVan: BASIS[i], variantProfiel: 'inclusie' }, { merge: true }));
for (const p of plannen) {
  const update = { vergrendeldeHoofdstukken: FieldValue.arrayUnion(H3) };
  if (p.nieuw.length) update.enabledParagrafen = FieldValue.arrayUnion(...p.nieuw);
  batch.update(p.ref, update);
}
await batch.commit();
console.log('Geschreven.');
