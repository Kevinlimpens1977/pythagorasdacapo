export const METHOD_ID = 'method2-row-band';
export const METHOD_LABEL = '2. Rijband OCR';

const DEFAULT_SCALE = 1;
const MIN_ROW_SIZE = 1;
const MIN_NAME_LENGTH = 3;
const MIN_MATCH_CONFIDENCE = 0.22;
const ROW_CLUSTER_FACTOR = 0.55;
const BAND_HEIGHT_FACTOR = 0.34;
const BAND_SIDE_PADDING_FACTOR = 0.18;
const BAND_TOP_PADDING_FACTOR = 0.16;
const BAND_BOTTOM_GAP = 4;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const centerX = (box) => box.x + box.width / 2;
const centerY = (box) => box.y + box.height / 2;

const median = (values, fallback = 0) => {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return fallback;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const getAnalysisBounds = (analysis = {}) => ({
  width: analysis.originalWidth || analysis.canvas?.width || analysis.width || 1,
  height: analysis.originalHeight || analysis.canvas?.height || analysis.height || 1
});

const getCanvasBounds = (analysis = {}) => ({
  width: analysis.canvas?.width || analysis.width || analysis.originalWidth || 1,
  height: analysis.canvas?.height || analysis.height || analysis.originalHeight || 1
});

const clipBox = (box, bounds, validateAndClipCoordinates) => {
  if (!box || box.width <= 0 || box.height <= 0) return null;

  if (typeof validateAndClipCoordinates === 'function') {
    try {
      const clipped = validateAndClipCoordinates(box, bounds);
      if (clipped) return clipped;
    } catch {
      try {
        const clipped = validateAndClipCoordinates(box, bounds.width, bounds.height);
        if (clipped) return clipped;
      } catch {
        // Fall through to local clipping.
      }
    }
  }

  const x = clamp(Math.round(box.x), 0, bounds.width);
  const y = clamp(Math.round(box.y), 0, bounds.height);
  const right = clamp(Math.round(box.x + box.width), 0, bounds.width);
  const bottom = clamp(Math.round(box.y + box.height), 0, bounds.height);
  if (right <= x || bottom <= y) return null;
  return { x, y, width: right - x, height: bottom - y };
};

const convertToCanvasBox = (box, analysis, helpers = {}) => {
  if (typeof helpers.toCanvasBox === 'function') {
    const converted = helpers.toCanvasBox(box, analysis);
    if (converted) return converted;
  }

  const scale = analysis?.scale || DEFAULT_SCALE;
  return {
    x: box.x * scale,
    y: box.y * scale,
    width: box.width * scale,
    height: box.height * scale
  };
};

const convertFromCanvasBox = (box, analysis, helpers = {}) => {
  const scale = analysis?.scale || DEFAULT_SCALE;
  const originalBounds = getAnalysisBounds(analysis);
  return clipBox(
    {
      x: box.x / scale,
      y: box.y / scale,
      width: box.width / scale,
      height: box.height / scale
    },
    originalBounds,
    helpers.validateAndClipCoordinates
  );
};

const clusterPhotoRows = (photoBoxes, analysis, helpers = {}) => {
  const items = photoBoxes
    .map((photoBox, index) => ({
      index,
      photoBox,
      canvasBox: convertToCanvasBox(photoBox, analysis, helpers)
    }))
    .filter((item) => item.canvasBox?.width > 0 && item.canvasBox?.height > 0)
    .sort((a, b) => centerY(a.canvasBox) - centerY(b.canvasBox) || centerX(a.canvasBox) - centerX(b.canvasBox));

  const medianHeight = median(items.map((item) => item.canvasBox.height), 80);
  const rowTolerance = Math.max(18, medianHeight * ROW_CLUSTER_FACTOR);
  const rows = [];

  for (const item of items) {
    const itemCenterY = centerY(item.canvasBox);
    const row = rows.find((candidate) => Math.abs(candidate.centerY - itemCenterY) <= rowTolerance);

    if (row) {
      row.items.push(item);
      row.centerY =
        row.items.reduce((total, rowItem) => total + centerY(rowItem.canvasBox), 0) / row.items.length;
    } else {
      rows.push({ centerY: itemCenterY, items: [item] });
    }
  }

  return rows
    .filter((row) => row.items.length >= MIN_ROW_SIZE)
    .map((row) => ({
      ...row,
      items: row.items.sort((a, b) => centerX(a.canvasBox) - centerX(b.canvasBox))
    }))
    .sort((a, b) => a.centerY - b.centerY);
};

const buildRowBand = (row, analysis, helpers = {}) => {
  const canvasBounds = getCanvasBounds(analysis);
  const left = Math.min(...row.items.map((item) => item.canvasBox.x));
  const right = Math.max(...row.items.map((item) => item.canvasBox.x + item.canvasBox.width));
  const top = Math.min(...row.items.map((item) => item.canvasBox.y));
  const medianWidth = median(row.items.map((item) => item.canvasBox.width), 80);
  const medianHeight = median(row.items.map((item) => item.canvasBox.height), 100);
  const sidePadding = Math.max(16, medianWidth * BAND_SIDE_PADDING_FACTOR);
  const bandHeight = clamp(medianHeight * BAND_HEIGHT_FACTOR, 28, Math.max(42, medianHeight * 0.62));
  const topPadding = Math.max(8, medianHeight * BAND_TOP_PADDING_FACTOR);

  const canvasBand = clipBox(
    {
      x: left - sidePadding,
      y: top - bandHeight - topPadding,
      width: right - left + sidePadding * 2,
      height: bandHeight + topPadding - BAND_BOTTOM_GAP
    },
    canvasBounds
  );

  if (!canvasBand) return null;
  const labelBox = convertFromCanvasBox(canvasBand, analysis, helpers);
  if (!labelBox) return null;
  return { canvasBand, labelBox };
};

const getOcrTextItems = (result) => {
  const data = result?.data || result || {};
  const words = Array.isArray(data.words) ? data.words : [];
  const lines = Array.isArray(data.lines) ? data.lines : [];
  const source = words.length ? words : lines;

  return source
    .map((item) => ({
      text: item.text || '',
      confidence: Number(item.confidence || item.conf || data.confidence || 0),
      bbox: item.bbox || item.boundingBox || item.box || null
    }))
    .filter((item) => item.text && item.bbox);
};

const normalizeBbox = (bbox) => {
  if (!bbox) return null;
  if (Number.isFinite(bbox.x0) && Number.isFinite(bbox.y0) && Number.isFinite(bbox.x1) && Number.isFinite(bbox.y1)) {
    return {
      x: bbox.x0,
      y: bbox.y0,
      width: bbox.x1 - bbox.x0,
      height: bbox.y1 - bbox.y0
    };
  }
  if (Number.isFinite(bbox.x) && Number.isFinite(bbox.y) && Number.isFinite(bbox.width) && Number.isFinite(bbox.height)) {
    return bbox;
  }
  if (Number.isFinite(bbox.left) && Number.isFinite(bbox.top) && Number.isFinite(bbox.width) && Number.isFinite(bbox.height)) {
    return {
      x: bbox.left,
      y: bbox.top,
      width: bbox.width,
      height: bbox.height
    };
  }
  return null;
};

const groupItemsIntoNameCandidates = (items, band) => {
  const normalized = items
    .map((item) => {
      const box = normalizeBbox(item.bbox);
      if (!box || box.width <= 0 || box.height <= 0) return null;
      return {
        ...item,
        box: {
          x: band.canvasBand.x + box.x,
          y: band.canvasBand.y + box.y,
          width: box.width,
          height: box.height
        }
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.box.y - b.box.y || a.box.x - b.box.x);

  if (!normalized.length) return [];

  const medianHeight = median(normalized.map((item) => item.box.height), 12);
  const lineTolerance = Math.max(8, medianHeight * 0.75);
  const lines = [];

  for (const item of normalized) {
    const itemCenterY = centerY(item.box);
    const line = lines.find((candidate) => Math.abs(candidate.centerY - itemCenterY) <= lineTolerance);
    if (line) {
      line.items.push(item);
      line.centerY = line.items.reduce((total, lineItem) => total + centerY(lineItem.box), 0) / line.items.length;
    } else {
      lines.push({ centerY: itemCenterY, items: [item] });
    }
  }

  return lines.flatMap((line) => {
    const sorted = line.items.sort((a, b) => a.box.x - b.box.x);
    const gapLimit = Math.max(22, median(sorted.map((item) => item.box.width), 28) * 1.45);
    const groups = [];

    for (const item of sorted) {
      const previousGroup = groups[groups.length - 1];
      const previousItem = previousGroup?.items[previousGroup.items.length - 1];
      const gap = previousItem ? item.box.x - (previousItem.box.x + previousItem.box.width) : 0;

      if (!previousGroup || gap > gapLimit) {
        groups.push({ items: [item] });
      } else {
        previousGroup.items.push(item);
      }
    }

    return groups.map((group) => {
      const rawText = group.items.map((item) => item.text).join(' ');
      const left = Math.min(...group.items.map((item) => item.box.x));
      const top = Math.min(...group.items.map((item) => item.box.y));
      const right = Math.max(...group.items.map((item) => item.box.x + item.box.width));
      const bottom = Math.max(...group.items.map((item) => item.box.y + item.box.height));
      const confidence =
        group.items.reduce((total, item) => total + Number(item.confidence || 0), 0) / Math.max(1, group.items.length);

      return {
        rawText,
        confidence,
        canvasBox: { x: left, y: top, width: right - left, height: bottom - top }
      };
    });
  });
};

const cleanName = (value, helpers = {}) => {
  if (typeof helpers.cleanOcrName === 'function') return helpers.cleanOcrName(value);

  return (
    String(value || '')
      .split('\n')
      .map((line) => line.replace(/[^A-Za-z\u00C0-\u017F' .-]/g, ' ').replace(/\s+/g, ' ').trim())
      .filter((line) => line.length >= MIN_NAME_LENGTH && /[A-Za-z\u00C0-\u017F]/.test(line))
      .sort((a, b) => b.length - a.length)[0] || ''
  );
};

const scoreCandidateForPhoto = (candidate, item, band, analysis, helpers = {}) => {
  const candidateLabelBox = convertFromCanvasBox(candidate.canvasBox, analysis, helpers) || band.labelBox;

  if (typeof helpers.scoreLabelForPhoto === 'function') {
    const score = helpers.scoreLabelForPhoto(candidateLabelBox, item.photoBox, {
      rowBand: band.labelBox,
      strategyId: METHOD_ID
    });
    if (Number.isFinite(score)) return { score, candidateLabelBox };
    if (Number.isFinite(score?.score)) return { score: score.score, candidateLabelBox };
    if (Number.isFinite(score?.confidence)) return { score: score.confidence, candidateLabelBox };
  }

  const photoCenter = centerX(item.canvasBox);
  const labelCenter = centerX(candidate.canvasBox);
  const centerDistance = Math.abs(photoCenter - labelCenter);
  const distanceScore = Math.max(0, 1 - centerDistance / Math.max(item.canvasBox.width, candidate.canvasBox.width, 1));
  const overlap =
    Math.max(
      0,
      Math.min(item.canvasBox.x + item.canvasBox.width, candidate.canvasBox.x + candidate.canvasBox.width) -
        Math.max(item.canvasBox.x, candidate.canvasBox.x)
    ) / Math.max(1, Math.min(item.canvasBox.width, candidate.canvasBox.width));

  return {
    score: Number((distanceScore * 0.72 + overlap * 0.28).toFixed(3)),
    candidateLabelBox
  };
};

const runRowBandOcr = async ({ analysis, band, helpers = {}, onProgress }) => {
  if (typeof helpers.runSparseOcr !== 'function') {
    throw new Error('runSparseOcr helper ontbreekt voor rijband-OCR.');
  }

  const payload = {
    analysis,
    box: band.labelBox,
    canvasBox: band.canvasBand,
    psm: 'SPARSE_TEXT',
    preferredPsm: 'SPARSE_TEXT',
    fallbackPsm: 'AUTO',
    onProgress
  };

  return helpers.runSparseOcr(payload);
};

export async function recognizeNames({ analysis, photoBoxes, helpers = {}, onProgress } = {}) {
  if (!analysis || !Array.isArray(photoBoxes) || !photoBoxes.length) return new Map();

  const rows = clusterPhotoRows(photoBoxes, analysis, helpers);
  const names = new Map();

  for (const [rowIndex, row] of rows.entries()) {
    const band = buildRowBand(row, analysis, helpers);
    if (!band) continue;

    onProgress?.({
      phase: 'ocr',
      strategyId: METHOD_ID,
      row: rowIndex + 1,
      rows: rows.length,
      percent: Math.round((rowIndex / Math.max(1, rows.length)) * 100)
    });

    let result;
    try {
      result = await runRowBandOcr({
        analysis,
        band,
        helpers,
        onProgress: (progress) =>
          onProgress?.({
            phase: 'ocr',
            strategyId: METHOD_ID,
            row: rowIndex + 1,
            rows: rows.length,
            percent: Math.round(((rowIndex + Number(progress || 0) / 100) / Math.max(1, rows.length)) * 100)
          })
      });
    } catch (error) {
      console.warn(`${METHOD_LABEL} mislukt voor rij ${rowIndex + 1}:`, error);
      continue;
    }

    const candidates = groupItemsIntoNameCandidates(getOcrTextItems(result), band)
      .map((candidate) => ({
        ...candidate,
        name: cleanName(candidate.rawText, helpers)
      }))
      .filter((candidate) => candidate.name);

    const usedCandidates = new Set();
    for (const item of row.items) {
      const best = candidates
        .map((candidate, candidateIndex) => {
          if (usedCandidates.has(candidateIndex)) return null;
          const scored = scoreCandidateForPhoto(candidate, item, band, analysis, helpers);
          return { ...candidate, candidateIndex, ...scored };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)[0];

      if (!best || best.score < MIN_MATCH_CONFIDENCE) continue;
      usedCandidates.add(best.candidateIndex);

      names.set(item.index, {
        name: best.name,
        rawText: best.rawText,
        ocrConfidence: Number(best.confidence || 0),
        labelBox: best.candidateLabelBox || band.labelBox,
        labelMatchConfidence: Number(best.score.toFixed(3)),
        strategyId: METHOD_ID
      });
    }
  }

  onProgress?.({ phase: 'ocr', strategyId: METHOD_ID, percent: 100 });
  return names;
}
