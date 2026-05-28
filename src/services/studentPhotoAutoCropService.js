import { validateAndClipCoordinates } from './cropService';

const ANALYSIS_WIDTH = 1200;
const MIN_COMPONENT_AREA = 420;
const DILATE_RADIUS = 3;

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

const isPhotoPixel = (r, g, b) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const saturation = max - min;
  const likelyBlueLabel = b > 130 && r < 120 && g < 160 && saturation > 35;

  if (likelyBlueLabel && luminance > 80) return false;
  return luminance < 232 && saturation > 9;
};

const buildMask = (imageData, width, height) => {
  const raw = new Uint8Array(width * height);
  const data = imageData.data;

  for (let index = 0; index < width * height; index += 1) {
    const offset = index * 4;
    raw[index] = isPhotoPixel(data[offset], data[offset + 1], data[offset + 2]) ? 1 : 0;
  }

  const dilated = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x;
      if (!raw[index]) continue;
      for (let dy = -DILATE_RADIUS; dy <= DILATE_RADIUS; dy += 1) {
        for (let dx = -DILATE_RADIUS; dx <= DILATE_RADIUS; dx += 1) {
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
    existing.confidence = Math.max(existing.confidence, box.confidence);
  }
  return merged;
};

const detectPhotoBoxes = ({ context, canvas, scale, originalWidth, originalHeight }) => {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const mask = buildMask(imageData, canvas.width, canvas.height);
  const components = findConnectedComponents(mask, canvas.width, canvas.height);
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
      const coordinates = validateAndClipCoordinates(
        {
          x: Math.round((component.x - marginX) / scale),
          y: Math.round((component.y - marginY) / scale),
          width: Math.round((component.width + marginX * 2) / scale),
          height: Math.round((component.height + marginY * 2) / scale)
        },
        { width: originalWidth, height: originalHeight }
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

const cropToDataUrl = (sourceCanvas, sourceBox) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return '';

  canvas.width = Math.max(1, Math.round(sourceBox.width));
  canvas.height = Math.max(1, Math.round(sourceBox.height));
  context.drawImage(
    sourceCanvas,
    sourceBox.x,
    sourceBox.y,
    sourceBox.width,
    sourceBox.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return canvas.toDataURL('image/png');
};

const cleanOcrName = (value = '') =>
  String(value)
    .split('\n')
    .map((line) => line.replace(/[^A-Za-zÀ-ž' -]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter((line) => line.length >= 3 && /[A-Za-zÀ-ž]/.test(line))
    .sort((a, b) => b.length - a.length)[0] || '';

const recognizeLabels = async ({ canvas, scale, boxes, onProgress }) => {
  if (!boxes.length) return new Map();

  const { createWorker } = await import('tesseract.js');
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress?.(Math.round(message.progress * 100));
      }
    }
  });
  const names = new Map();

  try {
    for (const [index, box] of boxes.entries()) {
      const sourceBox = {
        x: Math.max(0, Math.round((box.x - 24) * scale)),
        y: Math.max(0, Math.round((box.y - 52) * scale)),
        width: Math.min(canvas.width, Math.round((box.width + 48) * scale)),
        height: Math.min(canvas.height, Math.round(48 * scale))
      };
      sourceBox.width = Math.min(sourceBox.width, canvas.width - sourceBox.x);
      sourceBox.height = Math.min(sourceBox.height, canvas.height - sourceBox.y);
      if (sourceBox.width < 10 || sourceBox.height < 10) continue;

      const dataUrl = cropToDataUrl(canvas, sourceBox);
      const result = await worker.recognize(dataUrl);
      const name = cleanOcrName(result.data?.text);
      if (name) names.set(index, name);
    }
  } finally {
    await worker.terminate();
  }

  return names;
};

export const detectStudentPhotoSelections = async ({ imageData, runOcr = true, onProgress } = {}) => {
  if (!imageData?.src) throw new Error('Upload eerst een bronfoto.');

  onProgress?.({ phase: 'detect', percent: 0 });
  const analysis = await getCanvasForImage(imageData.src);
  const boxes = detectPhotoBoxes(analysis);
  onProgress?.({ phase: 'detect', percent: 100 });

  let names = new Map();
  if (runOcr && boxes.length) {
    onProgress?.({ phase: 'ocr', percent: 0 });
    try {
      names = await recognizeLabels({
        canvas: analysis.canvas,
        scale: analysis.scale,
        boxes,
        onProgress: (percent) => onProgress?.({ phase: 'ocr', percent })
      });
    } catch (error) {
      console.warn('OCR naamherkenning mislukt, crops blijven beschikbaar:', error);
    }
    onProgress?.({ phase: 'ocr', percent: 100 });
  }

  return boxes.map((box, index) => {
    const proposedName = names.get(index) || '';
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
      detectionMethod: runOcr ? 'auto-vision-ocr' : 'auto-vision'
    };
  });
};

export default {
  detectStudentPhotoSelections
};
