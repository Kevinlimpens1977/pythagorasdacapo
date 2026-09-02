/**
 * Logt in als het meegegeven account en print alleen zijn uid en huidige rol,
 * plus het directe pad naar het users-document. Puur lezen: schrijft niets.
 *
 *   node --env-file=<envbestand> scripts/toon-account-uid.mjs
 *
 * Verwacht HELIX_ADMIN_EMAIL en HELIX_ADMIN_WACHTWOORD in de omgeving.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

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
if (!email || !wachtwoord) {
  console.error('Zet HELIX_ADMIN_EMAIL en HELIX_ADMIN_WACHTWOORD in de omgeving.');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const credential = await signInWithEmailAndPassword(auth, email, wachtwoord);
const uid = credential.user.uid;
const snap = await getDoc(doc(db, 'users', uid));
const rol = snap.exists() ? (snap.data()?.role ?? '(geen role-veld)') : '(geen users-document)';

console.log('E-mail :', email);
console.log('UID    :', uid);
console.log('Rol nu :', rol);
console.log('');
console.log('Directe pad in Firestore (Data-tab, plak achter je project):');
console.log(`  users/${uid}`);
console.log('');
console.log('Zet daar het veld role op: admin');

await signOut(auth);
process.exit(0);
