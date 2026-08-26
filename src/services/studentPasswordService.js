import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

const functions = getFunctions(app, 'europe-west1');

export const DEFAULT_STUDENT_PASSWORD = 'Test123';

export const resetStudentPassword = async ({ studentUid, password = DEFAULT_STUDENT_PASSWORD } = {}) => {
  const resetPassword = httpsCallable(functions, 'resetStudentPassword');
  const result = await resetPassword({ studentUid, password });
  return result.data;
};

export const syncAllStudentAuthAccounts = async ({ password = DEFAULT_STUDENT_PASSWORD } = {}) => {
  const syncAccounts = httpsCallable(functions, 'syncAllStudentAuthAccounts');
  const result = await syncAccounts({ password });
  return result.data;
};

export const changeCurrentUserPassword = async ({ user, currentPassword, newPassword } = {}) => {
  if (!user?.email) {
    throw new Error('Geen ingelogde gebruiker gevonden.');
  }

  // De leerling is net ingelogd, dus meestal kan het nieuwe wachtwoord direct
  // gezet worden. Alleen als Firebase een recente login eist, vragen we het
  // huidige wachtwoord echt — dan is een fout daarin ook pas relevant.
  try {
    await updatePassword(user, newPassword);
  } catch (err) {
    if (err?.code !== 'auth/requires-recent-login') throw err;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  }
  await setDoc(doc(db, 'users', user.uid), {
    mustChangePassword: false,
    passwordStatus: 'changed',
    passwordChangedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export default {
  changeCurrentUserPassword,
  resetStudentPassword,
  syncAllStudentAuthAccounts
};
