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
import {
  CMS_RESET_COLLECTIONS,
  CMS_RESET_PROGRESS_COLLECTIONS,
  isQuestionMetadataPath
} from '../lib/cmsResetConfig';
import { db } from './firebase';

const BATCH_LIMIT = 450;

export const resetCmsContentForDev = async ({ includeProgress = false } = {}) => {
  const totals = {
    deleted: {},
    failed: {},
    cleanedClasses: 0,
    cleanedStudents: 0,
    includedProgress: includeProgress
  };

  // Elke stap wordt apart afgevangen. Zo maakt een collectie waar de rules
  // dwarsliggen niet de hele reset stuk, en zie je achteraf precies wat er
  // wel en niet is gelukt.
  const run = async (label, taak) => {
    try {
      totals.deleted[label] = await taak();
    } catch (error) {
      console.error(`CMS-reset: ${label} is mislukt:`, error);
      totals.failed[label] = error?.code || error?.message || 'onbekende fout';
    }
  };

  for (const collectionName of CMS_RESET_COLLECTIONS) {
    await run(collectionName, () => deleteCollectionDocuments(collectionName));
  }

  await run('questionMetadataQuestions', deleteQuestionMetadataQuestions);

  if (includeProgress) {
    for (const collectionName of CMS_RESET_PROGRESS_COLLECTIONS) {
      await run(collectionName, () => deleteCollectionDocuments(collectionName));
    }
  }

  try {
    totals.cleanedClasses = await clearClassLessonAssignments();
  } catch (error) {
    console.error('CMS-reset: klassen opschonen is mislukt:', error);
    totals.failed.klassen = error?.code || error?.message || 'onbekende fout';
  }

  try {
    totals.cleanedStudents = await clearStudentLessonState();
  } catch (error) {
    console.error('CMS-reset: leerlingen opschonen is mislukt:', error);
    totals.failed.users = error?.code || error?.message || 'onbekende fout';
  }

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
      enabledContentBlocks: {},
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
      progress: deleteField(),
      completedSlides: deleteField(),
      completedChapters: deleteField(),
      lastSlide: deleteField(),
      lastChapter: deleteField(),
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
