// Assenstelsel als objecttype op het Presenter-bord.
//
// Het beeld dat de docent voor zich ziet komt uit een wiskundeboek: lichte
// roosterlijnen over het hele vlak, twee zwarte assen die precies OVER
// roosterlijnen lopen, een pijlpunt aan het eind, maatstreepjes bij elke hele
// eenheid, de getallen netjes op de roosterlijn waar ze bij horen, een O bij
// de oorsprong en de naam van de as aan het uiteinde.
//
// Twee keuzes liggen vast en sturen alle rekenwerk hieronder:
//
//  1. EEN EENHEID IS EEN RUITJE. Het kader is dus altijd een heel aantal
//     ruitjes breed en hoog, en de assen vallen per constructie op
//     roosterlijnen. Past een groot bereik niet meer op het bord, dan wordt
//     het assenstelsel NIET fijner geruit maar gaat de stapgrootte per ruitje
//     omhoog langs de ladder 1-2-5-10-20-50-...; één ruitje stelt dan 2, 5 of
//     10 eenheden voor en de nummering loopt mee.
//  2. De oorsprong ligt waar het bereik hem legt, niet vast in het midden.
//     x van 0 tot 10 en y van 0 tot 10 geeft één kwadrant met de oorsprong
//     linksonder; -5 tot 6 geeft er vier.
//
// Alles hier is puur rekenwerk zonder React, in de geest van
// presenterAngleTool.js: van een bereik naar een kader, en van een kader naar
// de losse lijntjes, streepjes en getallen die de tekenlaag alleen nog hoeft
// neer te zetten.
//
// Let op de naamsbotsing: `background.kind === 'axes'` is de ACHTERGROND met
// een kruis midden op de pagina. Dat is iets anders dan het objecttype
// 'axes' waar dit bestand over gaat, en die achtergrond wordt hier niet
// aangeraakt.

import { PRESENTER_PAGE_BAR_RESERVE_PX, PRESENTER_TOOLBAR_PEEK_PX } from './presenterInstruments.js';

const isFiniteNumber = (value) => Number.isFinite(value);
const isFinitePositiveNumber = (value) => Number.isFinite(value) && value > 0;
const getNumber = (value, fallback = 0) => (isFiniteNumber(value) ? value : fallback);
const round2 = (value) => Math.round(value * 100) / 100;
const clampNumber = (value, min, max) => (max < min ? min : Math.min(Math.max(value, min), max));

export const AXES_DEFAULT_GRID_SIZE = 96;

// Het voorbeeld uit het wiskundeboek: -5 tot 6 op beide assen, dus vier
// kwadranten met de oorsprong iets links en onder het midden.
export const AXES_DEFAULT_RANGE = { xMin: -5, xMax: 6, yMin: -5, yMax: 6 };
export const AXES_DEFAULT_LABELS = { x: 'x', y: 'y' };

// Hoeveel eenheden één ruitje mag voorstellen. De 1-2-5-ladder is wat in elk
// wiskundeboek staat: 3 of 7 per ruitje leest niemand af.
export const AXES_UNIT_LADDER = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

// Grenzen aan wat er ingetypt mag worden. Hele getallen, want een halve
// eenheid per ruitje breekt de belofte "een eenheid is een ruitje".
export const AXES_BOUND_LIMIT = 100000;
export const AXES_LABEL_MAX_LENGTH = 14;
export const AXES_MIN_CELLS = 1;
export const AXES_MIN_RESIZE_CELLS = 2;
export const AXES_MAX_CELLS = 80;

// Dezelfde letter als de tekstobjecten en het gradenlabel van de hoek.
export const AXES_FONT_STACK = 'Sora, Inter, system-ui, sans-serif';

// De pijlpunt aan het eind van een as, in boardunits. Bewust een vaste maat en
// niet de lijndikte-schaal van de gewone pijlobjecten: die punt is een halve
// ruit lang en zou over het laatste getal heen vallen.
export const AXES_ARROW = { length: 26, width: 20 };

export const AXES_ERRORS = {
  bound: 'Vul een heel getal in.',
  order: 'Het minimum moet kleiner zijn dan het maximum.'
};

// ---------------------------------------------------------------------------
// Invoer lezen
// ---------------------------------------------------------------------------

// Wat de docent in een bereikveld typt. Geeft null bij onzin (letters, leeg,
// een komma-getal), zodat het veld rood kan kleuren zonder de figuur kapot te
// maken - net als parseAngleInput bij de hoekconstructie.
export const parseAxisBound = (value) => {
  if (typeof value === 'number') {
    if (!isFiniteNumber(value)) return null;
    const rounded = Math.round(value);
    return Math.abs(rounded) > AXES_BOUND_LIMIT ? null : rounded;
  }

  const text = String(value ?? '')
    .trim()
    .replace(/\s/g, '')
    .replace('−', '-');
  if (!/^[+-]?\d+$/.test(text)) return null;

  const parsed = Number(text);
  if (!isFiniteNumber(parsed) || Math.abs(parsed) > AXES_BOUND_LIMIT) return null;

  return parsed;
};

// De naam van een as: standaard 'x' en 'y', maar een docent moet er 't (s)'
// of 'snelheid (m/s)' van kunnen maken. Leeg is toegestaan en betekent: geen
// naam tekenen.
export const parseAxisLabel = (value) => {
  const text = String(value ?? '').replace(/[\r\n\t]/g, ' ').trim();
  return text.slice(0, AXES_LABEL_MAX_LENGTH);
};

// Per veld een leesbare melding, zodat het paneel precies kan aanwijzen wat er
// mis is in plaats van de invoer stilletjes te negeren.
export const validateAxesRange = (input = {}) => {
  const values = {
    xMin: parseAxisBound(input.xMin),
    xMax: parseAxisBound(input.xMax),
    yMin: parseAxisBound(input.yMin),
    yMax: parseAxisBound(input.yMax)
  };
  const errors = {};

  for (const key of ['xMin', 'xMax', 'yMin', 'yMax']) {
    if (values[key] === null) errors[key] = AXES_ERRORS.bound;
  }

  if (values.xMin !== null && values.xMax !== null && values.xMin >= values.xMax) {
    errors.xMin = AXES_ERRORS.order;
    errors.xMax = AXES_ERRORS.order;
  }

  if (values.yMin !== null && values.yMax !== null && values.yMin >= values.yMax) {
    errors.yMin = AXES_ERRORS.order;
    errors.yMax = AXES_ERRORS.order;
  }

  const errorKeys = Object.keys(errors);

  return {
    valid: errorKeys.length === 0,
    errors,
    message: errorKeys.length === 0 ? null : errors[errorKeys[0]],
    range: errorKeys.length === 0 ? { ...values } : null
  };
};

const readStoredRange = (range) => {
  const result = validateAxesRange(range || {});
  return result.valid ? result.range : null;
};

const readStoredLabels = (labels) => ({
  x: labels && typeof labels.x === 'string' ? parseAxisLabel(labels.x) : AXES_DEFAULT_LABELS.x,
  y: labels && typeof labels.y === 'string' ? parseAxisLabel(labels.y) : AXES_DEFAULT_LABELS.y
});

// Een assenstelsel van vóór deze versie heeft alleen `width` en `height`; het
// werd getekend met de oorsprong op 18% van links en 78% van boven. Daar wordt
// hier het bereik uit afgeleid dat het dichtst bij dat oude plaatje ligt, zodat
// een oud bord opent zonder migratiestap en zonder lege plek. Bij de eerste
// bewerking wordt `range` alsnog weggeschreven.
const getLegacyAxesRange = (object, gridSize) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const cellsX = clampNumber(Math.round(Math.abs(getNumber(object?.width, 360)) / safeGrid), 2, AXES_MAX_CELLS);
  const cellsY = clampNumber(Math.round(Math.abs(getNumber(object?.height, 260)) / safeGrid), 2, AXES_MAX_CELLS);
  const xMin = -Math.round(0.18 * cellsX);
  const yMin = -Math.round(0.22 * cellsY);

  return { xMin, xMax: xMin + cellsX, yMin, yMax: yMin + cellsY };
};

// Het bereik en de asnamen van een object, met of zonder opgeslagen `range`.
// Renderer, hitbox, miniatuur en het bewerkpaneel lezen allemaal hierlangs, zodat
// er maar één bron van waarheid is.
export const getAxesModel = (object, gridSize = AXES_DEFAULT_GRID_SIZE) => ({
  range: readStoredRange(object?.range) || getLegacyAxesRange(object, gridSize),
  labels: readStoredLabels(object?.labels)
});

// ---------------------------------------------------------------------------
// Van bereik naar kader
// ---------------------------------------------------------------------------

// Hoeveel ruitjes er op deze pagina passen. Horizontaal blijft er wat lucht
// staan, verticaal gaan de paginabalk en de gluurstrook van de werkbalk eraf -
// dezelfde strook waar PresenterBoard de instrumenten binnen past.
export const getAxesMaxCells = ({ pageWidth, pageHeight, gridSize } = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const width = isFinitePositiveNumber(pageWidth) ? pageWidth : 1920;
  const height = isFinitePositiveNumber(pageHeight) ? pageHeight : 1400;
  const usableHeight = height - PRESENTER_PAGE_BAR_RESERVE_PX - PRESENTER_TOOLBAR_PEEK_PX;

  return {
    maxCellsX: clampNumber(Math.floor((width * 0.92) / safeGrid), 2, AXES_MAX_CELLS),
    maxCellsY: clampNumber(Math.floor(usableHeight / safeGrid), 2, AXES_MAX_CELLS)
  };
};

// Zodra één ruitje meer dan één eenheid voorstelt, moet 0 nog steeds op een
// roosterlijn liggen. Daarom wordt het minimum naar beneden en het maximum naar
// boven afgerond op een veelvoud van de stapgrootte: het bereik wordt iets
// ruimer dan ingetypt, en dat is in het paneel te zien.
const alignRangeToUnits = (range, unitsPerCell) => {
  const xMin = Math.floor(range.xMin / unitsPerCell) * unitsPerCell;
  const yMin = Math.floor(range.yMin / unitsPerCell) * unitsPerCell;
  let xMax = Math.ceil(range.xMax / unitsPerCell) * unitsPerCell;
  let yMax = Math.ceil(range.yMax / unitsPerCell) * unitsPerCell;

  if (xMax - xMin < unitsPerCell * AXES_MIN_CELLS) xMax = xMin + unitsPerCell * AXES_MIN_CELLS;
  if (yMax - yMin < unitsPerCell * AXES_MIN_CELLS) yMax = yMin + unitsPerCell * AXES_MIN_CELLS;

  return { xMin, xMax, yMin, yMax };
};

const buildAxesFrame = (range, unitsPerCell, gridSize) => {
  const cellsX = Math.round((range.xMax - range.xMin) / unitsPerCell);
  const cellsY = Math.round((range.yMax - range.yMin) / unitsPerCell);
  const width = cellsX * gridSize;
  const height = cellsY * gridSize;
  const originInsideX = range.xMin <= 0 && range.xMax >= 0;
  const originInsideY = range.yMin <= 0 && range.yMax >= 0;

  return {
    range: { ...range },
    unitsPerCell,
    cellsX,
    cellsY,
    gridSize,
    width,
    height,
    // Valt de nul buiten het bereik, dan ligt de as op de rand van het kader:
    // het natuurkundegeval waarin t van 20 tot 30 loopt.
    originX: round2(clampNumber(((0 - range.xMin) / unitsPerCell) * gridSize, 0, width)),
    originY: round2(clampNumber(height - ((0 - range.yMin) / unitsPerCell) * gridSize, 0, height)),
    originInsideX,
    originInsideY
  };
};

// Het kader van een assenstelsel: hoeveel eenheden er in één ruitje gaan,
// hoeveel ruitjes het er zijn, en waar de oorsprong binnen dat kader ligt.
//
// `unitsPerCell` mag meegegeven worden als voorkeur; die wordt gebruikt zolang
// hij past. Bij het slepen aan een handvat houdt dat de stapgrootte stabiel, in
// plaats van halverwege de beweging van 2 naar 1 te springen.
export const getAxesFrame = ({
  range,
  gridSize = AXES_DEFAULT_GRID_SIZE,
  maxCellsX,
  maxCellsY,
  unitsPerCell
} = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const safeRange = readStoredRange(range) || { ...AXES_DEFAULT_RANGE };
  const limitX = clampNumber(Math.round(getNumber(maxCellsX, AXES_MAX_CELLS)), 2, AXES_MAX_CELLS);
  const limitY = clampNumber(Math.round(getNumber(maxCellsY, AXES_MAX_CELLS)), 2, AXES_MAX_CELLS);
  const preferred = AXES_UNIT_LADDER.includes(unitsPerCell) ? unitsPerCell : null;
  const candidates = preferred ? [preferred, ...AXES_UNIT_LADDER] : AXES_UNIT_LADDER;

  for (const step of candidates) {
    const aligned = alignRangeToUnits(safeRange, step);
    const cellsX = (aligned.xMax - aligned.xMin) / step;
    const cellsY = (aligned.yMax - aligned.yMin) / step;

    if (cellsX <= limitX && cellsY <= limitY) return buildAxesFrame(aligned, step, safeGrid);
  }

  // Onvoorstelbaar groot bereik: neem de grofste stap en knip het bereik af op
  // wat er past, zodat er altijd een tekenbaar kader uit komt.
  const step = AXES_UNIT_LADDER[AXES_UNIT_LADDER.length - 1];
  const aligned = alignRangeToUnits(safeRange, step);
  const clamped = {
    xMin: aligned.xMin,
    xMax: aligned.xMin + Math.min(limitX, Math.round((aligned.xMax - aligned.xMin) / step)) * step,
    yMin: aligned.yMin,
    yMax: aligned.yMin + Math.min(limitY, Math.round((aligned.yMax - aligned.yMin) / step)) * step
  };

  return buildAxesFrame(clamped, step, safeGrid);
};

// Waar de oorsprong ligt als breukdeel van het kader (0..1, y van boven af
// geteld). De miniaturen tekenen hiermee twee lijntjes op de goede plek zonder
// de hele meetkunde uit te rekenen.
export const getAxesOriginRatio = (range) => {
  const safeRange = readStoredRange(range) || { ...AXES_DEFAULT_RANGE };
  const spanX = safeRange.xMax - safeRange.xMin;
  const spanY = safeRange.yMax - safeRange.yMin;

  return {
    x: round2(clampNumber((0 - safeRange.xMin) / spanX, 0, 1)),
    y: round2(clampNumber(1 - (0 - safeRange.yMin) / spanY, 0, 1))
  };
};

// ---------------------------------------------------------------------------
// Van kader naar tekening
// ---------------------------------------------------------------------------

const formatAxisNumber = (value) => String(value);

// Hoeveel ruitjes er tussen twee getallen zitten. De maatstreepjes blijven op
// elk ruitje staan; alleen de getallen worden uitgedund zodra ze elkaar zouden
// raken - precies wat een wiskundeboek doet bij een grote schaal.
const getLabelEvery = (needed, available) => {
  if (!(available > 0)) return 1;

  for (const step of [1, 2, 5, 10]) {
    if (needed <= available * step) return step;
  }

  return 10;
};

const estimateTextWidth = (text, fontSize) => text.length * fontSize * 0.62;

const getAxisValues = (min, max, step) => {
  const values = [];
  const count = Math.round((max - min) / step);

  for (let index = 0; index <= count; index += 1) {
    values.push(min + index * step);
  }

  return values;
};

export const getAxesTypography = (gridSize = AXES_DEFAULT_GRID_SIZE) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;

  return {
    // Klein genoeg om tussen twee roosterlijnen te passen, groot genoeg om
    // vanaf vier meter van een digibord af te lezen.
    fontSize: Math.round(clampNumber(safeGrid * 0.32, 20, 34)),
    tickLength: Math.round(clampNumber(safeGrid * 0.1, 6, 12)),
    // Hoe ver de as met zijn pijlpunt voorbij het laatste ruitje steekt. Ruimer
    // dan de pijlpunt zelf lang is (AXES_ARROW), anders komt de punt over het
    // laatste getal heen te liggen.
    overshoot: Math.round(clampNumber(safeGrid * 0.42, 30, 52))
  };
};

// De hele tekening van een assenstelsel in zijn eigen kader (linksboven = 0,0):
// twee assen, maatstreepjes, getallen, de O bij de oorsprong en de asnamen.
// De tekenlaag hoeft dit alleen nog neer te zetten.
export const getAxesGeometry = ({
  object,
  gridSize = AXES_DEFAULT_GRID_SIZE,
  pageWidth,
  pageHeight
} = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const model = getAxesModel(object, safeGrid);
  const { maxCellsX, maxCellsY } = getAxesMaxCells({ pageWidth, pageHeight, gridSize: safeGrid });
  const frame = getAxesFrame({ range: model.range, gridSize: safeGrid, maxCellsX, maxCellsY });
  const { fontSize, tickLength, overshoot } = getAxesTypography(safeGrid);
  const { width, height, originX, originY, unitsPerCell } = frame;

  const xValues = getAxisValues(frame.range.xMin, frame.range.xMax, unitsPerCell);
  const yValues = getAxisValues(frame.range.yMin, frame.range.yMax, unitsPerCell);
  const widestX = xValues.reduce(
    (widest, value) => Math.max(widest, estimateTextWidth(formatAxisNumber(value), fontSize)),
    0
  );
  const labelEveryX = getLabelEvery(widestX + 12, safeGrid);
  const labelEveryY = getLabelEvery(fontSize * 1.5, safeGrid);

  // Vanaf welke roosterlijn de nummering telt: vanaf de oorsprong als die in
  // beeld is, zodat 0 nooit wordt overgeslagen bij een grovere stap.
  const anchorX = frame.originInsideX ? Math.round((0 - frame.range.xMin) / unitsPerCell) : 0;
  const anchorY = frame.originInsideY ? Math.round((0 - frame.range.yMin) / unitsPerCell) : 0;
  const hasOrigin = frame.originInsideX && frame.originInsideY;

  const ticks = [];
  const numbers = [];

  xValues.forEach((value, index) => {
    const x = round2(index * safeGrid);
    ticks.push({
      key: `x-${index}`,
      x1: x,
      y1: round2(originY - tickLength),
      x2: x,
      y2: round2(originY + tickLength)
    });

    if ((index - anchorX) % labelEveryX !== 0) return;
    if (value === 0 && hasOrigin) return;

    numbers.push({
      key: `nx-${index}`,
      axis: 'x',
      text: formatAxisNumber(value),
      x,
      y: round2(originY + tickLength + fontSize),
      anchor: 'middle'
    });
  });

  yValues.forEach((value, index) => {
    const y = round2(height - index * safeGrid);
    ticks.push({
      key: `y-${index}`,
      x1: round2(originX - tickLength),
      y1: y,
      x2: round2(originX + tickLength),
      y2: y
    });

    if ((index - anchorY) % labelEveryY !== 0) return;
    if (value === 0 && hasOrigin) return;

    numbers.push({
      key: `ny-${index}`,
      axis: 'y',
      text: formatAxisNumber(value),
      x: round2(originX - tickLength - 8),
      y: round2(y + fontSize * 0.35),
      anchor: 'end'
    });
  });

  return {
    frame,
    labels: model.labels,
    fontSize,
    tickLength,
    overshoot,
    // De assen steken met hun pijlpunt een stukje voorbij het laatste ruitje,
    // net als in het boek. Het kader zelf blijft een heel aantal ruitjes.
    xAxis: { x1: round2(-overshoot), y1: originY, x2: round2(width + overshoot), y2: originY },
    yAxis: { x1: originX, y1: round2(height + overshoot), x2: originX, y2: round2(-overshoot) },
    ticks,
    numbers,
    originLabel: hasOrigin
      ? {
          text: 'O',
          x: round2(originX - tickLength - 8),
          y: round2(originY + tickLength + fontSize),
          anchor: 'end'
        }
      : null,
    axisNames: {
      x: model.labels.x
        ? {
            text: model.labels.x,
            x: round2(width + overshoot + 12),
            y: round2(originY + fontSize * 0.95),
            anchor: 'start'
          }
        : null,
      y: model.labels.y
        ? {
            text: model.labels.y,
            x: round2(originX + tickLength + 10),
            y: round2(-overshoot - 8),
            anchor: 'start'
          }
        : null
    }
  };
};

// ---------------------------------------------------------------------------
// Plaatsen, bijstellen en slepen
// ---------------------------------------------------------------------------

const snapToGrid = (value, gridSize) => Math.round(value / gridSize) * gridSize;

// Klemmen tussen twee grenzen zonder van de roosterlijn af te raken: de
// ondergrens gaat omhoog naar het eerstvolgende veelvoud, de bovengrens omlaag.
const clampToGridRange = (value, min, max, gridSize) => {
  const low = Math.ceil(min / gridSize) * gridSize;
  const high = Math.floor(max / gridSize) * gridSize;
  if (high < low) return value;

  return clampNumber(value, low, high);
};

// Het kader blijft op de ruitjes vallen, binnen de pagina, en - als het past -
// binnen het stuk bord dat de docent op dit moment ziet.
const placeOnGrid = (value, size, pageSize, gridSize, window = null) => {
  let result = snapToGrid(getNumber(value), gridSize);

  if (window && window.size >= size) {
    result = clampToGridRange(result, window.start, window.start + window.size - size, gridSize);
  }

  if (!isFinitePositiveNumber(pageSize)) return Math.max(0, result);

  const room = pageSize - size;
  if (room <= 0) return 0;

  return clampNumber(result, 0, Math.floor(room / gridSize) * gridSize);
};

// Onder de selectie hangt de knoppenrij van het bord (Voorgrond, Achtergrond,
// Bereik). Die telt mee als deel van de figuur, anders valt hij bij een
// beeldvullend assenstelsel achter de werkbalk.
export const AXES_SELECTION_BAR_UNITS = 48;

const getVisibleWindows = (visibleRect, gridSize) => {
  if (!visibleRect || !isFinitePositiveNumber(visibleRect.width) || !isFinitePositiveNumber(visibleRect.height)) {
    return { x: null, y: null, maxCellsX: null, maxCellsY: null };
  }

  const height = Math.max(gridSize, visibleRect.height - AXES_SELECTION_BAR_UNITS);

  return {
    x: { start: getNumber(visibleRect.x), size: visibleRect.width },
    y: { start: getNumber(visibleRect.y), size: height },
    maxCellsX: Math.floor(visibleRect.width / gridSize),
    maxCellsY: Math.floor(height / gridSize)
  };
};

// Een nieuw assenstelsel hoort in één oogopslag helemaal in beeld te staan.
// Past het boekbereik niet op het scherm van dit lokaal, dan wordt het bereik
// een slag kleiner gemaakt - NIET de ruitjes, want één eenheid blijft één
// ruitje. Er gaat steeds een eenheid af aan de kant die het verst van de
// oorsprong ligt, zodat de figuur zijn vorm houdt en de nul in beeld blijft.
export const fitAxesRangeToCells = (range, { maxCellsX, maxCellsY } = {}) => {
  const safeRange = readStoredRange(range) || { ...AXES_DEFAULT_RANGE };

  const fitAxis = (min, max, limit) => {
    if (!Number.isFinite(limit) || limit < 2) return { min, max };

    let low = min;
    let high = max;
    const zeroInside = low <= 0 && high >= 0;

    for (let step = 0; step < 200 && high - low > limit; step += 1) {
      const trimHigh = Math.abs(high) > Math.abs(low);
      const nextHigh = trimHigh ? high - 1 : high;
      const nextLow = trimHigh ? low : low + 1;
      if (nextHigh <= nextLow) break;
      if (zeroInside && (nextLow > 0 || nextHigh < 0)) break;

      low = nextLow;
      high = nextHigh;
    }

    return { min: low, max: high };
  };

  const x = fitAxis(safeRange.xMin, safeRange.xMax, maxCellsX);
  const y = fitAxis(safeRange.yMin, safeRange.yMax, maxCellsY);

  return { xMin: x.min, xMax: x.max, yMin: y.min, yMax: y.max };
};

// Waar een nieuw assenstelsel landt: gecentreerd in het vrije deel van het
// bord, met de linkerbovenhoek op een roosterlijn zodat elke aslijn samenvalt
// met een lijn van het ruitjespapier.
export const planAxesObjectPlacement = ({
  range = AXES_DEFAULT_RANGE,
  labels = AXES_DEFAULT_LABELS,
  gridSize = AXES_DEFAULT_GRID_SIZE,
  pageWidth,
  pageHeight,
  visibleRect = null
} = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const page = getAxesMaxCells({ pageWidth, pageHeight, gridSize: safeGrid });
  const view = getVisibleWindows(visibleRect, safeGrid);
  const fitted = fitAxesRangeToCells(range, {
    maxCellsX: view.maxCellsX ?? page.maxCellsX,
    maxCellsY: view.maxCellsY ?? page.maxCellsY
  });
  const frame = getAxesFrame({
    range: fitted,
    gridSize: safeGrid,
    maxCellsX: page.maxCellsX,
    maxCellsY: page.maxCellsY
  });
  const area = view.x
    ? visibleRect
    : { x: 0, y: 0, width: getNumber(pageWidth, 1920), height: getNumber(pageHeight, 1400) };

  return {
    x: placeOnGrid(getNumber(area.x) + (area.width - frame.width) / 2, frame.width, pageWidth, safeGrid, view.x),
    y: placeOnGrid(getNumber(area.y) + (area.height - frame.height) / 2, frame.height, pageHeight, safeGrid, view.y),
    width: frame.width,
    height: frame.height,
    range: { ...frame.range },
    labels: { x: parseAxisLabel(labels?.x ?? AXES_DEFAULT_LABELS.x), y: parseAxisLabel(labels?.y ?? AXES_DEFAULT_LABELS.y) }
  };
};

// Een nieuw bereik of een nieuwe asnaam uit het bewerkpaneel. De oorsprong
// blijft staan waar hij stond zolang hij in beeld is: rek je het bereik naar
// rechts op, dan groeit de figuur naar rechts en blijft alles wat er al bij
// getekend was op zijn plek.
export const planAxesUpdate = ({
  object,
  range,
  labels,
  gridSize = AXES_DEFAULT_GRID_SIZE,
  pageWidth,
  pageHeight,
  visibleRect = null
} = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const current = getAxesModel(object, safeGrid);
  const validated = validateAxesRange(range || current.range);
  if (!validated.valid) return null;

  const { maxCellsX, maxCellsY } = getAxesMaxCells({ pageWidth, pageHeight, gridSize: safeGrid });
  const before = getAxesFrame({ range: current.range, gridSize: safeGrid, maxCellsX, maxCellsY });
  const after = getAxesFrame({ range: validated.range, gridSize: safeGrid, maxCellsX, maxCellsY });

  const keepOrigin = before.originInsideX && after.originInsideX;
  const keepOriginY = before.originInsideY && after.originInsideY;
  const x = keepOrigin
    ? getNumber(object?.x) + before.originX - after.originX
    : getNumber(object?.x);
  const y = keepOriginY
    ? getNumber(object?.y) + before.originY - after.originY
    : getNumber(object?.y);

  const nextLabels = labels
    ? { x: parseAxisLabel(labels.x ?? current.labels.x), y: parseAxisLabel(labels.y ?? current.labels.y) }
    : { ...current.labels };
  const view = getVisibleWindows(visibleRect, safeGrid);

  return {
    x: placeOnGrid(x, after.width, pageWidth, safeGrid, view.x),
    y: placeOnGrid(y, after.height, pageHeight, safeGrid, view.y),
    width: after.width,
    height: after.height,
    range: { ...after.range },
    labels: nextLabels
  };
};

// Slepen aan een hoekhandvat verandert het BEREIK, niet de schaal: er komen
// ruitjes bij of af, en elk ruitje blijft evenveel eenheden voorstellen. Zo is
// slepen precies wat een docent verwacht, en blijft het assenstelsel op het
// ruitjespapier vallen.
export const planAxesResize = ({
  object,
  gridSize = AXES_DEFAULT_GRID_SIZE,
  pageWidth,
  pageHeight,
  handle = 'se',
  dx = 0,
  dy = 0
} = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const model = getAxesModel(object, safeGrid);
  const { maxCellsX, maxCellsY } = getAxesMaxCells({ pageWidth, pageHeight, gridSize: safeGrid });
  const before = getAxesFrame({ range: model.range, gridSize: safeGrid, maxCellsX, maxCellsY });
  const step = before.unitsPerCell;
  const handleName = typeof handle === 'string' ? handle : '';
  const west = handleName.includes('w');
  const east = handleName.includes('e');
  const north = handleName.includes('n');
  const south = handleName.includes('s');

  const cellsFrom = (size, limit) =>
    clampNumber(Math.round(size / safeGrid), AXES_MIN_RESIZE_CELLS, limit);
  const cellsX = east
    ? cellsFrom(before.width + getNumber(dx), maxCellsX)
    : west
      ? cellsFrom(before.width - getNumber(dx), maxCellsX)
      : before.cellsX;
  const cellsY = south
    ? cellsFrom(before.height + getNumber(dy), maxCellsY)
    : north
      ? cellsFrom(before.height - getNumber(dy), maxCellsY)
      : before.cellsY;

  const range = { ...before.range };
  if (east) range.xMax = range.xMin + cellsX * step;
  else if (west) range.xMin = range.xMax - cellsX * step;
  // De onderrand van het kader is de KLEINSTE y-waarde: naar beneden slepen
  // laat het bereik dus naar beneden uitlopen.
  if (south) range.yMin = range.yMax - cellsY * step;
  else if (north) range.yMax = range.yMin + cellsY * step;

  const after = getAxesFrame({
    range,
    gridSize: safeGrid,
    maxCellsX,
    maxCellsY,
    unitsPerCell: step
  });

  return {
    x: placeOnGrid(getNumber(object?.x) + (west ? before.width - after.width : 0), after.width, pageWidth, safeGrid),
    y: placeOnGrid(getNumber(object?.y) + (north ? before.height - after.height : 0), after.height, pageHeight, safeGrid),
    width: after.width,
    height: after.height,
    range: { ...after.range },
    labels: { ...model.labels }
  };
};

// Het kader opnieuw uitrekenen bij een andere ruitmaat, zodat één eenheid één
// ruitje blijft wanneer de docent van 96 naar 72 wisselt.
export const getAxesGridSizePatch = (object, { gridSize, pageWidth, pageHeight } = {}) => {
  const safeGrid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;
  const model = getAxesModel(object, safeGrid);
  const { maxCellsX, maxCellsY } = getAxesMaxCells({ pageWidth, pageHeight, gridSize: safeGrid });
  const frame = getAxesFrame({ range: model.range, gridSize: safeGrid, maxCellsX, maxCellsY });

  return {
    x: placeOnGrid(getNumber(object?.x), frame.width, pageWidth, safeGrid),
    y: placeOnGrid(getNumber(object?.y), frame.height, pageHeight, safeGrid),
    width: frame.width,
    height: frame.height,
    range: { ...frame.range },
    labels: { ...model.labels }
  };
};

export const isPresenterAxesObject = (object) => object?.type === 'axes';

// Een assenstelsel dat versleept wordt, moet op de roosterlijnen blijven
// vallen. Zit hij in zijn eentje in de selectie, dan wordt zijn nieuwe plek op
// het raster gelegd. Zit hij in een groep, dan wordt de hele VERPLAATSING op
// hele ruitjes gelegd: de groep blijft zo onderling op zijn plek staan én het
// assenstelsel blijft op het ruitjespapier vallen.
//
// Geeft null terug als er geen assenstelsel in de selectie zit; dan gelden de
// gewone hulplijnen van getAlignmentSnap, precies zoals nu.
export const getAxesMoveSnap = ({
  objects = [],
  objectIds = [],
  bounds = null,
  dx = 0,
  dy = 0,
  gridSize = AXES_DEFAULT_GRID_SIZE
} = {}) => {
  const ids = new Set(Array.isArray(objectIds) ? objectIds : [objectIds]);
  const selected = (Array.isArray(objects) ? objects : []).filter((object) => ids.has(object?.id));
  if (!selected.some((object) => object?.type === 'axes')) return null;

  const grid = isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE;

  if (selected.length === 1 && bounds) {
    const targetX = getNumber(bounds.x) + getNumber(dx);
    const targetY = getNumber(bounds.y) + getNumber(dy);

    return {
      dx: round2(snapToGrid(targetX, grid) - targetX),
      dy: round2(snapToGrid(targetY, grid) - targetY),
      guides: []
    };
  }

  return {
    dx: round2(snapToGrid(getNumber(dx), grid) - getNumber(dx)),
    dy: round2(snapToGrid(getNumber(dy), grid) - getNumber(dy)),
    guides: []
  };
};

// Een groepsselectie schalen verschuift een assenstelsel wel, maar rekt hem
// niet uit. Die verschoven plek moet alsnog op een roosterlijn landen.
export const snapAxesPositionToGrid = (value, gridSize = AXES_DEFAULT_GRID_SIZE) =>
  snapToGrid(getNumber(value), isFinitePositiveNumber(gridSize) ? gridSize : AXES_DEFAULT_GRID_SIZE);

// Twee keer kort achter elkaar op hetzelfde assenstelsel tikken opent het
// bewerkpaneel. Bewust zelf geteld en niet via een dblclick-gebeurtenis: het
// bord roept preventDefault() aan op pointerdown (nodig voor pen en palm
// rejection), en daarmee komt er in de browser nooit een dblclick. Zo werkt het
// bovendien net zo goed met een vinger op het digibord als met een muis.
export const AXES_DOUBLE_TAP_MS = 450;
export const AXES_DOUBLE_TAP_SLOP = 28;

export const isAxesDoubleTap = (previous, current) => {
  if (!previous || !current) return false;
  if (!previous.objectId || previous.objectId !== current.objectId) return false;

  const elapsed = getNumber(current.time) - getNumber(previous.time);
  if (!(elapsed >= 0 && elapsed <= AXES_DOUBLE_TAP_MS)) return false;

  return (
    Math.hypot(getNumber(current.x) - getNumber(previous.x), getNumber(current.y) - getNumber(previous.y)) <=
    AXES_DOUBLE_TAP_SLOP
  );
};

// Maat van het zwevende bewerkpaneel bij de selectie, in schermpixels.
export const AXES_PANEL_SIZE = { width: 336, height: 356, gap: 14, margin: 8 };

// Waar dat paneel komt te hangen: rechts van het assenstelsel, en anders links
// ervan of tegen de rand aan. Het mag nooit half buiten het bord vallen, want
// dan is er op een digibord geen bij te komen.
export const getAxesPanelPosition = ({ bounds, scale = 1, boardWidth = 1920, boardHeight = 1400 } = {}) => {
  const safeScale = isFinitePositiveNumber(scale) ? scale : 1;
  const { width, height, gap, margin } = AXES_PANEL_SIZE;
  const viewWidth = getNumber(boardWidth, 1920) * safeScale;
  const viewHeight = getNumber(boardHeight, 1400) * safeScale;
  const boxX = getNumber(bounds?.x) * safeScale;
  const boxY = getNumber(bounds?.y) * safeScale;
  const boxRight = boxX + getNumber(bounds?.width) * safeScale;

  const preferRight = boxRight + gap + width <= viewWidth;
  const preferLeft = boxX - gap - width >= 0;
  const left = preferRight
    ? boxRight + gap
    : preferLeft
      ? boxX - gap - width
      : clampNumber(boxX, margin, Math.max(margin, viewWidth - width - margin));

  return {
    left: Math.round(left),
    top: Math.round(clampNumber(boxY, margin, Math.max(margin, viewHeight - height - margin))),
    width,
    height
  };
};
