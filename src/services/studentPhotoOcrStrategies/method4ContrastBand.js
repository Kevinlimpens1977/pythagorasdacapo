export const METHOD_ID = 'method4-contrast-band';
export const METHOD_LABEL = '4. Contrast band';

const OCR_UPSCALE = 5;
const OCR_NAME_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\u00c0\u00c1\u00c2\u00c3\u00c4\u00c5\u00c6\u00c7\u00c8\u00c9\u00ca\u00cb\u00cc\u00cd\u00ce\u00cf\u00d0\u00d1\u00d2\u00d3\u00d4\u00d5\u00d6\u00d8\u00d9\u00da\u00db\u00dc\u00dd\u00de\u00df\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5\u00e6\u00e7\u00e8\u00e9\u00ea\u00eb\u00ec\u00ed\u00ee\u00ef\u00f0\u00f1\u00f2\u00f3\u00f4\u00f5\u00f6\u00f8\u00f9\u00fa\u00fb\u00fc\u00fd\u00ff' .-";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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

const getContrastBandForPhoto = (photoBox, bounds, validateAndClipCoordinates) => {
  const horizontalMargin = Math.max(24, Math.round(photoBox.width * 0.26));
  const gap = Math.max(0, Math.round(photoBox.height * 0.015));
  const bandHeight = clamp(Math.round(photoBox.height * 0.3), 48, 170);

  return clipBox(
    {
      x: photoBox.x - horizontalMargin,
      y: photoBox.y - gap - bandHeight,
      width: photoBox.width + horizontalMargin * 2,
      height: bandHeight
    },
    bounds,
    validateAndClipCoordinates
  );
};

const getLuminance = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const getBackgroundLuminance = (imageData, pixelCount) => {
  const luminances = [];

  for (let index = 0; index < pixelCount; index += 1) {
    const offset = index * 4;
    if (imageData.data[offset + 3] < 20) continue;
    luminances.push(
      getLuminance(imageData.data[offset], imageData.data[offset + 1], imageData.data[offset + 2])
    );
  }

  if (!luminances.length) return 255;
  luminances.sort((a, b) => a - b);
  return luminances[Math.floor(luminances.length * 0.86)] || 255;
};

const isLikelyTextPixel = (r, g, b, backgroundLuminance) => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const luminance = getLuminance(r, g, b);
  const saturation = max - min;
  const darkThreshold = clamp(backgroundLuminance - 42, 112, 205);
  const coloredThreshold = clamp(backgroundLuminance - 18, 130, 230);

  return (
    luminance <= darkThreshold ||
    (saturation >= 32 && luminance <= coloredThreshold && max <= 245) ||
    (saturation >= 48 && luminance <= 235)
  );
};

const prepareContrastBandCanvas = ({ analysis, labelBox, helpers }) => {
  const { canvas, context, scale } = analysis;
  const canvasBox =
    typeof helpers.toCanvasBox === 'function'
      ? helpers.toCanvasBox(labelBox, scale, canvas)
      : defaultToCanvasBox(labelBox, scale, canvas);

  if (!canvasBox?.width || !canvasBox?.height) return null;

  const targetCanvas = document.createElement('canvas');
  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true });
  if (!targetContext) return null;

  targetCanvas.width = Math.max(1, canvasBox.width * OCR_UPSCALE);
  targetCanvas.height = Math.max(1, canvasBox.height * OCR_UPSCALE);
  targetContext.fillStyle = '#ffffff';
  targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

  const imageData = context.getImageData(canvasBox.x, canvasBox.y, canvasBox.width, canvasBox.height);
  const backgroundLuminance = getBackgroundLuminance(imageData, canvasBox.width * canvasBox.height);
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(canvasBox.width - 1, Math.floor(x / OCR_UPSCALE));
      const sourceY = Math.min(canvasBox.height - 1, Math.floor(y / OCR_UPSCALE));
      const sourceOffset = (sourceY * canvasBox.width + sourceX) * 4;
      const outputOffset = (y * targetCanvas.width + x) * 4;
      const isText = isLikelyTextPixel(
        imageData.data[sourceOffset],
        imageData.data[sourceOffset + 1],
        imageData.data[sourceOffset + 2],
        backgroundLuminance
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

const createOcrWorker = async ({ createWorker, PSM, onProgress }) => {
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

  await worker.setParameters?.({
    tessedit_pageseg_mode: PSM?.SINGLE_LINE || '7',
    preserve_interword_spaces: '1',
    tessedit_char_whitelist: OCR_NAME_WHITELIST,
    user_defined_dpi: '300'
  });

  return worker;
};

const recognizeSingleLine = async ({ worker, preparedLabel, helpers }) => {
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

const getConfidence = (result, cleanedName) => {
  if (!cleanedName) return 0;
  return Number(result?.ocrConfidence ?? result?.confidence ?? result?.data?.confidence ?? 0);
};

const scoreLabel = ({ photoBox, labelBox, helpers }) => {
  if (typeof helpers.scoreLabelForPhoto === 'function') {
    const score = helpers.scoreLabelForPhoto({ photoBox, labelBox });
    return Number.isFinite(score) ? Number(score.toFixed(3)) : 0;
  }

  const photoCenterX = photoBox.x + photoBox.width / 2;
  const labelCenterX = labelBox.x + labelBox.width / 2;
  const centerDistance = Math.abs(photoCenterX - labelCenterX);
  const centerScore = Math.max(0, 1 - centerDistance / Math.max(photoBox.width, labelBox.width, 1));
  const overlap =
    Math.max(0, Math.min(photoBox.x + photoBox.width, labelBox.x + labelBox.width) - Math.max(photoBox.x, labelBox.x)) /
    Math.max(1, Math.min(photoBox.width, labelBox.width));
  const verticalGap = Math.max(0, photoBox.y - (labelBox.y + labelBox.height));
  const verticalScore = Math.max(0, 1 - verticalGap / Math.max(1, photoBox.height * 0.45));

  return Number((centerScore * 0.5 + overlap * 0.25 + verticalScore * 0.25).toFixed(3));
};

export async function recognizeNames({ analysis, photoBoxes, helpers, onProgress }) {
  if (!analysis?.canvas || !analysis?.context || !Array.isArray(photoBoxes) || !helpers?.createWorker) {
    return new Map();
  }

  const bounds = {
    width: analysis.originalWidth,
    height: analysis.originalHeight
  };
  const labelMatches = photoBoxes
    .map((photoBox, index) => ({
      index,
      photoBox,
      labelBox: getContrastBandForPhoto(photoBox, bounds, helpers.validateAndClipCoordinates)
    }))
    .filter((match) => match.labelBox);

  if (!labelMatches.length) return new Map();

  const names = new Map();
  const worker = await createOcrWorker({
    createWorker: helpers.createWorker,
    PSM: helpers.PSM,
    onProgress: (percent) => onProgress?.({ strategyId: METHOD_ID, percent })
  });

  try {
    for (const [position, match] of labelMatches.entries()) {
      const preparedLabel = prepareContrastBandCanvas({ analysis, labelBox: match.labelBox, helpers });
      if (!preparedLabel) continue;

      const result = await recognizeSingleLine({ worker, preparedLabel, helpers });
      const rawText = getRawText(result);
      const name = helpers.cleanOcrName(rawText);
      if (!name) continue;

      names.set(match.index, {
        name,
        rawText,
        ocrConfidence: getConfidence(result, name),
        labelBox: match.labelBox,
        labelMatchConfidence: scoreLabel({
          photoBox: match.photoBox,
          labelBox: match.labelBox,
          helpers
        }),
        strategyId: METHOD_ID
      });

      onProgress?.({
        strategyId: METHOD_ID,
        percent: Math.round(((position + 1) / labelMatches.length) * 100)
      });
    }
  } finally {
    await worker.terminate?.();
  }

  return names;
}
