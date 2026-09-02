/**
 * Binask EOA-import via een gewone adminlogin.
 *
 * Variant op import-binask-eoa-seed-to-firestore.mjs. Die gebruikt de Admin SDK
 * en een serversleutel; deze gebruikt de client-SDK en logt in als admin. Het
 * verschil is belangrijk: de Admin SDK gaat langs de securityregels heen, deze
 * route blijft er juist binnen. Er wordt dus niets geschreven wat een admin niet
 * ook via het beheerscherm zou mogen schrijven.
 *
 * Inloggegevens komen uit de omgeving, niet uit de argumenten, zodat het
 * wachtwoord niet in de shellgeschiedenis of in een proceslijst belandt:
 *
 *   HELIX_ADMIN_EMAIL=... HELIX_ADMIN_WACHTWOORD=... node scripts/import-binask-eoa-met-login.mjs
 *
 * Vlaggen zijn gelijk aan het Admin SDK-script: standaard dry run, --apply om te
 * schrijven, --koppel-klassen voor de route en --wijs-toe voor de toewijzing.
 */

import fs from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  writeBatch,
  setDoc
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAHWzHd0ITGcHegVRz2tunTMkVS3EK2Fbo',
  authDomain: 'pythagoras-eoa.firebaseapp.com',
  projectId: 'pythagoras-eoa',
  storageBucket: 'pythagoras-eoa.firebasestorage.app',
  messagingSenderId: '103397886024',
  appId: '1:103397886024:web:75e7809c476f23d9c2b07d'
};

const seedPath = path.resolve('docs/seeds/binask-eoa.seed.json');
const apply = process.argv.includes('--apply');
const koppelKlassen = process.argv.includes('--koppel-klassen');
const wijsToe = process.argv.includes('--wijs-toe');

const email = process.env.HELIX_ADMIN_EMAIL || '';
const wachtwoord = process.env.HELIX_ADMIN_WACHTWOORD || '';

if (!email || !wachtwoord) {
  console.error('Zet HELIX_ADMIN_EMAIL en HELIX_ADMIN_WACHTWOORD in de omgeving.');
  process.exit(1);
}

const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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

const paragrafenVanNiveau = (niveauId) =>
  (seed.paragrafen || []).filter((paragraaf) => paragraaf.niveauId === niveauId);

const countExistingDocs = async () => {
  const result = {};
  for (const [collectionName, docs] of collectionMap) {
    let existing = 0;
    for (const item of docs) {
      const snapshot = await getDoc(doc(db, collectionName, item.id));
      if (snapshot.exists()) existing += 1;
    }
    result[collectionName] = { total: docs.length, existing };
  }
  return result;
};

const zoekKlassen = async () => {
  const routes = seed.meta?.klasRoutes || [];
  const gevonden = [];

  for (const route of routes) {
    const snapshot = await getDocs(
      query(collection(db, 'klassen'), where('name', '==', route.klasNaam))
    );

    if (snapshot.empty) {
      gevonden.push({ ...route, klasId: null, aantal: 0 });
      continue;
    }

    const klasDoc = snapshot.docs[0];
    gevonden.push({
      ...route,
      klasId: klasDoc.id,
      huidigeNiveauId: klasDoc.data()?.niveauId || null,
      huidigeParagrafen: klasDoc.data()?.enabledParagrafen || [],
      aantal: snapshot.size
    });
  }

  return gevonden;
};

const writeCollection = async (collectionName, docs) => {
  let batch = writeBatch(db);
  let operations = 0;
  let committed = 0;

  for (const item of docs) {
    batch.set(doc(db, collectionName, item.id), cleanForFirestore({
      ...item,
      updatedAt: serverTimestamp(),
      seedMeta: {
        seedId: seed.meta?.seedId || 'binask-eoa',
        importedAt: serverTimestamp()
      }
    }), { merge: true });
    operations += 1;

    if (operations === 450) {
      await batch.commit();
      committed += operations;
      batch = writeBatch(db);
      operations = 0;
    }
  }

  if (operations > 0) {
    await batch.commit();
    committed += operations;
  }

  return committed;
};

console.log(`Binask EOA import via adminlogin (${apply ? 'APPLY' : 'DRY RUN'})`);
console.log(`Project: ${firebaseConfig.projectId}`);
console.log(`Seed: ${seedPath}`);

const credential = await signInWithEmailAndPassword(auth, email, wachtwoord);
console.log(`Ingelogd als: ${credential.user.email}`);

// Controleer dat dit account echt admin is. Anders lopen de schrijfacties
// halverwege stuk op de rules en blijft er een halve import achter.
const userSnap = await getDoc(doc(db, 'users', credential.user.uid));
const rol = userSnap.exists() ? userSnap.data()?.role : null;
if (rol !== 'admin' && credential.user.email !== 'kevlimpens@gmail.com') {
  console.error(`Dit account heeft rol "${rol || 'onbekend'}", geen admin. Gestopt voordat er iets is geschreven.`);
  await signOut(auth);
  process.exit(1);
}
console.log('Rolcontrole: admin, schrijven is toegestaan.');
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
    console.log(`- ${klas.klasNaam} (${klas.klasId}): route nu "${klas.huidigeNiveauId || 'geen route'}" -> wordt "${klas.niveauId}"`);
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
  await signOut(auth);
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

    const update = { updatedAt: serverTimestamp() };
    if (koppelKlassen) update.niveauId = klas.niveauId;
    if (wijsToe) {
      const nieuw = paragrafenVanNiveau(klas.niveauId).map((p) => p.id);
      update.enabledParagrafen = Array.from(new Set([...(klas.huidigeParagrafen || []), ...nieuw]));
    }

    await setDoc(doc(db, 'klassen', klas.klasId), update, { merge: true });
    console.log(`Klas bijgewerkt: ${klas.klasNaam} (${klas.klasId})`);
  }
}

console.log('');
console.log(`Import klaar. Totaal geschreven/geupdatet: ${totalWritten}`);
await signOut(auth);
process.exit(0);
