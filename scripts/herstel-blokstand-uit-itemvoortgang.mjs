/**
 * Herstelt blokrecords van quizzen en toetsen die niet kloppen met de
 * itemvoortgang eronder.
 *
 * Oorzaak (gevonden 11 september 2026): de leerlingroute berekende de blokstand
 * direct na het opslaan van een vraag uit de React-state, en React voert zo'n
 * update pas bij de volgende render uit. Was die kopie verouderd - bijvoorbeeld
 * na een refresh, terwijl de itemvoortgang nog aan het laden was - dan schreef
 * de app een stand weg die op de map van dat moment gebaseerd was. Zo kwamen
 * leerlingen met alle 27 vragen af toch op "1 van 27" te staan, telde hun
 * nulmeting niet als afgerond en bleef het startprofiel uit.
 *
 * De waarheid staat in `voortgang/{uid}_{blockId}/items`; dit script rekent die
 * met dezelfde gedeelde laag als de app (summarizeAssessmentItemProgress) om
 * naar de blokstand en schrijft die terug.
 *
 * Tokens worden niet toegekend: dat pad loopt via de Cloud Function en blijft
 * hier bewust buiten beeld. Het startprofiel van de nulmeting wordt evenmin
 * gebouwd; dat meldt het script, zodat je het zelf kunt laten draaien.
 *
 *   node scripts/herstel-blokstand-uit-itemvoortgang.mjs            # dry run
 *   node scripts/herstel-blokstand-uit-itemvoortgang.mjs --apply
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { summarizeAssessmentItemProgress } from '../src/lib/voortgangPayload.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const SCRIPT_NAAM = 'scripts/herstel-blokstand-uit-itemvoortgang.mjs';
const apply = process.argv.slice(2).includes('--apply');

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

console.log(`Blokstand herstellen uit de itemvoortgang (${apply ? 'APPLY' : 'DRY RUN'})\n`);

const records = await db.collection('voortgang').where('progressType', '==', 'contentBlock').get();
const scheef = [];

for (const doc of records.docs) {
  if (!['quiz', 'toets'].includes(doc.get('blockType'))) continue;

  const items = await doc.ref.collection('items').get();
  if (items.empty) continue;

  const blok = await db.collection('contentBlocks').doc(doc.get('blockId') || '').get();
  const blokItems = blok.exists ? (blok.get('content')?.items || []) : [];
  if (!blokItems.length) continue;

  const itemRecords = Object.fromEntries(items.docs.map((item) => [item.id, { id: item.id, ...item.data() }]));
  const samenvatting = summarizeAssessmentItemProgress({ items: blokItems, records: itemRecords });

  const gelijk =
    Number(doc.get('itemsCompleted') || 0) === samenvatting.itemsCompleted &&
    Number(doc.get('itemsCorrect') || 0) === samenvatting.itemsCorrect &&
    Boolean(doc.get('completed')) === Boolean(samenvatting.completed);
  if (gelijk) continue;

  const user = await db.collection('users').doc(doc.get('userId') || '').get();
  scheef.push({
    ref: doc.ref,
    naam: user.exists ? user.get('displayName') || doc.get('userId') : doc.get('userId'),
    blockId: doc.get('blockId'),
    isNulmeting: Boolean(blok.get('content')?.nulmeting?.deel),
    uid: doc.get('userId'),
    was: {
      itemsCompleted: Number(doc.get('itemsCompleted') || 0),
      itemsCorrect: Number(doc.get('itemsCorrect') || 0),
      completed: Boolean(doc.get('completed'))
    },
    wordt: samenvatting
  });
}

console.log(`Records die niet kloppen: ${scheef.length}\n`);
for (const x of scheef) {
  console.log(`- ${x.naam} (${x.blockId})`);
  console.log(`    was:   ${x.was.itemsCompleted} af, ${x.was.itemsCorrect} goed, afgerond=${x.was.completed}`);
  console.log(`    wordt: ${x.wordt.itemsCompleted} af, ${x.wordt.itemsCorrect} goed, afgerond=${x.wordt.completed}, score ${x.wordt.score}/${x.wordt.maxScore}`);
}

if (!scheef.length) {
  console.log('Niets te herstellen.');
  process.exit(0);
}

if (!apply) {
  console.log('\nDry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `blokstand-voor-herstel-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(backupPad, JSON.stringify(scheef.map(({ ref, ...rest }) => ({ pad: ref.path, ...rest })), null, 2));
console.log(`\nBack-up: ${backupPad}`);

for (const x of scheef) {
  await x.ref.set({
    itemCount: x.wordt.itemCount,
    itemsCompleted: x.wordt.itemsCompleted,
    itemsCorrect: x.wordt.itemsCorrect,
    score: x.wordt.score,
    maxScore: x.wordt.maxScore,
    aiHelpCount: x.wordt.aiHelpCount,
    eersteScore: x.wordt.eersteScore,
    herkansing: x.wordt.herkansing,
    completed: x.wordt.completed,
    isCorrect: x.wordt.isCorrect,
    resultTier: x.wordt.resultTier,
    attemptStatus: x.wordt.attemptStatus,
    completionReason: x.wordt.completed ? (x.wordt.isCorrect ? 'correct' : 'assessment_finished') : '',
    hersteldOp: FieldValue.serverTimestamp(),
    herstelReden: 'blokstand-liep-achter-op-itemvoortgang',
    herstelScript: SCRIPT_NAAM,
    updatedAt: FieldValue.serverTimestamp()
  }, { merge: true });
  console.log(`Hersteld: ${x.naam} (${x.blockId})`);
}

const nulmetingKlaar = scheef.filter((x) => x.isNulmeting && x.wordt.completed);
if (nulmetingKlaar.length) {
  console.log('\nLet op: deze leerlingen hebben nu een afgerond nulmetingdeel, maar hun');
  console.log('startprofiel is niet opnieuw gebouwd. Dat loopt via buildNulmetingProfiel:');
  nulmetingKlaar.forEach((x) => console.log(`  ${x.naam} (${x.uid})`));
}

console.log('\nKlaar.');
process.exit(0);
