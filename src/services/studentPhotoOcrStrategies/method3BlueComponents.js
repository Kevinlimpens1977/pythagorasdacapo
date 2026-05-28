export const METHOD_ID = 'method3-blue-components';
export const METHOD_LABEL = '3. Blauwe componenten';

const OCR_UPSCALE = 4;
const MIN_LABEL_SCORE = 0.32;
const OCR_NAME_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u00C0\u00C1\u00C2\u00C3\u00C4\u00C5\u00C6\u00C7\u00C8\u00C9\u00CA\u00CB\u00CC\u00CD\u00CE\u00CF\u00D0\u00D1\u00D2\u00D3\u00D4\u00D5\u00D6\u00D8\u00D9\u00DA\u00DB\u00DC\u00DD\u00DE\u00DF\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5\u00E6\u00E7\u00E8\u00E9\u00EA\u00EB\u00EC\u00ED\u00EE\u00EF\u00F0\u00F1\u00F2\u00F3\u00F4\u00F5\u00F6\u00F8\u00F9\u00FA\u00FB\u00FC\u00FD\u00FF' .-";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const defaultCleanOcrName = (value = '') =>
  String(value)
    .split('\n')
    .map((line) => line.replace(/[^A-Za-z\u00C0-\u017F' .-]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((line) => line.length >= 3 && /[A-Za-z\u00C0-\u017F]/.test(line))
    .sort((a, b) => b.length - a.length)[0] || '';

const defaultIsBlueTextPixel = (r, g, b) => {
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

const buildPixelMask = (imageData, width, height, predicate) => {
  const mask = new Uint8Array(width * height);
  const data = imageData.data;

  for (let index = 0; index < mask.length; index += 1) {
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

const clipBox = (box, bounds, validateAndClipCoordinates) => {
  if (typeof validateAndClipCoordinates === 'function') {
    return validateAndClipCoordinates(box, bounds);
  }

  const x = clamp(Math.round(box.x), 0, bounds.width);
  const y = clamp(Math.round(box.y), 0, bounds.height);
  const right = clamp(Math.round(box.x + box.width), x, bounds.width);
  const bottom = clamp(Math.round(box.y + box.height), y, bounds.height);
  const width = right - x;
  const height = bottom - y;

  return width > 0 && height > 0 ? { x, y, width, height } : null;
};

const toOriginalBox = (box, scale, bounds, validateAndClipCoordinates) =>
  clipBox(
    {
      x: Math.round(box.x / scale),
      y: Math.round(box.y / scale),
      width: Math.round(box.width / scale),
      height: Math.round(box.height / scale)
    },
    bounds,
    validateAndClipCoordinates
  );

const expandBox = (box, padding, bounds, validateAndClipCoordinates) =>
  clipBox(
    {
      x: box.x - padding.x,
      y: box.y - padding.y,
      width: box.width + padding.x * 2,
      height: box.height + padding.y * 2
    },
    bounds,
    validateAndClipCoordinates
  );

const boxesOverlap = (a, b) => {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const overlapArea = xOverlap * yOverlap;
  const smallerArea = Math.min(a.width * a.height, b.width * b.height);
  return smallerArea > 0 && overlapArea / smallerArea > 0.35;
};

const mergeBoxes = (boxes) => {
  const merged = [];

  for (const box of boxes) {
    const existing = merged.find((item) => boxesOverlap(item, box));
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
  }

  return merged;
};

const detectBlueComponents = ({ analysis, helpers }) => {
  if (typeof helpers.detectBlueLabelBoxes === 'function') {
    return helpers.detectBlueLabelBoxes(analysis) || [];
  }

  const { canvas, context, scale = 1, originalWidth = canvas.width, originalHeight = canvas.height } = analysis;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const isBlueTextPixel = helpers.isBlueTextPixel || defaultIsBlueTextPixel;
  const blueMask = buildPixelMask(imageData, canvas.width, canvas.height, isBlueTextPixel);
  const groupedMask = dilateMask(blueMask, canvas.width, canvas.height, 8, 2);
  const components = findConnectedComponents(groupedMask, canvas.width, canvas.height);
  const bounds = { width: originalWidth, height: originalHeight };

  const candidates = components
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
    .map((component) => toOriginalBox(component, scale, bounds, helpers.validateAndClipCoordinates))
    .filter(Boolean)
    .map((box) => expandBox(box, { x: 10, y: 8 }, bounds, helpers.validateAndClipCoordinates))
    .filter(Boolean);

  return mergeBoxes(candidates).sort((a, b) => a.y - b.y || a.x - b.x);
};

const defaultToCanvasBox = (box, scale, canvas) => {
  const x = clamp(Math.round(box.x * scale), 0, canvas.width - 1);
  const y = clamp(Math.round(box.y * scale), 0, canvas.height - 1);
  const right = clamp(Math.round((box.x + box.width) * scale), x + 1, canvas.width);
  const bottom = clamp(Math.round((box.y + box.height) * scale), y + 1, canvas.height);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y
  };
};

const prepareLabelCanvas = ({ analysis, labelBox, helpers }) => {
  const { canvas, context, scale = 1 } = analysis;
  const isBlueTextPixel = helpers.isBlueTextPixel || defaultIsBlueTextPixel;

  if (typeof helpers.cropPreparedLabel === 'function') {
    const prepared = helpers.cropPreparedLabel({ analysis, labelBox, scale, isBlueTextPixel });
    if (prepared) return prepared;
  }

  const paddedLabelBox = {
    x: labelBox.x - 8,
    y: labelBox.y - 8,
    width: labelBox.width + 16,
    height: labelBox.height + 16
  };
  const canvasBox =
    typeof helpers.toCanvasBox === 'function'
      ? helpers.toCanvasBox(paddedLabelBox, scale, canvas)
      : defaultToCanvasBox(paddedLabelBox, scale, canvas);

  if (!canvasBox?.width || !canvasBox?.height) return null;

  const targetCanvas = document.createElement('canvas');
  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!targetContext) return null;

  targetCanvas.width = Math.max(1, canvasBox.width * OCR_UPSCALE);
  targetCanvas.height = Math.max(1, canvasBox.height * OCR_UPSCALE);
  targetContext.fillStyle = '#ffffff';
  targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

  const imageData = context.getImageData(canvasBox.x, canvasBox.y, canvasBox.width, canvasBox.height);
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(canvasBox.width - 1, Math.floor(x / OCR_UPSCALE));
      const sourceY = Math.min(canvasBox.height - 1, Math.floor(y / OCR_UPSCALE));
      const sourceOffset = (sourceY * canvasBox.width + sourceX) * 4;
      const outputOffset = (y * targetCanvas.width + x) * 4;
      const value = isBlueTextPixel(
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

const horizontalOverlapRatio = (a, b) => {
  const overlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  return overlap / Math.max(1, Math.min(a.width, b.width));
};

const scoreLabelForPhoto = ({ photoBox, labelBox, maxVerticalGap, helpers }) => {
  const verticalGap = photoBox.y - (labelBox.y + labelBox.height);
  if (verticalGap < -8 || verticalGap > maxVerticalGap) return 0;

  if (typeof helpers.scoreLabelForPhoto === 'function') {
    const score = helpers.scoreLabelForPhoto({ photoBox, labelBox });
    return Number.isFinite(score) ? Number(score.toFixed(3)) : 0;
  }

  const photoCenterX = photoBox.x + photoBox.width / 2;
  const labelCenterX = labelBox.x + labelBox.width / 2;
  const centerDistance = Math.abs(photoCenterX - labelCenterX);
  const centerScore = Math.max(0, 1 - centerDistance / Math.max(photoBox.width, labelBox.width, 1));
  const overlapScore = horizontalOverlapRatio(photoBox, labelBox);
  const verticalScore = Math.max(0, 1 - Math.max(0, verticalGap) / maxVerticalGap);

  return Number((centerScore * 0.55 + overlapScore * 0.3 + verticalScore * 0.15).toFixed(3));
};

const matchLabelsToPhotos = ({ photoBoxes, labelBoxes, helpers }) => {
  const usedLabels = new Set();
  const averagePhotoHeight = photoBoxes.reduce((total, box) => total + box.height, 0) / Math.max(1, photoBoxes.length);
  const maxVerticalGap = Math.max(80, averagePhotoHeight * 0.55);

  return photoBoxes
    .map((photoBox, index) => {
      const candidates = labelBoxes
        .map((labelBox, labelIndex) => {
          if (usedLabels.has(labelIndex)) return null;

          const labelMatchConfidence = scoreLabelForPhoto({
            photoBox,
            labelBox,
            maxVerticalGap,
            helpers
          });
          if (labelMatchConfidence < MIN_LABEL_SCORE) return null;

          return {
            index,
            photoBox,
            labelBox,
            labelIndex,
            labelMatchConfidence
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.labelMatchConfidence - a.labelMatchConfidence);

      const best = candidates[0];
      if (!best) return null;
      usedLabels.add(best.labelIndex);
      return best;
    })
    .filter(Boolean);
};

const createOcrWorker = async ({ helpers, onProgress }) => {
  const workerOptions = {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress?.(Math.round(message.progress * 100));
      }
    }
  };

  let worker;
  try {
    worker = await helpers.createWorker('nld+eng', 1, workerOptions);
  } catch (error) {
    console.warn('Nederlandse OCR-taaldata niet beschikbaar, val terug op Engels:', error);
    worker = await helpers.createWorker('eng', 1, workerOptions);
  }

  await worker.setParameters?.({
    tessedit_pageseg_mode: helpers.PSM?.SINGLE_LINE || '7',
    preserve_interword_spaces: '1',
    tessedit_char_whitelist: OCR_NAME_WHITELIST,
    user_defined_dpi: '300'
  });

  return worker;
};

const recognizeSingleLine = ({ worker, preparedLabel, helpers }) => {
  if (typeof helpers.runSingleLineOcr === 'function') {
    return helpers.runSingleLineOcr({ worker, preparedLabel });
  }

  return worker.recognize(
    typeof preparedLabel?.toDataURL === 'function' ? preparedLabel.toDataURL('image/png') : preparedLabel
  );
};

const getRawText = (result) => {
  if (typeof result === 'string') return result;
  return result?.rawText || result?.text || result?.data?.text || '';
};

const getConfidence = (result, name) => {
  if (!name) return 0;
  return Number(result?.ocrConfidence ?? result?.confidence ?? result?.data?.confidence ?? 0);
};

export async function recognizeNames({ analysis, photoBoxes, helpers = {}, onProgress }) {
  const strategyHelpers = helpers || {};

  if (!analysis?.canvas || !analysis?.context || !Array.isArray(photoBoxes) || !strategyHelpers.createWorker) {
    return new Map();
  }

  onProgress?.({ strategyId: METHOD_ID, phase: 'detect', percent: 0 });
  const labelBoxes = detectBlueComponents({ analysis, helpers: strategyHelpers });
  const labelMatches = matchLabelsToPhotos({ photoBoxes, labelBoxes, helpers: strategyHelpers });
  onProgress?.({ strategyId: METHOD_ID, phase: 'detect', percent: 100 });

  if (!labelMatches.length) return new Map();

  const names = new Map();
  const cleanOcrName = strategyHelpers.cleanOcrName || defaultCleanOcrName;
  const worker = await createOcrWorker({
    helpers: strategyHelpers,
    onProgress: (percent) => onProgress?.({ strategyId: METHOD_ID, phase: 'ocr', percent })
  });

  try {
    for (const [position, match] of labelMatches.entries()) {
      const preparedLabel = prepareLabelCanvas({ analysis, labelBox: match.labelBox, helpers: strategyHelpers });
      if (!preparedLabel) continue;

      const result = await recognizeSingleLine({ worker, preparedLabel, helpers: strategyHelpers });
      const rawText = getRawText(result);
      const name = cleanOcrName(rawText);
      if (!name) continue;

      names.set(match.index, {
        name,
        rawText,
        ocrConfidence: getConfidence(result, name),
        labelBox: match.labelBox,
        labelMatchConfidence: match.labelMatchConfidence,
        strategyId: METHOD_ID
      });

      onProgress?.({
        strategyId: METHOD_ID,
        phase: 'ocr',
        percent: Math.round(((position + 1) / labelMatches.length) * 100)
      });
    }
  } finally {
    await worker.terminate?.();
  }

  return names;
}
