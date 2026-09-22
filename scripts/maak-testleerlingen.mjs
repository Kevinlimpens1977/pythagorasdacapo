/**
 * Maakt per klas één testleerling, zodat de beheerder kan zien en doen wat een
 * leerling van die klas ziet en doet.
 *
 *   node scripts/maak-testleerlingen.mjs                 # dry run
 *   node scripts/maak-testleerlingen.mjs --apply
 *   node scripts/maak-testleerlingen.mjs --apply --verwijder
 *
 * De uid ligt vast (`testleerling-<klas>`), dus opnieuw draaien werkt bestaande
 * accounts bij in plaats van een tweede testleerling te maken. De testdata van
 * eerdere sessies blijft zo aan hetzelfde account hangen.
 *
 * Het adres `<uid>@helix-test.local` is alleen een sleutel voor Firebase Auth;
 * er gaat nooit post heen. Er is ook geen wachtwoord: inloggen kan alleen via de
 * Cloud Function startTestleerlingSessie, en die geeft alleen een token voor een
 * account met `isTestaccount: true`.
 *
 * Dit script schrijft met de Admin SDK en gaat dus langs de beveiligingsregels
 * heen. Dat is hier terecht: een testaccount heeft geen schoolmail en zou die
 * regels niet halen.
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getAuth } = requireFromFunctions('firebase-admin/auth');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/maak-testleerlingen.mjs';
const TEST_DOMEIN = 'helix-test.local';

// Dezelfde klassen als scripts/zet-klas-lesstof-klaar.mjs, plus de twee
// EOA-klassen. Komt er een klas bij, voeg hem hier toe en draai het script
// opnieuw.
const KLASSEN = [
  { naam: 'H1B1', id: 'klas_1787767044660' },
  { naam: 'H1B2', id: 'klas_1787767053890' },
  { naam: 'H1K1', id: 'klas_1787768386819_0' },
  { naam: 'H1K2', id: 'klas_1787768386908_1' },
  { naam: 'H1K3', id: 'klas_1787768387011_2' },
  { naam: 'H1i1', id: 'klas_1787768387105_3' },
  { naam: 'H1TL1', id: 'klas_1787768387188_4' },
  { naam: 'H1TL2', id: 'klas_1787768387289_5' },
  { naam: 'H1TL3', id: 'klas_1787768387366_6' },
  { naam: 'ER3L1A', id: 'klas_1787768387441_7' },
  { naam: 'ER3L2A', id: 'klas_1787768387528_8' }
];

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const verwijder = argumenten.includes('--verwijder');

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();
const auth = getAuth();

const testleerling = (klas) => {
  const uid = `testleerling-${klas.naam.toLowerCase()}`;
  return {
    uid,
    email: `${uid}@${TEST_DOMEIN}`,
    displayName: `Testleerling ${klas.naam}`,
    klasId: klas.id,
    klasNaam: klas.naam
  };
};

console.log(`Testleerlingen ${verwijder ? 'verwijderen' : 'klaarzetten'} (${apply ? 'APPLY' : 'DRY RUN'})\n`);

const plannen = [];
for (const klas of KLASSEN) {
  const klasSnap = await db.collection('klassen').doc(klas.id).get();
  if (!klasSnap.exists) {
    console.error(`Klas ${klas.naam} (${klas.id}) bestaat niet. Werk de lijst in dit script bij.`);
    process.exit(1);
  }

  const account = testleerling(klas);
  const bestaatDoc = (await db.collection('users').doc(account.uid).get()).exists;
  const bestaatAuth = await auth.getUser(account.uid).then(() => true).catch(() => false);
  plannen.push({ ...account, bestaatDoc, bestaatAuth });

  const stand = bestaatDoc || bestaatAuth
    ? `bestaat al (auth: ${bestaatAuth ? 'ja' : 'nee'}, gegevens: ${bestaatDoc ? 'ja' : 'nee'})`
    : 'nieuw';
  console.log(`  ${account.klasNaam.padEnd(7)} ${account.uid.padEnd(24)} ${verwijder ? 'wordt verwijderd' : stand}`);
}

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

console.log('');
for (const plan of plannen) {
  if (verwijder) {
    if (plan.bestaatAuth) await auth.deleteUser(plan.uid);
    if (plan.bestaatDoc) await db.collection('users').doc(plan.uid).delete();
    console.log(`Verwijderd: ${plan.uid}`);
    continue;
  }

  if (plan.bestaatAuth) {
    await auth.updateUser(plan.uid, { email: plan.email, displayName: plan.displayName, disabled: false });
  } else {
    await auth.createUser({
      uid: plan.uid,
      email: plan.email,
      displayName: plan.displayName,
      disabled: false,
      emailVerified: false
    });
  }

  await db.collection('users').doc(plan.uid).set({
    uid: plan.uid,
    email: plan.email,
    displayName: plan.displayName,
    role: 'student',
    klasId: plan.klasId,
    isTestaccount: true,
    needsNameSetup: false,
    aangemaaktDoor: SCRIPT_NAAM,
    updatedAt: FieldValue.serverTimestamp(),
    ...(plan.bestaatDoc ? {} : { createdAt: FieldValue.serverTimestamp(), lastActive: FieldValue.serverTimestamp() })
  }, { merge: true });

  console.log(`Klaar: ${plan.uid} (${plan.klasNaam})`);
}

console.log(`\n${verwijder ? 'Verwijderd' : 'Klaargezet'}: ${plannen.length} testleerling(en).`);
console.log('Werk van een testleerling wis je met scripts/wis-werk-leerling.mjs.');
