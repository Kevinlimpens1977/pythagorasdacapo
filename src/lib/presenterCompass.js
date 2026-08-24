// Passerlogica voor Presenter: een echte passer met een naald (middelpunt) en
// een potloodbeen. Het potlood tekent bogen als inkt-strokes, zodat passerwerk
// gumbaar en undo-baar is net als gewone penstreken.

export const COMPASS_MIN_RADIUS = 40;
export const COMPASS_MAX_RADIUS = 1200;
export const DEFAULT_COMPASS_RADIUS = 200;
export const DEFAULT_COMPASS_ANGLE = -35;

// Beenlengte van de passer bij maat 1. Het scharnier ligt zo hoog als een echt
// scharnier: sqrt(been^2 - (straal/2)^2) boven het midden tussen naald en
// potlood. Daardoor steekt de passer flink boven het middelpunt uit, en daar
// moet de plaatsing rekening mee houden.
export const COMPASS_LEG_LENGTH = 300;
// Lokale maten van de kop (bij partScale 1), gemeten vanaf het scharnier langs
// de kop-as: de behuizing loopt van -16 tot 76, de draaiknop zit op 100 met een
// straal van 26, dus het uiteinde ligt op 126. Zijwaarts is de kop 32 breed.
export const COMPASS_HEAD_END = 126;
export const COMPASS_HEAD_KNOB = 100;
export const COMPASS_HEAD_HALF_WIDTH = 32;

const isFiniteNumber = (value) => Number.isFinite(value);
const round2 = (value) => Math.round(value * 100) / 100;
const toRadians = (degrees) => (degrees * Math.PI) / 180;
const clampNumber = (value, min, max) => (max < min ? min : Math.min(Math.max(value, min), max));

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

// De volledige meetkunde van de passer als pure functie: naald, potlood,
// scharnier, kop en draaiknop. PresenterInstrumentOverlay tekent hiermee en de
// plaatsingslogica rekent er de bounding box mee uit, zodat het getekende
// instrument en de berekende omvang nooit uit elkaar kunnen lopen.
export const getCompassGeometry = ({ x, y, radius, angle, sizeScale = 1 } = {}) => {
  const needle = { x: isFiniteNumber(x) ? x : 0, y: isFiniteNumber(y) ? y : 0 };
  const safeRadius = clampCompassRadius(radius);
  const safeAngle = isFiniteNumber(angle) ? angle : DEFAULT_COMPASS_ANGLE;
  const size = clampNumber(isFiniteNumber(sizeScale) ? sizeScale : 1, 0.35, 2);

  const pencil = getCompassPencilPoint({ x: needle.x, y: needle.y, radius: safeRadius, angle: safeAngle });
  const mid = { x: (needle.x + pencil.x) / 2, y: (needle.y + pencil.y) / 2 };

  const legLength = Math.max(safeRadius * 0.72, COMPASS_LEG_LENGTH * size);
  const halfSpan = safeRadius / 2;
  const hingeHeight = Math.sqrt(Math.max(legLength * legLength - halfSpan * halfSpan, 3600 * size * size));

  const direction = { x: (pencil.x - needle.x) / safeRadius, y: (pencil.y - needle.y) / safeRadius };
  // Het scharnier hoort altijd aan de bovenkant, hoe je het potlood ook draait.
  // De twee loodrechte richtingen zijn (dy, -dx) en (-dy, dx); hun y-component
  // is -dx en +dx, dus de tekenrichting van dx bepaalt welke omhoog wijst.
  // (Op de x-component kiezen, niet op de y: anders hangt de kop omgekeerd
  //  zodra het potlood linksboven staat.)
  const headUp = direction.x >= 0
    ? { x: direction.y, y: -direction.x }
    : { x: -direction.y, y: direction.x };

  const hinge = { x: mid.x + headUp.x * hingeHeight, y: mid.y + headUp.y * hingeHeight };
  const partScale = clampNumber(legLength / 320, 0.5, 1.6);
  const knob = {
    x: hinge.x + headUp.x * COMPASS_HEAD_KNOB * partScale,
    y: hinge.y + headUp.y * COMPASS_HEAD_KNOB * partScale
  };
  const headEnd = {
    x: hinge.x + headUp.x * COMPASS_HEAD_END * partScale,
    y: hinge.y + headUp.y * COMPASS_HEAD_END * partScale
  };

  return {
    angle: safeAngle,
    headEnd,
    headUp,
    hinge,
    knob,
    legLength,
    mid,
    needle,
    partScale,
    pencil,
    radius: safeRadius,
    sizeScale: size
  };
};

// Omhullende rechthoek van de passer in boardunits. `includeCircle` telt de
// cirkel die je met deze straal zou tekenen mee, want die hoort net zo goed in
// beeld te vallen als het instrument zelf.
export const getCompassBounds = (geometry, { includeCircle = true } = {}) => {
  if (!geometry) return null;

  const pad = COMPASS_HEAD_HALF_WIDTH * geometry.partScale + 4;
  const xs = [geometry.needle.x, geometry.pencil.x, geometry.hinge.x, geometry.headEnd.x, geometry.knob.x];
  const ys = [geometry.needle.y, geometry.pencil.y, geometry.hinge.y, geometry.headEnd.y, geometry.knob.y];

  let minX = Math.min(...xs) - pad;
  let maxX = Math.max(...xs) + pad;
  let minY = Math.min(...ys) - pad;
  let maxY = Math.max(...ys) + pad;

  if (includeCircle) {
    minX = Math.min(minX, geometry.needle.x - geometry.radius);
    maxX = Math.max(maxX, geometry.needle.x + geometry.radius);
    minY = Math.min(minY, geometry.needle.y - geometry.radius);
    maxY = Math.max(maxY, geometry.needle.y + geometry.radius);
  }

  return { x: round2(minX), y: round2(minY), width: round2(maxX - minX), height: round2(maxY - minY) };
};

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
