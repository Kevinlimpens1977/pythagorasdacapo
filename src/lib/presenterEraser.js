// Gumlogica voor Presenter: bepaalt welke pen-/markeerstiftstreken geraakt
// worden door een gumbeweging (borstelcirkel die van `from` naar `to` beweegt).
// Objecten worden bewust nooit door de gum verwijderd; die gaan via selectie.

export const PRESENTER_ERASER_SIZES = [
  { id: 'small', label: 'Klein', radius: 14 },
  { id: 'medium', label: 'Middel', radius: 30 },
  { id: 'large', label: 'Groot', radius: 56 }
];

export const DEFAULT_PRESENTER_ERASER_SIZE = 'medium';

export const getPresenterEraserRadius = (sizeId) =>
  (PRESENTER_ERASER_SIZES.find((size) => size.id === sizeId) ||
    PRESENTER_ERASER_SIZES.find((size) => size.id === DEFAULT_PRESENTER_ERASER_SIZE)).radius;

const isFiniteNumber = (value) => Number.isFinite(value);

const isValidPoint = (point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y);

// Kleinste afstand tussen twee lijnsegmenten (of punten wanneer een segment
// gedegenereerd is). Voldoende nauwkeurig voor gum-hittests op boardunits.
const distancePointToSegment = (point, a, b) => {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const lengthSquared = abx * abx + aby * aby;
  if (lengthSquared === 0) return Math.hypot(point.x - a.x, point.y - a.y);

  const t = Math.max(0, Math.min(1, ((point.x - a.x) * abx + (point.y - a.y) * aby) / lengthSquared));
  const projX = a.x + t * abx;
  const projY = a.y + t * aby;
  return Math.hypot(point.x - projX, point.y - projY);
};

const segmentsIntersect = (a1, a2, b1, b2) => {
  const orientation = (p, q, r) => {
    const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (value === 0) return 0;
    return value > 0 ? 1 : 2;
  };

  const onSegment = (p, q, r) =>
    q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);

  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a1, b1, a2)) return true;
  if (o2 === 0 && onSegment(a1, b2, a2)) return true;
  if (o3 === 0 && onSegment(b1, a1, b2)) return true;
  if (o4 === 0 && onSegment(b1, a2, b2)) return true;
  return false;
};

const distanceSegmentToSegment = (a1, a2, b1, b2) => {
  if (segmentsIntersect(a1, a2, b1, b2)) return 0;

  return Math.min(
    distancePointToSegment(a1, b1, b2),
    distancePointToSegment(a2, b1, b2),
    distancePointToSegment(b1, a1, a2),
    distancePointToSegment(b2, a1, a2)
  );
};

const strokeIsHit = (stroke, eraserFrom, eraserTo, radius) => {
  const points = (Array.isArray(stroke?.points) ? stroke.points : []).filter(isValidPoint);
  if (points.length === 0) return false;

  const strokeHalfWidth = (isFiniteNumber(stroke?.width) && stroke.width > 0 ? stroke.width : 5) / 2;
  const hitDistance = radius + strokeHalfWidth;

  if (points.length === 1) {
    return distancePointToSegment(points[0], eraserFrom, eraserTo) <= hitDistance;
  }

  for (let index = 0; index < points.length - 1; index += 1) {
    if (distanceSegmentToSegment(points[index], points[index + 1], eraserFrom, eraserTo) <= hitDistance) {
      return true;
    }
  }

  return false;
};

// Precisie-gum: wist alleen het geraakte stukje van een streek. Punten binnen
// de borstel verdwijnen; de overgebleven stukken gaan verder als losse strokes.
// Lange rechte segmenten worden eerst verdicht, zodat je ook midden in een
// rechte lijn een gat kunt gummen.

const MAX_SEGMENT_SPACING = 14;

let splitIdCounter = 0;
const createSplitStrokeId = (baseId) =>
  `${baseId}-s${(splitIdCounter += 1).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const interpolatePoint = (a, b, t) => {
  const point = {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t
  };
  if (isFiniteNumber(a.p) && isFiniteNumber(b.p)) {
    point.p = Math.round((a.p + (b.p - a.p) * t) * 100) / 100;
  }
  return point;
};

const densifyPoints = (points, maxSpacing) => {
  if (points.length < 2) return points;

  const dense = [points[0]];
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const distance = Math.hypot(current.x - previous.x, current.y - previous.y);
    const steps = Math.ceil(distance / maxSpacing);

    for (let step = 1; step < steps; step += 1) {
      dense.push(interpolatePoint(previous, current, step / steps));
    }
    dense.push(current);
  }

  return dense;
};

export const erasePartialStrokes = (strokes, { from, to, radius }) => {
  const eraserFrom = isValidPoint(from) ? from : null;
  const eraserTo = isValidPoint(to) ? to : eraserFrom;
  const sourceStrokes = Array.isArray(strokes) ? strokes : [];
  if (!eraserFrom || !eraserTo) return { changed: false, strokes: sourceStrokes };

  const safeRadius = isFiniteNumber(radius) && radius > 0 ? radius : getPresenterEraserRadius();
  let changed = false;
  const nextStrokes = [];

  for (const stroke of sourceStrokes) {
    if (!strokeIsHit(stroke, eraserFrom, eraserTo, safeRadius)) {
      nextStrokes.push(stroke);
      continue;
    }

    const validPoints = (Array.isArray(stroke?.points) ? stroke.points : []).filter(isValidPoint);
    const strokeHalfWidth = (isFiniteNumber(stroke?.width) && stroke.width > 0 ? stroke.width : 5) / 2;
    const hitDistance = safeRadius + strokeHalfWidth;
    const densePoints = densifyPoints(validPoints, MAX_SEGMENT_SPACING);

    const survivingRuns = [];
    let currentRun = [];
    for (const point of densePoints) {
      if (distancePointToSegment(point, eraserFrom, eraserTo) <= hitDistance) {
        if (currentRun.length > 0) survivingRuns.push(currentRun);
        currentRun = [];
      } else {
        currentRun.push(point);
      }
    }
    if (currentRun.length > 0) survivingRuns.push(currentRun);

    // Stukken van 1 punt zijn gumresten; die laten we vervallen.
    const keptRuns = survivingRuns.filter((run, index) =>
      run.length >= 2 || (validPoints.length === 1 && index === 0)
    );

    changed = true;
    keptRuns.forEach((run, index) => {
      nextStrokes.push({
        ...stroke,
        id: index === 0 ? stroke.id : createSplitStrokeId(stroke.id),
        points: run
      });
    });
  }

  return changed ? { changed, strokes: nextStrokes } : { changed: false, strokes: sourceStrokes };
};

export const findStrokeIdsHitByEraser = (strokes, { from, to, radius }) => {
  const eraserFrom = isValidPoint(from) ? from : null;
  const eraserTo = isValidPoint(to) ? to : eraserFrom;
  if (!eraserFrom || !eraserTo) return [];

  const safeRadius = isFiniteNumber(radius) && radius > 0 ? radius : getPresenterEraserRadius();

  return (Array.isArray(strokes) ? strokes : [])
    .filter((stroke) => typeof stroke?.id === 'string' && stroke.id.length > 0)
    .filter((stroke) => strokeIsHit(stroke, eraserFrom, eraserTo, safeRadius))
    .map((stroke) => stroke.id);
};
