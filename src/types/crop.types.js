/**
 * Type definitions for Admin Crop Tool
 * Shadow document model: JS = content source, Firestore = metadata only
 */

/**
 * @typedef {Object} CropCoordinates
 * @property {number} x - X coordinate in original image
 * @property {number} y - Y coordinate in original image
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 */

/**
 * @typedef {Object} ImageSize
 * @property {number} width - Image width in pixels
 * @property {number} height - Image height in pixels
 */

/**
 * @typedef {Object} Crop
 * @property {string} cropId - Unique crop ID (format: crop_NNN_timestamp)
 * @property {'image'|'text'} type - Crop type
 * @property {string} label - Display label (e.g., "1", "1a", "2")
 * @property {string} sourceImageId - Reference to source image
 * @property {string} storagePath - Full Firebase Storage path
 * @property {string} downloadURL - Public download URL
 * @property {CropCoordinates} cropCoordinates - Crop region in original image
 * @property {ImageSize} originalImageSize - Original image dimensions
 * @property {number} order - Sort order within crops array
 * @property {Date|Object} createdAt - Creation timestamp
 * @property {string} createdBy - Admin user ID
 * @property {Date|Object} updatedAt - Last update timestamp
 * @property {'pending'|'processing'|'done'|'failed'} [ocrStatus] - OCR status (future)
 * @property {string|null} [extractedText] - OCR result (future)
 * @property {number|null} [confidence] - OCR confidence (future)
 */

/**
 * @typedef {Object} QuestionMetadata
 * @property {string} questionId - Matches JS slide ID
 * @property {string} paragraphId - Chapter ID (e.g., "7.3")
 * @property {Crop[]} crops - Array of linked crops
 * @property {number} [orderOverride] - Manual sort order (future)
 * @property {boolean} isArchived - If true, question hidden from admin
 * @property {string} [adminNotes] - Admin-only notes
 * @property {Date|Object} lastCropUpdate - Last crop modification
 * @property {number} cropCount - Number of crops
 */

/**
 * @typedef {Object} SourceImage
 * @property {string} sourceImageId - Unique source ID
 * @property {string} paragraphId - Chapter reference
 * @property {string} fileName - Original filename
 * @property {string} sourceFormat - File format ("jpg"|"png")
 * @property {string} storagePath - Firebase Storage path
 * @property {string} downloadURL - Public URL
 * @property {ImageSize} dimensions - Image size
 * @property {string} uploadedBy - Admin user ID
 * @property {Date|Object} createdAt - Upload timestamp
 * @property {string} [notes] - Admin notes about image
 */

/**
 * @typedef {Object} Selection
 * @property {string} id - Unique selection ID (sel_timestamp)
 * @property {'image'|'text'} type - Selection type
 * @property {string} label - Display label
 * @property {CropCoordinates} cropCoordinates - Coordinates in original image space
 * @property {ImageSize} originalImageSize - Original image dimensions
 * @property {number} [displayX] - Display-space X (for rendering)
 * @property {number} [displayY] - Display-space Y
 * @property {number} [displayWidth] - Display-space width
 * @property {number} [displayHeight] - Display-space height
 */

/**
 * @typedef {Object} ImageData
 * @property {string} src - Data URL or blob URL
 * @property {number} width - Original pixel width
 * @property {number} height - Original pixel height
 * @property {number} canvasWidth - Display canvas width
 * @property {number} canvasHeight - Display canvas height
 * @property {number} scale - Scale factor (original / display)
 * @property {number} zoom - Current zoom level (1.0 = 100%)
 * @property {number} panX - Pan offset X
 * @property {number} panY - Pan offset Y
 */

/**
 * Scale coordinates between display space and original image space
 * @type {Object}
 */
export const ScaleCoordinates = {
  /**
   * Convert display-space coordinates to original image space
   * @param {CropCoordinates} displayCoords
   * @param {number} scale - Scale factor
   * @returns {CropCoordinates}
   */
  displayToOriginal: (displayCoords, scale) => ({
    x: Math.round(displayCoords.x * scale),
    y: Math.round(displayCoords.y * scale),
    width: Math.round(displayCoords.width * scale),
    height: Math.round(displayCoords.height * scale)
  }),

  /**
   * Convert original image space to display-space coordinates
   * @param {CropCoordinates} originalCoords
   * @param {number} scale - Scale factor
   * @returns {CropCoordinates}
   */
  originalToDisplay: (originalCoords, scale) => ({
    x: Math.round(originalCoords.x / scale),
    y: Math.round(originalCoords.y / scale),
    width: Math.round(originalCoords.width / scale),
    height: Math.round(originalCoords.height / scale)
  })
};

export default {
  ScaleCoordinates
};
