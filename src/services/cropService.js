/**
 * Canvas-based crop extraction service
 * Handles image loading, coordinate scaling, and crop extraction via Canvas API
 */

/**
 * Load image and return ImageData object with scaling info
 * @param {File|string} source - File object or data URL
 * @returns {Promise<Object>} { src, width, height, canvasWidth, canvasHeight, scale }
 */
export const loadImageData = (source) => {
  return new Promise((resolve, reject) => {
    const reader = source instanceof File ? new FileReader() : null;

    const handleImageLoad = (img) => {
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;

      // Calculate canvas size (fit to viewport, max 90% of window)
      const maxCanvasWidth = Math.min(naturalWidth, window.innerWidth * 0.9 - 300);
      const maxCanvasHeight = Math.min(naturalHeight, window.innerHeight * 0.9 - 200);

      // Maintain aspect ratio
      let canvasWidth = maxCanvasWidth;
      let canvasHeight = (maxCanvasWidth / naturalWidth) * naturalHeight;

      if (canvasHeight > maxCanvasHeight) {
        canvasHeight = maxCanvasHeight;
        canvasWidth = (maxCanvasHeight / naturalHeight) * naturalWidth;
      }

      // Scale factor: original / display
      const scale = naturalWidth / canvasWidth;

      resolve({
        src: img.src,
        width: naturalWidth,
        height: naturalHeight,
        canvasWidth: Math.round(canvasWidth),
        canvasHeight: Math.round(canvasHeight),
        scale: parseFloat(scale.toFixed(4))
      });
    };

    const handleError = (err) => {
      reject(new Error(`Image load failed: ${err.message}`));
    };

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => handleImageLoad(img);
    img.onerror = handleError;

    if (reader) {
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = handleError;
      reader.readAsDataURL(source);
    } else if (typeof source === 'string') {
      img.src = source;
    } else {
      reject(new Error('Invalid source: must be File or data URL'));
    }
  });
};

/**
 * Extract crop from image using Canvas API
 * @param {string} imageSrc - Image data URL or blob URL
 * @param {Object} cropCoordinates - { x, y, width, height } in ORIGINAL image space
 * @param {string} format - 'image/jpeg' or 'image/png' (default: 'image/jpeg')
 * @param {number} quality - JPEG quality 0-1 (default: 0.85)
 * @returns {Promise<Blob>} Cropped image blob
 */
export const cropRectangleFromImage = async (
  imageSrc,
  cropCoordinates,
  format = 'image/jpeg',
  quality = 0.85
) => {
  // Validate inputs
  if (!imageSrc || typeof imageSrc !== 'string') {
    throw new Error('imageSrc must be a valid data URL or blob URL');
  }

  if (!cropCoordinates || !cropCoordinates.width || !cropCoordinates.height) {
    throw new Error('cropCoordinates must include x, y, width, height');
  }

  if (cropCoordinates.width < 1 || cropCoordinates.height < 1) {
    throw new Error('Crop dimensions too small (min 1x1)');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const clippedCoordinates = validateAndClipCoordinates(cropCoordinates, {
          width: img.naturalWidth,
          height: img.naturalHeight
        });

        if (!clippedCoordinates) {
          throw new Error('Crop valt buiten de afbeelding');
        }

        const canvas = document.createElement('canvas');
        canvas.width = clippedCoordinates.width;
        canvas.height = clippedCoordinates.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas 2D context');
        }

        // Draw cropped region
        ctx.drawImage(
          img,
          clippedCoordinates.x,      // Source X
          clippedCoordinates.y,      // Source Y
          clippedCoordinates.width,  // Source width
          clippedCoordinates.height, // Source height
          0,                      // Dest X
          0,                      // Dest Y
          clippedCoordinates.width,  // Dest width
          clippedCoordinates.height  // Dest height
        );

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob from canvas'));
            }
          },
          format,
          quality
        );
      } catch (error) {
        reject(new Error(`Canvas crop failed: ${error.message}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for cropping'));
    };

    img.src = imageSrc;
  });
};

/**
 * Batch crop multiple rectangles from one image
 * @param {string} imageSrc - Image data URL
 * @param {Array} selections - Array of { cropCoordinates, type, label }
 * @param {string} format - Image format
 * @param {number} quality - JPEG quality
 * @returns {Promise<Array>} Array of { cropId, blob, metadata }
 */
export const batchCropRectangles = async (
  imageSrc,
  selections,
  format = 'image/jpeg',
  quality = 0.85
) => {
  const results = [];

  for (let i = 0; i < selections.length; i++) {
    const selection = selections[i];

    try {
      const blob = await cropRectangleFromImage(
        imageSrc,
        selection.cropCoordinates,
        format,
        quality
      );

      results.push({
        index: i,
        cropId: selection.id || `crop_${i}_${Date.now()}`,
        blob,
        type: selection.type,
        label: selection.label,
        coordinates: selection.cropCoordinates,
        originalImageSize: selection.originalImageSize,
        status: 'success',
        error: null
      });
    } catch (error) {
      results.push({
        index: i,
        cropId: selection.id || `crop_${i}_${Date.now()}`,
        blob: null,
        status: 'error',
        error: error.message
      });
    }
  }

  return results;
};

/**
 * Validate crop coordinates
 * @param {Object} coords - { x, y, width, height }
 * @param {Object} imageBounds - { width, height }
 * @returns {Object|null} Clipped coordinates or null if invalid
 */
export const validateAndClipCoordinates = (coords, imageBounds) => {
  if (!coords || !imageBounds) return null;

  const { x, y, width, height } = coords;
  const { width: imgWidth, height: imgHeight } = imageBounds;

  // Check minimum size
  if (width < 1 || height < 1) return null;

  const left = Math.max(0, Math.min(x, x + width));
  const top = Math.max(0, Math.min(y, y + height));
  const right = Math.min(imgWidth, Math.max(x, x + width));
  const bottom = Math.min(imgHeight, Math.max(y, y + height));
  const clippedWidth = Math.round(right - left);
  const clippedHeight = Math.round(bottom - top);

  if (clippedWidth < 1 || clippedHeight < 1) return null;

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: clippedWidth,
    height: clippedHeight
  };
};

/**
 * Get file extension from format MIME type
 * @param {string} format - e.g., 'image/jpeg', 'image/png'
 * @returns {string} e.g., 'jpg', 'png'
 */
export const getFileExtension = (format = 'image/jpeg') => {
  const mimeToExt = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  return mimeToExt[format] || 'jpg';
};

export default {
  loadImageData,
  cropRectangleFromImage,
  batchCropRectangles,
  validateAndClipCoordinates,
  getFileExtension
};
