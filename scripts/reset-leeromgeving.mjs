/**
 * Eenmalige opruimactie: maakt de leeromgeving leeg zodat de lesstof opnieuw
 * opgebouwd kan worden.
 *
 * Draai eerst zonder vlag voor een droogloop. Pas met --apply wordt er echt
 * verwijderd, en dan altijd nadat er een volledige back-up is weggeschreven.
 *
 *   node scripts/reset-leeromgeving.mjs
 *   node scripts/reset-leeromgeving.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const apply = process.argv.includes('--apply');
const BATCH_LIMIT = 450;

// Collecties die volledig leeg gaan.
const VERWIJDER = {
  'Lesstof (CMS-structuur)': ['vak', 'vakken', 'leerjaar', 'niveau', 'hoofdstuk', 'paragraaf'],
  'Lesinhoud': ['contentBlocks', 'vraag', 'slidedeckPackages', 'adminCropSources'],
  'Leerlingveilige snapshots': ['publicContentBlocks', 'publicQuestions'],
  'Badges en certificaten': ['badges', 'certificates'],
  'Klassen': ['klassen'],
  'Voortgang': ['voortgang', 'userAnswers', 'progressSignalAcknowledgements'],
  'Tokens': [
    'tokenAccounts',
    'tokenTransactions',
    'tokenPurchases',
    'tokenAwardClaims',
    'studentTokenLoadouts'
  ]
};

// Collecties die bewust blijven staan.
const BEHOUDEN = [
  'users (accounts, namen, wachtwoordstatus en foto blijven)',
  'tokenShopItems (de shopcatalogus van 35 items)',
  'tokenGameRewardRules en gameInstellingen (spelinstellingen)',
  'promptTemplates (NotebookLM-prompts)',
  'photoImports en pendingStudents (fotoimport-sessies)',
  'studentBugReports (gemelde fouten)'
];

// Velden die van elk leerlingdocument af moeten, omdat de klas en de lesstof
// waar ze naar verwijzen niet meer bestaan.
const LEERLING_VELDEN_LEEGMAKEN = [
  'klasId',
  'joinedKlasAt',
  'progress',
  'completedSlides',
  'completedChapters',
  'lastSlide',
  'lastChapter',
  'warning',
  'exerciseData',
  'presentationViewed',
  'evaluationData'
];

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}
const db = getFirestore();

const serialiseer = (waarde) => {
  if (waarde === null || waarde === undefined) return waarde;
  if (Array.isArray(waarde)) return waarde.map(serialiseer);
  if (typeof waarde?.toDate === 'function') return { __timestamp: waarde.toDate().toISOString() };
  if (typeof waarde === 'object' && waarde.constructor === Object) {
    return Object.fromEntries(Object.entries(waarde).map(([sleutel, kind]) => [sleutel, serialiseer(kind)]));
  }
  if (typeof waarde === 'object' && waarde.path) return { __ref: waarde.path };
  return waarde;
};

const lees = async (naam) => {
  const snapshot = await db.collection(naam).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, data: serialiseer(doc.data()) }));
};

// questionMetadata/{paragraaf}/questions/{vraag} is een subcollectie.
const leesQuestionMetadata = async () => {
  const ouders = await db.collection('questionMetadata').get();
  const rijen = [];
  for (const ouder of ouders.docs) {
    const kinderen = await ouder.ref.collection('questions').get();
    rijen.push({
      id: ouder.id,
      data: serialiseer(ouder.data()),
      questions: kinderen.docs.map((kind) => ({ id: kind.id, data: serialiseer(kind.data()) }))
    });
  }
  return rijen;
};

console.log(apply
  ? '=== OPRUIMACTIE - ECHT VERWIJDEREN (--apply) ==='
  : '=== OPRUIMACTIE - DROOGLOOP (er wordt niets verwijderd) ===');
console.log(`Firebase-project: ${PROJECT_ID}\n`);

const backup = { project: PROJECT_ID, gemaaktOp: new Date().toISOString(), collecties: {} };
let totaal = 0;

for (const [groep, collecties] of Object.entries(VERWIJDER)) {
  console.log(groep);
  for (const naam of collecties) {
    const docs = await lees(naam);
    backup.collecties[naam] = docs;
    totaal += docs.length;
    console.log(`  ${String(docs.length).padStart(6)}  ${naam}`);
  }
}

const questionMetadata = await leesQuestionMetadata();
backup.collecties.questionMetadata = questionMetadata;
const vragenInMetadata = questionMetadata.reduce((aantal, rij) => aantal + rij.questions.length, 0);
totaal += questionMetadata.length + vragenInMetadata;
console.log('Vraagmetadata');
console.log(`  ${String(questionMetadata.length).padStart(6)}  questionMetadata (+ ${vragenInMetadata} vragen in subcollecties)`);

const leerlingen = await db.collection('users').where('role', '==', 'student').get();
backup.collecties.users = leerlingen.docs.map((doc) => ({ id: doc.id, data: serialiseer(doc.data()) }));
console.log('\nLeerlingdocumenten opschonen (niet verwijderen)');
console.log(`  ${String(leerlingen.size).padStart(6)}  users met rol student`);
console.log(`          velden die weggaan: ${LEERLING_VELDEN_LEEGMAKEN.join(', ')}`);

console.log(`\nTotaal te verwijderen documenten: ${totaal}`);
console.log('\nBlijft ongemoeid:');
BEHOUDEN.forEach((regel) => console.log(`  - ${regel}`));

// Back-up altijd wegschrijven, ook bij een droogloop.
const stempel = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupDir = path.resolve('exports/reset-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPad = path.join(backupDir, `leeromgeving-backup-${stempel}.json`);
fs.writeFileSync(backupPad, JSON.stringify(backup, null, 2), 'utf8');
const megabytes = (fs.statSync(backupPad).size / (1024 * 1024)).toFixed(2);
console.log(`\nBack-up weggeschreven: ${backupPad} (${megabytes} MB)`);

if (!apply) {
  console.log('\nDroogloop klaar. Er is niets verwijderd.');
  console.log('Draai opnieuw met --apply om het echt uit te voeren.');
  process.exit(0);
}

console.log('\n--- Verwijderen ---');

const verwijderRefs = async (refs, label) => {
  for (let index = 0; index < refs.length; index += BATCH_LIMIT) {
    const batch = db.batch();
    refs.slice(index, index + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
  console.log(`  verwijderd: ${String(refs.length).padStart(5)}  ${label}`);
};

for (const collecties of Object.values(VERWIJDER)) {
  for (const naam of collecties) {
    const snapshot = await db.collection(naam).get();
    await verwijderRefs(snapshot.docs.map((doc) => doc.ref), naam);
  }
}

// Eerst de subcollecties, dan de ouderdocumenten.
for (const ouder of (await db.collection('questionMetadata').get()).docs) {
  const kinderen = await ouder.ref.collection('questions').get();
  await verwijderRefs(kinderen.docs.map((doc) => doc.ref), `questionMetadata/${ouder.id}/questions`);
  await ouder.ref.delete();
}

const leegmaken = Object.fromEntries(LEERLING_VELDEN_LEEGMAKEN.map((veld) => [veld, FieldValue.delete()]));
leegmaken.updatedAt = FieldValue.serverTimestamp();
for (let index = 0; index < leerlingen.docs.length; index += BATCH_LIMIT) {
  const batch = db.batch();
  leerlingen.docs.slice(index, index + BATCH_LIMIT).forEach((doc) => batch.update(doc.ref, leegmaken));
  await batch.commit();
}
console.log(`  opgeschoond: ${String(leerlingen.size).padStart(3)}  leerlingdocumenten`);

console.log('\nKlaar. De leeromgeving is leeg en klaar om opnieuw gevuld te worden.');
process.exit(0);
