// Passerlogica voor Presenter: een echte passer met een naald (middelpunt) en
// een potloodbeen. Het potlood tekent bogen als inkt-strokes, zodat passerwerk
// gumbaar en undo-baar is net als gewone penstreken.

export const COMPASS_MIN_RADIUS = 40;
export const COMPASS_MAX_RADIUS = 1200;
export const DEFAULT_COMPASS_RADIUS = 200;
export const DEFAULT_COMPASS_ANGLE = -35;

const isFiniteNumber = (value) => Number.isFinite(value);
const round2 = (value) => Math.round(value * 100) / 100;
const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const clampCompassRadius = (radius) =>
  Math.max(COMPASS_MIN_RADIUS, Math.min(COMPASS_MAX_RADIUS, isFiniteNumber(radius) ? radius : DEFAULT_COMPASS_RADIUS));

// Zachte snap op halve en hele ruitjes, zodat "precies 2 ruitjes" haalbaar is
// zonder vrije stralen te blokkeren.
export const snapCompassRadius = (radius, gridSize = 96, { threshold = 8 } = {}) => {
  const safeRadius = clampCompassRadius(radius);
  if (!isFiniteNumber(gridSize) || gridSize <= 0) return safeRadius;

  const step = gridSize / 2;
  const nearest = Math.round(safeRadius / step) * step;
  if (Math.abs(safeRadius - nearest) <= threshold && nearest >= COMPASS_MIN_RADIUS) {
    return nearest;
  }

  return safeRadius;
};

export const getCompassPencilPoint = ({ x, y, radius, angle }) => ({
  x: round2(x + Math.cos(toRadians(angle)) * radius),
  y: round2(y + Math.sin(toRadians(angle)) * radius)
});

// Hoek (graden) van het middelpunt naar een punt, in schermcoordinaten.
export const getCompassPointerAngle = (center, point) =>
  (Math.atan2(point.y - center.y, point.x - center.x) * 180) / Math.PI;

// Sweep-opbouw tijdens het trekken van een boog: telkens de kortste hoekstap
// bij de vorige hoek optellen, geklemd op een volledige cirkel.
export const advanceCompassSweep = (previousAngle, sweep, nextAngle) => {
  const delta = ((nextAngle - previousAngle + 540) % 360) - 180;
  const nextSweep = Math.max(-360, Math.min(360, (isFiniteNumber(sweep) ? sweep : 0) + delta));

  return { angle: nextAngle, sweep: nextSweep };
};

// Boogpunten voor een inkt-stroke; segmentlengte ~10 units zodat de boog ook
// na gummen/splitsen soepel blijft.
export const buildCompassArcPoints = ({ cx, cy, radius, startAngle, sweep }, { maxSpacing = 10 } = {}) => {
  if (!isFiniteNumber(cx) || !isFiniteNumber(cy)) return [];

  const safeRadius = clampCompassRadius(radius);
  const safeSweep = Math.max(-360, Math.min(360, isFiniteNumber(sweep) ? sweep : 0));
  if (Math.abs(safeSweep) < 1) return [];

  const arcLength = (Math.abs(safeSweep) / 360) * 2 * Math.PI * safeRadius;
  const segments = Math.max(12, Math.min(720, Math.ceil(arcLength / maxSpacing)));

  const points = [];
  for (let index = 0; index <= segments; index += 1) {
    const angle = toRadians(startAngle + (safeSweep * index) / segments);
    points.push({
      x: round2(cx + Math.cos(angle) * safeRadius),
      y: round2(cy + Math.sin(angle) * safeRadius)
    });
  }

  return points;
};

export const buildCompassCirclePoints = (compass, options) =>
  buildCompassArcPoints({ ...compass, cx: compass.cx ?? compass.x, cy: compass.cy ?? compass.y, startAngle: compass.angle ?? 0, sweep: 360 }, options);

export const formatCompassRadius = (radius, gridSize = 96) => {
  const safeRadius = clampCompassRadius(radius);
  if (!isFiniteNumber(gridSize) || gridSize <= 0) return `r = ${Math.round(safeRadius)}`;

  const units = Math.round((safeRadius / gridSize) * 10) / 10;
  return `r = ${String(units).replace('.', ',')} ${units === 1 ? 'ruitje' : 'ruitjes'}`;
};
