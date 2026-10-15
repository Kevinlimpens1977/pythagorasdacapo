/**
 * Maakt leerlingaccounts aan uit een lijst (tab of puntkomma gescheiden, met
 * kop Voornaam, Achternaam, Leerlingnummer), met een tijdelijk wachtwoord.
 * Het doet hetzelfde als de leerlingimport in het beheer (importStudentNumbers
 * in functions/index.js): uid student_<nummer>, mail <nummer>@leerling...,
 * mustChangePassword: true. Bij de eerste keer inloggen opent HELIX dan vanzelf
 * het scherm "Stel je wachtwoord in" (RequiredPasswordChange).
 *
 *   node scripts/maak-leerlingaccounts.mjs --bestand <pad> --klas <klasId> --wachtwoord <tijdelijk>
 *   node scripts/maak-leerlingaccounts.mjs --bestand <pad> --klas <klasId> --wachtwoord <tijdelijk> --apply
 *
 * Bestaat er al een account met dat mailadres onder een ander uid (de leerling
 * maakte zelf al een account), dan slaat het script die over en meldt het; zijn
 * wachtwoord en voortgang blijven dan van hem.
 */

import fs from 'node:fs';
import { createRequire } from 'node:module';

import { buildStudentEmail, normalizeDutchLastName, normalizeStudentNumber } from '../src/lib/studentNumberImportUtils.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');
const { getAuth } = requireFromFunctions('firebase-admin/auth');

const ADMIN_UID = 'gJIAmJpSDOYczZNh64UtTTVVrAo1';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const optie = (naam) => {
  const index = argumenten.indexOf(naam);
  return index >= 0 ? String(argumenten[index + 1] || '').trim() : '';
};
const bestand = optie('--bestand');
const klasId = optie('--klas');
const wachtwoord = optie('--wachtwoord');
if (!bestand || !klasId || wachtwoord.length < 6) {
  console.error('Gebruik: --bestand <pad> --klas <klasId> --wachtwoord <minstens 6 tekens>');
  process.exit(1);
}

const regels = fs.readFileSync(bestand, 'utf8').split(/\r?\n/).map((regel) => regel.trim()).filter(Boolean);
const rijen = regels.slice(1).map((regel) => {
  const [voornaam = '', achternaam = '', nummer = ''] = regel.split(/\t|;/).map((deel) => deel.trim());
  const studentNumber = normalizeStudentNumber(nummer);
  const firstName = voornaam;
  const lastName = normalizeDutchLastName(achternaam);
  return {
    uid: `student_${studentNumber}`,
    email: buildStudentEmail(studentNumber),
    firstName,
    lastName,
    displayName: [firstName, lastName].filter(Boolean).join(' '),
    studentNumber
  };
});

const fout = rijen.filter((rij) => !rij.firstName || !rij.lastName || !rij.studentNumber);
if (fout.length) {
  console.error('Onvolledige regels:', fout);
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();
const auth = getAuth();

const klas = await db.collection('klassen').doc(klasId).get();
if (!klas.exists) {
  console.error(`Klas ${klasId} bestaat niet.`);
  process.exit(1);
}

const plan = [];
for (const rij of rijen) {
  const opMail = await auth.getUserByEmail(rij.email).catch(() => null);
  const opUid = await auth.getUser(rij.uid).catch(() => null);
  const doc = await db.collection('users').doc(rij.uid).get();
  let actie = 'nieuw';
  if (opMail && opMail.uid !== rij.uid) actie = `overslaan: heeft al een eigen account (${opMail.uid})`;
  else if (opUid || doc.exists) actie = 'bestaat al: wachtwoord en klas opnieuw zetten';
  plan.push({ ...rij, actie });
}

console.log(`${apply ? 'SCHRIJVEN' : 'DRY RUN'}: ${plan.length} leerlingen naar ${klas.get('name')} (${klasId})`);
plan.forEach((rij) => console.log(`  ${rij.studentNumber}  ${rij.displayName.padEnd(30)} ${rij.actie}`));
if (!apply) {
  console.log('Gebruik --apply om de accounts aan te maken.');
  process.exit(0);
}

let gedaan = 0;
for (const rij of plan) {
  if (rij.actie.startsWith('overslaan')) continue;
  try {
    await auth.getUser(rij.uid);
    await auth.updateUser(rij.uid, { email: rij.email, password: wachtwoord, displayName: rij.displayName, disabled: false });
  } catch (error) {
    if (error?.code !== 'auth/user-not-found') throw error;
    await auth.createUser({ uid: rij.uid, email: rij.email, password: wachtwoord, displayName: rij.displayName, disabled: false, emailVerified: false });
  }
  const ref = db.collection('users').doc(rij.uid);
  const bestaat = (await ref.get()).exists;
  const nu = FieldValue.serverTimestamp();
  await ref.set({
    uid: rij.uid,
    email: rij.email,
    displayName: rij.displayName,
    firstName: rij.firstName,
    lastName: rij.lastName,
    studentNumber: rij.studentNumber,
    leerlingnummer: rij.studentNumber,
    role: 'student',
    klasId,
    needsNameSetup: false,
    isImportedStudent: true,
    importedBy: ADMIN_UID,
    mustChangePassword: true,
    passwordStatus: 'default',
    defaultPasswordSetAt: nu,
    lastPasswordResetBy: ADMIN_UID,
    updatedAt: nu,
    ...(bestaat ? {} : { createdAt: nu })
  }, { merge: true });
  gedaan += 1;
}
console.log(`Klaar: ${gedaan} account(s) aangemaakt of bijgewerkt.`);
process.exit(0);
