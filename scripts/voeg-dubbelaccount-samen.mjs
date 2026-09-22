/**
 * Voegt een dubbel leerlingaccount samen met het goede account.
 *
 *   node scripts/voeg-dubbelaccount-samen.mjs --van <uid> --naar <uid>
 *   node scripts/voeg-dubbelaccount-samen.mjs --van <uid> --naar <uid> --apply
 *
 * Een leerling die per ongeluk twee keer een account maakte, heeft zijn werk
 * verdeeld over twee uid's. Dit script schuift alles naar het goede account en
 * ruimt het foute op:
 *
 *   - tokens: het saldo en het verdiende totaal worden opgeteld;
 *   - tokenAwardClaims: gaan mee, zodat hetzelfde spel niet twee keer betaalt;
 *   - voortgang (inclusief de itemantwoorden) en het nulmetingprofiel: alleen
 *     wat het goede account nog NIET heeft. Bestaat het daar al, dan blijft het
 *     staan en meldt het script dat het is overgeslagen. Werk van het goede
 *     account wordt dus nooit overschreven.
 *
 * Daarna gaat het foute account weg, uit Firestore en uit Firebase Auth, met
 * een back-up in exports/reset-backups/.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getAuth } = requireFromFunctions('firebase-admin/auth');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/voeg-dubbelaccount-samen.mjs';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const waarde = (vlag) => {
  const index = argumenten.indexOf(vlag);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : '';
};

const vanUid = waarde('--van');
const naarUid = waarde('--naar');
if (!vanUid || !naarUid || vanUid === naarUid) {
  console.error('Gebruik: --van <uid van het foute account> --naar <uid van het goede account> [--apply]');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();
const auth = getAuth();

const leesGebruiker = async (uid) => {
  const snapshot = await db.collection('users').doc(uid).get();
  if (!snapshot.exists) {
    console.error(`${uid} bestaat niet in users.`);
    process.exit(1);
  }
  return { uid, ...snapshot.data() };
};

const van = await leesGebruiker(vanUid);
const naar = await leesGebruiker(naarUid);

const tokensVan = await db.collection('tokenAccounts').doc(vanUid).get();
const tokensNaar = await db.collection('tokenAccounts').doc(naarUid).get();
const getal = (snapshot, veld) => Number(snapshot.exists ? snapshot.get(veld) || 0 : 0);

const voortgangVan = (await db.collection('voortgang').where('userId', '==', vanUid).get()).docs;
const blokkenNaar = new Set(
  (await db.collection('voortgang').where('userId', '==', naarUid).get()).docs.map((doc) => doc.get('blockId'))
);
const profielVan = await db.collection('nulmetingProfielen').doc(vanUid).get();
const profielNaar = await db.collection('nulmetingProfielen').doc(naarUid).get();
const claimsVan = (await db.collection('tokenAwardClaims').get()).docs.filter((doc) => doc.id.startsWith(`${vanUid}_`));

const teVerplaatsen = voortgangVan.filter((doc) => !blokkenNaar.has(doc.get('blockId')));
const overgeslagen = voortgangVan.filter((doc) => blokkenNaar.has(doc.get('blockId')));

console.log(`Samenvoegen (${apply ? 'APPLY' : 'DRY RUN'})\n`);
console.log(`van:  ${van.displayName || '(naamloos)'} <${van.email || 'geen'}>  ${vanUid}`);
console.log(`naar: ${naar.displayName || '(naamloos)'} <${naar.email || 'geen'}>  ${naarUid}\n`);
console.log(`tokens:      ${getal(tokensNaar, 'balance')} + ${getal(tokensVan, 'balance')} = ${getal(tokensNaar, 'balance') + getal(tokensVan, 'balance')}`);
console.log(`claims mee:  ${claimsVan.length ? claimsVan.map((doc) => doc.id.replace(`${vanUid}_`, '')).join(', ') : 'geen'}`);
console.log(`voortgang:   ${teVerplaatsen.length} record(s) mee${overgeslagen.length ? `, ${overgeslagen.length} overgeslagen (bestaat al)` : ''}`);
console.log(`startprofiel: ${profielVan.exists ? (profielNaar.exists ? 'bestaat al bij het goede account, blijft staan' : 'gaat mee') : 'geen'}`);
console.log(`auth:        ${await auth.getUser(vanUid).then(() => 'foute account bestaat, wordt verwijderd').catch(() => 'foute account bestaat niet in auth')}`);

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om samen te voegen.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `samenvoegen-${vanUid}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify({
  van,
  naar: { uid: naarUid, email: naar.email, tokensVoor: getal(tokensNaar, 'balance') },
  tokensVan: tokensVan.exists ? tokensVan.data() : null,
  claims: claimsVan.map((doc) => ({ id: doc.id, ...doc.data() })),
  voortgang: voortgangVan.map((doc) => ({ id: doc.id, ...doc.data() })),
  profiel: profielVan.exists ? profielVan.data() : null
}, null, 2));
console.log(`\nBack-up: ${backupPad}`);

// 1. Tokens optellen.
if (tokensVan.exists) {
  await db.collection('tokenAccounts').doc(naarUid).set({
    balance: getal(tokensNaar, 'balance') + getal(tokensVan, 'balance'),
    earnedTotal: getal(tokensNaar, 'earnedTotal') + getal(tokensVan, 'earnedTotal'),
    adjustedTotal: getal(tokensNaar, 'adjustedTotal') + getal(tokensVan, 'adjustedTotal'),
    spentTotal: getal(tokensNaar, 'spentTotal') + getal(tokensVan, 'spentTotal'),
    samengevoegdVan: FieldValue.arrayUnion(vanUid),
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
  await db.collection('tokenAccounts').doc(vanUid).delete();
  console.log('Tokens samengevoegd.');
}

// 2. Claims mee, zodat hetzelfde spel niet twee keer uitbetaalt.
for (const claim of claimsVan) {
  const nieuweId = claim.id.replace(`${vanUid}_`, `${naarUid}_`);
  const bestaand = await db.collection('tokenAwardClaims').doc(nieuweId).get();
  if (!bestaand.exists) {
    await db.collection('tokenAwardClaims').doc(nieuweId).set({
      ...claim.data(),
      studentUid: naarUid,
      samengevoegdVan: vanUid
    });
  }
  await claim.ref.delete();
  console.log(`Claim ${bestaand.exists ? 'bestond al, alleen opgeruimd' : 'verplaatst'}: ${claim.id.replace(`${vanUid}_`, '')}`);
}

// 3. Voortgang mee, inclusief de losse antwoorden.
for (const doc of teVerplaatsen) {
  const blockId = doc.get('blockId');
  const nieuweRef = db.collection('voortgang').doc(`${naarUid}_${blockId}`);
  await nieuweRef.set({ ...doc.data(), userId: naarUid, samengevoegdVan: vanUid });
  const items = await doc.ref.collection('items').get();
  for (const item of items.docs) {
    await nieuweRef.collection('items').doc(item.id).set({ ...item.data(), userId: naarUid });
    await item.ref.delete();
  }
  await doc.ref.delete();
  console.log(`Voortgang verplaatst: ${blockId} (${items.size} antwoorden)`);
}
for (const doc of overgeslagen) {
  const items = await doc.ref.collection('items').get();
  for (const item of items.docs) await item.ref.delete();
  await doc.ref.delete();
  console.log(`Voortgang overgeslagen en opgeruimd (bestond al): ${doc.get('blockId')}`);
}

// 4. Startprofiel alleen als het goede account er nog geen heeft.
if (profielVan.exists) {
  if (!profielNaar.exists) {
    await db.collection('nulmetingProfielen').doc(naarUid).set({ ...profielVan.data(), userId: naarUid, leerlingId: naarUid });
    console.log('Startprofiel verplaatst.');
  } else {
    console.log('Startprofiel overgeslagen: het goede account had er al een.');
  }
  await profielVan.ref.delete();
}

// 5. Het foute account weg.
await auth.deleteUser(vanUid).catch(() => {});
await db.collection('users').doc(vanUid).delete();
console.log(`\nKlaar. ${vanUid} is verwijderd; alles staat nu onder ${naar.email || naarUid}.`);
console.log(`Uitgevoerd door ${SCRIPT_NAAM}.`);
