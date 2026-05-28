export const METHOD_ID = 'method1-blue-band';
export const METHOD_LABEL = '1. Blauwe band';

const OCR_UPSCALE = 4;
const OCR_NAME_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ' .-";

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

const getDynamicBandForPhoto = (photoBox, bounds, validateAndClipCoordinates) => {
  const horizontalMargin = Math.max(18, Math.round(photoBox.width * 0.18));
  const gap = Math.max(2, Math.round(photoBox.height * 0.025));
  const bandHeight = clamp(Math.round(photoBox.height * 0.22), 36, 130);

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

const prepareBlueBandCanvas = ({ analysis, labelBox, helpers }) => {
  const { canvas, context, scale } = analysis;
  const { cropPreparedLabel, isBlueTextPixel, toCanvasBox } = helpers;

  if (typeof cropPreparedLabel === 'function') {
    const prepared = cropPreparedLabel({ analysis, labelBox, scale, isBlueTextPixel });
    if (prepared) return prepared;
  }

  const canvasBox =
    typeof toCanvasBox === 'function'
      ? toCanvasBox(labelBox, scale, canvas)
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
  const output = targetContext.createImageData(targetCanvas.width, targetCanvas.height);

  for (let y = 0; y < targetCanvas.height; y += 1) {
    for (let x = 0; x < targetCanvas.width; x += 1) {
      const sourceX = Math.min(canvasBox.width - 1, Math.floor(x / OCR_UPSCALE));
      const sourceY = Math.min(canvasBox.height - 1, Math.floor(y / OCR_UPSCALE));
      const sourceOffset = (sourceY * canvasBox.width + sourceX) * 4;
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
  const verticalGap = Math.max(0, photoBox.y - (labelBox.y + labelBox.height));
  const verticalScore = Math.max(0, 1 - verticalGap / Math.max(1, photoBox.height * 0.35));

  return Number((centerScore * 0.7 + verticalScore * 0.3).toFixed(3));
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
      labelBox: getDynamicBandForPhoto(photoBox, bounds, helpers.validateAndClipCoordinates)
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
      const preparedLabel = prepareBlueBandCanvas({ analysis, labelBox: match.labelBox, helpers });
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
