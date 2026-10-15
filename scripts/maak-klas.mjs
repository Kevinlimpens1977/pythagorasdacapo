/**
 * Maakt een nieuwe klas aan, met dezelfde velden als "Nieuwe klas aanmaken" op
 * /admin/klassen (createKlas in src/services/klasService.js). Toewijzen doe je
 * daarna met scripts/zet-klas-lesstof-klaar.mjs.
 *
 *   node scripts/maak-klas.mjs --naam Diff_kader2
 *   node scripts/maak-klas.mjs --naam Diff_kader2 --apply
 *
 * Weigert als er al een klas met die naam bestaat.
 */

import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
// Kevins beheerdersaccount, zoals bij de bestaande klassen.
const ADMIN_UID = 'gJIAmJpSDOYczZNh64UtTTVVrAo1';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const naamIndex = argumenten.indexOf('--naam');
const naam = naamIndex >= 0 ? String(argumenten[naamIndex + 1] || '').trim() : '';
if (!naam) {
  console.error('Geef de naam op: --naam <klasnaam>');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const bestaand = await db.collection('klassen').where('name', '==', naam).get();
if (!bestaand.empty) {
  console.error(`Er bestaat al een klas ${naam}: ${bestaand.docs.map((d) => d.id).join(', ')}`);
  process.exit(1);
}

const tekens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const code = Array.from({ length: 6 }, () => tekens.charAt(Math.floor(Math.random() * tekens.length))).join('');
const klasId = `klas_${Date.now()}`;
const klas = {
  klasId,
  name: naam,
  code,
  createdBy: ADMIN_UID,
  settings: { hintsEnabled: true, aiEnabled: true, calculatorEnabled: true },
  enabledChapters: { voorkennis: true }
};

console.log(`${apply ? 'SCHRIJVEN' : 'DRY RUN'}: klas ${naam} (${klasId}), code ${code}, geen route.`);
if (!apply) {
  console.log('Gebruik --apply om de klas aan te maken.');
  process.exit(0);
}

await db.collection('klassen').doc(klasId).set({ ...klas, createdAt: FieldValue.serverTimestamp() });
console.log(`Aangemaakt: ${klasId}. Zet dit id in VAKKEN van scripts/zet-klas-lesstof-klaar.mjs en in KLASSEN van scripts/maak-testleerlingen.mjs.`);
process.exit(0);
