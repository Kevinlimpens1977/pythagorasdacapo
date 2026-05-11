/**
 * Firestore service for crop metadata management
 * Uses shadow document model: JS = content, Firestore = metadata only
 */

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Collection path for question metadata
 * Path: questionMetadata/{paragraphId}/questions/{questionId}
 * (subcollection model for even segment count)
 */
const getQuestionMetadataRef = (paragraphId, questionId) => {
  return doc(db, 'questionMetadata', paragraphId, 'questions', questionId);
};

/**
 * Save new crop metadata to question document
 * Creates or updates questionMetadata/{paragraphId}/{questionId}
 * @param {string} paragraphId - e.g., "7.3"
 * @param {string} questionId - e.g., "p73_14a"
 * @param {Object} crops - Array of crop objects
 * @param {string} createdBy - Admin user ID
 * @returns {Promise<void>}
 */
export const saveCropMetadata = async (paragraphId, questionId, crops, createdBy) => {
  if (!paragraphId || !questionId) {
    throw new Error('paragraphId and questionId are required');
  }

  if (!Array.isArray(crops) || crops.length === 0) {
    throw new Error('crops must be a non-empty array');
  }

  if (!createdBy) {
    throw new Error('createdBy (admin user ID) is required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    // Determine next crop order
    let nextOrder = 1;
    if (docSnap.exists() && docSnap.data().crops) {
      const existingCrops = docSnap.data().crops;
      if (existingCrops.length > 0) {
        nextOrder = Math.max(...existingCrops.map(c => c.order || 0)) + 1;
      }
    }

    // Add order to each crop (no serverTimestamp in arrays!)
    const cropsWithMetadata = crops.map((crop, idx) => ({
      ...crop,
      order: nextOrder + idx
    }));

    // Create or update document
    if (docSnap.exists()) {
      // Add crops to existing array
      await updateDoc(docRef, {
        crops: arrayUnion(...cropsWithMetadata),
        cropCount: docSnap.data().crops.length + cropsWithMetadata.length,
        lastCropUpdate: serverTimestamp(),
        updatedBy: createdBy
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        questionId,
        paragraphId,
        crops: cropsWithMetadata,
        cropCount: cropsWithMetadata.length,
        createdAt: serverTimestamp(),
        createdBy,
        lastCropUpdate: serverTimestamp(),
        isArchived: false
      });
    }
  } catch (error) {
    throw new Error(`Failed to save crop metadata: ${error.message}`);
  }
};

/**
 * Fetch crop metadata for a question
 * @param {string} paragraphId
 * @param {string} questionId
 * @returns {Promise<Object|null>} Metadata object or null if not found
 */
export const fetchQuestionMetadata = async (paragraphId, questionId) => {
  if (!paragraphId || !questionId) {
    throw new Error('paragraphId and questionId are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return null;
  } catch (error) {
    console.error(`Failed to fetch question metadata: ${error.message}`);
    return null;
  }
};

/**
 * Delete single crop from question
 * @param {string} paragraphId
 * @param {string} questionId
 * @param {Object} cropToRemove - Exact crop object to remove
 * @returns {Promise<void>}
 */
export const deleteCropFromQuestion = async (paragraphId, questionId, cropToRemove) => {
  if (!paragraphId || !questionId || !cropToRemove) {
    throw new Error('paragraphId, questionId, and cropToRemove are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Question metadata document not found');
    }

    const currentCrops = docSnap.data().crops || [];

    // Remove exact crop object
    await updateDoc(docRef, {
      crops: arrayRemove(cropToRemove),
      cropCount: currentCrops.length - 1,
      lastCropUpdate: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to delete crop: ${error.message}`);
  }
};

/**
 * Update single crop metadata (e.g., label, order)
 * @param {string} paragraphId
 * @param {string} questionId
 * @param {string} cropId - ID of crop to update
 * @param {Object} updates - Fields to update (label, order, etc.)
 * @returns {Promise<void>}
 */
export const updateCropMetadata = async (paragraphId, questionId, cropId, updates) => {
  if (!paragraphId || !questionId || !cropId || !updates) {
    throw new Error('paragraphId, questionId, cropId, and updates are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Question metadata document not found');
    }

    const crops = docSnap.data().crops || [];
    const cropIndex = crops.findIndex(c => c.cropId === cropId);

    if (cropIndex === -1) {
      throw new Error(`Crop ${cropId} not found`);
    }

    // Update crop and entire array
    const updatedCrop = {
      ...crops[cropIndex],
      ...updates,
      updatedAt: serverTimestamp()
    };

    const updatedCrops = [...crops];
    updatedCrops[cropIndex] = updatedCrop;

    await updateDoc(docRef, {
      crops: updatedCrops,
      lastCropUpdate: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to update crop metadata: ${error.message}`);
  }
};

/**
 * Reorder crops within a question
 * @param {string} paragraphId
 * @param {string} questionId
 * @param {Array<string>} cropIds - IDs in new order
 * @returns {Promise<void>}
 */
export const reorderCrops = async (paragraphId, questionId, cropIds) => {
  if (!paragraphId || !questionId || !Array.isArray(cropIds)) {
    throw new Error('paragraphId, questionId, and cropIds array are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error('Question metadata document not found');
    }

    const crops = docSnap.data().crops || [];
    const cropMap = new Map(crops.map(c => [c.cropId, c]));

    // Reorder crops based on IDs
    const reorderedCrops = cropIds
      .map(id => cropMap.get(id))
      .filter(c => c !== undefined)
      .map((crop, idx) => ({
        ...crop,
        order: idx + 1,
        updatedAt: serverTimestamp()
      }));

    await updateDoc(docRef, {
      crops: reorderedCrops,
      lastCropUpdate: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to reorder crops: ${error.message}`);
  }
};

/**
 * Archive or unarchive a question
 * @param {string} paragraphId
 * @param {string} questionId
 * @param {boolean} archived - Whether to archive
 * @returns {Promise<void>}
 */
export const setQuestionArchived = async (paragraphId, questionId, archived = true) => {
  if (!paragraphId || !questionId) {
    throw new Error('paragraphId and questionId are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        questionId,
        paragraphId,
        isArchived: archived,
        crops: []
      });
    } else {
      await updateDoc(docRef, {
        isArchived: archived,
        lastCropUpdate: serverTimestamp()
      });
    }
  } catch (error) {
    throw new Error(`Failed to archive question: ${error.message}`);
  }
};

/**
 * Add admin notes to question
 * @param {string} paragraphId
 * @param {string} questionId
 * @param {string} notes
 * @returns {Promise<void>}
 */
export const setQuestionAdminNotes = async (paragraphId, questionId, notes) => {
  if (!paragraphId || !questionId) {
    throw new Error('paragraphId and questionId are required');
  }

  try {
    const docRef = getQuestionMetadataRef(paragraphId, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        questionId,
        paragraphId,
        adminNotes: notes,
        crops: []
      });
    } else {
      await updateDoc(docRef, {
        adminNotes: notes,
        lastCropUpdate: serverTimestamp()
      });
    }
  } catch (error) {
    throw new Error(`Failed to update admin notes: ${error.message}`);
  }
};

/**
 * Create/update source image metadata
 * @param {string} sourceImageId
 * @param {string} paragraphId
 * @param {Object} metadata - { fileName, storagePath, downloadURL, width, height, etc. }
 * @param {string} createdBy - Admin user ID
 * @returns {Promise<void>}
 */
export const saveSourceImageMetadata = async (
  sourceImageId,
  paragraphId,
  metadata,
  createdBy
) => {
  if (!sourceImageId || !paragraphId) {
    throw new Error('sourceImageId and paragraphId are required');
  }

  try {
    const docRef = doc(db, 'adminCropSources', sourceImageId);

    await setDoc(docRef, {
      sourceImageId,
      paragraphId,
      ...metadata,
      uploadedBy: createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    throw new Error(`Failed to save source image metadata: ${error.message}`);
  }
};

/**
 * Fetch source image metadata
 * @param {string} sourceImageId
 * @returns {Promise<Object|null>}
 */
export const fetchSourceImageMetadata = async (sourceImageId) => {
  if (!sourceImageId) {
    throw new Error('sourceImageId is required');
  }

  try {
    const docRef = doc(db, 'adminCropSources', sourceImageId);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error(`Failed to fetch source image metadata: ${error.message}`);
    return null;
  }
};

export default {
  saveCropMetadata,
  fetchQuestionMetadata,
  deleteCropFromQuestion,
  updateCropMetadata,
  reorderCrops,
  setQuestionArchived,
  setQuestionAdminNotes,
  saveSourceImageMetadata,
  fetchSourceImageMetadata
};
