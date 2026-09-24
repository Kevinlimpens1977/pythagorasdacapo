/**
 * Binask 2.2 Volume als cijfer (Kevin, 24 sep 2026).
 *
 *   node scripts/zet-cijfer-volume-klaar.mjs            dry run
 *   node scripts/zet-cijfer-volume-klaar.mjs --apply    schrijven
 *
 * 1. Wist de voortgang van de drie volumespellen voor de EOA-klassen, zodat
 *    iedereen opnieuw begint. Eerst een back-up naar exports/reset-backups/.
 * 2. Zet de cijfergroep `cijferGroepen/binask-2-2-volume` klaar: alleen de
 *    eerste ronde per spel na nu telt (functions: registreerSpelRonde).
 * 3. Zet de drie spellen op slot, met de tekst voor de leerling.
 * 4. Opnieuw spelen levert geen nieuwe tokens op (replayDecay uit).
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore, Timestamp } = requireFromFunctions('firebase-admin/firestore');

const apply = process.argv.includes('--apply');
if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const KLASSEN = ['klas_1787768387441_7', 'klas_1787768387528_8'];
const BLOKKEN = [
  'block-binask-eoa-1-22-game-maatcilinder',
  'block-binask-eoa-1-22-game-balk',
  'block-binask-eoa-1-22-game-onderdompelen'
];
const SPELLEN = ['binask-volume-maatcilinder', 'binask-volume-balk', 'binask-volume-onderdompelen'];
const GROEP_ID = 'binask-2-2-volume';
const SLOT_TEKST = 'Dit spel staat nu dicht. In de volgende les starten we hiermee, als herhaling en als start van paragraaf 2.3. Dan telt je eerste ronde voor je cijfer.';

console.log(`Cijfer 2.2 Volume klaarzetten (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// 1. Voortgang van de drie spellen
const records = (await db.collection('voortgang').where('paragraafId', '==', 'paragraaf-binask-eoa-1-2-2').get()).docs
  .filter((doc) => BLOKKEN.includes(doc.get('blockId')) && KLASSEN.includes(doc.get('klasId')));
const leerlingen = new Set(records.map((doc) => doc.get('userId')));
console.log(`1. Voortgang wissen: ${records.length} records van ${leerlingen.size} leerlingen.`);
for (const blok of BLOKKEN) console.log(`   ${blok}: ${records.filter((doc) => doc.get('blockId') === blok).length}`);

// 2-4
console.log(`2. Cijfergroep ${GROEP_ID}: 3 spellen, klassen ER3L1A en ER3L2A, telt vanaf nu.`);
console.log(`3. Op slot bij beide klassen, met de tekst:\n   "${SLOT_TEKST}"`);
console.log(`4. Tokenregels ${SPELLEN.join(', ')}: replayDecay uit (geen nieuwe tokens bij opnieuw spelen).`);

if (!apply) {
  console.log('\nDry run. Draai met --apply om te schrijven.');
  process.exit(0);
}

const map = path.join(process.cwd(), 'exports', 'reset-backups');
fs.mkdirSync(map, { recursive: true });
const bestand = path.join(map, `cijfer-volume-voortgang-${Date.now()}.json`);
fs.writeFileSync(bestand, JSON.stringify(records.map((doc) => ({ id: doc.id, data: doc.data() })), null, 2));
console.log(`\nBack-up: ${bestand}`);

const batch = db.batch();
records.forEach((doc) => batch.delete(doc.ref));
batch.set(db.doc(`cijferGroepen/${GROEP_ID}`), {
  titel: '2.2 Volume',
  paragraafId: 'paragraaf-binask-eoa-1-2-2',
  blockIds: BLOKKEN,
  klasIds: KLASSEN,
  status: 'open',
  vanaf: Timestamp.now(),
  createdAt: FieldValue.serverTimestamp()
});
for (const klasId of KLASSEN) {
  batch.set(db.doc(`klassen/${klasId}`), {
    vergrendeldeBlokken: FieldValue.arrayUnion(...BLOKKEN),
    blokSlotTeksten: Object.fromEntries(BLOKKEN.map((id) => [id, SLOT_TEKST])),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
}
for (const spel of SPELLEN) {
  batch.set(db.doc(`tokenGameRewardRules/${spel}`), { replayDecay: null, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
}
await batch.commit();
console.log('Geschreven.');
