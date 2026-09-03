/**
 * Voortgang (Progress) Service
 * Handles per-question progress tracking in Firestore
 * Document structure: voortgang/{userId}_{vraagId}
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { buildLearningResultMetadata } from '../lib/learningResultUtils';
import {
  buildAssessmentItemConceptUpdate,
  buildAssessmentItemVoortgangUpdate,
  buildContentBlockVoortgangUpdate
} from '../lib/voortgangPayload';
import { shouldFallbackToUserProgressQuery } from '../lib/voortgangQueryUtils';
import {
  beoordeelBlokkade,
  buildBeoordelingData,
  buildBlokstandNaBeoordeling,
  isAssessmentItemRecord
} from '../lib/nakijkOpdrachten';

/**
 * Save progress for a single question (upsert)
 * Document ID format: {userId}_{vraagId}
 *
 * @param {string} userId - Student user ID
 * @param {string} vraagId - Question ID
 * @param {string} paragraafId - Paragraph ID
 * @param {string} hoofdstukId - Chapter ID
 * @param {string} klasId - Class ID
 * @param {Object} data - Progress data
 *   @param {boolean} data.completed - Whether question is completed
 *   @param {boolean} data.isCorrect - Whether answer is correct
 *   @param {number} data.attempts - Number of attempts
 *   @param {Object} data.lastAnswer - Last submitted answer (optional)
 * @returns {Promise<void>}
 */
export const saveVoortgang = async (
  userId,
  vraagId,
  paragraafId,
  hoofdstukId,
  klasId,
  data
) => {
  if (!userId || !vraagId || !paragraafId || !klasId) {
    throw new Error('userId, vraagId, paragraafId, and klasId are required');
  }

  try {
    const docId = `${userId}_${vraagId}`;
    const docRef = doc(db, 'voortgang', docId);

    // Get existing doc to preserve firstAttemptAt
    let existingData = {};
    try {
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        existingData = existing.data();
      }
    } catch {
      // Doc doesn't exist yet, that's ok
    }

    const resultMetadata = buildLearningResultMetadata({
      isCorrect: data.isCorrect || false,
      aiHelpCount: data.aiHelpCount || existingData.aiHelpCount || 0
    });

    const updates = {
      userId,
      vraagId,
      paragraafId,
      hoofdstukId,
      klasId,
      completed: data.completed || false,
      isCorrect: data.isCorrect || false,
      attempts: data.attempts || 1,
      lastAnswer: data.lastAnswer || null,
      ...resultMetadata,
      updatedAt: serverTimestamp(),

      // Only set on first attempt
      firstAttemptAt: existingData.firstAttemptAt || serverTimestamp()
    };

    // Set completedAt if question is marked as completed
    if (data.completed && !existingData.completedAt) {
      updates.completedAt = serverTimestamp();
    }

    await setDoc(docRef, updates, { merge: true });
    console.log(`✅ [Voortgang] Saved progress for vraag ${vraagId}`);
  } catch (error) {
    console.error('❌ [Voortgang] Error saving progress:', error);
    throw error;
  }
};

/**
 * Get all progress records for a paragraph (for progress bar)
 *
 * @param {string} userId - Student user ID
 * @param {string} paragraafId - Paragraph ID
 * @returns {Promise<Array>} Array of progress records
 */
export const getVoortgangForParagraaf = async (userId, paragraafId) => {
  if (!userId || !paragraafId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'voortgang'),
      where('userId', '==', userId),
      where('paragraafId', '==', paragraafId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ [Voortgang] Error fetching paragraph progress:', error);
    return [];
  }
};

/**
 * Save progress for a content block in a student lesson route.
 * Document ID format: {userId}_{blockId}
 *
 * This keeps the newer lesson-route progress separate from the legacy
 * question-only fields while still using the same voortgang collection.
 */
export const saveContentBlockVoortgang = async (
  userId,
  blockId,
  paragraafId,
  hoofdstukId,
  klasId,
  data = {}
) => {
  if (!userId || !blockId || !paragraafId || !klasId) {
    throw new Error('userId, blockId, paragraafId, and klasId are required');
  }

  try {
    const docId = `${userId}_${blockId}`;
    const docRef = doc(db, 'voortgang', docId);

    let existingData = {};
    try {
      const existing = await getDoc(docRef);
      if (existing.exists()) {
        existingData = existing.data();
      }
    } catch {
      // Missing progress doc is fine for first visit.
    }

    const updates = buildContentBlockVoortgangUpdate({
      userId,
      blockId,
      paragraafId,
      hoofdstukId,
      klasId,
      data,
      existingData,
      timestamp: serverTimestamp()
    });

    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error('❌ [Voortgang] Error saving content block progress:', error);
    throw error;
  }
};

/**
 * Voortgang van EEN vraag binnen een toets of quiz.
 * Document: voortgang/{userId}_{blockId}/items/{itemId}
 *
 * Een toets is een blok, maar de docent kijkt per vraag. Daarom een subcollectie
 * onder het blokdocument: de bestaande queries op `voortgang` blijven werken en
 * de Firestore-regels kunnen dezelfde eigenaarstoets gebruiken.
 */
export const saveAssessmentItemVoortgang = async (
  userId,
  blockId,
  itemId,
  paragraafId,
  hoofdstukId,
  klasId,
  data = {}
) => {
  if (!userId || !blockId || !itemId || !paragraafId || !klasId) {
    throw new Error('userId, blockId, itemId, paragraafId, and klasId are required');
  }

  const docRef = doc(db, 'voortgang', `${userId}_${blockId}`, 'items', itemId);

  let existingData = {};
  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      existingData = existing.data();
    }
  } catch {
    // Eerste poging op dit item: er is nog niets om te bewaren.
  }

  const updates = buildAssessmentItemVoortgangUpdate({
    userId,
    blockId,
    itemId,
    itemIndex: data.itemIndex ?? 0,
    paragraafId,
    hoofdstukId,
    klasId,
    data,
    existingData,
    timestamp: serverTimestamp()
  });

  await setDoc(docRef, updates, { merge: true });

  // De aanroeper wil meteen verder met de nieuwe stand; serverTimestamp() is op
  // dat moment nog een sentinel, dus die wordt hier lokaal ingevuld.
  return {
    ...updates,
    id: itemId,
    updatedAt: new Date(),
    firstAttemptAt: existingData.firstAttemptAt || new Date()
  };
};

/**
 * Tussentijds bewaard antwoord op een vraag (nog niet ingeleverd). Merge op
 * hetzelfde itemdocument, zodat de leerling na een refresh verder kan waar hij
 * gebleven was. Zie buildAssessmentItemConceptUpdate voor wat er precies
 * geschreven wordt: geen pogingen, geen score, geen status.
 */
export const saveAssessmentItemConcept = async (
  userId,
  blockId,
  itemId,
  paragraafId,
  hoofdstukId,
  klasId,
  data = {}
) => {
  if (!userId || !blockId || !itemId || !paragraafId || !klasId) {
    throw new Error('userId, blockId, itemId, paragraafId, and klasId are required');
  }

  const docRef = doc(db, 'voortgang', `${userId}_${blockId}`, 'items', itemId);
  const updates = buildAssessmentItemConceptUpdate({
    userId,
    blockId,
    itemId,
    itemIndex: data.itemIndex ?? 0,
    paragraafId,
    hoofdstukId,
    klasId,
    value: data.value,
    blockTitle: data.blockTitle || '',
    blockType: data.blockType || '',
    timestamp: serverTimestamp()
  });

  await setDoc(docRef, updates, { merge: true });

  return {
    ...updates,
    id: itemId,
    concept: { value: data.value ?? null, updatedAt: new Date() },
    updatedAt: new Date()
  };
};

/**
 * Alle itemvoortgang van een toets- of quizblok, als map itemId -> record.
 */
export const getAssessmentItemVoortgang = async (userId, blockId) => {
  if (!userId || !blockId) return {};

  try {
    const snapshot = await getDocs(collection(db, 'voortgang', `${userId}_${blockId}`, 'items'));
    return Object.fromEntries(
      snapshot.docs.map((itemDoc) => [itemDoc.id, { id: itemDoc.id, ...itemDoc.data() }])
    );
  } catch (error) {
    console.error('❌ [Voortgang] Error fetching assessment item progress:', error);
    return {};
  }
};

/**
 * Een docent handelt een open beoordeling af.
 *
 * Dit is de enige schrijfactie van het docentdashboard. Ze loopt bewust over
 * `saveContentBlockVoortgang`, zodat de beoordeling exact dezelfde velden en
 * dezelfde documentsleutel raakt als een gewone poging van de leerling. Er komt
 * geen tweede waarheid bij.
 *
 * Beveiliging: `firestore.rules` staat een update op `voortgang/{docId}` toe
 * voor de eigenaar OF voor `isAdmin()`. Een docent zit in de tweede categorie,
 * dus hier is geen Cloud Function en geen regelwijziging voor nodig. Is de
 * aanroeper geen admin, dan weigert Firestore de schrijfactie en vertaalt deze
 * functie dat naar een leesbare melding in plaats van een rauwe foutcode.
 *
 * Toets- en quizvragen: het antwoord van de leerling staat NIET in het
 * blokdocument maar in `voortgang/{uid}_{blockId}/items/{itemId}`. Een besluit
 * over zo'n vraag gaat dus naar het itemdocument, en daarna wordt de opgetelde
 * stand van het blok bijgewerkt met precies dezelfde optelling die de
 * leerlingroute gebruikt. Zonder die tweede schrijfactie blijft het blok op
 * "wacht op nakijken" staan terwijl er niets meer te doen is.
 *
 * @param {Object} params
 * @param {Object} params.record - Het voortgangrecord van de stap (uit het dashboard)
 * @param {string} params.besluit - Een waarde uit NAKIJK_BESLUIT
 * @param {string} [params.opmerking] - Korte toelichting van de docent
 * @param {Object} [params.docent] - De ingelogde docent (uid, displayName, email)
 * @param {Array} [params.blokItems] - De vragen van het toetsblok uit de lesstof
 * @param {Object} [params.itemRecords] - Map itemId -> itemrecord van dit blok
 * @returns {Promise<Object>} De data die is weggeschreven
 */
export const beoordeelOpenAntwoord = async ({
  record = null,
  besluit = '',
  opmerking = '',
  docent = {},
  blokItems = [],
  itemRecords = {}
} = {}) => {
  const blokkade = beoordeelBlokkade(record);
  if (blokkade) {
    throw new Error(blokkade);
  }

  const data = buildBeoordelingData({ record, besluit, opmerking, docent });

  try {
    if (isAssessmentItemRecord(record)) {
      await saveAssessmentItemVoortgang(
        record.userId,
        record.blockId,
        record.itemId,
        record.paragraafId,
        record.hoofdstukId || '',
        record.klasId || '',
        { ...data, itemIndex: record.itemIndex ?? 0 }
      );

      const blokstand = buildBlokstandNaBeoordeling({
        record,
        beoordeling: data,
        items: blokItems,
        itemRecords
      });

      if (blokstand) {
        await saveContentBlockVoortgang(
          record.userId,
          record.blockId,
          record.paragraafId,
          record.hoofdstukId || '',
          record.klasId || '',
          blokstand
        );
      }
    } else {
      await saveContentBlockVoortgang(
        record.userId,
        record.blockId,
        record.paragraafId,
        record.hoofdstukId || '',
        record.klasId || '',
        data
      );
    }
  } catch (error) {
    if (error?.code === 'permission-denied') {
      throw new Error(
        'Je account mag deze voortgang niet aanpassen. Vraag een beheerder om je docentrol te controleren.',
        { cause: error }
      );
    }
    throw error;
  }

  return data;
};

/**
 * Get the last incomplete question in a paragraph
 * Useful for "continue" functionality
 *
 * @param {string} userId - Student user ID
 * @param {string} paragraafId - Paragraph ID
 * @param {Array<string>} alleVraagIds - All question IDs in paragraph (ordered)
 * @returns {Promise<string|null>} ID of first incomplete vraag, or null
 */
export const getLastIncompleteVraag = async (userId, paragraafId, alleVraagIds) => {
  if (!userId || !paragraafId || !alleVraagIds || alleVraagIds.length === 0) {
    return alleVraagIds?.[0] || null;
  }

  try {
    const voortgang = await getVoortgangForParagraaf(userId, paragraafId);

    // Create map of completed vraag IDs
    const completedIds = new Set(
      voortgang
        .filter(v => v.completed === true)
        .map(v => v.vraagId)
    );

    // Find first non-completed vraag
    for (const vraagId of alleVraagIds) {
      if (!completedIds.has(vraagId)) {
        return vraagId;
      }
    }

    // All completed, return last one
    return alleVraagIds[alleVraagIds.length - 1];
  } catch (error) {
    console.error('❌ [Voortgang] Error finding last incomplete vraag:', error);
    return alleVraagIds?.[0] || null;
  }
};

/**
 * Get class-wide progress for a paragraph (for teacher dashboard)
 *
 * @param {string} klasId - Class ID
 * @param {string} paragraafId - Paragraph ID
 * @returns {Promise<Object>} Summary with { totalStudents, completedCount, averageAttempts }
 */
export const getKlasVoortgangForParagraaf = async (klasId, paragraafId) => {
  if (!klasId || !paragraafId) {
    return { totalStudents: 0, completedCount: 0, averageAttempts: 0 };
  }

  try {
    const q = query(
      collection(db, 'voortgang'),
      where('klasId', '==', klasId),
      where('paragraafId', '==', paragraafId)
    );

    const snapshot = await getDocs(q);
    const records = snapshot.docs.map(doc => doc.data());

    // Group by user to count students
    const uniqueUsers = new Set(records.map(r => r.userId));
    const completedRecords = records.filter(r => r.completed === true);
    const totalAttempts = records.reduce((sum, r) => sum + (r.attempts || 1), 0);

    return {
      totalStudents: uniqueUsers.size,
      completedCount: new Set(completedRecords.map(r => r.userId)).size,
      averageAttempts: records.length > 0 ? totalAttempts / records.length : 0,
      totalRecords: records.length
    };
  } catch (error) {
    console.error('❌ [Voortgang] Error fetching class progress:', error);
    return { totalStudents: 0, completedCount: 0, averageAttempts: 0 };
  }
};

/**
 * Get all progress for a student in a class
 * Useful for overview dashboards
 *
 * @param {string} userId - Student user ID
 * @param {string} klasId - Class ID
 * @returns {Promise<Array>} Array of all progress records for student
 */
export const getStudentVoortgang = async (userId, klasId) => {
  if (!userId) {
    return [];
  }

  try {
    const userOnlyQuery = query(
      collection(db, 'voortgang'),
      where('userId', '==', userId)
    );

    if (!klasId) {
      const snapshot = await getDocs(userOnlyQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    const classScopedQuery = query(
      collection(db, 'voortgang'),
      where('userId', '==', userId),
      where('klasId', '==', klasId)
    );

    const classScopedSnapshot = await getDocs(classScopedQuery);
    if (!shouldFallbackToUserProgressQuery({ klasId, classScopedCount: classScopedSnapshot.size })) {
      return classScopedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    }

    const userOnlySnapshot = await getDocs(userOnlyQuery);
    return userOnlySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ [Voortgang] Error fetching student progress:', error);
    return [];
  }
};

export default {
  saveVoortgang,
  saveContentBlockVoortgang,
  beoordeelOpenAntwoord,
  saveAssessmentItemVoortgang,
  getAssessmentItemVoortgang,
  saveAssessmentItemConcept,
  getVoortgangForParagraaf,
  getLastIncompleteVraag,
  getKlasVoortgangForParagraaf,
  getStudentVoortgang
};
