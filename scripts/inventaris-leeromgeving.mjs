// Alleen-lezen inventaris van de Firestore-inhoud. Verwijdert niets.
import { createRequire } from 'node:module';

const requireFromFunctions = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = requireFromFunctions('firebase-admin/app');
const { getFirestore } = requireFromFunctions('firebase-admin/firestore');

const PROJECT_ID = 'pythagoras-eoa';
if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
}
const db = getFirestore();

const GROEPEN = {
  'Lesstof (CMS-structuur)': ['vak', 'vakken', 'leerjaar', 'niveau', 'hoofdstuk', 'paragraaf'],
  'Lesinhoud': ['contentBlocks', 'vraag', 'slidedeckPackages', 'promptTemplates', 'adminCropSources'],
  'Leerlingveilige snapshots': ['publicContentBlocks', 'publicQuestions'],
  'Leerlingen en klassen': ['users', 'klassen', 'photoImports', 'pendingStudents'],
  'Voortgang': ['voortgang', 'userAnswers', 'progressSignalAcknowledgements', 'studentBugReports'],
  'Tokens': ['tokenAccounts', 'tokenTransactions', 'tokenPurchases', 'tokenAwardClaims', 'studentTokenLoadouts', 'tokenShopItems', 'tokenGameRewardRules'],
  'Spel en overig': ['gameInstellingen', 'badges', 'certificates', 'questionMetadata']
};

const tel = async (naam) => {
  try {
    const snap = await db.collection(naam).count().get();
    return snap.data().count;
  } catch (e) {
    return `fout: ${e.message}`;
  }
};

for (const [groep, collecties] of Object.entries(GROEPEN)) {
  console.log(`\n${groep}`);
  for (const c of collecties) {
    const n = await tel(c);
    console.log(`  ${String(n).padStart(6)}  ${c}`);
  }
}

// Rolverdeling van users
const users = await db.collection('users').get();
const rollen = {};
users.forEach((d) => {
  const r = d.get('role') || '(geen rol)';
  rollen[r] = (rollen[r] || 0) + 1;
});
console.log('\nRollen in users:', rollen);

// Hoofdstukken met naam, zodat duidelijk is wat er weg zou gaan
const hoofdstukken = await db.collection('hoofdstuk').get();
console.log(`\nHoofdstukken (${hoofdstukken.size}):`);
hoofdstukken.forEach((d) => {
  console.log(`  - ${d.id}: ${d.get('titel') || d.get('naam') || d.get('title') || '(geen titel)'}`);
});

const leerjaren = await db.collection('leerjaar').get();
console.log(`\nLeerjaren (${leerjaren.size}):`);
leerjaren.forEach((d) => console.log(`  - ${d.id}: ${d.get('titel') || d.get('naam') || d.get('title') || '(geen titel)'}`));

const klassen = await db.collection('klassen').get();
console.log(`\nKlassen (${klassen.size}):`);
klassen.forEach((d) => console.log(`  - ${d.id}: ${d.get('naam') || d.get('title') || '(geen naam)'}`));

process.exit(0);
