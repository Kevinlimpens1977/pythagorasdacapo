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
// Dit is de vaste breedte voor streken die géén variabele omtrek krijgen:
// markeerstift, lijnpen, passerbogen en streken langs een instrumentrand.
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

// ---------------------------------------------------------------------------
// Variabele breedte binnen één haal
// ---------------------------------------------------------------------------
//
// Een echte pen is dun bij het aanzetten, dikker in de haal en dun bij het
// afzetten. Eén `strokeWidth` voor de hele streek kan dat per definitie niet.
// Daarom wordt een vrije penstreek niet als lijn getekend maar als gevulde
// omtrek: links en rechts van de middellijn een rij punten op halve breedte,
// met ronde doppen aan de uiteinden.
//
// De breedte komt uit de pendruk als die er is, en anders uit de snelheid:
// snel bewegen is dun, langzaam is dik. Die snelheid wordt gemeten als de
// afstand tussen opeenvolgende samples, gedeeld door de mediaan van diezelfde
// afstanden binnen deze streek. Daardoor is de maat onafhankelijk van de
// rapportagesnelheid van het apparaat: een pen die 240 keer per seconde meldt
// en een muis die 60 keer per seconde meldt krijgen hetzelfde beeld, en een
// gelijkmatig gegenereerde streek (passerboog) blijft precies constant.

const SPEED_MIN_FACTOR = 0.62;
const SPEED_MAX_FACTOR = 1.3;

// Doppen: aantal tussenstapjes in de halve cirkel aan elk uiteinde.
const CAP_STEPS = 8;

// Uiteindetapering: over deze lengte (boardunits, begrensd op een deel van de
// hele streek) loopt de breedte op van TAPER_MIN_FACTOR naar vol.
const TAPER_MIN_FACTOR = 0.35;
const TAPER_MAX_SHARE = 0.28;

const MIN_RENDER_WIDTH = 0.4;
const DEDUPE_EPSILON = 0.01;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Geldige punten, ontdubbeld. Dubbele punten leveren geen bruikbare raaklijn
// en zouden de omtrek laten klappen.
export const getUsableStrokePoints = (points = []) => {
  const valid = (Array.isArray(points) ? points : []).filter(isValidPoint);
  const result = [];

  for (const point of valid) {
    const last = result[result.length - 1];
    if (last && Math.abs(last.x - point.x) < DEDUPE_EPSILON && Math.abs(last.y - point.y) < DEDUPE_EPSILON) {
      if (isFiniteNumber(point.p)) last.p = point.p;
      continue;
    }

    result.push(isFiniteNumber(point.p) ? { x: point.x, y: point.y, p: point.p } : { x: point.x, y: point.y });
  }

  return result;
};

const getMedian = (values) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

const smoothSeries = (values, passes = 2) => {
  let current = values;

  for (let pass = 0; pass < passes; pass += 1) {
    const next = current.map((value, index) => {
      const previous = current[index - 1];
      const following = current[index + 1];
      const window = [previous, value, following].filter(isFiniteNumber);
      return window.reduce((sum, item) => sum + item, 0) / window.length;
    });
    current = next;
  }

  return current;
};

// Breedte per punt, in boardunits. Altijd even lang als de puntenlijst.
export const getStrokeWidthProfile = (stroke, baseWidth) => {
  const safeBase = isFiniteNumber(baseWidth) && baseWidth > 0 ? baseWidth : 5;
  const points = getUsableStrokePoints(stroke?.points);
  if (points.length === 0) return [];
  if (points.length === 1) return [safeBase];

  const segmentLengths = [];
  for (let index = 1; index < points.length; index += 1) {
    segmentLengths.push(Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y));
  }

  const pressures = points.map((point) =>
    isFiniteNumber(point.p) && point.p > 0 && point.p <= 1 ? point.p : null
  );
  const knownPressures = pressures.filter((pressure) => pressure !== null);
  const usePressure = stroke?.pointerType === 'pen' && knownPressures.length >= points.length / 2;

  let factors;

  if (usePressure) {
    // Gaten in de drukreeks opvullen met de laatst bekende waarde, zodat één
    // ontbrekend sample geen dip in de haal veroorzaakt.
    let carried = knownPressures[0];
    factors = pressures.map((pressure) => {
      if (pressure !== null) carried = pressure;
      return clamp(carried * 2, PRESSURE_MIN_FACTOR, PRESSURE_MAX_FACTOR);
    });
  } else {
    const median = getMedian(segmentLengths.filter((length) => length > 0));
    factors = points.map((point, index) => {
      if (!(median > 0)) return 1;

      const before = segmentLengths[index - 1];
      const after = segmentLengths[index];
      const window = [before, after].filter(isFiniteNumber);
      const spacing = window.reduce((sum, item) => sum + item, 0) / (window.length || 1);
      const ratio = spacing / median;

      // ratio 1 (eigen gemiddelde tempo) → factor 1; stilstaan → dik;
      // uitschieten → dun.
      return clamp(2 / (1 + ratio), SPEED_MIN_FACTOR, SPEED_MAX_FACTOR);
    });
  }

  const smoothed = smoothSeries(factors, usePressure ? 2 : 1);

  const cumulative = [0];
  for (let index = 0; index < segmentLengths.length; index += 1) {
    cumulative.push(cumulative[index] + segmentLengths[index]);
  }
  const total = cumulative[cumulative.length - 1];
  const taperLength = Math.min(total * TAPER_MAX_SHARE, Math.max(1, safeBase * 1.6));

  return smoothed.map((factor, index) => {
    const fromStart = cumulative[index];
    const fromEnd = total - cumulative[index];
    const ease = (distance) => {
      if (!(taperLength > 0)) return 1;
      const ratio = clamp(distance / taperLength, 0, 1);
      return TAPER_MIN_FACTOR + (1 - TAPER_MIN_FACTOR) * Math.sqrt(ratio);
    };

    const taper = Math.min(ease(fromStart), ease(fromEnd));
    return Math.max(MIN_RENDER_WIDTH, round2(safeBase * factor * taper));
  });
};

// Zelfde midpoint-smoothing als buildSmoothedStrokePath, maar als vervolg op
// een pad dat al op `points[0]` staat.
const appendSmoothedPolyline = (commands, points) => {
  if (points.length < 2) return;

  if (points.length === 2) {
    commands.push(`L ${round2(points[1].x)} ${round2(points[1].y)}`);
    return;
  }

  for (let index = 1; index < points.length - 1; index += 1) {
    const control = points[index];
    const next = points[index + 1];
    commands.push(
      `Q ${round2(control.x)} ${round2(control.y)} ${round2((control.x + next.x) / 2)} ${round2((control.y + next.y) / 2)}`
    );
  }

  const last = points[points.length - 1];
  commands.push(`L ${round2(last.x)} ${round2(last.y)}`);
};

// Halve cirkel om `center`, van hoek `startAngle` aflopend over 180 graden.
// Aflopend voor beide doppen, zodat de omtrek één consistente winding houdt.
const appendCapPoints = (commands, center, radius, startAngle) => {
  for (let step = 1; step < CAP_STEPS; step += 1) {
    const angle = startAngle - (Math.PI * step) / CAP_STEPS;
    commands.push(`L ${round2(center.x + Math.cos(angle) * radius)} ${round2(center.y + Math.sin(angle) * radius)}`);
  }
};

// Gesloten omtrek van een streek met per punt een eigen breedte. Wordt gevuld
// getekend (nonzero), niet gelijnd.
export const buildVariableWidthStrokeOutline = (points = [], widths = []) => {
  const usable = Array.isArray(points) ? points : [];
  if (usable.length < 2 || widths.length !== usable.length) return '';

  const left = [];
  const right = [];
  const normals = [];

  for (let index = 0; index < usable.length; index += 1) {
    const previous = usable[index - 1] || usable[index];
    const next = usable[index + 1] || usable[index];
    let tangentX = next.x - previous.x;
    let tangentY = next.y - previous.y;
    const length = Math.hypot(tangentX, tangentY);

    if (length > 0) {
      tangentX /= length;
      tangentY /= length;
    } else {
      tangentX = 1;
      tangentY = 0;
    }

    const normalX = -tangentY;
    const normalY = tangentX;
    const half = Math.max(MIN_RENDER_WIDTH, widths[index]) / 2;

    normals.push({ x: normalX, y: normalY });
    left.push({ x: usable[index].x + normalX * half, y: usable[index].y + normalY * half });
    right.push({ x: usable[index].x - normalX * half, y: usable[index].y - normalY * half });
  }

  const lastIndex = usable.length - 1;
  const commands = [`M ${round2(left[0].x)} ${round2(left[0].y)}`];

  appendSmoothedPolyline(commands, left);

  const endNormal = normals[lastIndex];
  appendCapPoints(
    commands,
    usable[lastIndex],
    Math.max(MIN_RENDER_WIDTH, widths[lastIndex]) / 2,
    Math.atan2(endNormal.y, endNormal.x)
  );
  commands.push(`L ${round2(right[lastIndex].x)} ${round2(right[lastIndex].y)}`);

  appendSmoothedPolyline(commands, [...right].reverse());

  const startNormal = normals[0];
  appendCapPoints(
    commands,
    usable[0],
    Math.max(MIN_RENDER_WIDTH, widths[0]) / 2,
    Math.atan2(-startNormal.y, -startNormal.x)
  );
  commands.push('Z');

  return commands.join(' ');
};

// Welke streken krijgen een variabele breedte? Alleen vrije haaltjes:
//   - markeerstift is een vlakke band en blijft constant;
//   - de lijnpen en streken langs een instrumentrand zijn recht en exact;
//   - passerbogen hebben geen pointerType en blijven dus ook constant;
//   - twee punten is geen haal maar een lijn.
export const shouldUseVariableStrokeWidth = (stroke, points) => {
  const list = Array.isArray(points) ? points : getUsableStrokePoints(stroke?.points);
  if (list.length < 3) return false;
  if (stroke?.variant === 'highlighter' || stroke?.variant === 'geometry-pen') return false;
  if (stroke?.straight) return false;

  return typeof stroke?.pointerType === 'string' && stroke.pointerType.length > 0;
};

// De enige plek waar bepaald wordt hoe een streek getekend wordt. Zowel de
// live preview op canvas als de definitieve SVG-laag halen hier hun pad
// vandaan, dus die twee kunnen per constructie niet uit elkaar lopen.
//   mode 'fill'   → `d` is een gesloten omtrek, vullen met de inktkleur;
//   mode 'stroke' → `d` is een middellijn, lijnen met breedte `width`.
export const buildStrokeRenderPath = (stroke, baseWidth) => {
  const safeBase = isFiniteNumber(baseWidth) && baseWidth > 0 ? baseWidth : 5;
  const points = getUsableStrokePoints(stroke?.points);
  const asLine = () => ({
    mode: 'stroke',
    d: buildSmoothedStrokePath(points),
    width: getStrokePressureWidth(stroke, safeBase)
  });

  if (points.length === 0) return { mode: 'stroke', d: '', width: safeBase };
  if (!shouldUseVariableStrokeWidth(stroke, points)) return asLine();

  const outline = buildVariableWidthStrokeOutline(points, getStrokeWidthProfile(stroke, safeBase));
  if (!outline) return asLine();

  return { mode: 'fill', d: outline, width: safeBase };
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
