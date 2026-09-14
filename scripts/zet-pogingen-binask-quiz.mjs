/**
 * Zet de quizzen van Binask op één poging per vraag.
 *
 * Kevin, 14 september 2026: een meerkeuzevraag mag één keer gemaakt worden.
 * De drie Binask-quizzen stonden op `attemptPolicy.maxAttempts: null`, en dan
 * valt de leerlingroute terug op MAX_CORE_QUESTION_ATTEMPTS (vier). Een leerling
 * kon dus doorklikken tot het goed was. Bewust alleen Binask: de instelling zit
 * op het lesblok, dus de rest van HELIX blijft staan en jij kunt het per quiz
 * terugdraaien in de toetsstudio.
 *
 * De herkansingsronde blijft aan. Die is iets anders dan opnieuw raden: hij komt
 * pas ná de eerste ronde, alleen voor de foute vragen, met een hint op de fout.
 *
 * Het publieke snapshot draagt attemptPolicy mee (publicContentBlockView.js), dus
 * dat wordt hier meteen opnieuw opgebouwd. Zonder die stap verandert er voor de
 * leerling niets.
 *
 *   node scripts/zet-pogingen-binask-quiz.mjs            # dry run
 *   node scripts/zet-pogingen-binask-quiz.mjs --apply
 *   node scripts/zet-pogingen-binask-quiz.mjs --pogingen 2 --apply
 */

import { createRequire } from 'node:module';

import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const SCRIPT_NAAM = 'scripts/zet-pogingen-binask-quiz.mjs';
const VAK_ID = 'vak-binask-eoa';

const argumenten = process.argv.slice(2);
const apply = argumenten.includes('--apply');
const pogingenIndex = argumenten.indexOf('--pogingen');
const pogingen = pogingenIndex >= 0 ? Number.parseInt(argumenten[pogingenIndex + 1], 10) : 1;

if (!Number.isFinite(pogingen) || pogingen < 1) {
  console.error('--pogingen moet een geheel getal van 1 of hoger zijn.');
  process.exit(1);
}

if (getApps().length === 0) initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
const db = getFirestore();

console.log(`Binask-quizzen op ${pogingen} poging${pogingen === 1 ? '' : 'en'} per vraag (${apply ? 'APPLY' : 'DRY RUN'})\n`);

// Paragrafen van het vak uit Firestore halen, niet hardcoderen: komt er een
// paragraaf bij, dan loopt die vanzelf mee.
const paragrafen = await db.collection('paragraaf').where('vakId', '==', VAK_ID).get();
if (paragrafen.empty) {
  console.error(`Geen paragrafen gevonden voor ${VAK_ID}.`);
  process.exit(1);
}

const teWijzigen = [];
for (const paragraaf of paragrafen.docs) {
  const blokken = await db.collection('contentBlocks').where('paragraafId', '==', paragraaf.id).get();
  for (const blok of blokken.docs) {
    if (!['quiz', 'toets'].includes(blok.get('type'))) continue;
    if (blok.get('isArchived') === true) continue;

    const content = blok.get('content') || {};
    const huidig = content.attemptPolicy?.maxAttempts ?? null;
    console.log(`  ${paragraaf.get('code')} ${blok.get('type')} "${blok.get('title')}"`);
    console.log(`      ${blok.id}`);
    console.log(`      vragen: ${(content.items || []).length} | pogingen nu: ${huidig === null ? 'niet ingesteld (valt terug op 4)' : huidig} -> ${pogingen}`);
    if (huidig === pogingen) {
      console.log('      staat al goed, wordt overgeslagen');
      continue;
    }
    teWijzigen.push({ ref: blok.ref, id: blok.id, titel: blok.get('title'), data: { id: blok.id, ...blok.data() } });
  }
}

console.log(`\nBlokken die aangepast worden: ${teWijzigen.length}`);
if (!teWijzigen.length) {
  console.log('Niets te doen.');
  process.exit(0);
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om te schrijven.');
  process.exit(0);
}

for (const blok of teWijzigen) {
  const nieuweContent = {
    ...(blok.data.content || {}),
    attemptPolicy: {
      ...(blok.data.content?.attemptPolicy || {}),
      maxAttempts: pogingen
    }
  };

  await blok.ref.update({
    'content.attemptPolicy.maxAttempts': pogingen,
    updatedAt: FieldValue.serverTimestamp(),
    laatsteWijziging: { script: SCRIPT_NAAM, op: new Date().toISOString() }
  });

  // Het publieke snapshot uit de NIEUWE stand opbouwen, anders blijft de
  // leerling de oude pogingenlimiet houden.
  const snapshot = buildPublicContentBlockSnapshot({ ...blok.data, content: nieuweContent });
  await db.collection('publicContentBlocks').doc(snapshot.id).set(
    { ...snapshot, updatedAt: FieldValue.serverTimestamp() },
    { merge: false }
  );

  console.log(`  bijgewerkt: "${blok.titel}" (${blok.id}) + publiek snapshot`);
}

// Narekenen op de leerlingversie, want dat is wat telt.
console.log('\nControle op de publieke snapshots:');
let fout = 0;
for (const blok of teWijzigen) {
  const pub = await db.collection('publicContentBlocks').doc(blok.id).get();
  const waarde = pub.get('content')?.attemptPolicy?.maxAttempts ?? null;
  const items = (pub.get('content')?.items || []).length;
  if (waarde !== pogingen) fout += 1;
  console.log(`  ${blok.id}: pogingen=${waarde} vragen=${items} ${waarde === pogingen ? '' : ' <-- KLOPT NIET'}`);
}

console.log(fout === 0 ? '\nKlaar.' : `\nLET OP: ${fout} snapshot(s) kloppen niet.`);
process.exit(fout === 0 ? 0 : 1);
