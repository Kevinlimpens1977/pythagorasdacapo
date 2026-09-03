/**
 * Lege start voor de brugklassen: wist de voortgang van alle leerlingen in
 * klassen waarvan de naam met H1 begint, en haalt oude lesstatusvelden van hun
 * leerlingdocument. Tokens blijven staan: rekeningen, transacties, aankopen,
 * claims en uitrusting worden niet aangeraakt. Lesstof en klassen ook niet.
 *
 * Standaard een dry run; met --apply wordt er gewist, na een back-up in
 * exports/reset-backups/.
 *
 *   node scripts/lege-start-brugklassen.mjs
 *   node scripts/lege-start-brugklassen.mjs --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const KLAS_PREFIX = /^H1/i;
const OUDE_LESVELDEN = ['lastLessonStatus', 'lesStatus', 'currentParagraafId', 'lastParagraafId', 'laatsteLes'];
const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}
const db = getFirestore();

const klassen = (await db.collection('klassen').get()).docs.filter((doc) => KLAS_PREFIX.test(doc.data().name || ''));
const klasIds = new Set(klassen.map((doc) => doc.id));
const leerlingen = (await db.collection('users').get()).docs.filter((doc) => klasIds.has(doc.data().klasId));
const uids = new Set(leerlingen.map((doc) => doc.id));
const voortgang = (await db.collection('voortgang').get()).docs.filter((doc) => uids.has(doc.data().userId));
const teSchonen = leerlingen.filter((doc) => {
  const data = doc.data();
  return (Array.isArray(data.completedChapters) && data.completedChapters.length > 0)
    || (Array.isArray(data.completedSlides) && data.completedSlides.length > 0)
    || OUDE_LESVELDEN.some((veld) => data[veld] !== undefined);
});

console.log(`Lege start brugklassen (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Klassen: ${klassen.map((doc) => doc.data().name).join(', ')}`);
console.log(`Leerlingen in die klassen: ${uids.size}`);
console.log(`Voortgangdocumenten (met hun items) te wissen: ${voortgang.length}`);
voortgang.forEach((doc) => console.log(`  - ${doc.id}`));
console.log(`Leerlingdocumenten met oude lesvelden te schonen: ${teSchonen.length}`);
console.log('Blijft staan: tokenAccounts, tokenTransactions, tokenPurchases, tokenAwardClaims, studentTokenLoadouts, lesstof, klassen.');

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om te wissen.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backup = [];
for (const doc of voortgang) {
  const items = await doc.ref.collection('items').get();
  backup.push({ id: doc.id, ...doc.data(), items: items.docs.map((item) => ({ id: item.id, ...item.data() })) });
}
const backupPad = path.join(backupDir, `voortgang-brugklassen-gewist-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(backup, null, 2));
console.log(`Back-up: ${backupPad}`);

for (const doc of voortgang) {
  const items = await doc.ref.collection('items').get();
  for (const item of items.docs) await item.ref.delete();
  await doc.ref.delete();
  console.log(`Gewist: ${doc.id} (${items.size} items)`);
}

for (const doc of teSchonen) {
  const data = doc.data();
  const update = {};
  if (Array.isArray(data.completedChapters) && data.completedChapters.length) update.completedChapters = [];
  if (Array.isArray(data.completedSlides) && data.completedSlides.length) update.completedSlides = [];
  OUDE_LESVELDEN.forEach((veld) => { if (data[veld] !== undefined) update[veld] = FieldValue.delete(); });
  await doc.ref.update(update);
}
console.log(`Geschoond: ${teSchonen.length} leerlingdocumenten`);
console.log('Klaar.');
process.exit(0);
