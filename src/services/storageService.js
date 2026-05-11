/**
 * Firebase Storage service for crop uploads
 * Handles upload paths, download URLs, and storage cleanup
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { getFileExtension } from './cropService';

/**
 * Retry helper with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Max retry attempts (default 3)
 * @param {number} initialDelay - Initial delay in ms (default 1000)
 * @returns {Promise} Result of successful fn call
 */
const retryWithBackoff = async (fn, maxRetries = 3, initialDelay = 1000) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client-side validation errors or 400-level errors
      if (error.code?.includes('invalid') || error.message?.includes('must be a')) {
        throw error;
      }

      // Calculate exponential backoff: 1s, 2s, 4s, 8s
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.warn(`Upload attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Upload failed after ${maxRetries + 1} attempts: ${lastError.message}`);
};

/**
 * Build Firebase Storage path for crop
 * Format: pythagoras/question-crops/{paragraphId}/{questionId}/crop_{order}_{timestamp}.{ext}
 * @param {string} paragraphId - e.g., "7.3"
 * @param {string} questionId - e.g., "p73_14a"
 * @param {number} order - Crop order within question
 * @param {string} format - MIME type (e.g., 'image/jpeg')
 * @returns {string} Storage path
 */
export const buildCropStoragePath = (paragraphId, questionId, order, format = 'image/jpeg') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '_').slice(0, -5);
  const ext = getFileExtension(format);
  const cleanParagraph = paragraphId.replace(/\./g, '');

  return `pythagoras/question-crops/${cleanParagraph}/${questionId}/crop_${String(order).padStart(3, '0')}_${timestamp}.${ext}`;
};

/**
 * Build Firebase Storage path for source image
 * Format: pythagoras/source-pages/{paragraphId}/{sourceImageId}.{ext}
 * @param {string} paragraphId
 * @param {string} sourceImageId
 * @param {string} format
 * @returns {string}
 */
export const buildSourceImageStoragePath = (paragraphId, sourceImageId, format = 'image/jpeg') => {
  const ext = getFileExtension(format);
  const cleanParagraph = paragraphId.replace(/\./g, '');

  return `pythagoras/source-pages/${cleanParagraph}/${sourceImageId}.${ext}`;
};

/**
 * Upload crop blob to Firebase Storage (with retry logic)
 * @param {Blob} cropBlob - Image blob from canvas crop
 * @param {string} paragraphId - Chapter ID
 * @param {string} questionId - Question ID
 * @param {number} order - Crop order
 * @param {string} format - MIME type
 * @param {number} maxRetries - Max retry attempts (default 3)
 * @returns {Promise<Object>} { storagePath, downloadURL, attempts }
 */
export const uploadCropToStorage = async (
  cropBlob,
  paragraphId,
  questionId,
  order,
  format = 'image/jpeg',
  maxRetries = 3
) => {
  if (!cropBlob || !(cropBlob instanceof Blob)) {
    throw new Error('cropBlob must be a valid Blob');
  }

  if (!paragraphId || !questionId) {
    throw new Error('paragraphId and questionId are required');
  }

  if (!Number.isFinite(order) || order < 0) {
    throw new Error('order must be a non-negative number');
  }

  const storagePath = buildCropStoragePath(paragraphId, questionId, order, format);

  try {
    // Upload with retry
    const result = await retryWithBackoff(async () => {
      const storageRef = ref(storage, storagePath);

      // Upload with cache settings
      const metadata = {
        contentType: format,
        cacheControl: 'public, max-age=31536000' // 1 year
      };

      await uploadBytes(storageRef, cropBlob, metadata);

      // Get public download URL
      const downloadURL = await getDownloadURL(storageRef);

      return { downloadURL };
    }, maxRetries);

    return {
      storagePath,
      downloadURL: result.downloadURL,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
};

/**
 * Batch upload multiple crop blobs with progress callback
 * @param {Array} crops - Array of { blob, paragraphId, questionId, order, format, cropId }
 * @param {Function} onProgress - Callback (current, total, currentCropId, status)
 * @returns {Promise<Array>} Results with storagePath, downloadURL, status, error details
 */
export const batchUploadCrops = async (crops, onProgress = null) => {
  const results = [];

  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];

    // Notify progress: starting
    onProgress?.(i, crops.length, crop.cropId, 'uploading');

    try {
      const result = await uploadCropToStorage(
        crop.blob,
        crop.paragraphId,
        crop.questionId,
        crop.order,
        crop.format || 'image/jpeg'
      );

      results.push({
        index: i,
        cropId: crop.cropId,
        status: 'success',
        ...result
      });

      // Notify progress: completed
      onProgress?.(i + 1, crops.length, crop.cropId, 'success');
    } catch (error) {
      const errorResult = {
        index: i,
        cropId: crop.cropId,
        status: 'error',
        error: error.message,
        storagePath: null,
        downloadURL: null,
        timestamp: new Date().toISOString()
      };

      results.push(errorResult);

      // Notify progress: error
      onProgress?.(i + 1, crops.length, crop.cropId, 'error', error.message);
    }
  }

  return results;
};

/**
 * Delete crop from Firebase Storage
 * @param {string} storagePath - Full storage path
 * @returns {Promise<void>}
 */
export const deleteCropFromStorage = async (storagePath) => {
  if (!storagePath || typeof storagePath !== 'string') {
    throw new Error('storagePath must be a valid string');
  }

  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    // Log but don't fail - file may already be deleted
    console.warn(`Failed to delete crop from storage: ${error.message}`);
  }
};

/**
 * Upload source image to Firebase Storage
 * @param {Blob} imageBlob - Source image blob
 * @param {string} paragraphId
 * @param {string} sourceImageId
 * @param {string} format
 * @returns {Promise<Object>} { storagePath, downloadURL }
 */
export const uploadSourceImageToStorage = async (
  imageBlob,
  paragraphId,
  sourceImageId,
  format = 'image/jpeg'
) => {
  if (!imageBlob || !(imageBlob instanceof Blob)) {
    throw new Error('imageBlob must be a valid Blob');
  }

  try {
    const storagePath = buildSourceImageStoragePath(paragraphId, sourceImageId, format);
    const storageRef = ref(storage, storagePath);

    const metadata = {
      contentType: format,
      cacheControl: 'public, max-age=86400' // 1 day
    };

    await uploadBytes(storageRef, imageBlob, metadata);
    const downloadURL = await getDownloadURL(storageRef);

    return {
      storagePath,
      downloadURL,
      uploadedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Source image upload failed: ${error.message}`);
  }
};

export default {
  buildCropStoragePath,
  buildSourceImageStoragePath,
  uploadCropToStorage,
  batchUploadCrops,
  deleteCropFromStorage,
  uploadSourceImageToStorage
};
