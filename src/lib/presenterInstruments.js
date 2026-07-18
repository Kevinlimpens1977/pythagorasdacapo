// Meetinstrumenten op het Presenter-bord: positie/rotatie in boardunits,
// plus de tekenrand (edge) waar penstreken op vast kunnen klikken.

export const PRESENTER_INSTRUMENT_DEFS = {
  ruler: { id: 'ruler', label: 'Liniaal', width: 760, height: 110, edge: 'top' },
  triangle: { id: 'triangle', label: 'Geodriehoek', width: 560, height: 300, edge: 'bottom' },
  compass: { id: 'compass', label: 'Passer', width: 380, height: 420, edge: null },
  protractor: { id: 'protractor', label: 'Gradenboog', width: 560, height: 300, edge: 'bottom' }
};

export const PRESENTER_INSTRUMENT_EDGE_TOLERANCE = 24;

const isFiniteNumber = (value) => Number.isFinite(value);
const round2 = (value) => Math.round(value * 100) / 100;

export const createPresenterInstrument = (instrumentId, overrides = {}) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrumentId];
  if (!def) return null;

  return {
    id: instrumentId,
    x: isFiniteNumber(overrides.x) ? overrides.x : 520,
    y: isFiniteNumber(overrides.y) ? overrides.y : 420,
    rotation: isFiniteNumber(overrides.rotation) ? overrides.rotation : 0
  };
};

export const getInstrumentCenter = (instrument) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  if (!def) return null;

  return {
    x: instrument.x + def.width / 2,
    y: instrument.y + def.height / 2
  };
};

const rotateAroundCenter = (point, center, degrees) => {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const dx = point.x - center.x;
  const dy = point.y - center.y;

  return {
    x: round2(center.x + dx * cos - dy * sin),
    y: round2(center.y + dx * sin + dy * cos)
  };
};

// De tekenrand van het instrument in boardcoordinaten, inclusief rotatie.
export const getInstrumentEdgeLine = (instrument) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  if (!def || !def.edge) return null;

  const center = getInstrumentCenter(instrument);
  const edgeY = def.edge === 'top' ? instrument.y : instrument.y + def.height;
  const start = rotateAroundCenter({ x: instrument.x, y: edgeY }, center, instrument.rotation || 0);
  const end = rotateAroundCenter({ x: instrument.x + def.width, y: edgeY }, center, instrument.rotation || 0);

  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
};

// Projecteer een punt op de tekenrand (geklemd op het randsegment).
export const projectPointOntoEdge = (point, edgeLine) => {
  if (!edgeLine || !isFiniteNumber(point?.x) || !isFiniteNumber(point?.y)) return point;

  const dx = edgeLine.x2 - edgeLine.x1;
  const dy = edgeLine.y2 - edgeLine.y1;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return { x: edgeLine.x1, y: edgeLine.y1 };

  const t = Math.max(
    0,
    Math.min(1, ((point.x - edgeLine.x1) * dx + (point.y - edgeLine.y1) * dy) / lengthSquared)
  );

  return {
    x: round2(edgeLine.x1 + t * dx),
    y: round2(edgeLine.y1 + t * dy)
  };
};

export const isPointNearInstrumentEdge = (point, instrument, tolerance = PRESENTER_INSTRUMENT_EDGE_TOLERANCE) => {
  const edgeLine = getInstrumentEdgeLine(instrument);
  if (!edgeLine || !isFiniteNumber(point?.x) || !isFiniteNumber(point?.y)) return false;

  const projected = projectPointOntoEdge(point, edgeLine);
  return Math.hypot(point.x - projected.x, point.y - projected.y) <= tolerance;
};

// Hoeklabel voor de gradenboog: rotatie genormaliseerd naar 0-360.
export const getInstrumentAngleLabel = (instrument) => {
  const rotation = isFiniteNumber(instrument?.rotation) ? instrument.rotation : 0;
  return `${Math.round(((rotation % 360) + 360) % 360)}°`;
};
