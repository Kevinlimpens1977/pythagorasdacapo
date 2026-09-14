/**
 * Wist al het gemaakte werk van EEN leerling, zodat hij met een schone lei
 * opnieuw kan beginnen. Bedoeld voor een testaccount of voor een leerling die
 * op verzoek van de docent helemaal overnieuw begint.
 *
 * Wat er weg gaat:
 *   - elk voortgangsdocument van deze leerling, inclusief de subcollectie
 *     `items` met de antwoorden per toets- of quizvraag;
 *   - losse antwoorden (`userAnswers`), bevestigde voortgangssignalen,
 *     inleveringen en het startprofiel van de nulmeting.
 *
 * Wat blijft staan:
 *   - het account zelf, de klas en de toewijzingen;
 *   - de lesstof;
 *   - tokens en tokenclaims. Die staan bewust los: een claim weghalen zou de
 *     leerling dezelfde tokens opnieuw laten verdienen. Met --ook-tokens gaan
 *     saldo, transacties en claims alsnog mee.
 *
 * Er komt eerst een back-up in exports/reset-backups.
 *
 *   node scripts/wis-werk-leerling.mjs <e-mailadres>                 # dry run
 *   node scripts/wis-werk-leerling.mjs <e-mailadres> --apply
 *   node scripts/wis-werk-leerling.mjs <e-mailadres> --apply --ook-tokens
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const ookTokens = argumenten.includes('--ook-tokens');
const email = argumenten.find((arg) => arg.includes('@'));

if (!email) {
  console.error('Geef het e-mailadres van de leerling mee.');
  console.error('  node scripts/wis-werk-leerling.mjs leerling@school.nl --apply');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

const users = await db.collection('users').where('email', '==', email).get();
if (users.empty) {
  console.error(`Geen account gevonden met e-mailadres ${email}.`);
  process.exit(1);
}
if (users.size > 1) {
  console.error(`Let op: ${users.size} accounts met dit e-mailadres. Script stopt, dit moet handmatig.`);
  process.exit(1);
}

const leerling = users.docs[0];
const uid = leerling.id;
console.log(`Werk wissen van ${leerling.get('displayName') || uid} <${email}> (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`  uid:  ${uid}`);
console.log(`  klas: ${leerling.get('klasId') || 'geen'}`);
console.log(`  rol:  ${leerling.get('role')}\n`);

// Verzamelen vóór het wissen, zodat de back-up compleet is en de dry run
// precies laat zien wat er zou verdwijnen.
const teWissen = [];
const backup = { email, uid, opgehaaldOp: new Date().toISOString(), documenten: [] };

const voegToe = async (snapshotDocs, label) => {
  for (const doc of snapshotDocs) {
    teWissen.push(doc.ref);
    backup.documenten.push({ pad: doc.ref.path, label, data: doc.data() });
  }
};

const voortgang = await db.collection('voortgang').where('userId', '==', uid).get();
let itemTeller = 0;
for (const doc of voortgang.docs) {
  const items = await doc.ref.collection('items').get();
  itemTeller += items.size;
  await voegToe(items.docs, 'toets-/quizantwoord');
}
await voegToe(voortgang.docs, 'voortgang');
console.log(`  voortgang:                 ${voortgang.size} documenten + ${itemTeller} antwoorden per vraag`);

for (const [collectie, veld] of [
  ['userAnswers', 'userId'],
  ['progressSignalAcknowledgements', 'userId'],
  ['inleveringen', 'userId']
]) {
  const snap = await db.collection(collectie).where(veld, '==', uid).get();
  await voegToe(snap.docs, collectie);
  console.log(`  ${collectie.padEnd(26)} ${snap.size} documenten`);
}

const profiel = await db.collection('nulmetingProfielen').doc(uid).get();
if (profiel.exists) {
  await voegToe([profiel], 'nulmetingProfielen');
  console.log('  nulmetingProfielen:        1 document');
}

if (ookTokens) {
  const rekening = await db.collection('tokenAccounts').doc(uid).get();
  if (rekening.exists) await voegToe([rekening], 'tokenAccounts');
  for (const [collectie, veld] of [['tokenTransactions', 'userId'], ['tokenAwardClaims', 'studentUid']]) {
    const snap = await db.collection(collectie).where(veld, '==', uid).get();
    await voegToe(snap.docs, collectie);
    console.log(`  ${collectie.padEnd(26)} ${snap.size} documenten`);
  }
  console.log(`  tokenAccounts:             ${rekening.exists ? 1 : 0} document`);
} else {
  console.log('  tokens:                    blijven staan (gebruik --ook-tokens)');
}

console.log(`\nTotaal te wissen: ${teWissen.length} documenten.`);

if (!teWissen.length) {
  console.log('Er staat niets om te wissen.');
  process.exit(0);
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te wissen.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const veiligeNaam = email.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const backupPad = path.join(backupDir, `werk-${veiligeNaam}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(backup, null, 2));
console.log(`Back-up: ${backupPad}`);

// In blokken van 400: een batch mag er 500.
for (let start = 0; start < teWissen.length; start += 400) {
  const batch = db.batch();
  teWissen.slice(start, start + 400).forEach((ref) => batch.delete(ref));
  await batch.commit();
  console.log(`  gewist: ${Math.min(start + 400, teWissen.length)} van ${teWissen.length}`);
}

// Narekenen.
const restVoortgang = await db.collection('voortgang').where('userId', '==', uid).get();
console.log(`\nControle: ${restVoortgang.size} voortgangsdocumenten over.`);
console.log(restVoortgang.empty ? 'Klaar. De leerling start met een schone lei.' : 'LET OP: er staat nog voortgang.');
process.exit(restVoortgang.empty ? 0 : 1);
