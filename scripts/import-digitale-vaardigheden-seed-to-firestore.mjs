import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const seedPath = path.resolve('docs/seeds/digitale-vaardigheden-vmbo1.seed.json');
const apply = process.argv.includes('--apply');

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECT_ID
  });
}

const db = getFirestore();

const collectionMap = [
  ['vak', seed.vakken || []],
  ['leerjaar', seed.leerjaren || []],
  ['niveau', seed.niveaus || []],
  ['hoofdstuk', seed.hoofdstukken || []],
  ['paragraaf', seed.paragrafen || []],
  ['contentBlocks', seed.contentBlocks || []],
  ['badges', seed.badges || []],
  ['certificates', seed.certificates || []]
];

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

const countExistingDocs = async () => {
  const result = {};
  for (const [collectionName, docs] of collectionMap) {
    let existing = 0;
    for (const item of docs) {
      const snapshot = await db.collection(collectionName).doc(item.id).get();
      if (snapshot.exists) existing += 1;
    }
    result[collectionName] = { total: docs.length, existing };
  }
  return result;
};

const writeCollection = async (collectionName, docs) => {
  let batch = db.batch();
  let operations = 0;
  let committed = 0;

  for (const item of docs) {
    const ref = db.collection(collectionName).doc(item.id);
    batch.set(ref, cleanForFirestore({
      ...item,
      updatedAt: FieldValue.serverTimestamp(),
      seedMeta: {
        seedId: seed.meta?.seedId || 'digitale-vaardigheden-vmbo1',
        importedAt: FieldValue.serverTimestamp()
      }
    }), { merge: true });
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

console.log(`Digitale vaardigheden Firestore import (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);
console.log(`Seed: ${seedPath}`);

const existing = await countExistingDocs();
console.log('Documenten in seed / al bestaand:');
for (const [collectionName, info] of Object.entries(existing)) {
  console.log(`- ${collectionName}: ${info.total} totaal, ${info.existing} bestaand`);
}

if (!apply) {
  console.log('Dry-run klaar. Gebruik --apply om naar Firestore te schrijven.');
  process.exit(0);
}

let totalWritten = 0;
for (const [collectionName, docs] of collectionMap) {
  const written = await writeCollection(collectionName, docs);
  totalWritten += written;
  console.log(`Geschreven naar ${collectionName}: ${written}`);
}

console.log(`Import klaar. Totaal geschreven/geüpdatet: ${totalWritten}`);
