/**
 * Ruimt een dubbel leerlingaccount op dat nog helemaal leeg is.
 *
 *   node scripts/ruim-leeg-dubbelaccount-op.mjs --uid <uid> [--uid <uid>]
 *   node scripts/ruim-leeg-dubbelaccount-op.mjs --uid <uid> --apply
 *
 * Twee leerlingen hadden per ongeluk twee accounts: één met hun werk en één
 * lege. Zo'n lege staat daarna eeuwig op nul in elk overzicht.
 *
 * Het script weigert te verwijderen zodra het ook maar iets van werk vindt:
 * voortgang, losse antwoorden, tokens, een startprofiel of een melding. Dan is
 * het namelijk geen leeg account meer, en hoort er eerst iemand naar te kijken.
 * Vóór het verwijderen gaat het gebruikersdocument naar exports/reset-backups/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getAuth } = requireFromFunctions('firebase-admin/auth');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const uids = argumenten.reduce((lijst, waarde, index) => (
  waarde === '--uid' && argumenten[index + 1] ? [...lijst, argumenten[index + 1]] : lijst
), []);

if (!uids.length) {
  console.error('Gebruik: --uid <uid> [--uid <uid>] [--apply]');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();
const auth = getAuth();

// Elke plek waar werk van een leerling kan staan. Komt er een collectie bij,
// zet hem hier ook neer: het script is alleen veilig als deze lijst klopt.
const WERKPLEKKEN = [
  { collectie: 'voortgang', veld: 'userId' },
  { collectie: 'userAnswers', veld: 'userId' },
  { collectie: 'tokenTransactions', veld: 'userId' },
  { collectie: 'tokenPurchases', veld: 'userId' },
  { collectie: 'meldingen', veld: 'melderUid' }
];

const DOCUMENTEN = ['nulmetingProfielen', 'tokenAccounts'];

console.log(`Lege dubbelaccounts opruimen (${apply ? 'APPLY' : 'DRY RUN'})\n`);

const plannen = [];
for (const uid of uids) {
  const snapshot = await db.collection('users').doc(uid).get();
  if (!snapshot.exists) {
    console.error(`${uid}: bestaat niet in users.`);
    process.exit(1);
  }
  const data = snapshot.data() || {};
  const sporen = [];

  for (const { collectie, veld } of WERKPLEKKEN) {
    const treffers = await db.collection(collectie).where(veld, '==', uid).limit(5).get();
    if (!treffers.empty) sporen.push(`${treffers.size}+ in ${collectie}`);
  }
  for (const collectie of DOCUMENTEN) {
    const doc = await db.collection(collectie).doc(uid).get();
    if (doc.exists) sporen.push(`document in ${collectie}`);
  }

  const inAuth = await auth.getUser(uid).then(() => true).catch(() => false);

  console.log(`${uid}`);
  console.log(`  naam:      ${data.displayName || '(geen)'} <${data.email || 'geen e-mail'}>`);
  console.log(`  klas:      ${data.klasId || '(geen)'} | rol: ${data.role || '(geen)'}`);
  console.log(`  auth:      ${inAuth ? 'bestaat' : 'bestaat niet'}`);
  console.log(`  werk:      ${sporen.length ? sporen.join(', ') : 'niets gevonden'}`);
  console.log('');

  if (sporen.length) {
    console.error('Dit account is niet leeg. Er wordt niets verwijderd.');
    process.exit(1);
  }

  plannen.push({ uid, data, inAuth });
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te verwijderen.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `lege-dubbelaccounts-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(plannen.map(({ uid, data }) => ({ uid, ...data })), null, 2));
console.log(`Back-up: ${backupPad}\n`);

for (const plan of plannen) {
  if (plan.inAuth) await auth.deleteUser(plan.uid);
  await db.collection('users').doc(plan.uid).delete();
  console.log(`Verwijderd: ${plan.uid} (${plan.data.displayName || 'naamloos'})`);
}

console.log(`\nKlaar: ${plannen.length} leeg account verwijderd.`);
