import {
  collection,
  collectionGroup,
  deleteField,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch
} from 'firebase/firestore';
import { CMS_RESET_COLLECTIONS, isQuestionMetadataPath } from '../lib/cmsResetConfig';
import { db } from './firebase';

const BATCH_LIMIT = 450;

export const resetCmsContentForDev = async () => {
  const totals = {
    deleted: {},
    cleanedClasses: 0,
    cleanedStudents: 0
  };

  for (const collectionName of CMS_RESET_COLLECTIONS) {
    totals.deleted[collectionName] = await deleteCollectionDocuments(collectionName);
  }

  totals.deleted.questionMetadataQuestions = await deleteQuestionMetadataQuestions();
  totals.cleanedClasses = await clearClassLessonAssignments();
  totals.cleanedStudents = await clearStudentLessonState();

  return totals;
};

const deleteCollectionDocuments = async (collectionName) => {
  const snapshot = await getDocs(collection(db, collectionName));
  await commitInChunks(snapshot.docs.map((documentSnapshot) => ({
    type: 'delete',
    ref: documentSnapshot.ref
  })));

  return snapshot.size;
};

const deleteQuestionMetadataQuestions = async () => {
  const snapshot = await getDocs(collectionGroup(db, 'questions'));
  const questionMetadataDocs = snapshot.docs.filter((documentSnapshot) =>
    isQuestionMetadataPath(documentSnapshot.ref.path)
  );

  await commitInChunks(questionMetadataDocs.map((documentSnapshot) => ({
    type: 'delete',
    ref: documentSnapshot.ref
  })));

  return questionMetadataDocs.length;
};

const clearClassLessonAssignments = async () => {
  const snapshot = await getDocs(collection(db, 'klassen'));
  await commitInChunks(snapshot.docs.map((documentSnapshot) => ({
    type: 'update',
    ref: documentSnapshot.ref,
    data: {
      enabledParagrafen: [],
      enabledChapters: {},
      studentOverrides: {},
      updatedAt: serverTimestamp()
    }
  })));

  return snapshot.size;
};

const clearStudentLessonState = async () => {
  const snapshot = await getDocs(query(collection(db, 'users'), where('role', '==', 'student')));

  await commitInChunks(snapshot.docs.map((documentSnapshot) => ({
    type: 'update',
    ref: documentSnapshot.ref,
    data: {
      warning: deleteField(),
      exerciseData: deleteField(),
      presentationViewed: deleteField(),
      evaluationData: deleteField(),
      updatedAt: serverTimestamp()
    }
  })));

  return snapshot.size;
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
