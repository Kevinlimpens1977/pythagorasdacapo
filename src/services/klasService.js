/**
 * Klas (Class) Management Service
 * Handles CRUD operations for student classes and settings
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  deleteField,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { getStudentEffectiveParagrafen as getEffectiveParagrafenFromAssignments } from '../lib/assignmentUtils';

/**
 * Generate a 6-character class code (e.g., "VMB1A")
 */
const generateClassCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Create a new class
 * @param {string} name - Class name (e.g., "VMBO 1A")
 * @param {string} adminUid - Admin user ID
 * @returns {Promise<{klasId: string}>}
 */
export const createKlas = async (name, adminUid) => {
  if (!name || !adminUid) {
    throw new Error('Name and adminUid are required');
  }

  try {
    const klasId = `klas_${Date.now()}`;
    const klasRef = doc(db, 'klassen', klasId);

    await setDoc(klasRef, {
      klasId,
      name,
      code: generateClassCode(),
      createdBy: adminUid,
      createdAt: serverTimestamp(),
      settings: {
        hintsEnabled: true,
        aiEnabled: true,
        calculatorEnabled: true
      },
      // Default: only voorkennis enabled, all others disabled
      enabledChapters: {
        voorkennis: true,
        para_71: false,
        para_72: false,
        para_73: false,
        para_74: false,
        para_75: false,
        para_76: false
      }
    });

    return { klasId };
  } catch (error) {
    throw new Error(`Failed to create class: ${error.message}`, { cause: error });
  }
};

/**
 * Get all available classes for students to join
 * @returns {Promise<Array>} Array of klas documents
 */
export const getAvailableKlassen = async () => {
  try {
    const klassensRef = collection(db, 'klassen');
    const snapshot = await getDocs(klassensRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
  } catch (error) {
    console.error('Failed to fetch available classes:', error);
    return [];
  }
};

/**
 * Join a class (write klasId to user document)
 * @param {string} userId - Student user ID
 * @param {string} klasId - Class ID to join
 * @returns {Promise<void>}
 */
export const joinKlas = async (userId, klasId) => {
  if (!userId || !klasId) {
    throw new Error('userId and klasId are required');
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      klasId,
      joinedKlasAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to join class: ${error.message}`, { cause: error });
  }
};

/**
 * Get a single class document
 * @param {string} klasId
 * @returns {Promise<Object|null>} Class data or null if not found
 */
export const getKlas = async (klasId) => {
  if (!klasId) {
    return null;
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    const snapshot = await getDoc(klasRef);
    return snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null;
  } catch (error) {
    console.error('Failed to fetch class:', error);
    return null;
  }
};

/**
 * Get all students in a class
 * @param {string} klasId
 * @returns {Promise<Array>} Array of user documents in the class
 */
export const getKlasStudents = async (klasId) => {
  if (!klasId) {
    throw new Error('klasId is required');
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('klasId', '==', klasId), where('role', '==', 'student'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      uid: doc.id
    }));
  } catch (error) {
    console.error('Failed to fetch class students:', error);
    return [];
  }
};

/**
 * Update class settings (hints, AI, calculator toggles)
 * @param {string} klasId
 * @param {Object} settings - Partial settings object
 * @returns {Promise<void>}
 */
export const updateKlasSettings = async (klasId, settings) => {
  if (!klasId || !settings) {
    throw new Error('klasId and settings are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      settings,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update class settings: ${error.message}`, { cause: error });
  }
};

/**
 * Update which chapters are available for a class
 * @param {string} klasId
 * @param {Object} enabledChapters - Map of chapter IDs to boolean (e.g., { voorkennis: true, para_71: false, ... })
 * @returns {Promise<void>}
 */
export const updateKlasChapters = async (klasId, enabledChapters) => {
  if (!klasId || !enabledChapters) {
    throw new Error('klasId and enabledChapters are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      enabledChapters,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update class chapters: ${error.message}`, { cause: error });
  }
};

/**
 * Zet de leerroute (het niveau) van een klas.
 * Een lege of ontbrekende niveauId betekent "geen route": de leerling ziet dan
 * alles wat is toegewezen, ongeacht niveau.
 * @param {string} klasId
 * @param {string|null} niveauId - Niveau-document-id (bijv. 'niveau-dv-vmbo1-bb') of null
 * @returns {Promise<void>}
 */
export const updateKlasNiveau = async (klasId, niveauId) => {
  if (!klasId) {
    throw new Error('klasId is required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      niveauId: String(niveauId || '').trim() || null,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update class niveau: ${error.message}`, { cause: error });
  }
};

/**
 * Delete a class
 * @param {string} klasId
 * @returns {Promise<void>}
 */
export const deleteKlas = async (klasId) => {
  if (!klasId) {
    throw new Error('klasId is required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await deleteDoc(klasRef);
  } catch (error) {
    throw new Error(`Failed to delete class: ${error.message}`, { cause: error });
  }
};

/**
 * Update enabled paragraphs for a class (new system)
 * @param {string} klasId
 * @param {Array<string>} paragraafIds - Array of paragraph IDs (Firestore document IDs)
 * @returns {Promise<void>}
 */
export const updateKlasEnabledParagrafen = async (klasId, paragraafIds) => {
  if (!klasId || !Array.isArray(paragraafIds)) {
    throw new Error('klasId and paragraafIds array are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      enabledParagrafen: paragraafIds,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update class paragraphs: ${error.message}`, { cause: error });
  }
};

/**
 * Update explicit content block selection for one paragraph in a class.
 * If blockIds is an empty array, the paragraph remains assigned but no blocks are visible.
 * Remove the field to fall back to all published blocks.
 * @param {string} klasId
 * @param {string} paragraafId
 * @param {Array<string>} blockIds
 * @returns {Promise<void>}
 */
export const updateKlasEnabledContentBlocks = async (klasId, paragraafId, blockIds) => {
  if (!klasId || !paragraafId || !Array.isArray(blockIds)) {
    throw new Error('klasId, paragraafId, and blockIds array are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      [`enabledContentBlocks.${paragraafId}`]: blockIds,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update class content blocks: ${error.message}`, { cause: error });
  }
};

/**
 * Remove explicit class content block selection for one paragraph.
 * The student flow then falls back to all published blocks in the assigned paragraph.
 * @param {string} klasId
 * @param {string} paragraafId
 * @returns {Promise<void>}
 */
export const clearKlasEnabledContentBlocks = async (klasId, paragraafId) => {
  if (!klasId || !paragraafId) {
    throw new Error('klasId and paragraafId are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      [`enabledContentBlocks.${paragraafId}`]: deleteField(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to clear class content blocks: ${error.message}`, { cause: error });
  }
};

/**
 * Set per-student content override (extra paragraphs beyond class default)
 * @param {string} klasId
 * @param {string} userId - Student user ID
 * @param {Array<string>} extraParagraafIds - Extra paragraphs for this student
 * @returns {Promise<void>}
 */
export const setStudentOverride = async (klasId, userId, extraParagraafIds) => {
  if (!klasId || !userId || !Array.isArray(extraParagraafIds)) {
    throw new Error('klasId, userId, and extraParagraafIds array are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      [`studentOverrides.${userId}.extraParagrafen`]: extraParagraafIds,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to set student override: ${error.message}`, { cause: error });
  }
};

/**
 * Set extra content blocks for one student in one paragraph.
 * These are additive on top of the class selection.
 * @param {string} klasId
 * @param {string} userId
 * @param {string} paragraafId
 * @param {Array<string>} blockIds
 * @returns {Promise<void>}
 */
export const setStudentContentBlockOverride = async (klasId, userId, paragraafId, blockIds) => {
  if (!klasId || !userId || !paragraafId || !Array.isArray(blockIds)) {
    throw new Error('klasId, userId, paragraafId, and blockIds array are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      [`studentOverrides.${userId}.extraContentBlocks.${paragraafId}`]: blockIds,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to set student content block override: ${error.message}`, { cause: error });
  }
};

/**
 * Remove per-student content override
 * @param {string} klasId
 * @param {string} userId - Student user ID
 * @returns {Promise<void>}
 */
export const removeStudentOverride = async (klasId, userId) => {
  if (!klasId || !userId) {
    throw new Error('klasId and userId are required');
  }

  try {
    const klasRef = doc(db, 'klassen', klasId);
    await updateDoc(klasRef, {
      [`studentOverrides.${userId}`]: deleteField()
    });
  } catch (error) {
    throw new Error(`Failed to remove student override: ${error.message}`, { cause: error });
  }
};

/**
 * Get effective paragraphs for a student (class default + student overrides)
 * Pure function - no async needed
 * @param {Object} klasData - Klas document from Firestore
 * @param {string} userId - Student user ID
 * @returns {Array<string>} Array of paragraaf IDs visible to this student
 */
export const getStudentEffectiveParagrafen = (klasData, userId) => {
  return getEffectiveParagrafenFromAssignments(klasData, userId);
};

/**
 * Subscribe to klas document changes in real-time
 * @param {string} klasId
 * @param {Function} callback - Called with klas data on changes
 * @returns {Function} Unsubscribe function
 */
export const subscribeToKlas = (klasId, callback) => {
  if (!klasId || typeof callback !== 'function') {
    throw new Error('klasId and callback function are required');
  }

  const klasRef = doc(db, 'klassen', klasId);
  return onSnapshot(
    klasRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ ...docSnap.data(), id: docSnap.id });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to klas:', error);
      callback(null);
    }
  );
};

export default {
  createKlas,
  getAvailableKlassen,
  joinKlas,
  getKlas,
  getKlasStudents,
  updateKlasSettings,
  updateKlasChapters,
  updateKlasNiveau,
  deleteKlas,
  updateKlasEnabledParagrafen,
  updateKlasEnabledContentBlocks,
  clearKlasEnabledContentBlocks,
  setStudentOverride,
  setStudentContentBlockOverride,
  removeStudentOverride,
  getStudentEffectiveParagrafen,
  subscribeToKlas
};
