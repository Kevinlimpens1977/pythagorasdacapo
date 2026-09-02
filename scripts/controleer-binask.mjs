/**
 * Leest de zojuist geimporteerde Binask-structuur terug en print hem als boom.
 * Puur lezen. node --env-file=<envbestand> scripts/controleer-binask.mjs
 */
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAHWzHd0ITGcHegVRz2tunTMkVS3EK2Fbo',
  authDomain: 'pythagoras-eoa.firebaseapp.com',
  projectId: 'pythagoras-eoa',
  storageBucket: 'pythagoras-eoa.firebasestorage.app',
  messagingSenderId: '103397886024',
  appId: '1:103397886024:web:75e7809c476f23d9c2b07d'
};

const email = process.env.HELIX_ADMIN_EMAIL || '';
const wachtwoord = process.env.HELIX_ADMIN_WACHTWOORD || '';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
await signInWithEmailAndPassword(auth, email, wachtwoord);

const vakSnap = await getDoc(doc(db, 'vak', 'vak-binask-eoa'));
console.log('Vak:', vakSnap.exists() ? vakSnap.data().name : 'ONTBREEKT');

for (const niveauId of ['niveau-binask-eoa-1-lr3', 'niveau-binask-eoa-2-lr3']) {
  const nv = await getDoc(doc(db, 'niveau', niveauId));
  console.log(`\n  Niveau ${niveauId}: ${nv.exists() ? nv.data().name : 'ONTBREEKT'}`);
  const hs = await getDocs(query(collection(db, 'hoofdstuk'), where('niveauId', '==', niveauId)));
  for (const h of hs.docs) {
    console.log(`    Hoofdstuk: ${h.data().title}`);
    const ps = await getDocs(query(collection(db, 'paragraaf'), where('hoofdstukId', '==', h.id)));
    for (const p of ps.docs) console.log(`      Paragraaf: ${p.data().title} (${p.data().code})`);
  }
}

for (const klasId of ['klas_1787768387441_7', 'klas_1787768387528_8']) {
  const k = await getDoc(doc(db, 'klassen', klasId));
  if (k.exists()) console.log(`\n  Klas ${k.data().name}: route = ${k.data().niveauId || 'geen'}`);
}

await signOut(auth);
process.exit(0);
