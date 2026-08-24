// Meetinstrumenten op het Presenter-bord: positie/rotatie in boardunits,
// plus de tekenrand (edge) waar penstreken op vast kunnen klikken.
//
// Coordinatenafspraak:
// - `anchor: 'topLeft'` -> instrument.x/y is de linkerbovenhoek van het kader
//   (liniaal, geodriehoek, gradenboog).
// - `anchor: 'needle'`  -> instrument.x/y IS het meetpunt zelf (de passer prikt
//   daar in het bord); er hoort geen kader bij.
// - `localEdge` staat in lokale instrumentunits (linksboven = 0,0) en is de
//   zichtbare rand waar de pen op vastklikt.
// - `pivot` staat in lokale units en is het draaipunt: voor de gradenboog het
//   meetpunt op de basislijn, voor de liniaal het midden van het kader.

import {
  clampCompassRadius,
  DEFAULT_COMPASS_ANGLE,
  DEFAULT_COMPASS_RADIUS,
  getCompassBounds,
  getCompassGeometry
} from './presenterCompass.js';

const isFiniteNumber = (value) => Number.isFinite(value);
const round2 = (value) => Math.round(value * 100) / 100;
const clampNumber = (value, min, max) => (max < min ? min : Math.min(Math.max(value, min), max));

export const PRESENTER_INSTRUMENT_DEFS = {
  ruler: {
    id: 'ruler',
    label: 'Liniaal',
    width: 960,
    height: 132,
    edge: 'top',
    anchor: 'topLeft',
    localEdge: { x1: 0, y1: 0, x2: 960, y2: 0 },
    pivot: { x: 480, y: 66 },
    controlButtonCount: 4
  },
  triangle: {
    id: 'triangle',
    label: 'Geodriehoek',
    width: 640,
    height: 340,
    edge: 'bottom',
    anchor: 'topLeft',
    localEdge: { x1: 12, y1: 330, x2: 628, y2: 330 },
    pivot: { x: 320, y: 330 },
    // Vier gedeelde knoppen plus twee eigen knoppen voor het eerste been van de
    // hoekconstructie (naar links / naar rechts).
    controlButtonCount: 6
  },
  compass: {
    id: 'compass',
    label: 'Passer',
    width: 380,
    height: 420,
    edge: null,
    anchor: 'needle',
    controlButtonCount: 5
  },
  protractor: {
    id: 'protractor',
    label: 'Gradenboog',
    width: 640,
    // De voet onder de basislijn (y 332 tot 368) draagt de eindcijfers 0 en 180
    // van de dubbele schaal; die passen daar alleen leesbaar in als de voet
    // hoog genoeg is.
    height: 368,
    edge: 'bottom',
    anchor: 'topLeft',
    localEdge: { x1: 36, y1: 332, x2: 604, y2: 332 },
    pivot: { x: 320, y: 332 },
    controlButtonCount: 4
  }
};

export const PRESENTER_INSTRUMENT_EDGE_TOLERANCE = 24;

// Hoogte (in CSS-pixels) die de vaste werkbalk onderin afdekt, inclusief een
// open paneel. Nieuwe instrumenten moeten daarboven landen.
// Doorgerekend uit PresenterToolbar: iconenbalk 56px + onderrand 8px, plus het
// zwevende paneel (2 rijen van 44px met padding = 106px) en 8px tussenruimte.
export const PRESENTER_TOOLBAR_RESERVE_PX = 184;

// Wat de werkbalk PERMANENT bedekt: alleen de lage iconenbalk zelf (56px plus
// de onderrand). Het paneel erboven telt niet mee, want dat sluit zodra de pen
// het bord raakt — tenzij het is vastgezet, en dan rekent PresenterBoard met de
// reserve hierboven.
export const PRESENTER_TOOLBAR_PEEK_PX = 72;

// Strook bovenaan het bord waar de paginabalk overheen ligt. Ook daar mag geen
// instrument onder verdwijnen.
export const PRESENTER_PAGE_BAR_RESERVE_PX = 56;

// Maten van de zwevende knoppenrij die bij elk instrument hoort. De knoppenrij
// is onderdeel van het instrument: past hij niet in beeld, dan past het
// instrument niet in beeld. Alles hier staat in CSS-pixels (de knoppenrij
// schaalt niet mee met het bord), behalve frameOffset, dat in boardunits onder
// het kader hangt.
export const PRESENTER_INSTRUMENT_CHROME_PX = {
  barHeight: 76,
  badgeHeight: 30,
  buttonWidth: 64,
  barPadding: 24,
  // Verticale afstand tussen het ankerpunt en de bovenkant van de knoppenrij
  // bij de passer: de rij hangt boven de draaiknop van de kop, met precies
  // genoeg lucht (rijhoogte 76 + knopstraal 28 + 16 marge) om er niet overheen
  // te vallen.
  compassOffset: 120,
  // Afstand (in boardunits) onder het kader waar de knoppenrij van de andere
  // instrumenten hangt; die punt draait mee met het instrument.
  frameOffset: 52,
  // Straal van de losse grijpknoppen op de passer (naald, straalknop, potlood).
  grabButton: 28
};

export const getInstrumentControlBarWidthPx = (instrumentId) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrumentId];
  const buttons = def?.controlButtonCount || 4;
  return buttons * PRESENTER_INSTRUMENT_CHROME_PX.buttonWidth + PRESENTER_INSTRUMENT_CHROME_PX.barPadding;
};

// Maatfactor van een instrument: 1 is de volle maat op een digibord, kleiner
// hoort bij een krap venster. De schaalverdelingen blijven kloppen doordat de
// tekenlaag met `gridSize / sizeScale` rekent (zie PresenterInstrumentOverlay).
export const PRESENTER_INSTRUMENT_MIN_SIZE = 0.5;
export const PRESENTER_INSTRUMENT_MAX_SIZE = 1;

export const getInstrumentSizeScale = (instrument) =>
  clampNumber(
    isFiniteNumber(instrument?.sizeScale) ? instrument.sizeScale : 1,
    PRESENTER_INSTRUMENT_MIN_SIZE,
    PRESENTER_INSTRUMENT_MAX_SIZE
  );

export const createPresenterInstrument = (instrumentId, overrides = {}) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrumentId];
  if (!def) return null;

  return {
    id: instrumentId,
    x: isFiniteNumber(overrides.x) ? overrides.x : 520,
    y: isFiniteNumber(overrides.y) ? overrides.y : 420,
    rotation: isFiniteNumber(overrides.rotation) ? overrides.rotation : 0,
    sizeScale: getInstrumentSizeScale(overrides),
    // De gradenboog heeft een verplaatsbare wijzer om een hoek af te lezen.
    ...(instrumentId === 'protractor'
      ? { reading: isFiniteNumber(overrides.reading) ? overrides.reading : 60 }
      : {}),
    // De passer is een tekenend instrument: naaldpunt (x,y als middelpunt),
    // straal en potloodhoek in plaats van een rechthoekig kader.
    ...(instrumentId === 'compass'
      ? {
          x: isFiniteNumber(overrides.x) ? overrides.x : 860,
          y: isFiniteNumber(overrides.y) ? overrides.y : 620,
          radius: isFiniteNumber(overrides.radius) ? overrides.radius : DEFAULT_COMPASS_RADIUS,
          angle: isFiniteNumber(overrides.angle) ? overrides.angle : DEFAULT_COMPASS_ANGLE
        }
      : {})
  };
};

// Kader, draaipunt en tekenrand op de huidige maat. Alle plaatsings- en
// snaplogica rekent hiermee, nooit rechtstreeks met de def-constanten.
export const getInstrumentMetrics = (instrument) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrument?.id];
  if (!def) return null;

  const sizeScale = getInstrumentSizeScale(instrument);
  if (def.anchor === 'needle') {
    return { def, sizeScale, width: 0, height: 0, pivot: { x: 0, y: 0 }, localEdge: null };
  }

  const localEdge = def.localEdge || {
    x1: 0,
    y1: def.edge === 'top' ? 0 : def.height,
    x2: def.width,
    y2: def.edge === 'top' ? 0 : def.height
  };

  return {
    def,
    sizeScale,
    width: def.width * sizeScale,
    height: def.height * sizeScale,
    pivot: {
      x: (def.pivot?.x ?? def.width / 2) * sizeScale,
      y: (def.pivot?.y ?? def.height / 2) * sizeScale
    },
    localEdge: {
      x1: localEdge.x1 * sizeScale,
      y1: localEdge.y1 * sizeScale,
      x2: localEdge.x2 * sizeScale,
      y2: localEdge.y2 * sizeScale
    }
  };
};

export const getInstrumentCenter = (instrument) => {
  const metrics = getInstrumentMetrics(instrument);
  if (!metrics) return null;

  // Bij de passer is (x,y) het naaldpunt zelf, geen linkerbovenhoek.
  if (metrics.def.anchor === 'needle') {
    return { x: instrument.x, y: instrument.y };
  }

  return {
    x: instrument.x + metrics.width / 2,
    y: instrument.y + metrics.height / 2
  };
};

// Het draaipunt van het instrument in boardcoordinaten. Voor de gradenboog is
// dat het meetpunt op de basislijn, zodat het punt blijft liggen waar je hem
// neerlegt terwijl je draait.
export const getInstrumentPivot = (instrument) => {
  const metrics = getInstrumentMetrics(instrument);
  if (!metrics) return null;
  if (metrics.def.anchor === 'needle') return { x: instrument.x, y: instrument.y };

  return { x: instrument.x + metrics.pivot.x, y: instrument.y + metrics.pivot.y };
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

// De tekenrand van het instrument in boardcoordinaten, inclusief rotatie om
// het draaipunt van het instrument.
export const getInstrumentEdgeLine = (instrument) => {
  const metrics = getInstrumentMetrics(instrument);
  if (!metrics || !metrics.def.edge) return null;

  const pivot = getInstrumentPivot(instrument);
  const local = metrics.localEdge;
  const rotation = instrument.rotation || 0;
  const start = rotateAroundCenter({ x: instrument.x + local.x1, y: instrument.y + local.y1 }, pivot, rotation);
  const end = rotateAroundCenter({ x: instrument.x + local.x2, y: instrument.y + local.y2 }, pivot, rotation);

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

// Lengte in ruitjes, zelfde notatie als formatCompassRadius ('2,5 ruitjes').
export const formatRulerLength = (length, gridSize = 96) => {
  const safeLength = isFiniteNumber(length) ? Math.max(0, length) : 0;
  if (!isFiniteNumber(gridSize) || gridSize <= 0) return `${Math.round(safeLength)}`;

  const units = Math.round((safeLength / gridSize) * 10) / 10;
  return `${String(units).replace('.', ',')} ${units === 1 ? 'ruitje' : 'ruitjes'}`;
};

// Streepjes van de liniaal: 1 eenheid = 1 ruitje, met tussenstreepjes per
// tiende en een halve-streep in het midden. Zo klopt aflezen met het
// ruitjespapier op de achtergrond.
export const buildRulerTicks = ({ length, gridSize = 96, ticksPerUnit = 10 } = {}) => {
  const safeLength = isFiniteNumber(length) && length > 0 ? length : PRESENTER_INSTRUMENT_DEFS.ruler.width;
  const unit = isFiniteNumber(gridSize) && gridSize > 0 ? gridSize : 96;
  const perUnit = Math.max(2, Math.round(isFiniteNumber(ticksPerUnit) ? ticksPerUnit : 10));
  const step = unit / perUnit;
  const half = perUnit % 2 === 0 ? perUnit / 2 : null;
  const count = Math.floor(safeLength / step + 0.0001);

  const ticks = [];
  for (let index = 0; index <= count; index += 1) {
    const kind = index % perUnit === 0 ? 'major' : half && index % half === 0 ? 'mid' : 'minor';
    ticks.push({ index, kind, x: round2(index * step) });
  }

  const units = Math.floor(safeLength / unit + 0.0001);
  const labels = [];
  for (let value = 0; value <= units; value += 1) {
    labels.push({ value, x: round2(value * unit) });
  }

  return { unit, step, ticksPerUnit: perUnit, ticks, labels, units };
};

// ---------------------------------------------------------------------------
// Cijfers op een schaalverdeling: leesbaarheid is meetbaar
//
// Een digibord wordt vanaf vier meter gelezen. Een cijfer waar maatstreepjes of
// de basislijn doorheen lopen, is op die afstand onleesbaar - het klontert
// samen tot een blok. Daarom rekenen we van elk cijfer een (ruim genomen)
// inktdoos uit. Op die doos wordt de plek van de eindcijfers bepaald, worden
// streepjes eronder ingekort, en controleren de tests dat er niets doorheen
// loopt.
// ---------------------------------------------------------------------------

// Maten van een cijfer in de vette schreefloze letter van de instrumenten,
// nagemeten in de browser (Segoe UI 800, via canvas TextMetrics en getBBox):
// - een cijfer is 0,599 em breed (drie cijfers samen iets minder per cijfer);
// - de inkt is 0,70 em hoog (cijfers hebben geen staart onder de regel);
// - `dominant-baseline: middle` zet de letter 0,25 em lager dan de gewone
//   regel, waardoor het inktblokje 0,10 em boven het ankerpunt uitkomt.
// De marge eromheen is de lucht die een cijfer sowieso moet houden.
const DIGIT_ADVANCE_RATIO = 0.6;
const DIGIT_CAP_RATIO = 0.7;
const DIGIT_MIDDLE_SHIFT_RATIO = 0.1;
const DIGIT_MARGIN_RATIO = 0.06;

// De doos van een cijferlabel dat om zijn eigen midden staat. Een gedraaid
// label (de gradenboog zet zijn cijfers langs de boog) krijgt een meegedraaide
// doos: een rechte omhullende zou daar veel te ruim zijn en botsingen melden
// die er niet zijn. `x1..y2` is de rechte omhullende erbij, handig om snel op
// x-bereik te filteren.
export const getScaleLabelBox = ({ text, x, y, fontSize = 20, rotation = 0 }) => {
  const characters = Math.max(1, String(text ?? '').length);
  const margin = 2 * DIGIT_MARGIN_RATIO * fontSize;
  const width = characters * DIGIT_ADVANCE_RATIO * fontSize + margin;
  const height = DIGIT_CAP_RATIO * fontSize + margin;
  const degrees = isFiniteNumber(rotation) ? rotation : 0;
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const shift = -DIGIT_MIDDLE_SHIFT_RATIO * fontSize;
  const corners = [
    [-width / 2, shift - height / 2],
    [width / 2, shift - height / 2],
    [width / 2, shift + height / 2],
    [-width / 2, shift + height / 2]
  ].map(([dx, dy]) => ({ x: round2(x + dx * cos - dy * sin), y: round2(y + dx * sin + dy * cos) }));
  const center = { x: x - shift * sin, y: y + shift * cos };

  return {
    x: round2(center.x),
    y: round2(center.y),
    width: round2(width),
    height: round2(height),
    rotation: degrees,
    corners,
    x1: round2(Math.min(...corners.map((corner) => corner.x))),
    y1: round2(Math.min(...corners.map((corner) => corner.y))),
    x2: round2(Math.max(...corners.map((corner) => corner.x))),
    y2: round2(Math.max(...corners.map((corner) => corner.y)))
  };
};

// Doos met `gap` extra lucht rondom, in zijn eigen (gedraaide) richting.
function scaleCorners(box, gap) {
  const radians = (box.rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const halfWidth = box.width / 2 + gap;
  const halfHeight = box.height / 2 + gap;

  return [
    [-halfWidth, -halfHeight],
    [halfWidth, -halfHeight],
    [halfWidth, halfHeight],
    [-halfWidth, halfHeight]
  ].map(([dx, dy]) => ({ x: box.x + dx * cos - dy * sin, y: box.y + dx * sin + dy * cos }));
}

const projectOnAxis = (points, axis) => {
  let min = Infinity;
  let max = -Infinity;
  for (const point of points) {
    const value = point.x * axis.x + point.y * axis.y;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return { min, max };
};

// Scheidende-assen-test tussen twee convexe vormen. Een lijnstuk is hier een
// vorm van twee punten; daarvoor telt ook zijn eigen richting als as.
const shapesOverlap = (a, b) => {
  const axes = [];
  for (const shape of [a, b]) {
    for (let index = 0; index < shape.length; index += 1) {
      const from = shape[index];
      const to = shape[(index + 1) % shape.length];
      axes.push({ x: -(to.y - from.y), y: to.x - from.x });
      if (shape.length === 2) axes.push({ x: to.x - from.x, y: to.y - from.y });
    }
  }

  for (const axis of axes) {
    if (axis.x === 0 && axis.y === 0) continue;
    const projectionA = projectOnAxis(a, axis);
    const projectionB = projectOnAxis(b, axis);
    if (projectionA.max <= projectionB.min || projectionB.max <= projectionA.min) return false;
  }

  return true;
};

export const boxesOverlap = (a, b, gap = 0) =>
  Boolean(a) && Boolean(b) && shapesOverlap(scaleCorners(a, gap / 2), scaleCorners(b, gap / 2));

// Snijdt een lijnstuk (een maatstreepje, een hulplijn, de basislijn) het cijfer?
export const segmentHitsBox = (segment, box, gap = 0) => {
  if (!segment || !box) return false;

  return shapesOverlap(
    [
      { x: segment.x1, y: segment.y1 },
      { x: segment.x2, y: segment.y2 }
    ],
    scaleCorners(box, gap)
  );
};

// Maten van de geodriehoek-schaal. De eindcijfers 0 en 180 zouden midden op de
// basislijn belanden, dwars door de rij maatstreepjes heen. Ze staan daarom van
// de basislijn af getild, in de vrije band erboven - wel nog op dezelfde
// cijferring als 30, 60, 90, 120 en 150, zodat de reeks een reeks blijft.
export const TRIANGLE_SCALE = {
  arcRadius: 168,
  labelRadius: 124,
  labelFontSize: 20,
  endLabelLift: 34,
  // Alle boogstreepjes beginnen even ver binnen de boog; de streepjes op 30, 60,
  // ... steken er aan de buitenkant doorheen. Ze krijgen hun nadruk dus buiten
  // de boog, niet naar binnen toe - want naar binnen wijzen ze recht op hun
  // eigen hoekcijfer, en daar zouden ze tegenaan lopen.
  arcTickLength: 14,
  arcTickOvershoot: 8,
  arcTickClearance: 4,
  baseTickSpan: 560,
  baseTickGap: 4,
  baseTickLength: { major: 34, mid: 22, minor: 14 },
  // Lucht die tussen een streepje en een cijfer moet blijven.
  labelClearance: 6
};

export const buildTriangleScale = ({
  cx = PRESENTER_INSTRUMENT_DEFS.triangle.width / 2,
  baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1,
  gridSize = 96
} = {}) => {
  const cfg = TRIANGLE_SCALE;

  const labels = [];
  for (let degrees = 0; degrees <= 180; degrees += 30) {
    const isEnd = degrees === 0 || degrees === 180;
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    // Eindcijfers blijven op de cijferring, maar dan op de hoogte van de vrije
    // band: horizontaal schuiven ze daardoor iets naar binnen.
    const offset = isEnd
      ? Math.sign(cos) * Math.sqrt(Math.max(0, cfg.labelRadius ** 2 - cfg.endLabelLift ** 2))
      : cos * cfg.labelRadius;
    const x = round2(cx + offset);
    const y = round2(isEnd ? baseY - cfg.endLabelLift : baseY - Math.sin(radians) * cfg.labelRadius);

    labels.push({
      degrees,
      isEnd,
      x,
      y,
      fontSize: cfg.labelFontSize,
      box: getScaleLabelBox({ text: String(degrees), x, y, fontSize: cfg.labelFontSize })
    });
  }

  const arcTickAt = (degrees, length) => {
    const radians = (degrees * Math.PI) / 180;
    const major = degrees % 30 === 0;
    const inner = cfg.arcRadius - length;
    const outer = cfg.arcRadius + (major ? cfg.arcTickOvershoot : 0);

    return {
      degrees,
      major,
      x1: round2(cx + Math.cos(radians) * inner),
      y1: round2(baseY - Math.sin(radians) * inner),
      x2: round2(cx + Math.cos(radians) * outer),
      y2: round2(baseY - Math.sin(radians) * outer)
    };
  };

  // Hoe ver de boogstreepjes naar binnen reiken, hangt af van waar de cijfers
  // staan: de streepjes op 30, 60, ... wijzen recht op hun eigen cijfer. We
  // rekenen de grootste lengte uit die vrij blijft in plaats van hem vast te
  // zetten, zodat het blijft kloppen als een cijfer van maat of plaats
  // verandert.
  const labelBoxes = labels.map((label) => label.box);
  const labelDegrees = labels.map((label) => label.degrees);
  let tickLength = cfg.arcTickLength;
  while (
    tickLength > 4 &&
    labelBoxes.some((box) =>
      labelDegrees.some((degrees) => segmentHitsBox(arcTickAt(degrees, tickLength), box, cfg.arcTickClearance))
    )
  ) {
    tickLength -= 1;
  }

  const arcTicks = [];
  for (let degrees = 0; degrees <= 180; degrees += 10) {
    arcTicks.push(arcTickAt(degrees, tickLength));
  }

  const endBoxes = labels.filter((label) => label.isEnd).map((label) => label.box);
  const startX = cx - cfg.baseTickSpan / 2;
  const tickTop = round2(baseY - cfg.baseTickGap);
  const baseTicks = [];

  for (const tick of buildRulerTicks({ length: cfg.baseTickSpan, gridSize, ticksPerUnit: 5 }).ticks) {
    const x = round2(startX + tick.x);
    let length = cfg.baseTickLength[tick.kind] ?? cfg.baseTickLength.minor;

    for (const box of endBoxes) {
      if (x < box.x1 - cfg.labelClearance || x > box.x2 + cfg.labelClearance) continue;
      // Ter hoogte van een eindcijfer wordt het streepje ingekort tot onder het
      // cijfer - zoals de maatverdeling op een echte geodriehoek wijkt voor het
      // opschrift. Bij de standaardruitjesmaat valt hier niets onder; het is het
      // vangnet dat de leesbaarheid ook bij een andere ruitjesmaat garandeert.
      length = Math.min(length, baseY - cfg.baseTickGap - box.y2 - cfg.labelClearance);
    }

    if (length < 4) continue;

    baseTicks.push({ index: tick.index, kind: tick.kind, x, y1: tickTop, y2: round2(baseY - length) });
  }

  return { cx, baseY, arcRadius: cfg.arcRadius, arcTicks, baseTicks, labels, baseTickSpan: cfg.baseTickSpan };
};

// Maten van het sleepvlak van de geodriehoek: een driehoek binnen het lichaam
// die de strook langs de tekenrand vrijlaat, zodat de pen daar gewoon langs kan.
// Alles wat pointers vangt op de geodriehoek hoort BINNEN dit vlak te vallen;
// dan verandert er voor de pen niets ten opzichte van de bestaande situatie.
export const TRIANGLE_MOVE_AREA = {
  inset: 70,
  lift: 34,
  apexDrop: 46
};

export const buildTriangleMoveArea = ({
  width = PRESENTER_INSTRUMENT_DEFS.triangle.width,
  baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1,
  apexY = 26
} = {}) => {
  const cfg = TRIANGLE_MOVE_AREA;
  const points = [
    { x: round2(cfg.inset), y: round2(baseY - cfg.lift) },
    { x: round2(width - cfg.inset), y: round2(baseY - cfg.lift) },
    { x: round2(width / 2), y: round2(apexY + cfg.apexDrop) }
  ];

  return { points, pathData: `M ${points.map((point) => `${point.x} ${point.y}`).join(' L ')} Z` };
};

// Aanraakband over de hoekschaal van de geodriehoek: een tik hierop leest een
// aantal graden af, een sleep verplaatst het instrument gewoon (zie
// isInstrumentTap in presenterAngleTool).
//
// De band ligt om de boog (straal 168) heen, ruim buiten de cijferring (124) en
// binnen het sleepvlak hierboven. De onderkant wordt vlak afgesneden op dezelfde
// hoogte als het sleepvlak, zodat de band nooit in de tolerantieband van de
// tekenrand komt.
export const TRIANGLE_SCALE_BAND = {
  // Ruim buiten de verste hoek van het verste hoekcijfer (146) en ruim binnen de
  // binnenkant van de boogstreepjes (154): de cijfers blijven onbedekt, de
  // streepjes waar je op tikt vallen wel in de band.
  innerRadius: 150,
  outerRadius: 186,
  cutHeight: TRIANGLE_MOVE_AREA.lift,
  segments: 48
};

export const buildTriangleScaleBand = ({
  cx = PRESENTER_INSTRUMENT_DEFS.triangle.pivot.x,
  baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1
} = {}) => {
  const cfg = TRIANGLE_SCALE_BAND;
  const minDegrees = (Math.asin(clampNumber(cfg.cutHeight / cfg.outerRadius, 0, 1)) * 180) / Math.PI;
  const maxDegrees = 180 - minDegrees;
  const outer = [];
  const inner = [];

  for (let index = 0; index <= cfg.segments; index += 1) {
    const degrees = minDegrees + ((maxDegrees - minDegrees) * index) / cfg.segments;
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    // Vlak afgesneden onderkant: dichtbij de basislijn volgt de binnenrand de
    // horizontale snijlijn in plaats van de cirkel.
    const innerRadius = Math.min(cfg.outerRadius, Math.max(cfg.innerRadius, cfg.cutHeight / Math.max(sin, 1e-6)));

    outer.push({ x: round2(cx + cos * cfg.outerRadius), y: round2(baseY - sin * cfg.outerRadius) });
    inner.push({ x: round2(cx + cos * innerRadius), y: round2(baseY - sin * innerRadius) });
  }

  const points = [...outer, ...inner.reverse()];

  return {
    minDegrees: round2(minDegrees),
    maxDegrees: round2(maxDegrees),
    innerRadius: cfg.innerRadius,
    outerRadius: cfg.outerRadius,
    points,
    pointsAttribute: points.map((point) => `${point.x},${point.y}`).join(' ')
  };
};

// Lettergroottes van de dubbele schaal op de gradenboog.
export const PROTRACTOR_LABEL_FONT_SIZE = { outer: 23, inner: 19 };

// Dubbele schaalverdeling van de gradenboog: 181 streepjes van 1 graad met
// lange streepjes op de tienden, en per tiende twee getallen (0-180 met de klok
// mee en tegen de klok in).
//
// De twee eindcijfers (bij 0 en bij 180) zouden midden op de basislijn belanden:
// de dikke basislijn loopt dan dwars door het cijfer heen. Ze krijgen daarom hun
// eigen plek op de vlakke voet onder de basislijn, rechtop in plaats van
// meegedraaid met de boog.
export const buildProtractorScale = ({
  cx = PRESENTER_INSTRUMENT_DEFS.protractor.pivot.x,
  cy = PRESENTER_INSTRUMENT_DEFS.protractor.pivot.y,
  radius = 284,
  majorLength = 46,
  midLength = 32,
  minorLength = 18,
  outerLabelRadius = 224,
  innerLabelRadius = 186,
  guideRadius = 150,
  endLabelOffset = 20
} = {}) => {
  const ticks = [];
  for (let degrees = 0; degrees <= 180; degrees += 1) {
    const kind = degrees % 10 === 0 ? 'major' : degrees % 5 === 0 ? 'mid' : 'minor';
    const length = kind === 'major' ? majorLength : kind === 'mid' ? midLength : minorLength;
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    ticks.push({
      degrees,
      kind,
      x1: round2(cx + cos * (radius - length)),
      y1: round2(cy - sin * (radius - length)),
      x2: round2(cx + cos * radius),
      y2: round2(cy - sin * radius)
    });
  }

  const labels = [];
  const guides = [];
  for (let degrees = 0; degrees <= 180; degrees += 10) {
    const radians = (degrees * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    // Bij 0 en 180 wijst de schaal langs de basislijn: daar horen de cijfers
    // onder de lijn, op de voet, en rechtop.
    const isEnd = degrees === 0 || degrees === 180;
    const outerX = round2(cx + cos * outerLabelRadius);
    const outerY = round2(isEnd ? cy + endLabelOffset : cy - sin * outerLabelRadius);
    const innerX = round2(cx + cos * innerLabelRadius);
    const innerY = round2(isEnd ? cy + endLabelOffset : cy - sin * innerLabelRadius);
    const rotation = isEnd ? 0 : round2(90 - degrees);

    labels.push({
      degrees,
      isEnd,
      // Buitenste schaal telt van links naar rechts op, binnenste andersom.
      outer: 180 - degrees,
      inner: degrees,
      outerX,
      outerY,
      innerX,
      innerY,
      rotation,
      outerBox: getScaleLabelBox({
        text: String(180 - degrees),
        x: outerX,
        y: outerY,
        fontSize: PROTRACTOR_LABEL_FONT_SIZE.outer,
        rotation
      }),
      innerBox: getScaleLabelBox({
        text: String(degrees),
        x: innerX,
        y: innerY,
        fontSize: PROTRACTOR_LABEL_FONT_SIZE.inner,
        rotation
      })
    });

    guides.push({
      degrees,
      x1: round2(cx + cos * (radius - majorLength)),
      y1: round2(cy - sin * (radius - majorLength)),
      x2: round2(cx + cos * guideRadius),
      y2: round2(cy - sin * guideRadius)
    });
  }

  return { cx, cy, radius, ticks, labels, guides };
};

// Hoek (0-180) die de wijzer van de gradenboog aanwijst, gerekend vanaf de
// basislijn rechts en tegen de klok in, ongeacht hoe het instrument gedraaid is.
export const getProtractorReadingFromPoint = ({ pivot, rotation = 0, point }) => {
  if (!pivot || !isFiniteNumber(point?.x) || !isFiniteNumber(point?.y)) return null;

  const boardAngle = (Math.atan2(point.y - pivot.y, point.x - pivot.x) * 180) / Math.PI;
  const local = ((rotation - boardAngle) % 360 + 360) % 360;

  return clampNumber(Math.round(local > 270 ? 0 : local), 0, 180);
};

export const formatProtractorReading = (reading) =>
  `${clampNumber(Math.round(isFiniteNumber(reading) ? reading : 0), 0, 180)}°`;

// ---------------------------------------------------------------------------
// Plaatsing: waar landt een instrument, en hoe groot?
//
// Regel: de volledige omhullende rechthoek van het instrument - inclusief de
// zwevende knoppenrij die erbij hoort - moet binnen het zichtbare deel van het
// bord vallen. Past het niet, dan wordt het instrument kleiner gemaakt in
// plaats van dat het half buiten beeld of achter de werkbalk verdwijnt.
// ---------------------------------------------------------------------------

const unionBounds = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);

  return {
    x: round2(x),
    y: round2(y),
    width: round2(Math.max(a.x + a.width, b.x + b.width) - x),
    height: round2(Math.max(a.y + a.height, b.y + b.height) - y)
  };
};

const boundsFromPoints = (points) => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const x = Math.min(...xs);
  const y = Math.min(...ys);

  return { x: round2(x), y: round2(y), width: round2(Math.max(...xs) - x), height: round2(Math.max(...ys) - y) };
};

// Het ankerpunt waar de knoppenrij aan hangt, in boardcoordinaten.
export const getInstrumentControlAnchor = (instrument) => {
  const metrics = getInstrumentMetrics(instrument);
  if (!metrics) return null;

  if (metrics.def.anchor === 'needle') {
    const geometry = getCompassGeometry({
      x: instrument.x,
      y: instrument.y,
      radius: instrument.radius,
      angle: instrument.angle,
      sizeScale: metrics.sizeScale
    });

    return { x: geometry.knob.x, y: geometry.knob.y, placement: 'above' };
  }

  const local = {
    x: instrument.x + metrics.width / 2,
    y: instrument.y + metrics.height + PRESENTER_INSTRUMENT_CHROME_PX.frameOffset
  };
  const rotated = rotateAroundCenter(local, getInstrumentPivot(instrument), instrument.rotation || 0);

  return { x: rotated.x, y: rotated.y, placement: 'below' };
};

// De ruimte die de knoppenrij inneemt, omgerekend naar boardunits.
const getChromeBounds = (instrument, boardScale) => {
  const anchor = getInstrumentControlAnchor(instrument);
  if (!anchor) return null;

  const scale = isFiniteNumber(boardScale) && boardScale > 0 ? boardScale : 1;
  const chrome = PRESENTER_INSTRUMENT_CHROME_PX;
  const halfWidth = getInstrumentControlBarWidthPx(instrument.id) / 2 / scale;
  const barHeight = chrome.barHeight / scale;
  const badgeHeight = chrome.badgeHeight / scale;

  if (anchor.placement === 'above') {
    return {
      x: round2(anchor.x - halfWidth),
      y: round2(anchor.y - chrome.compassOffset / scale),
      width: round2(halfWidth * 2),
      height: round2(barHeight)
    };
  }

  return {
    x: round2(anchor.x - halfWidth),
    y: round2(anchor.y),
    width: round2(halfWidth * 2),
    height: round2(badgeHeight + barHeight)
  };
};

// De omhullende rechthoek van een instrument in boardunits, met rotatie en
// (optioneel) de knoppenrij meegerekend.
export const getInstrumentBounds = (instrument, { boardScale = 1, includeChrome = false } = {}) => {
  const metrics = getInstrumentMetrics(instrument);
  if (!metrics) return null;

  let bounds;
  if (metrics.def.anchor === 'needle') {
    bounds = getCompassBounds(
      getCompassGeometry({
        x: instrument.x,
        y: instrument.y,
        radius: instrument.radius,
        angle: instrument.angle,
        sizeScale: metrics.sizeScale
      })
    );
  } else {
    const pivot = getInstrumentPivot(instrument);
    const rotation = instrument.rotation || 0;
    const corners = [
      { x: instrument.x, y: instrument.y },
      { x: instrument.x + metrics.width, y: instrument.y },
      { x: instrument.x + metrics.width, y: instrument.y + metrics.height },
      { x: instrument.x, y: instrument.y + metrics.height }
    ].map((corner) => rotateAroundCenter(corner, pivot, rotation));
    bounds = boundsFromPoints(corners);
  }

  if (!includeChrome) return bounds;

  if (metrics.def.anchor === 'needle') {
    // De losse grijpknoppen op naald en potlood steken buiten het instrument
    // uit; die horen net zo goed helemaal in beeld te vallen.
    const scale = isFiniteNumber(boardScale) && boardScale > 0 ? boardScale : 1;
    const pad = PRESENTER_INSTRUMENT_CHROME_PX.grabButton / scale;
    bounds = {
      x: round2(bounds.x - pad),
      y: round2(bounds.y - pad),
      width: round2(bounds.width + pad * 2),
      height: round2(bounds.height + pad * 2)
    };
  }

  return unionBounds(bounds, getChromeBounds(instrument, boardScale));
};

// Maatstappen waarin een instrument mag krimpen tot het past.
const INSTRUMENT_SIZE_STEPS = [1, 0.92, 0.84, 0.76, 0.68, 0.6, 0.5];

// Bijpassende straal voor de passer: hele en halve ruitjes, zodat de straal
// leesbaar blijft ('r = 2 ruitjes') terwijl de passer krimpt.
const getCompassRadiusForSize = (sizeScale, gridSize) => {
  const unit = isFiniteNumber(gridSize) && gridSize > 0 ? gridSize / 2 : 48;
  const steps = Math.max(1, Math.floor((DEFAULT_COMPASS_RADIUS * sizeScale) / unit));

  return clampCompassRadius(steps * unit);
};

const buildPlacementProbe = (instrumentId, sizeScale, gridSize) =>
  createPresenterInstrument(instrumentId, {
    x: 0,
    y: 0,
    sizeScale,
    ...(instrumentId === 'compass' ? { radius: getCompassRadiusForSize(sizeScale, gridSize) } : {})
  });

const normalizeVisibleRect = (visibleRect, page) => {
  const x = clampNumber(isFiniteNumber(visibleRect?.x) ? visibleRect.x : 0, 0, page.width);
  const y = clampNumber(isFiniteNumber(visibleRect?.y) ? visibleRect.y : 0, 0, page.height);
  const width = isFiniteNumber(visibleRect?.width) && visibleRect.width > 0 ? visibleRect.width : page.width;
  const height = isFiniteNumber(visibleRect?.height) && visibleRect.height > 0 ? visibleRect.height : page.height;

  return {
    x,
    y,
    width: Math.max(1, Math.min(width, page.width - x)),
    height: Math.max(1, Math.min(height, page.height - y))
  };
};

// Startpositie en startmaat voor een nieuw instrument: zo groot als past en
// gecentreerd in het zichtbare deel van het bord. De teruggegeven waarden gaan
// rechtstreeks als overrides naar createPresenterInstrument.
export const planInstrumentPlacement = ({
  instrumentId,
  visibleRect,
  boardWidth = 1920,
  boardHeight = 1400,
  boardScale = 1,
  gridSize = 96
} = {}) => {
  const def = PRESENTER_INSTRUMENT_DEFS[instrumentId];
  if (!def) return null;

  const page = {
    width: isFiniteNumber(boardWidth) && boardWidth > 0 ? boardWidth : 1920,
    height: isFiniteNumber(boardHeight) && boardHeight > 0 ? boardHeight : 1400
  };
  const rect = normalizeVisibleRect(visibleRect, page);
  const scale = isFiniteNumber(boardScale) && boardScale > 0 ? boardScale : 1;

  let chosen = null;
  for (const sizeScale of INSTRUMENT_SIZE_STEPS) {
    const probe = buildPlacementProbe(instrumentId, sizeScale, gridSize);
    const bounds = getInstrumentBounds(probe, { boardScale: scale, includeChrome: true });
    chosen = { probe, bounds, sizeScale };

    if (bounds.width <= rect.width && bounds.height <= rect.height) break;
  }

  const { bounds, probe } = chosen;
  // clampNumber geeft het minimum terug zodra het instrument breder of hoger is
  // dan de strook: dan liever de linker-/bovenkant in beeld dan aan twee kanten
  // wegvallen.
  const targetX = clampNumber(
    rect.x + (rect.width - bounds.width) / 2,
    rect.x,
    rect.x + rect.width - bounds.width
  );
  const targetY = clampNumber(
    rect.y + (rect.height - bounds.height) / 2,
    rect.y,
    rect.y + rect.height - bounds.height
  );

  return {
    x: round2(probe.x + (targetX - bounds.x)),
    y: round2(probe.y + (targetY - bounds.y)),
    sizeScale: chosen.sizeScale,
    ...(instrumentId === 'compass' ? { radius: probe.radius, angle: probe.angle } : {})
  };
};
