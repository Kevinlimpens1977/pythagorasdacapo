import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

const BATCH_LIMIT = 450;
export const PRESERVED_STUDENT_RESET_EMAILS = new Set([
  'vragen@scheikundeles.nl',
  'kevlimpens@gmail.com'
]);

export const shouldPreserveUserDuringStudentReset = (user = {}) => {
  const role = String(user.role || '').trim().toLowerCase();
  const email = String(user.email || '').trim().toLowerCase();

  return role === 'admin' || PRESERVED_STUDENT_RESET_EMAILS.has(email);
};

const commitInChunks = async (operations) => {
  for (let index = 0; index < operations.length; index += BATCH_LIMIT) {
    const chunk = operations.slice(index, index + BATCH_LIMIT);
    const batch = writeBatch(db);

    chunk.forEach((operation) => {
      if (operation.type === 'delete') {
        batch.delete(operation.ref);
      } else if (operation.type === 'update') {
        batch.update(operation.ref, operation.data);
      }
    });

    await batch.commit();
  }
};

const deleteSnapshotDocuments = async (snapshot) => {
  await commitInChunks(snapshot.docs.map((documentSnapshot) => ({
    type: 'delete',
    ref: documentSnapshot.ref
  })));

  return snapshot.size;
};

const deleteStudentProgress = async (studentIds) => {
  let deleted = 0;

  for (const studentId of studentIds) {
    const snapshot = await getDocs(query(collection(db, 'voortgang'), where('userId', '==', studentId)));
    deleted += await deleteSnapshotDocuments(snapshot);
  }

  return deleted;
};

const clearClassStudentOverrides = async () => {
  const snapshot = await getDocs(collection(db, 'klassen'));
  await commitInChunks(snapshot.docs.map((documentSnapshot) => ({
    type: 'update',
    ref: documentSnapshot.ref,
    data: {
      studentOverrides: {},
      updatedAt: serverTimestamp()
    }
  })));

  return snapshot.size;
};

export const deleteAllStudentData = async () => {
  const studentSnapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));
  const deletableStudentDocs = studentSnapshot.docs.filter((documentSnapshot) =>
    !shouldPreserveUserDuringStudentReset(documentSnapshot.data())
  );
  const studentIds = deletableStudentDocs.map((documentSnapshot) => documentSnapshot.id);
  const pendingStudentsSnapshot = await getDocs(collection(db, 'pendingStudents'));

  const deletedProgress = await deleteStudentProgress(studentIds);
  const deletedPendingStudents = await deleteSnapshotDocuments(pendingStudentsSnapshot);
  const deletedStudents = await deleteSnapshotDocuments({ docs: deletableStudentDocs, size: deletableStudentDocs.length });
  const cleanedClasses = await clearClassStudentOverrides();

  return {
    deletedStudents,
    deletedProgress,
    deletedPendingStudents,
    cleanedClasses,
    preservedEmails: [...PRESERVED_STUDENT_RESET_EMAILS]
  };
};

export default {
  deleteAllStudentData
};
