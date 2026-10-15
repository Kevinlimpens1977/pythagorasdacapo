/**
 * Zet `content.vraagVolgordePerLeerling` aan (of uit) op de quiz- en
 * toetsblokken van één hoofdstuk. De leerling ziet de vragen dan in een eigen
 * volgorde, geschud binnen elk niveau (schudVraagVolgordePerNiveau in
 * src/lib/answerOptionShuffle.js). Daarna de snapshots bijwerken:
 *
 *   node scripts/zet-vraagvolgorde-per-leerling.mjs --hoofdstuk hoofdstuk-diff-rekenen-2-start
 *   node scripts/zet-vraagvolgorde-per-leerling.mjs --hoofdstuk <id> --apply
 *   node scripts/zet-vraagvolgorde-per-leerling.mjs --hoofdstuk <id> --uit --apply
 *   node scripts/backfill-public-content-snapshots.mjs --hoofdstuk <id> --apply
 *
 * Met --rekenhulp zet het script in plaats daarvan `settings.allowMathToolbox`
 * aan: bij getalvragen staat dan de rekenhulp (verhoudingstabel, rekenmachine)
 * als kladwerk. Nagekeken wordt alleen het getal.
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const aan = !argumenten.includes('--uit');
const rekenhulp = argumenten.includes('--rekenhulp');
const veld = rekenhulp ? 'settings.allowMathToolbox' : 'content.vraagVolgordePerLeerling';
const index = argumenten.indexOf('--hoofdstuk');
const hoofdstukId = index >= 0 ? String(argumenten[index + 1] || '') : '';
if (!hoofdstukId) {
  console.error('Geef het hoofdstuk op: --hoofdstuk <id>');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const snap = await db.collection('contentBlocks').where('hoofdstukId', '==', hoofdstukId).get();
const blokken = snap.docs.filter((doc) => ['quiz', 'toets'].includes(doc.get('type')));
if (!blokken.length) {
  console.error(`Geen quiz- of toetsblokken in ${hoofdstukId}.`);
  process.exit(1);
}

console.log(`${apply ? 'SCHRIJVEN' : 'DRY RUN'}: ${veld} ${aan ? 'aan' : 'uit'} op ${blokken.length} blok(ken):`);
blokken.forEach((doc) => console.log(`  ${doc.id}  (nu: ${doc.get(veld) === true ? 'aan' : 'uit'})`));
if (!apply) {
  console.log('Gebruik --apply om te schrijven, en daarna backfill-public-content-snapshots.mjs --hoofdstuk.');
  process.exit(0);
}

for (const doc of blokken) {
  await doc.ref.update({ [veld]: aan });
}
console.log('Klaar. Werk nu de snapshots bij.');
process.exit(0);
