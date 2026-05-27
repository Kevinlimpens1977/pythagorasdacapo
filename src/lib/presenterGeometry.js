const isFinitePositiveNumber = (value) =>
  Number.isFinite(value) && value > 0;

export const getBoardScale = ({ viewportWidth, boardWidth }) => {
  if (!isFinitePositiveNumber(viewportWidth) || !isFinitePositiveNumber(boardWidth)) return 1;
  return viewportWidth / boardWidth;
};

export const mapClientPointToBoard = ({ clientX, clientY, rect, scrollTop = 0, scale = 1 }) => {
  const safeScale = isFinitePositiveNumber(scale) ? scale : 1;

  return {
    x: Math.round((clientX - rect.left) / safeScale),
    y: Math.round((clientY - rect.top + scrollTop) / safeScale)
  };
};

export const snapValueToGrid = (value, gridSize) =>
  isFinitePositiveNumber(gridSize)
    ? Math.round(value / gridSize) * gridSize
    : value;

export const snapPointToGrid = (point, { enabled, gridSize }) => {
  if (!enabled || !isFinitePositiveNumber(gridSize)) return point;

  return {
    x: snapValueToGrid(point.x, gridSize),
    y: snapValueToGrid(point.y, gridSize)
  };
};

export const getGridLineStyle = ({ gridSize, scale }) => {
  const safeGridSize = isFinitePositiveNumber(gridSize) ? gridSize : 96;
  const safeScale = isFinitePositiveNumber(scale) ? scale : 1;
  const lineSize = Math.max(1, Math.round(safeGridSize * safeScale));

  return {
    backgroundSize: `${lineSize}px ${lineSize}px`,
    lineSize
  };
};

export const measureDistance = (a, b) =>
  Math.hypot(b.x - a.x, b.y - a.y);

export const measureAngleDegrees = (origin, a, b) => {
  const angleA = Math.atan2(a.y - origin.y, a.x - origin.x);
  const angleB = Math.atan2(b.y - origin.y, b.x - origin.x);
  const raw = Math.abs((angleB - angleA) * 180 / Math.PI);
  const normalized = raw > 180 ? 360 - raw : raw;

  return Math.round(normalized);
};
