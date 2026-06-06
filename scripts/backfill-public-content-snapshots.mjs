import { createRequire } from 'node:module';

import { buildPublicContentBlockSnapshot } from '../src/lib/publicContentBlockView.js';
import { buildPublicQuestionSnapshot } from '../src/lib/publicQuestionView.js';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const apply = process.argv.includes('--apply');

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID
  });
}

const db = getFirestore();

const cleanForFirestore = (value) => {
  if (Array.isArray(value)) return value.map(cleanForFirestore);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]) => child !== undefined)
        .map(([key, child]) => [key, cleanForFirestore(child)])
    );
  }
  return value;
};

const readCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
};

const writeSnapshots = async (collectionName, snapshots) => {
  let batch = db.batch();
  let operations = 0;
  let committed = 0;

  for (const snapshot of snapshots) {
    const ref = db.collection(collectionName).doc(snapshot.id);
    batch.set(ref, cleanForFirestore({
      ...snapshot,
      updatedAt: FieldValue.serverTimestamp(),
      snapshotBackfillMeta: {
        backfilledAt: FieldValue.serverTimestamp(),
        source: 'scripts/backfill-public-content-snapshots.mjs'
      }
    }));
    operations += 1;

    if (operations === 450) {
      await batch.commit();
      committed += operations;
      batch = db.batch();
      operations = 0;
    }
  }

  if (operations > 0) {
    await batch.commit();
    committed += operations;
  }

  return committed;
};

console.log(`Public content snapshot backfill (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);

const [privateQuestions, privateBlocks] = await Promise.all([
  readCollection('vraag'),
  readCollection('contentBlocks')
]);

const publicQuestions = privateQuestions.map(buildPublicQuestionSnapshot);
const publicBlocks = privateBlocks.map(buildPublicContentBlockSnapshot);

console.log('Te verwerken documenten:');
console.log(`- vraag -> publicQuestions: ${publicQuestions.length}`);
console.log(`- contentBlocks -> publicContentBlocks: ${publicBlocks.length}`);

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om publieke snapshots naar Firestore te schrijven.');
  process.exit(0);
}

const [questionsWritten, blocksWritten] = await Promise.all([
  writeSnapshots('publicQuestions', publicQuestions),
  writeSnapshots('publicContentBlocks', publicBlocks)
]);

console.log(`Geschreven naar publicQuestions: ${questionsWritten}`);
console.log(`Geschreven naar publicContentBlocks: ${blocksWritten}`);
console.log(`Backfill klaar. Totaal geschreven/geupdatet: ${questionsWritten + blocksWritten}`);
