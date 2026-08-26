// Maakt het supervisoraccount k.limpens@stichtinglvo.nl aan in Firebase Auth,
// zet het users-document met role 'supervisor', en print een eenmalige link
// waarmee je zelf je wachtwoord instelt. Draaien: node scripts/maak-supervisor.mjs
import { createRequire } from 'node:module';

const req = createRequire(new URL('../functions/package.json', import.meta.url));
const { applicationDefault, getApps, initializeApp } = req('firebase-admin/app');
const { getFirestore, FieldValue } = req('firebase-admin/firestore');
const { getAuth } = req('firebase-admin/auth');

if (getApps().length === 0) {
  initializeApp({ credential: applicationDefault(), projectId: 'pythagoras-eoa' });
}

const EMAIL = 'k.limpens@stichtinglvo.nl';
const auth = getAuth();

let user;
try {
  user = await auth.getUserByEmail(EMAIL);
  console.log(`Account bestaat al (uid ${user.uid}); rol en resetlink worden vernieuwd.`);
} catch {
  user = await auth.createUser({ email: EMAIL, emailVerified: true, displayName: 'Kevin Limpens' });
  console.log(`Account aangemaakt (uid ${user.uid}).`);
}

await getFirestore().collection('users').doc(user.uid).set({
  email: EMAIL,
  displayName: 'Kevin Limpens',
  role: 'supervisor',
  createdAt: FieldValue.serverTimestamp(),
  completedChapters: [],
  completedSlides: [],
  needsNameSetup: false
}, { merge: true });
console.log('users-document gezet met role: supervisor.');

const link = await auth.generatePasswordResetLink(EMAIL);
console.log('\nOpen deze link om je wachtwoord te kiezen (eenmalig, verloopt na korte tijd):\n');
console.log(link);
