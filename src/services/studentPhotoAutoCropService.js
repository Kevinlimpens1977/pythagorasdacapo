import { validateAndClipCoordinates } from './cropService';
import {
  DEFAULT_STUDENT_PHOTO_OCR_METHOD_ID,
  STUDENT_PHOTO_OCR_METHODS,
  getStudentPhotoOcrStrategy
} from './studentPhotoOcrStrategies';

const ANALYSIS_WIDTH = 1800;
const MIN_COMPONENT_AREA = 420;
const PHOTO_DILATE_RADIUS = 3;
const OCR_UPSCALE = 4;
const OCR_NAME_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ' .-";

export const STUDENT_PHOTO_OCR_METHOD_OPTIONS = STUDENT_PHOTO_OCR_METHODS;
export const DEFAULT_STUDENT_PHOTO_OCR_METHOD = DEFAULT_STUDENT_PHOTO_OCR_METHOD_ID;

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Afbeelding kon niet worden geladen voor automatische detectie.'));
    image.src = src;
  });

const getCanvasForImage = async (src, maxWidth = ANALYSIS_WIDTH) => {
  const image = await loadImageElement(src);
  const scale = Math.min(1, maxWidth / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas-context is niet beschikbaar.');

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return {
    canvas,
    context,
    scale,
    originalWidth: image.naturalWidth,
    originalHeight: image.naturalHeight
  };
};

const isBlueTextPixel = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const saturation = max - min;

  return (
    b >= 115 &&
    b - r >= 45 &&
    b - g >= 18 &&
    saturation >= 42 &&
    luminance >= 55 &&
    luminance <= 235
  );
};

const isPhotoPixel = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const saturation = max - min;

  if (isBlueTextPixel(r, g, b) && luminance > 80) return false;
  return luminance < 232 && saturation > 9;
};

const buildPixelMask = (imageData, width, height, predicate) => {
  const mask = new Uint8Array(width * height);
  const data = imageData.data;

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    mask[index] = predicate(data[offset], data[offset + 1], data[offset + 2]) ? 1 : 0;
  }

  return mask;
};

const dilateMask = (mask, width, height, radiusX, radiusY) => {
  const dilated = new Uint8Array(mask.length);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue;

      for (let dy = -radiusY; dy <= radiusY; dy += 1) {
        for (let dx = -radiusX; dx <= radiusX; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            dilated[ny * width + nx] = 1;
          }
        }
      }
    }
  }

  return dilated;
};

const findConnectedComponents = (mask, width, height) => {
  const visited = new Uint8Array(mask.length);
  const components = [];
  const queue = [];

  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || visited[start]) continue;

    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    let area = 0;
    visited[start] = 1;
    queue.length = 0;
    queue.push(start);

    while (queue.length) {
      const index = queue.pop();
      const x = index % width;
      const y = Math.floor(index / width);
      area += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const neighbors = [index - 1, index + 1, index - width, index + width];
      for (const neighbor of neighbors) {
        if (neighbor < 0 || neighbor >= mask.length || visited[neighbor] || !mask[neighbor]) continue;
        const nx = neighbor % width;
        const ny = Math.floor(neighbor / width);
        if (Math.abs(nx - x) + Math.abs(ny - y) !== 1) continue;
        visited[neighbor] = 1;
        queue.push(neighbor);
      }
    }

    components.push({
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
      area
    });
  }

  return components;
};

const overlaps = (a, b) => {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const overlapArea = xOverlap * yOverlap;
  const smallerArea = Math.min(a.width * a.height, b.width * b.height);
  return smallerArea > 0 && overlapArea / smallerArea > 0.35;
};

const mergeBoxes = (boxes) => {
  const merged = [];
  for (const box of boxes) {
    const existing = merged.find((item) => overlaps(item, box));
    if (!existing) {
      merged.push({ ...box });
      continue;
    }

    const left = Math.min(existing.x, box.x);
    const top = Math.min(existing.y, box.y);
    const right = Math.max(existing.x + existing.width, box.x + box.width);
    const bottom = Math.max(existing.y + existing.height, box.y + box.height);
    existing.x = left;
    existing.y = top;
    existing.width = right - left;
    existing.height = bottom - top;
    existing.confidence = Math.max(existing.confidence || 0, box.confidence || 0);
  }
  return merged;
};

const toOriginalBox = (box, scale, bounds) =>
  validateAndClipCoordinates(
    {
      x: Math.round(box.x / scale),
      y: Math.round(box.y / scale),
      width: Math.round(box.width / scale),
      height: Math.round(box.height / scale)
    },
    bounds
  );

const toCanvasBox = (box, scaleOrAnalysis = 1, canvasArg = null) => {
  const scale = typeof scaleOrAnalysis === 'number' ? scaleOrAnalysis : scaleOrAnalysis?.scale || 1;
  const canvas = canvasArg || scaleOrAnalysis?.canvas || null;
  const x = Math.round(box.x * scale);
  const y = Math.round(box.y * scale);
  const width = Math.round(box.width * scale);
  const height = Math.round(box.height * scale);

  if (!canvas) return { x, y, width, height };

  const clippedX = Math.max(0, Math.min(x, canvas.width - 1));
  const clippedY = Math.max(0, Math.min(y, canvas.height - 1));
  const right = Math.max(clippedX + 1, Math.min(x + width, canvas.width));
  const bottom = Math.max(clippedY + 1, Math.min(y + height, canvas.height));

  return {
    x: clippedX,
    y: clippedY,
    width: right - clippedX,
    height: bottom - clippedY
  };
};

const expandBox = (box, padding, bounds) =>
  validateAndClipCoordinates(
    {
      x: box.x - padding.x,
      y: box.y - padding.y,
      width: box.width + padding.x * 2,
      height: box.height + padding.y * 2
    },
    bounds
  );

const detectPhotoBoxes = ({ context, canvas, scale, originalWidth, originalHeight }) => {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const rawMask = buildPixelMask(imageData, canvas.width, canvas.height, isPhotoPixel);
  const mask = dilateMask(rawMask, canvas.width, canvas.height, PHOTO_DILATE_RADIUS, PHOTO_DILATE_RADIUS);
  const components = findConnectedComponents(mask, canvas.width, canvas.height);
  const bounds = { width: originalWidth, height: originalHeight };
  const candidates = components
    .filter((component) => {
      const aspect = component.width / component.height;
      const fill = component.area / (component.width * component.height);
      return (
        component.area >= MIN_COMPONENT_AREA &&
        component.width >= 22 &&
        component.height >= 42 &&
        aspect >= 0.28 &&
        aspect <= 1.15 &&
        fill >= 0.16
      );
    })
    .map((component) => {
      const marginX = Math.max(4, Math.round(component.width * 0.06));
      const marginY = Math.max(4, Math.round(component.height * 0.04));
      const coordinates = toOriginalBox(
        {
          x: component.x - marginX,
          y: component.y - marginY,
          width: component.width + marginX * 2,
          height: component.height + marginY * 2
        },
        scale,
        bounds
      );

      if (!coordinates) return null;
      return {
        ...coordinates,
        confidence: Math.min(0.98, Math.max(0.45, component.area / (component.width * component.height)))
      };
    })
    .filter(Boolean);

  return mergeBoxes(candidates)
    .sort((a, b) => a.y - b.y || a.x - b.x)
    .slice(0, 40);
};

const detectBlueLabelBoxes = ({ context, canvas, scale, originalWidth, originalHeight }) => {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const blueMask = buildPixelMask(imageData, canvas.width, canvas.height, isBlueTextPixel);
  const groupedMask = dilateMask(blueMask, canvas.width, canvas.height, 8, 2);
  const components = findConnectedComponents(groupedMask, canvas.width, canvas.height);
  const bounds = { width: originalWidth, height: originalHeight };

  return components
    .filter((component) => {
      const aspect = component.width / Math.max(1, component.height);
      const area = component.width * component.height;
      return (
        component.width >= 18 &&
        component.height >= 5 &&
        component.height <= Math.max(34, canvas.height * 0.035) &&
        aspect >= 1.4 &&
        aspect <= 24 &&
        area >= 50
      );
    })
    .map((component) => toOriginalBox(component, scale, bounds))
    .filter(Boolean)
    .map((box) => expandBox(box, { x: 10, y: 8 }, bounds))
    .filter(Boolean)
    .sort((a, b) => a.y - b.y || a.x - b.x);
};

const centerX = (box) => box.x + box.width / 2;

const horizontalOverlapRatio = (a, b) => {
  const overlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  return overlap / Math.max(1, Math.min(a.width, b.width));
};

const linkLabelsToPhotoBoxes = (photoBoxes, labelBoxes) => {
  const usedLabels = new Set();
  const averagePhotoHeight = photoBoxes.reduce((total, box) => total + box.height, 0) / Math.max(1, photoBoxes.length);
  const maxVerticalGap = Math.max(80, averagePhotoHeight * 0.55);

  return photoBoxes.map((photoBox) => {
    const candidates = labelBoxes
      .map((labelBox, labelIndex) => {
        if (usedLabels.has(labelIndex)) return null;

        const verticalGap = photoBox.y - (labelBox.y + labelBox.height);
        if (verticalGap < -8 || verticalGap > maxVerticalGap) return null;

        const centerDistance = Math.abs(centerX(photoBox) - centerX(labelBox));
        const centerScore = Math.max(0, 1 - centerDistance / Math.max(photoBox.width, labelBox.width, 1));
        const overlapScore = horizontalOverlapRatio(photoBox, labelBox);
        const verticalScore = Math.max(0, 1 - verticalGap / maxVerticalGap);
        const score = centerScore * 0.55 + overlapScore * 0.3 + verticalScore * 0.15;

        return { labelBox, labelIndex, score };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score);

    const best = candidates[0];
    if (!best || best.score < 0.32) return { photoBox, labelBox: null, labelMatchConfidence: 0 };
    usedLabels.add(best.labelIndex);
    return {
      photoBox,
      labelBox: best.labelBox,
      labelMatchConfidence: Number(best.score.toFixed(3))
    };
  });
};

const cleanOcrName = (value = '') =>
  String(value)
    .split('\n')
    .map((line) => line.replace(/[^A-Za-z\u00C0-\u017F' .-]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((line) => line.length >= 3 && /[A-Za-z\u00C0-\u017F]/.test(line))
    .sort((a, b) => b.length - a.length)[0] || '';

const preprocessLabelCrop = (sourceCanvas, sourceContext, labelBox, scale) => {
  const sourceBox = {
    x: Math.max(0, Math.round((labelBox.x - 8) * scale)),
    y: Math.max(0, Math.round((labelBox.y - 8) * scale)),
    width: Math.round((labelBox.width + 16) * scale),
    height: Math.round((labelBox.height + 16) * scale)
  };

  sourceBox.width = Math.max(1, Math.min(sourceBox.width, sourceCanvas.width - sourceBox.x));
  sourceBox.height = Math.max(1, Math.min(sourceBox.height, sourceCanvas.height - sourceBox.y));

  const targetCanvas = document.createElement('canvas');
  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!targetContext) return '';

  targetCanvas.width = Math.max(1, sourceBox.width * OCR_UPSCALE);
  targetCanvas.height = Math.max(1, sourceBox.height * OCR_UPSCALE);
  targetContext.fillStyle = '#ffffff';
  targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

  const imageData = sourceContext.getImageData(sourceBox.x, sourceBox.y, sourceBox.width, sourceBox.height);
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(sourceBox.width - 1, Math.floor(x / OCR_UPSCALE));
      const sourceY = Math.min(sourceBox.height - 1, Math.floor(y / OCR_UPSCALE));
      const sourceOffset = (sourceY * sourceBox.width + sourceX) * 4;
      const outputOffset = (y * targetCanvas.width + x) * 4;
      const isText = isBlueTextPixel(
        imageData.data[sourceOffset],
        imageData.data[sourceOffset + 1],
        imageData.data[sourceOffset + 2]
      );
      const value = isText ? 0 : 255;

      output.data[outputOffset] = value;
      output.data[outputOffset + 1] = value;
      output.data[outputOffset + 2] = value;
      output.data[outputOffset + 3] = 255;
    }
  }

  targetContext.putImageData(output, 0, 0);
  return targetCanvas;
};

const cropPreparedLabel = ({ analysis, labelBox, isBlueTextPixel: isTextPixel = isBlueTextPixel } = {}) => {
  if (!analysis?.canvas || !analysis?.context || !labelBox) return null;
  const sourceBox = toCanvasBox(
    {
      x: labelBox.x - 8,
      y: labelBox.y - 8,
      width: labelBox.width + 16,
      height: labelBox.height + 16
    },
    analysis.scale,
    analysis.canvas
  );
  const targetCanvas = document.createElement('canvas');
  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!targetContext) return null;

  targetCanvas.width = Math.max(1, sourceBox.width * OCR_UPSCALE);
  targetCanvas.height = Math.max(1, sourceBox.height * OCR_UPSCALE);
  const imageData = analysis.context.getImageData(sourceBox.x, sourceBox.y, sourceBox.width, sourceBox.height);
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(sourceBox.width - 1, Math.floor(x / OCR_UPSCALE));
      const sourceY = Math.min(sourceBox.height - 1, Math.floor(y / OCR_UPSCALE));
      const sourceOffset = (sourceY * sourceBox.width + sourceX) * 4;
      const outputOffset = (y * targetCanvas.width + x) * 4;
      const value = isTextPixel(
        imageData.data[sourceOffset],
        imageData.data[sourceOffset + 1],
        imageData.data[sourceOffset + 2]
      )
        ? 0
        : 255;

      output.data[outputOffset] = value;
      output.data[outputOffset + 1] = value;
      output.data[outputOffset + 2] = value;
      output.data[outputOffset + 3] = 255;
    }
  }

  targetContext.putImageData(output, 0, 0);
  return targetCanvas;
};

const getLuminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const cropContrastLabel = ({ analysis, labelBox } = {}) => {
  if (!analysis?.canvas || !analysis?.context || !labelBox) return null;
  const sourceBox = toCanvasBox(
    {
      x: labelBox.x - 10,
      y: labelBox.y - 10,
      width: labelBox.width + 20,
      height: labelBox.height + 20
    },
    analysis.scale,
    analysis.canvas
  );
  const targetCanvas = document.createElement('canvas');
  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!targetContext) return null;

  const upscale = 5;
  targetCanvas.width = Math.max(1, sourceBox.width * upscale);
  targetCanvas.height = Math.max(1, sourceBox.height * upscale);
  const imageData = analysis.context.getImageData(sourceBox.x, sourceBox.y, sourceBox.width, sourceBox.height);
  const luminances = [];
  for (let index = 0; index < sourceBox.width * sourceBox.height; index += 1) {
    const offset = index * 4;
    luminances.push(getLuminance(imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2]));
  }
  luminances.sort((a, b) => a - b);
  const background = luminances[Math.floor(luminances.length * 0.86)] || 255;
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(sourceBox.width - 1, Math.floor(x / upscale));
      const sourceY = Math.min(sourceBox.height - 1, Math.floor(y / upscale));
      const sourceOffset = (sourceY * sourceBox.width + sourceX) * 4;
      const outputOffset = (y * targetCanvas.width + x) * 4;
      const r = imageData.data[sourceOffset];
      const g = imageData.data[sourceOffset + 1];
      const b = imageData.data[sourceOffset + 2];
      const luminance = getLuminance(r, g, b);
      const saturation = Math.max(r, g, b) - Math.min(r, g, b);
      const value = luminance <= background - 38 || (saturation > 32 && luminance <= background - 16) ? 0 : 255;

      output.data[outputOffset] = value;
      output.data[outputOffset + 1] = value;
      output.data[outputOffset + 2] = value;
      output.data[outputOffset + 3] = 255;
    }
  }

  targetContext.putImageData(output, 0, 0);
  return targetCanvas;
};

const pickBestOcrName = (result) => {
  const rawText = result.data?.text || '';
  const cleanedName = cleanOcrName(rawText);
  const confidence = Number(result.data?.confidence || 0);

  return {
    rawText,
    cleanedName,
    confidence: cleanedName ? confidence : 0
  };
};

const runSingleLineOcr = async ({ worker, preparedLabel }) => {
  const result = await worker.recognize(
    typeof preparedLabel?.toDataURL === 'function' ? preparedLabel.toDataURL('image/png') : preparedLabel
  );
  const ocr = pickBestOcrName(result);

  return {
    ...result,
    rawText: ocr.rawText,
    text: ocr.rawText,
    confidence: ocr.confidence,
    ocrConfidence: ocr.confidence
  };
};

const runSparseOcr = async ({ analysis, box, onProgress } = {}) => {
  const { createWorker, PSM } = await import('tesseract.js');
  const worker = await createConfiguredWorker({
    createWorker,
    PSM,
    pageSegMode: PSM?.SPARSE_TEXT || '11',
    onProgress: (percent) => onProgress?.(percent)
  });

  try {
    const labelCanvas = cropContrastLabel({ analysis, labelBox: box });
    if (!labelCanvas) return null;
    return worker.recognize(labelCanvas.toDataURL('image/png'));
  } finally {
    await worker.terminate();
  }
};

const scoreLabelForPhoto = (...args) => {
  const params = args.length === 1 ? args[0] : { labelBox: args[0], photoBox: args[1] };
  const { photoBox, labelBox } = params || {};
  if (!photoBox || !labelBox) return 0;

  const verticalGap = photoBox.y - (labelBox.y + labelBox.height);
  if (verticalGap < -8) return 0;

  const centerDistance = Math.abs(centerX(photoBox) - centerX(labelBox));
  const centerScore = Math.max(0, 1 - centerDistance / Math.max(photoBox.width, labelBox.width, 1));
  const overlapScore = horizontalOverlapRatio(photoBox, labelBox);
  const verticalScore = Math.max(0, 1 - Math.max(0, verticalGap) / Math.max(80, photoBox.height * 0.55));

  return Number((centerScore * 0.55 + overlapScore * 0.3 + verticalScore * 0.15).toFixed(3));
};

const scoreCandidateName = ({ name = '', rawText = '', ocrConfidence = 0 } = {}) => {
  if (!name) return 0;
  const confidenceScore = Math.max(0, Math.min(1, Number(ocrConfidence || 0) / 100));
  const lengthScore = Math.max(0.15, Math.min(1, name.length / 14));
  const letterCount = (String(rawText || name).match(/[A-Za-z\u00C0-\u017F]/g) || []).length;
  const letterRatio = Math.max(0, Math.min(1, letterCount / Math.max(1, String(rawText || name).length)));
  return Number((confidenceScore * 0.55 + lengthScore * 0.25 + letterRatio * 0.2).toFixed(3));
};

const createConfiguredWorker = async ({ createWorker, PSM, pageSegMode, onProgress }) => {
  const workerOptions = {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress?.(Math.round(message.progress * 100));
      }
    }
  };
  let worker;

  try {
    worker = await createWorker('nld+eng', 1, workerOptions);
  } catch (error) {
    console.warn('Nederlandse OCR-taaldata niet beschikbaar, val terug op Engels:', error);
    worker = await createWorker('eng', 1, workerOptions);
  }

  await worker.setParameters({
    tessedit_pageseg_mode: pageSegMode || PSM?.SINGLE_LINE || '7',
    preserve_interword_spaces: '1',
    tessedit_char_whitelist: OCR_NAME_WHITELIST,
    user_defined_dpi: '300'
  });

  return worker;
};

const buildOcrHelpers = ({ createWorker, PSM }) => ({
  createWorker,
  PSM,
  cleanOcrName,
  isBlueTextPixel,
  validateAndClipCoordinates,
  toCanvasBox,
  cropPreparedLabel,
  cropContrastLabel,
  detectBlueLabelBoxes,
  scoreLabelForPhoto,
  scoreCandidateName,
  runSingleLineOcr,
  runSparseOcr
});

const recognizeLabels = async ({ analysis, labelMatches, ocrMethodId, onProgress }) => {
  if (!labelMatches.length) return new Map();

  const { createWorker, PSM } = await import('tesseract.js');
  const strategy = getStudentPhotoOcrStrategy(ocrMethodId);
  const helpers = buildOcrHelpers({ createWorker, PSM });
  const strategyNames = await strategy.recognizeNames({
    analysis,
    photoBoxes: labelMatches.map((match) => match.photoBox),
    helpers,
    onProgress
  });

  if (strategyNames?.size) return strategyNames;

  const worker = await createConfiguredWorker({
    createWorker,
    PSM,
    onProgress
  });
  const names = new Map();

  try {
    for (const [index, match] of labelMatches.entries()) {
      if (!match.labelBox) continue;

      const labelCanvas = preprocessLabelCrop(analysis.canvas, analysis.context, match.labelBox, analysis.scale);
      if (!labelCanvas) continue;
      const result = await worker.recognize(labelCanvas.toDataURL('image/png'));
      const ocr = pickBestOcrName(result);
      if (ocr.cleanedName) {
        names.set(index, {
          name: ocr.cleanedName,
          rawText: ocr.rawText,
          ocrConfidence: ocr.confidence,
          labelBox: match.labelBox,
          labelMatchConfidence: match.labelMatchConfidence,
          strategyId: ocrMethodId || DEFAULT_STUDENT_PHOTO_OCR_METHOD_ID
        });
      }
    }
  } finally {
    await worker.terminate();
  }

  return names;
};

export const detectStudentPhotoSelections = async ({
  imageData,
  runOcr = true,
  ocrMethodId = DEFAULT_STUDENT_PHOTO_OCR_METHOD_ID,
  onProgress
} = {}) => {
  if (!imageData?.src) throw new Error('Upload eerst een bronfoto.');

  onProgress?.({ phase: 'detect', percent: 0 });
  const analysis = await getCanvasForImage(imageData.src);
  const boxes = detectPhotoBoxes(analysis);
  const labelBoxes = detectBlueLabelBoxes(analysis);
  const labelMatches = linkLabelsToPhotoBoxes(boxes, labelBoxes);
  onProgress?.({ phase: 'detect', percent: 100 });

  let names = new Map();
  if (runOcr && boxes.length) {
    onProgress?.({ phase: 'ocr', percent: 0 });
    try {
      names = await recognizeLabels({
        analysis,
        labelMatches,
        ocrMethodId,
        onProgress: (progress) => {
          if (typeof progress === 'number') {
            onProgress?.({ phase: 'ocr', percent: progress, strategyId: ocrMethodId });
          } else {
            onProgress?.({ phase: 'ocr', percent: progress?.percent || 0, strategyId: progress?.strategyId || ocrMethodId });
          }
        }
      });
    } catch (error) {
      console.warn('OCR naamherkenning mislukt, crops blijven beschikbaar:', error);
    }
    onProgress?.({ phase: 'ocr', percent: 100 });
  }

  return boxes.map((box, index) => {
    const labelData = names.get(index) || null;
    const proposedName = labelData?.name || '';
    return {
      id: `auto_${Date.now()}_${index + 1}`,
      type: 'image',
      label: proposedName || `Auto ${index + 1}`,
      proposedName,
      cropCoordinates: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height
      },
      originalImageSize: {
        width: imageData.width,
        height: imageData.height
      },
      detectionConfidence: box.confidence,
      detectionMethod: runOcr ? `auto-vision-ocr:${labelData?.strategyId || ocrMethodId}` : 'auto-vision',
      rawOcrText: labelData?.rawText || '',
      cleanedOcrName: proposedName,
      ocrConfidence: labelData?.ocrConfidence || 0,
      labelBox: labelData?.labelBox || labelMatches[index]?.labelBox || null,
      labelMatchConfidence: labelData?.labelMatchConfidence || labelMatches[index]?.labelMatchConfidence || 0,
      ocrMethodId: labelData?.strategyId || ocrMethodId
    };
  });
};

export const __studentPhotoAutoCropTest = {
  cleanOcrName,
  horizontalOverlapRatio,
  linkLabelsToPhotoBoxes
};

export default {
  detectStudentPhotoSelections
};
