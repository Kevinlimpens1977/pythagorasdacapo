export const METHOD_ID = 'method5-multipass';
export const METHOD_LABEL = '5. Multipass';

const OCR_NAME_WHITELIST =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ' .-";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

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

const expandBox = (box, bounds, validateAndClipCoordinates) => {
  const horizontalPadding = Math.max(12, Math.round(box.width * 0.18));
  const verticalPadding = Math.max(6, Math.round(box.height * 0.28));

  return clipBox(
    {
      x: box.x - horizontalPadding,
      y: box.y - verticalPadding,
      width: box.width + horizontalPadding * 2,
      height: box.height + verticalPadding * 2
    },
    bounds,
    validateAndClipCoordinates
  );
};

const getLabelBoxForPhoto = (photoBox, bounds, validateAndClipCoordinates) => {
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

const fallbackCleanName = (rawText = '') =>
  String(rawText)
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' .-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getRawText = (result) => {
  if (typeof result === 'string') return result;
  return result?.rawText || result?.text || result?.data?.text || '';
};

const getOcrConfidence = (result, name) => {
  if (!name) return 0;
  const confidence = Number(result?.ocrConfidence ?? result?.confidence ?? result?.data?.confidence ?? 0);
  return Number.isFinite(confidence) ? confidence : 0;
};

const callScoreCandidateName = ({ helpers, candidate }) => {
  if (typeof helpers?.scoreCandidateName !== 'function') return null;

  const attempts = [
    () => helpers.scoreCandidateName(candidate),
    () => helpers.scoreCandidateName(candidate.name, candidate.rawText, candidate.ocrConfidence),
    () => helpers.scoreCandidateName({ name: candidate.name, rawText: candidate.rawText })
  ];

  for (const attempt of attempts) {
    try {
      const score = attempt();
      if (Number.isFinite(Number(score))) return Number(score);
    } catch {
      // Try the next known helper shape.
    }
  }

  return null;
};

const fallbackCandidateScore = ({ name, rawText, ocrConfidence }) => {
  if (!name) return 0;

  const confidenceScore = clamp(ocrConfidence / 100, 0, 1);
  const lengthScore = clamp(name.length / 12, 0.15, 1);
  const letterRatio =
    rawText.length > 0 ? clamp((name.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g)?.length || 0) / rawText.length, 0, 1) : 0.5;

  return Number((confidenceScore * 0.55 + lengthScore * 0.25 + letterRatio * 0.2).toFixed(3));
};

const scoreCandidate = ({ helpers, candidate }) => {
  const helperScore = callScoreCandidateName({ helpers, candidate });
  return helperScore ?? fallbackCandidateScore(candidate);
};

const scoreLabel = ({ photoBox, labelBox, helpers }) => {
  if (typeof helpers?.scoreLabelForPhoto === 'function') {
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

const runSingleLine = async ({ worker, preparedLabel, helpers }) => {
  if (typeof helpers?.runSingleLineOcr === 'function') {
    return helpers.runSingleLineOcr({ worker, preparedLabel });
  }

  return worker.recognize(
    typeof preparedLabel?.toDataURL === 'function' ? preparedLabel.toDataURL('image/png') : preparedLabel
  );
};

const cropPrepared = ({ analysis, labelBox, helpers }) => {
  if (typeof helpers?.cropPreparedLabel !== 'function') return null;

  return helpers.cropPreparedLabel({
    analysis,
    labelBox,
    scale: analysis.scale,
    isBlueTextPixel: helpers.isBlueTextPixel
  });
};

const cropContrast = ({ analysis, labelBox, helpers }) => {
  if (typeof helpers?.cropContrastLabel !== 'function') return null;

  return helpers.cropContrastLabel({
    analysis,
    labelBox,
    scale: analysis.scale
  });
};

const buildPasses = ({ analysis, labelBox, largerLabelBox, helpers }) => [
  {
    passId: 'blue-single-line',
    labelBox,
    preparedLabel: cropPrepared({ analysis, labelBox, helpers })
  },
  {
    passId: 'larger-crop',
    labelBox: largerLabelBox || labelBox,
    preparedLabel: cropPrepared({ analysis, labelBox: largerLabelBox || labelBox, helpers })
  },
  {
    passId: 'contrast-crop',
    labelBox: largerLabelBox || labelBox,
    preparedLabel: cropContrast({ analysis, labelBox: largerLabelBox || labelBox, helpers })
  }
];

const candidateFromResult = ({ result, pass, photoBox, helpers }) => {
  const rawText = getRawText(result);
  const name =
    typeof helpers?.cleanOcrName === 'function' ? helpers.cleanOcrName(rawText) : fallbackCleanName(rawText);
  const ocrConfidence = getOcrConfidence(result, name);

  if (!name) return null;

  const candidate = {
    name,
    rawText,
    ocrConfidence,
    labelBox: pass.labelBox,
    photoBox,
    passId: pass.passId
  };

  return {
    ...candidate,
    score: scoreCandidate({ helpers, candidate })
  };
};

const isBetterCandidate = (candidate, bestCandidate) => {
  if (!bestCandidate) return true;
  if (candidate.score !== bestCandidate.score) return candidate.score > bestCandidate.score;
  return candidate.ocrConfidence > bestCandidate.ocrConfidence;
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
    .map((photoBox, index) => {
      const labelBox = getLabelBoxForPhoto(photoBox, bounds, helpers.validateAndClipCoordinates);
      return {
        index,
        photoBox,
        labelBox,
        largerLabelBox: labelBox ? expandBox(labelBox, bounds, helpers.validateAndClipCoordinates) : null
      };
    })
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
      const passes = buildPasses({
        analysis,
        labelBox: match.labelBox,
        largerLabelBox: match.largerLabelBox,
        helpers
      }).filter((pass) => pass.preparedLabel);

      let bestCandidate = null;

      for (const pass of passes) {
        const result = await runSingleLine({ worker, preparedLabel: pass.preparedLabel, helpers });
        const candidate = candidateFromResult({
          result,
          pass,
          photoBox: match.photoBox,
          helpers
        });

        if (candidate && isBetterCandidate(candidate, bestCandidate)) {
          bestCandidate = candidate;
        }
      }

      if (bestCandidate) {
        names.set(match.index, {
          name: bestCandidate.name,
          rawText: bestCandidate.rawText,
          ocrConfidence: bestCandidate.ocrConfidence,
          labelBox: bestCandidate.labelBox,
          labelMatchConfidence: scoreLabel({
            photoBox: match.photoBox,
            labelBox: bestCandidate.labelBox,
            helpers
          }),
          strategyId: METHOD_ID
        });
      }

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
