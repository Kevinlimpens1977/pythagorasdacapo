/**
 * Werkt EEN lesblok in Firestore bij vanuit een gegenereerde seed, zonder het
 * hele hoofdstuk opnieuw te importeren. Bedoeld voor een kleine wijziging aan
 * een blok dat al live staat, bijvoorbeeld vragen toevoegen aan een quiz.
 *
 *   node scripts/werk-blok-bij-uit-seed.mjs --seed docs/seeds/dv-h2-device.seed.json --blok block-dv-klas1-23-quiz-4
 *   node scripts/werk-blok-bij-uit-seed.mjs --seed ... --blok ... --apply
 *
 * Wat het doet:
 *   1. leest het blok uit de seed en het blok uit Firestore;
 *   2. toont het verschil (aantal vragen, tokens, titel);
 *   3. meldt hoeveel leerlingen al voortgang op dit blok hebben;
 *   4. schrijft met --apply de inhoud naar contentBlocks, met een back-up van
 *      de oude versie in exports/reset-backups/.
 *
 * De publieke snapshot werk je daarna bij met
 * scripts/backfill-public-content-snapshots.mjs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore, FieldValue } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const SCRIPT_NAAM = 'scripts/werk-blok-bij-uit-seed.mjs';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const waarde = (vlag) => {
  const index = argumenten.indexOf(vlag);
  return index >= 0 && argumenten[index + 1] ? argumenten[index + 1] : '';
};

const seedPad = waarde('--seed');
const blokId = waarde('--blok');
if (!seedPad || !blokId) {
  console.error('Gebruik: --seed <pad naar .seed.json> --blok <blokId> [--apply]');
  process.exit(1);
}

const seed = JSON.parse(fs.readFileSync(path.resolve(seedPad), 'utf8'));
const nieuw = (seed.contentBlocks || []).find((blok) => blok.id === blokId);
if (!nieuw) {
  console.error(`Blok ${blokId} staat niet in ${seedPad}.`);
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const snap = await db.collection('contentBlocks').doc(blokId).get();
if (!snap.exists) {
  console.error(`Blok ${blokId} bestaat niet in Firestore. Gebruik de gewone import voor een nieuw blok.`);
  process.exit(1);
}
const oud = snap.data();

const tel = (blok) => (Array.isArray(blok?.content?.items) ? blok.content.items.length : 0);
console.log(`${blokId} (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`  titel:    ${oud.title} -> ${nieuw.title}`);
console.log(`  vragen:   ${tel(oud)} -> ${tel(nieuw)}`);
console.log(`  tokens:   ${oud.content?.tokenConfig?.totalTokens ?? '-'} -> ${nieuw.content?.tokenConfig?.totalTokens ?? '-'}`);
console.log(`  status:   ${oud.status} -> ${nieuw.status}`);

const voortgang = await db.collection('voortgang').where('blockId', '==', blokId).get();
const afgerond = voortgang.docs.filter((doc) => doc.get('completed') === true).length;
console.log(`  voortgang: ${voortgang.size} leerling(en), waarvan ${afgerond} afgerond`);
if (voortgang.size > 0) {
  console.log('  LET OP: er is al gewerkt aan dit blok. Meer vragen betekent dat een');
  console.log('          afgeronde leerling opnieuw op "niet af" komt te staan.');
}

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `blok-${blokId}-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify({ id: blokId, ...oud }, null, 2));
console.log(`\nBack-up: ${backupPad}`);

// createdAt en createdBy blijven van het bestaande blok: dit is een wijziging,
// geen nieuw blok.
const { createdAt, createdBy, ...rest } = nieuw;
await db.collection('contentBlocks').doc(blokId).update({
  ...rest,
  updatedAt: FieldValue.serverTimestamp(),
  laatsteWijziging: { script: SCRIPT_NAAM, op: new Date().toISOString(), bron: seedPad }
});
console.log(`Geschreven: ${blokId}`);
console.log('Werk nu de publieke snapshot bij met scripts/backfill-public-content-snapshots.mjs.');
