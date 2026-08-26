import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import app, { db } from './firebase';

const functions = getFunctions(app, 'europe-west1');

export const archiveStudent = ({ studentUid, archivedBy }) =>
  updateDoc(doc(db, 'users', studentUid), {
    isArchived: true,
    archivedAt: serverTimestamp(),
    archivedBy: archivedBy || null,
    updatedAt: serverTimestamp()
  });

export const restoreStudent = ({ studentUid }) =>
  updateDoc(doc(db, 'users', studentUid), {
    isArchived: false,
    archivedAt: null,
    archivedBy: null,
    updatedAt: serverTimestamp()
  });

// Definitief verwijderen loopt via een Cloud Function: die wist ook het
// Auth-account en de voortgang, en weigert leerlingen die niet in het
// archief staan.
export const deleteArchivedStudent = async ({ studentUid }) => {
  const verwijder = httpsCallable(functions, 'deleteStudentAccount');
  const result = await verwijder({ studentUid });
  return result.data;
};
