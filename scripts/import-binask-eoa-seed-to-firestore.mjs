import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { FieldValue, getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
const seedPath = path.resolve('docs/seeds/binask-eoa.seed.json');
const apply = process.argv.includes('--apply');

// Twee losse opt-ins, omdat het twee verschillende beslissingen zijn:
//
// --koppel-klassen  zet de route (niveauId) op de klas. Zonder route ziet een
//                   leerling ook lesstof van andere niveaus die aan hem is
//                   toegewezen; met route alleen die ene leerroute.
// --wijs-toe        zet de paragraaf in enabledParagrafen van de klas. Dit is
//                   de toewijzing zelf: zonder deze stap ziet de leerling niets,
//                   ook niet met een route. Doe dit pas als de paragraaf inhoud
//                   heeft, anders opent de leerling een lege les.
const koppelKlassen = process.argv.includes('--koppel-klassen');
const wijsToe = process.argv.includes('--wijs-toe');

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
  ['contentBlocks', seed.contentBlocks || []]
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
        seedId: seed.meta?.seedId || 'binask-eoa',
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

/** De klassen uit meta.klasRoutes, opgezocht op hun naam in de collectie klassen. */
const zoekKlassen = async () => {
  const routes = seed.meta?.klasRoutes || [];
  const gevonden = [];

  for (const route of routes) {
    const snapshot = await db
      .collection('klassen')
      .where('name', '==', route.klasNaam)
      .get();

    if (snapshot.empty) {
      gevonden.push({ ...route, klasId: null, huidigeNiveauId: null, aantal: 0 });
      continue;
    }

    // Meerdere klassen met dezelfde naam is een datafout, geen keuze die dit
    // script mag maken; we melden het en slaan de koppeling over.
    const doc = snapshot.docs[0];
    gevonden.push({
      ...route,
      klasId: doc.id,
      huidigeNiveauId: doc.data()?.niveauId || null,
      huidigeParagrafen: doc.data()?.enabledParagrafen || [],
      aantal: snapshot.size
    });
  }

  return gevonden;
};

/** De paragrafen van een niveau, zodat --wijs-toe weet wat het moet toewijzen. */
const paragrafenVanNiveau = (niveauId) =>
  (seed.paragrafen || []).filter((paragraaf) => paragraaf.niveauId === niveauId);

console.log(`Binask EOA Firestore import (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${PROJECT_ID}`);
console.log(`Seed: ${seedPath}`);
console.log('');

const existing = await countExistingDocs();
console.log('Documenten in seed / al bestaand:');
for (const [collectionName, info] of Object.entries(existing)) {
  console.log(`- ${collectionName}: ${info.total} totaal, ${info.existing} bestaand`);
}

const klassen = await zoekKlassen();
if (klassen.length > 0) {
  console.log('');
  console.log('Klassen uit de seed:');
  for (const klas of klassen) {
    if (!klas.klasId) {
      console.log(`- ${klas.klasNaam}: NIET GEVONDEN in de collectie klassen`);
      continue;
    }
    if (klas.aantal > 1) {
      console.log(`- ${klas.klasNaam}: ${klas.aantal} klassen met deze naam, koppeling wordt overgeslagen`);
      continue;
    }
    const route = klas.huidigeNiveauId || 'geen route';
    console.log(`- ${klas.klasNaam} (${klas.klasId}): route nu "${route}" -> wordt "${klas.niveauId}"`);
    const toeTeWijzen = paragrafenVanNiveau(klas.niveauId).map((p) => p.id);
    console.log(`  toewijzen zou geven: ${toeTeWijzen.join(', ') || '(geen paragrafen)'}`);
  }
}

console.log('');
console.log(`Klasroute zetten (--koppel-klassen): ${koppelKlassen ? 'JA' : 'nee'}`);
console.log(`Paragraaf toewijzen (--wijs-toe): ${wijsToe ? 'JA' : 'nee'}`);

if (!apply) {
  console.log('');
  console.log('Dry-run klaar. Gebruik --apply om naar Firestore te schrijven.');
  process.exit(0);
}

let totalWritten = 0;
for (const [collectionName, docs] of collectionMap) {
  if (docs.length === 0) continue;
  const written = await writeCollection(collectionName, docs);
  totalWritten += written;
  console.log(`Geschreven naar ${collectionName}: ${written}`);
}

if (koppelKlassen || wijsToe) {
  for (const klas of klassen) {
    if (!klas.klasId || klas.aantal > 1) continue;

    const update = { updatedAt: FieldValue.serverTimestamp() };

    if (koppelKlassen) {
      update.niveauId = klas.niveauId;
    }

    if (wijsToe) {
      // Bestaande toewijzingen blijven staan; we voegen alleen toe wat ontbreekt.
      const nieuw = paragrafenVanNiveau(klas.niveauId).map((p) => p.id);
      update.enabledParagrafen = Array.from(new Set([...(klas.huidigeParagrafen || []), ...nieuw]));
    }

    await db.collection('klassen').doc(klas.klasId).set(update, { merge: true });
    console.log(`Klas bijgewerkt: ${klas.klasNaam} (${klas.klasId})`);
  }
}

console.log('');
console.log(`Import klaar. Totaal geschreven/geupdatet: ${totalWritten}`);
