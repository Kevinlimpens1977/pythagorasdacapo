// Inktweergave voor Presenter: gladde paden (quadratic midpoint-curves),
// lichte drukmodulatie en hulpjes voor de meetkundepen.

const isFiniteNumber = (value) => Number.isFinite(value);
const isValidPoint = (point) => isFiniteNumber(point?.x) && isFiniteNumber(point?.y);

const round2 = (value) => Math.round(value * 100) / 100;

// Glad pad door de punten: start en eind exact, tussenpunten als controlepunt
// van quadratic curves richting de middens. Voelt als natuurlijke inkt zonder
// dure fitting; identiek bruikbaar voor SVG (`d`) en canvas Path2D.
export const buildSmoothedStrokePath = (points = []) => {
  const validPoints = (Array.isArray(points) ? points : []).filter(isValidPoint);
  if (validPoints.length === 0) return '';

  const [first, ...rest] = validPoints;
  if (rest.length === 0) {
    return `M ${round2(first.x)} ${round2(first.y)} L ${round2(first.x)} ${round2(first.y)}`;
  }

  if (rest.length === 1) {
    return `M ${round2(first.x)} ${round2(first.y)} L ${round2(rest[0].x)} ${round2(rest[0].y)}`;
  }

  const commands = [`M ${round2(first.x)} ${round2(first.y)}`];
  for (let index = 1; index < validPoints.length - 1; index += 1) {
    const control = validPoints[index];
    const next = validPoints[index + 1];
    const midX = (control.x + next.x) / 2;
    const midY = (control.y + next.y) / 2;
    commands.push(`Q ${round2(control.x)} ${round2(control.y)} ${round2(midX)} ${round2(midY)}`);
  }
  const last = validPoints[validPoints.length - 1];
  commands.push(`L ${round2(last.x)} ${round2(last.y)}`);

  return commands.join(' ');
};

const PRESSURE_MIN_FACTOR = 0.65;
const PRESSURE_MAX_FACTOR = 1.35;

// Gemiddelde pendruk van een stroke → lichte breedtemodulatie. Muis en touch
// leveren geen bruikbare druk (0 of constant 0.5); alleen echte pen-druk telt.
export const getStrokePressureWidth = (stroke, baseWidth) => {
  const safeBase = isFiniteNumber(baseWidth) && baseWidth > 0 ? baseWidth : 5;
  const pressures = (Array.isArray(stroke?.points) ? stroke.points : [])
    .map((point) => point?.p)
    .filter((pressure) => isFiniteNumber(pressure) && pressure > 0 && pressure <= 1);

  if (pressures.length === 0 || stroke?.pointerType !== 'pen') return safeBase;

  const average = pressures.reduce((sum, value) => sum + value, 0) / pressures.length;
  const factor = Math.min(PRESSURE_MAX_FACTOR, Math.max(PRESSURE_MIN_FACTOR, average * 2));
  return round2(safeBase * factor);
};

// Meetkundepen: eindpunt van een rechte lijn, optioneel gesnapt op 0/45/90°.
export const constrainLineEnd = (start, end, { angleSnap = false } = {}) => {
  if (!isValidPoint(start) || !isValidPoint(end)) return end;
  if (!angleSnap) return end;

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) return end;

  const angle = Math.atan2(dy, dx);
  const step = Math.PI / 4;
  const snapped = Math.round(angle / step) * step;

  return {
    x: round2(start.x + Math.cos(snapped) * length),
    y: round2(start.y + Math.sin(snapped) * length)
  };
};
