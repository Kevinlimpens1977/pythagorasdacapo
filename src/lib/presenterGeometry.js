export const getBoardScale = ({ viewportWidth, boardWidth }) => {
  if (!viewportWidth || !boardWidth) return 1;
  return viewportWidth / boardWidth;
};

export const mapClientPointToBoard = ({ clientX, clientY, rect, scrollTop = 0, scale = 1 }) => ({
  x: Math.round((clientX - rect.left) / scale),
  y: Math.round((clientY - rect.top + scrollTop) / scale)
});

export const snapValueToGrid = (value, gridSize) =>
  Math.round(value / gridSize) * gridSize;

export const snapPointToGrid = (point, { enabled, gridSize }) => {
  if (!enabled || !gridSize) return point;

  return {
    x: snapValueToGrid(point.x, gridSize),
    y: snapValueToGrid(point.y, gridSize)
  };
};

export const getGridLineStyle = ({ gridSize, scale }) => {
  const lineSize = Math.max(1, Math.round(gridSize * scale));

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
