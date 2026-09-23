/**
 * Zet de komende DV-hoofdstukken als placeholder klaar: alleen een kaart met
 * titel, op slot, nog zonder inhoud.
 *
 *   node scripts/zet-dv-placeholders.mjs            dry run
 *   node scripts/zet-dv-placeholders.mjs --apply    schrijven
 *
 * Bron: docs/curriculum/dv-klas1-curriculum.json (les 2 t/m 22 = hoofdstuk 3
 * t/m 23). Per hoofdstuk een document `hoofdstuk-dv-klas1-h{n}` met dezelfde
 * id die scripts/bouw-hoofdstuk-seed.mjs later gebruikt; bouw je het hoofdstuk
 * met de skill, dan vult die dit document aan. Een hoofdstuk dat al bestaat,
 * blijft ongemoeid.
 *
 * Op slot gaat het bij elke klas die hoofdstuk 2 heeft (toegewezen of op slot);
 * een klas zonder DV-hoofdstuk 2 (H1i1, de EOA-klassen) blijft ongemoeid. De
 * leerling ziet de kaart omdat src/hooks/useStudentOutline.js hoofdstukken op
 * slot zonder paragrafen als "komt eraan" toont.
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
const H2_ID = 'hoofdstuk-dv-klas1-h2';

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}
const db = getFirestore();

const curriculum = JSON.parse(readFileSync(new URL('../docs/curriculum/dv-klas1-curriculum.json', import.meta.url), 'utf8'));
const lessen = curriculum.lessen.filter((les) => Number(les.hoofdstuk) > 2);

const h2 = await db.doc(`hoofdstuk/${H2_ID}`).get();
if (!h2.exists) {
  console.error(`${H2_ID} bestaat niet; zonder dat hoofdstuk weet ik vak, leerjaar en route niet.`);
  process.exit(1);
}
const sjabloon = h2.data();

const batch = db.batch();
const nieuweIds = [];
const alleIds = [];
console.log(`DV-placeholders (${apply ? 'APPLY' : 'DRY RUN'})\n`);
for (const les of lessen) {
  const id = `hoofdstuk-dv-klas1-h${les.hoofdstuk}`;
  alleIds.push(id);
  const bestaand = await db.doc(`hoofdstuk/${id}`).get();
  if (bestaand.exists) {
    console.log(`  bestaat al  ${id}  ${bestaand.get('title')}`);
    continue;
  }
  nieuweIds.push(id);
  console.log(`  nieuw       ${id}  H${les.hoofdstuk}: ${les.titel}`);
  batch.set(db.doc(`hoofdstuk/${id}`), {
    id,
    title: les.titel,
    description: les.focus || '',
    number: Number(les.hoofdstuk),
    order: Number(les.hoofdstuk),
    badge: '',
    vakId: sjabloon.vakId,
    leerjaarId: sjabloon.leerjaarId,
    niveauId: sjabloon.niveauId,
    published: true,
    isArchived: false,
    placeholderSinds: FieldValue.serverTimestamp(),
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });
}

const h2Paragrafen = new Set((await db.collection('paragraaf').where('hoofdstukId', '==', H2_ID).get()).docs.map((doc) => doc.id));
const klassen = (await db.collection('klassen').get()).docs.map((doc) => ({ id: doc.id, ...doc.data() }));
console.log('');
for (const klas of klassen) {
  const naam = klas.naam || klas.name || klas.id;
  const heeftH2 = (klas.vergrendeldeHoofdstukken || []).includes(H2_ID)
    || (klas.enabledParagrafen || []).some((id) => h2Paragrafen.has(id));
  if (!heeftH2) {
    console.log(`  ongemoeid   ${naam} (geen DV-hoofdstuk 2)`);
    continue;
  }
  const erbij = alleIds.filter((id) => !(klas.vergrendeldeHoofdstukken || []).includes(id));
  console.log(`  op slot     ${naam}: ${erbij.length} hoofdstukken erbij`);
  if (erbij.length) {
    batch.set(db.doc(`klassen/${klas.id}`), { vergrendeldeHoofdstukken: FieldValue.arrayUnion(...erbij) }, { merge: true });
  }
}

console.log(`\nNieuwe hoofdstukken: ${nieuweIds.length} van ${alleIds.length}.`);
if (!apply) {
  console.log('Dry run. Draai met --apply om te schrijven.');
  process.exit(0);
}
await batch.commit();
console.log('Geschreven.');
