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

    const updates = {
      userId,
      blockId,
      paragraafId,
      hoofdstukId,
      klasId,
      progressType: 'contentBlock',
      completed: data.completed || false,
      isCorrect: data.isCorrect || false,
      attempts: data.attempts || existingData.attempts || 1,
      lastAnswer: data.lastAnswer || existingData.lastAnswer || null,
      updatedAt: serverTimestamp(),
      firstAttemptAt: existingData.firstAttemptAt || serverTimestamp()
    };

    if (data.completed && !existingData.completedAt) {
      updates.completedAt = serverTimestamp();
    }

    await setDoc(docRef, updates, { merge: true });
  } catch (error) {
    console.error('❌ [Voortgang] Error saving content block progress:', error);
    throw error;
  }
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
  if (!userId || !klasId) {
    return [];
  }

  try {
    const q = query(
      collection(db, 'voortgang'),
      where('userId', '==', userId),
      where('klasId', '==', klasId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
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
  getVoortgangForParagraaf,
  getLastIncompleteVraag,
  getKlasVoortgangForParagraaf,
  getStudentVoortgang
};
