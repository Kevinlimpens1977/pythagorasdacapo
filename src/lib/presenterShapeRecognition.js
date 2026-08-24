// Vormherkenning voor Presenter: zet een losgelaten penstreek om in een net
// object (lijn, rechthoek, ellips, driehoek of veelhoek) zodra de meting daar
// duidelijk genoeg voor is. Puur rekenwerk op de puntenlijst — geen
// bibliotheek, geen modelbestand, geen netwerk.
//
// Uitgangspunt: liever niets doen dan de verkeerde vorm. Elke herkenning
// krijgt een zekerheidsscore; onder de drempel blijft de ruwe inkt staan.
//
// Bewust NIET herkend:
//   - markeerstift (`variant === 'highlighter'`): dat is een vlakke band;
//   - de lijnpen (`variant === 'geometry-pen'`): die is al recht;
//   - streken langs de tekenrand van een instrument en passerbogen: die zijn al
//     exact. Beide leveren maar twee punten (respectievelijk lopen ze buiten
//     `onStrokeComplete` om), en twee punten halen PRESENTER_SHAPE_MIN_POINTS
//     nooit.

const isFiniteNumber = (value) => Number.isFinite(value);
const isValidPoint = (point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y);
const round2 = (value) => Math.round(value * 100) / 100;
const clamp01 = (value) => Math.min(1, Math.max(0, value));

// Minder punten dan dit is geen vrije haal maar een gesnapte of gegenereerde
// streek; die laten we met rust.
export const PRESENTER_SHAPE_MIN_POINTS = 8;

// Kleiner dan dit (diagonaal van de omhullende rechthoek, in boardunits) is
// eerder een letter of een accent dan een vorm.
export const PRESENTER_SHAPE_MIN_SIZE = 48;

export const PRESENTER_SHAPE_MIN_CONFIDENCE = 0.62;

const RESAMPLE_COUNT = 64;

// Een gesloten vorm mag hooguit dit deel van zijn eigen diagonaal openstaan.
const CLOSURE_MAX_RATIO = 0.32;

// Rechte lijn: het pad mag hooguit 7% langer zijn dan de rechtstreekse afstand
// en nergens verder dan 6% van die afstand van de koorde afwijken.
const LINE_MAX_LENGTH_RATIO = 1.07;
const LINE_MAX_DEVIATION_RATIO = 0.06;

// Ellips: gemiddelde en maximale afwijking van de eenheidsstraal in het
// bbox-stelsel. Een vierkant haalt hier ~0.16 gemiddeld en 0.41 maximaal en
// valt er dus netjes buiten.
const ELLIPSE_MAX_MEAN_RESIDUAL = 0.12;
const ELLIPSE_MAX_PEAK_RESIDUAL = 0.3;

// Hoekdetectie: vereenvoudigingstolerantie en samenvoegafstand, allebei als
// deel van de diagonaal.
const CORNER_TOLERANCE_RATIO = 0.06;
const CORNER_MERGE_RATIO = 0.11;

// Rechthoek: alle hoeken binnen deze marge van 90 graden, en de vorm moet de
// omhullende rechthoek grotendeels vullen.
const RECTANGLE_ANGLE_TOLERANCE = 17;
const RECTANGLE_MIN_FILL = 0.76;
const RECTANGLE_MAX_TILT_DEGREES = 12;

const MAX_POLYGON_CORNERS = 8;

const getValidPoints = (points) => (Array.isArray(points) ? points : []).filter(isValidPoint);

const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

const getBounds = (points) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  points.forEach((point) => {
    if (point.x < minX) minX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.x > maxX) maxX = point.x;
    if (point.y > maxY) maxY = point.y;
  });

  const width = maxX - minX;
  const height = maxY - minY;

  return { minX, minY, maxX, maxY, width, height, diagonal: Math.hypot(width, height) };
};

const getPathLength = (points) => {
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    total += distance(points[index - 1], points[index]);
  }
  return total;
};

// Shoelace-oppervlakte van een (impliciet gesloten) polygoon.
const getPolygonArea = (points) => {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }
  return Math.abs(area) / 2;
};

const getCentroid = (points) => {
  const sum = points.reduce((total, point) => ({ x: total.x + point.x, y: total.y + point.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
};

// Afstand van een punt tot het SEGMENT a-b (niet tot de oneindige lijn).
const perpendicularDistance = (point, a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, a);

  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return Math.hypot(point.x - (a.x + t * dx), point.y - (a.y + t * dy));
};

// Punten op gelijke booglengte, zodat trage en snelle stukken even zwaar
// meetellen in alle metingen hieronder.
export const resampleStrokePoints = (points, count = RESAMPLE_COUNT) => {
  const validPoints = getValidPoints(points);
  if (validPoints.length === 0 || count < 2) return [];
  if (validPoints.length === 1) return new Array(count).fill(validPoints[0]);

  const total = getPathLength(validPoints);
  if (!(total > 0)) return new Array(count).fill(validPoints[0]);

  const interval = total / (count - 1);
  const working = validPoints.slice();
  const output = [working[0]];
  let accumulated = 0;

  for (let index = 1; index < working.length; index += 1) {
    const previous = working[index - 1];
    const current = working[index];
    const segment = distance(previous, current);

    if (accumulated + segment >= interval && segment > 0) {
      const ratio = (interval - accumulated) / segment;
      const inserted = {
        x: previous.x + ratio * (current.x - previous.x),
        y: previous.y + ratio * (current.y - previous.y)
      };
      output.push(inserted);
      working.splice(index, 0, inserted);
      accumulated = 0;
    } else {
      accumulated += segment;
    }
  }

  const last = validPoints[validPoints.length - 1];
  while (output.length < count) output.push(last);

  return output.slice(0, count);
};

// Douglas-Peucker: houdt alleen de punten over die de vorm echt bepalen.
export const simplifyPath = (points, tolerance) => {
  if (points.length < 3) return points.slice();

  let maxDistance = 0;
  let maxIndex = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const deviation = perpendicularDistance(points[index], points[0], points[points.length - 1]);
    if (deviation > maxDistance) {
      maxDistance = deviation;
      maxIndex = index;
    }
  }

  if (maxDistance <= tolerance) return [points[0], points[points.length - 1]];

  const left = simplifyPath(points.slice(0, maxIndex + 1), tolerance);
  const right = simplifyPath(points.slice(maxIndex), tolerance);
  return [...left.slice(0, -1), ...right];
};

const mergeCloseCorners = (corners, minSpacing) => {
  if (corners.length <= 3) return corners.slice();

  const merged = [];
  corners.forEach((corner) => {
    const previous = merged[merged.length - 1];
    if (previous && distance(previous, corner) < minSpacing) return;
    merged.push(corner);
  });

  while (merged.length > 3 && distance(merged[0], merged[merged.length - 1]) < minSpacing) {
    merged.pop();
  }

  return merged;
};

// Hoeken van een gesloten vorm. De naad (start = eind) ligt bij een handmatige
// haal vrijwel nooit op een hoek, dus draaien we de reeks eerst naar het punt
// dat het verst van het zwaartepunt ligt: dat IS bijna altijd een hoek.
export const getClosedShapeCorners = (points, tolerance) => {
  if (points.length < 4) return points.slice();

  const centroid = getCentroid(points);
  let startIndex = 0;
  let maxRadius = -Infinity;
  points.forEach((point, index) => {
    const radius = distance(point, centroid);
    if (radius > maxRadius) {
      maxRadius = radius;
      startIndex = index;
    }
  });

  const rotated = [...points.slice(startIndex), ...points.slice(0, startIndex), points[startIndex]];
  const simplified = simplifyPath(rotated, tolerance);
  const corners = simplified.slice(0, -1);

  return mergeCloseCorners(corners, tolerance * (CORNER_MERGE_RATIO / CORNER_TOLERANCE_RATIO));
};

export const getCornerAngles = (corners) =>
  corners.map((corner, index) => {
    const previous = corners[(index - 1 + corners.length) % corners.length];
    const next = corners[(index + 1) % corners.length];
    const angleToPrevious = Math.atan2(previous.y - corner.y, previous.x - corner.x);
    const angleToNext = Math.atan2(next.y - corner.y, next.x - corner.x);
    let difference = Math.abs(angleToPrevious - angleToNext);
    if (difference > Math.PI) difference = 2 * Math.PI - difference;
    return (difference * 180) / Math.PI;
  });

// Gemiddelde afstand van de gemeten punten tot de dichtstbijzijnde zijde van de
// kandidaat-veelhoek: de maat voor "past deze vorm echt op wat er getekend is".
const getPolygonFitError = (points, corners) => {
  if (corners.length < 2) return Infinity;

  const total = points.reduce((sum, point) => {
    let best = Infinity;
    for (let index = 0; index < corners.length; index += 1) {
      const a = corners[index];
      const b = corners[(index + 1) % corners.length];
      const deviation = perpendicularDistance(point, a, b);
      if (deviation < best) best = deviation;
    }
    return sum + best;
  }, 0);

  return total / points.length;
};

const getEllipseResiduals = (points, bounds) => {
  const rx = bounds.width / 2;
  const ry = bounds.height / 2;
  if (!(rx > 0) || !(ry > 0)) return null;

  const cx = bounds.minX + rx;
  const cy = bounds.minY + ry;
  let sum = 0;
  let peak = 0;

  points.forEach((point) => {
    const nx = (point.x - cx) / rx;
    const ny = (point.y - cy) / ry;
    const residual = Math.abs(Math.hypot(nx, ny) - 1);
    sum += residual;
    if (residual > peak) peak = residual;
  });

  return { mean: sum / points.length, peak };
};

const getTiltDegrees = (a, b) => {
  const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  const folded = Math.abs(((angle % 90) + 90) % 90);
  return Math.min(folded, 90 - folded);
};

const buildLineShape = (start, end, confidence) => ({
  type: 'line',
  x: round2(start.x),
  y: round2(start.y),
  width: round2(end.x - start.x),
  height: round2(end.y - start.y),
  rotation: 0,
  confidence: round2(confidence)
});

const buildBoxShape = (type, bounds, confidence) => ({
  type,
  x: round2(bounds.minX),
  y: round2(bounds.minY),
  width: round2(bounds.width),
  height: round2(bounds.height),
  rotation: 0,
  confidence: round2(confidence)
});

const buildPolygonShape = (type, corners, bounds, confidence) => ({
  type,
  x: round2(bounds.minX),
  y: round2(bounds.minY),
  width: round2(bounds.width),
  height: round2(bounds.height),
  rotation: 0,
  points: corners.map((corner) => ({
    x: round2(corner.x - bounds.minX),
    y: round2(corner.y - bounds.minY)
  })),
  confidence: round2(confidence)
});

// Een driehoek met een vrijwel horizontale basis en de top ongeveer boven het
// midden past exact op het bestaande `triangle`-object, dat netjes meeschaalt.
// Alle andere driehoeken blijven veelhoek, zodat de getekende vorm klopt.
const looksLikeIsoscelesTriangle = (corners, bounds) => {
  if (!(bounds.width > 0) || !(bounds.height > 0)) return false;

  const sorted = [...corners].sort((a, b) => a.y - b.y);
  const apex = sorted[0];
  const base = [sorted[1], sorted[2]];
  const baseHeightSpread = Math.abs(base[0].y - base[1].y) / bounds.height;
  if (baseHeightSpread > 0.16) return false;

  const apexAtBottom = Math.abs(apex.y - bounds.minY) / bounds.height;
  if (apexAtBottom > 0.14) return false;

  const apexOffset = Math.abs(apex.x - (bounds.minX + bounds.width / 2)) / bounds.width;
  return apexOffset <= 0.16;
};

export const canRecognizePresenterStroke = (stroke) => {
  if (!stroke) return false;

  const variant = stroke.variant || 'pen';
  if (variant !== 'pen') return false;

  return getValidPoints(stroke.points).length >= PRESENTER_SHAPE_MIN_POINTS;
};

export const recognizePresenterShape = (stroke, { minConfidence = PRESENTER_SHAPE_MIN_CONFIDENCE } = {}) => {
  if (!canRecognizePresenterStroke(stroke)) return null;

  const points = getValidPoints(stroke.points);
  const bounds = getBounds(points);
  if (!(bounds.diagonal >= PRESENTER_SHAPE_MIN_SIZE)) return null;

  const total = getPathLength(points);
  if (!(total > 0)) return null;

  const first = points[0];
  const last = points[points.length - 1];
  const gap = distance(first, last);

  // 1. Rechte lijn: kort pad ten opzichte van de koorde en nauwelijks afwijking.
  if (gap >= PRESENTER_SHAPE_MIN_SIZE * 0.75 && total / gap <= LINE_MAX_LENGTH_RATIO) {
    const deviation = points.reduce(
      (max, point) => Math.max(max, perpendicularDistance(point, first, last)),
      0
    );

    if (deviation <= LINE_MAX_DEVIATION_RATIO * gap) {
      const confidence = clamp01(1 - deviation / (LINE_MAX_DEVIATION_RATIO * gap) * 0.5 - (total / gap - 1) * 4);
      if (confidence >= minConfidence) return buildLineShape(first, last, confidence);
    }
    return null;
  }

  // 2. Alles hierna moet een gesloten vorm zijn. Een open krul laten we met rust.
  if (gap / bounds.diagonal > CLOSURE_MAX_RATIO) return null;

  const resampled = resampleStrokePoints(points, RESAMPLE_COUNT);
  if (resampled.length < 8) return null;

  const resampledBounds = getBounds(resampled);

  // 3. Ellips: past elk punt op de eenheidscirkel van het bbox-stelsel?
  const residuals = getEllipseResiduals(resampled, resampledBounds);
  if (
    residuals &&
    residuals.mean <= ELLIPSE_MAX_MEAN_RESIDUAL &&
    residuals.peak <= ELLIPSE_MAX_PEAK_RESIDUAL
  ) {
    const confidence = clamp01(1 - residuals.mean / ELLIPSE_MAX_MEAN_RESIDUAL * 0.55);
    if (confidence >= minConfidence) return buildBoxShape('ellipse', resampledBounds, confidence);
  }

  // 4. Hoekige vormen.
  const corners = getClosedShapeCorners(resampled, CORNER_TOLERANCE_RATIO * resampledBounds.diagonal);
  if (corners.length < 3 || corners.length > MAX_POLYGON_CORNERS) return null;

  const fitError = getPolygonFitError(resampled, corners);
  const confidence = clamp01(1 - fitError / (0.055 * resampledBounds.diagonal));
  if (confidence < minConfidence) return null;

  const cornerBounds = getBounds(corners);

  if (corners.length === 4) {
    const angles = getCornerAngles(corners);
    const squareEnough = angles.every((angle) => Math.abs(angle - 90) <= RECTANGLE_ANGLE_TOLERANCE);
    const fill = cornerBounds.width * cornerBounds.height > 0
      ? getPolygonArea(corners) / (cornerBounds.width * cornerBounds.height)
      : 0;
    const tilt = Math.max(
      getTiltDegrees(corners[0], corners[1]),
      getTiltDegrees(corners[1], corners[2])
    );

    if (squareEnough && fill >= RECTANGLE_MIN_FILL && tilt <= RECTANGLE_MAX_TILT_DEGREES) {
      return buildBoxShape('rectangle', cornerBounds, confidence);
    }
  }

  if (corners.length === 3 && looksLikeIsoscelesTriangle(corners, cornerBounds)) {
    return buildBoxShape('triangle', cornerBounds, confidence);
  }

  return buildPolygonShape('polygon', corners, cornerBounds, confidence);
};
