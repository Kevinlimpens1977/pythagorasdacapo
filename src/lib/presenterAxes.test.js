import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AXES_DEFAULT_RANGE,
  AXES_ERRORS,
  fitAxesRangeToCells,
  getAxesFrame,
  getAxesGeometry,
  getAxesGridSizePatch,
  getAxesMaxCells,
  getAxesModel,
  getAxesMoveSnap,
  getAxesOriginRatio,
  getAxesPanelPosition,
  getAxesTypography,
  isAxesDoubleTap,
  parseAxisBound,
  parseAxisLabel,
  planAxesObjectPlacement,
  planAxesResize,
  planAxesUpdate,
  snapAxesPositionToGrid,
  validateAxesRange
} from './presenterAxes.js';

const PAGE = { pageWidth: 1920, pageHeight: 1400 };
const GRID = 96;

const axesObject = (overrides = {}) => ({
  id: 'axes-1',
  type: 'axes',
  x: 192,
  y: 192,
  width: 1056,
  height: 1056,
  range: { ...AXES_DEFAULT_RANGE },
  labels: { x: 'x', y: 'y' },
  ...overrides
});

test('parseAxisBound accepts whole numbers and refuses everything else', () => {
  assert.equal(parseAxisBound('6'), 6);
  assert.equal(parseAxisBound('-5'), -5);
  assert.equal(parseAxisBound('+12'), 12);
  assert.equal(parseAxisBound(' 8 '), 8);
  assert.equal(parseAxisBound('−5'), -5);
  assert.equal(parseAxisBound(0), 0);

  assert.equal(parseAxisBound(''), null);
  assert.equal(parseAxisBound('abc'), null);
  assert.equal(parseAxisBound('2,5'), null);
  assert.equal(parseAxisBound('2.5'), null);
  assert.equal(parseAxisBound(null), null);
  assert.equal(parseAxisBound(Number.NaN), null);
  assert.equal(parseAxisBound('999999999'), null);
});

test('parseAxisLabel keeps physics style axis names and trims runaway text', () => {
  assert.equal(parseAxisLabel('x'), 'x');
  assert.equal(parseAxisLabel('  t (s) '), 't (s)');
  assert.equal(parseAxisLabel('snelheid (m/s)'), 'snelheid (m/s)');
  assert.equal(parseAxisLabel(''), '');
  assert.equal(parseAxisLabel('een heel lange asnaam').length, 14);
});

test('validateAxesRange reports a readable message per field', () => {
  const ok = validateAxesRange({ xMin: '-5', xMax: '6', yMin: '-5', yMax: '6' });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.range, { xMin: -5, xMax: 6, yMin: -5, yMax: 6 });
  assert.equal(ok.message, null);

  const empty = validateAxesRange({ xMin: '', xMax: '6', yMin: '0', yMax: '10' });
  assert.equal(empty.valid, false);
  assert.equal(empty.errors.xMin, AXES_ERRORS.bound);
  assert.equal(empty.range, null);

  const swapped = validateAxesRange({ xMin: '10', xMax: '0', yMin: '0', yMax: '10' });
  assert.equal(swapped.valid, false);
  assert.equal(swapped.errors.xMin, AXES_ERRORS.order);
  assert.equal(swapped.errors.xMax, AXES_ERRORS.order);
  assert.equal(swapped.errors.yMin, undefined);

  const equal = validateAxesRange({ xMin: '0', xMax: '10', yMin: '3', yMax: '3' });
  assert.equal(equal.valid, false);
  assert.equal(equal.errors.yMax, AXES_ERRORS.order);
});

test('getAxesMaxCells leaves room for the page bar and the toolbar peek', () => {
  assert.deepEqual(getAxesMaxCells({ ...PAGE, gridSize: 96 }), { maxCellsX: 18, maxCellsY: 13 });
  assert.deepEqual(getAxesMaxCells({ ...PAGE, gridSize: 72 }), { maxCellsX: 24, maxCellsY: 17 });
});

test('getAxesFrame keeps one unit on one cell while it fits', () => {
  const frame = getAxesFrame({ range: AXES_DEFAULT_RANGE, gridSize: GRID, maxCellsX: 18, maxCellsY: 13 });

  assert.equal(frame.unitsPerCell, 1);
  assert.equal(frame.cellsX, 11);
  assert.equal(frame.cellsY, 11);
  assert.equal(frame.width, 11 * GRID);
  assert.equal(frame.height, 11 * GRID);
  assert.deepEqual(frame.range, { xMin: -5, xMax: 6, yMin: -5, yMax: 6 });
});

test('getAxesFrame puts the origin bottom left for a single quadrant', () => {
  const frame = getAxesFrame({
    range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(frame.unitsPerCell, 1);
  assert.equal(frame.width, 960);
  assert.equal(frame.height, 960);
  assert.equal(frame.originX, 0);
  assert.equal(frame.originY, 960);
  assert.equal(frame.originInsideX, true);
  assert.equal(frame.originInsideY, true);
});

test('getAxesFrame moves the origin with the range instead of fixing it in the middle', () => {
  const frame = getAxesFrame({
    range: { xMin: -2, xMax: 9, yMin: -8, yMax: 3 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(frame.originX, 2 * GRID);
  assert.equal(frame.originY, 3 * GRID);
});

test('getAxesFrame steps up the units per cell instead of shrinking the squares', () => {
  const wide = getAxesFrame({
    range: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(wide.unitsPerCell, 2);
  assert.equal(wide.cellsX, 10);
  assert.equal(wide.cellsY, 10);
  assert.equal(wide.width, 960);

  const huge = getAxesFrame({
    range: { xMin: 0, xMax: 50, yMin: 0, yMax: 50 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(huge.unitsPerCell, 5);
  assert.equal(huge.cellsX, 10);

  const hundred = getAxesFrame({
    range: { xMin: 0, xMax: 100, yMin: 0, yMax: 100 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(hundred.unitsPerCell, 10);
  assert.equal(hundred.cellsX, 10);
});

test('getAxesFrame keeps zero on a grid line when one cell is more than one unit', () => {
  const frame = getAxesFrame({
    range: { xMin: -5, xMax: 25, yMin: -5, yMax: 25 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(frame.unitsPerCell, 5);
  assert.deepEqual(frame.range, { xMin: -5, xMax: 25, yMin: -5, yMax: 25 });
  assert.equal(frame.originX % GRID, 0);
  assert.equal(frame.originY % GRID, 0);

  const widened = getAxesFrame({
    range: { xMin: -3, xMax: 21, yMin: -3, yMax: 21 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  // -3 wordt -4 en 21 wordt 22 bij een stap van 2: het bereik wordt iets
  // ruimer dan ingetypt zodat de nul op een roosterlijn blijft liggen.
  assert.equal(widened.unitsPerCell, 2);
  assert.deepEqual(widened.range, { xMin: -4, xMax: 22, yMin: -4, yMax: 22 });
  assert.equal(widened.originX, 2 * GRID);
});

test('getAxesFrame honours a preferred units per cell while it fits', () => {
  const frame = getAxesFrame({
    range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13,
    unitsPerCell: 5
  });

  assert.equal(frame.unitsPerCell, 5);
  assert.equal(frame.cellsX, 2);

  const tooCoarse = getAxesFrame({
    range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13,
    unitsPerCell: 7
  });

  assert.equal(tooCoarse.unitsPerCell, 1);
});

test('getAxesFrame puts the axis on the edge when zero falls outside the range', () => {
  const frame = getAxesFrame({
    range: { xMin: 20, xMax: 30, yMin: 0, yMax: 10 },
    gridSize: GRID,
    maxCellsX: 18,
    maxCellsY: 13
  });

  assert.equal(frame.originX, 0);
  assert.equal(frame.originInsideX, false);
  assert.equal(frame.originInsideY, true);
  assert.equal(frame.originY, frame.height);
});

test('getAxesModel derives a range for axes objects from before the range existed', () => {
  const legacy = getAxesModel({ type: 'axes', width: 360, height: 260 }, GRID);

  assert.deepEqual(legacy.range, { xMin: -1, xMax: 3, yMin: -1, yMax: 2 });
  assert.deepEqual(legacy.labels, { x: 'x', y: 'y' });
});

test('getAxesModel prefers the stored range and repairs broken labels', () => {
  const model = getAxesModel(
    { type: 'axes', width: 999, height: 999, range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }, labels: { x: 't (s)' } },
    GRID
  );

  assert.deepEqual(model.range, { xMin: 0, xMax: 10, yMin: 0, yMax: 10 });
  assert.deepEqual(model.labels, { x: 't (s)', y: 'y' });

  const broken = getAxesModel({ type: 'axes', width: 384, height: 384, range: { xMin: 5, xMax: 5 } }, GRID);
  assert.deepEqual(broken.range, { xMin: -1, xMax: 3, yMin: -1, yMax: 3 });
});

test('getAxesOriginRatio places the thumbnail axes without the full geometry', () => {
  assert.deepEqual(getAxesOriginRatio({ xMin: -5, xMax: 5, yMin: -5, yMax: 5 }), { x: 0.5, y: 0.5 });
  assert.deepEqual(getAxesOriginRatio({ xMin: 0, xMax: 10, yMin: 0, yMax: 10 }), { x: 0, y: 1 });
  assert.deepEqual(getAxesOriginRatio({ xMin: 20, xMax: 30, yMin: 0, yMax: 10 }), { x: 0, y: 1 });
});

test('getAxesGeometry draws the numbers on the grid lines they belong to', () => {
  const geometry = getAxesGeometry({ object: axesObject(), gridSize: GRID, ...PAGE });
  const { fontSize, tickLength } = getAxesTypography(GRID);

  assert.equal(geometry.frame.unitsPerCell, 1);
  // Twaalf roosterlijnen per as, elk met een maatstreepje.
  assert.equal(geometry.ticks.length, 24);
  // Elke as toont elf getallen: twaalf waarden min de nul, want daar staat de O.
  assert.equal(geometry.numbers.filter((number) => number.axis === 'x').length, 11);
  assert.equal(geometry.numbers.filter((number) => number.axis === 'y').length, 11);
  assert.equal(geometry.numbers.some((number) => number.text === '0'), false);

  const minusThree = geometry.numbers.find((number) => number.axis === 'x' && number.text === '-3');
  assert.equal(minusThree.x, 2 * GRID);
  assert.equal(minusThree.anchor, 'middle');
  assert.equal(minusThree.y, geometry.frame.originY + tickLength + fontSize);

  const four = geometry.numbers.find((number) => number.axis === 'y' && number.text === '4');
  assert.equal(four.anchor, 'end');
  assert.equal(four.x, geometry.frame.originX - tickLength - 8);
  assert.equal(Math.round(four.y - fontSize * 0.35), geometry.frame.originY - 4 * GRID);
});

test('getAxesGeometry marks the origin with an O and names both axes', () => {
  const geometry = getAxesGeometry({ object: axesObject(), gridSize: GRID, ...PAGE });

  assert.equal(geometry.originLabel.text, 'O');
  assert.ok(geometry.originLabel.x < geometry.frame.originX);
  assert.ok(geometry.originLabel.y > geometry.frame.originY);

  assert.equal(geometry.axisNames.x.text, 'x');
  assert.ok(geometry.axisNames.x.x > geometry.frame.width);
  assert.equal(geometry.axisNames.y.text, 'y');
  assert.ok(geometry.axisNames.y.y < 0);
});

test('getAxesGeometry leaves out the O when the origin is off the figure', () => {
  const geometry = getAxesGeometry({
    object: axesObject({ range: { xMin: 20, xMax: 30, yMin: 0, yMax: 10 }, labels: { x: 't (s)', y: 's (m)' } }),
    gridSize: GRID,
    ...PAGE
  });

  assert.equal(geometry.originLabel, null);
  assert.equal(geometry.numbers.some((number) => number.axis === 'x' && number.text === '20'), true);
  assert.equal(geometry.numbers.some((number) => number.axis === 'y' && number.text === '0'), true);
  assert.equal(geometry.axisNames.x.text, 't (s)');
  assert.equal(geometry.axisNames.y.text, 's (m)');
});

test('getAxesGeometry hides an empty axis name instead of drawing nothing readable', () => {
  const geometry = getAxesGeometry({
    object: axesObject({ labels: { x: '', y: '' } }),
    gridSize: GRID,
    ...PAGE
  });

  assert.equal(geometry.axisNames.x, null);
  assert.equal(geometry.axisNames.y, null);
});

test('getAxesGeometry thins out the numbers but keeps every tick when they would collide', () => {
  const geometry = getAxesGeometry({
    object: axesObject({ range: { xMin: -1000, xMax: 1000, yMin: -1000, yMax: 1000 } }),
    gridSize: 72,
    ...PAGE
  });

  const xTicks = geometry.ticks.filter((tick) => tick.key.startsWith('x-'));
  const xNumbers = geometry.numbers.filter((number) => number.axis === 'x');

  assert.equal(xTicks.length, geometry.frame.cellsX + 1);
  assert.ok(xNumbers.length < xTicks.length);
  // De nummering blijft vanaf de oorsprong tellen, zodat er geen scheve reeks
  // ontstaat waarin de nul wordt overgeslagen.
  assert.equal(xNumbers.some((number) => number.text === '0'), false);
  assert.equal(geometry.originLabel.text, 'O');
});

test('getAxesGeometry lets the axes poke past the last square with an arrow', () => {
  const geometry = getAxesGeometry({ object: axesObject(), gridSize: GRID, ...PAGE });

  assert.ok(geometry.xAxis.x1 < 0);
  assert.ok(geometry.xAxis.x2 > geometry.frame.width);
  assert.equal(geometry.xAxis.y1, geometry.frame.originY);
  assert.equal(geometry.xAxis.y2, geometry.frame.originY);
  assert.ok(geometry.yAxis.y2 < 0);
  assert.equal(geometry.yAxis.x1, geometry.frame.originX);
});

test('planAxesObjectPlacement centres a new figure on the grid', () => {
  const placement = planAxesObjectPlacement({
    range: AXES_DEFAULT_RANGE,
    gridSize: GRID,
    ...PAGE,
    visibleRect: { x: 0, y: 56, width: 1920, height: 1272 }
  });

  assert.equal(placement.width, 1056);
  assert.equal(placement.height, 1056);
  assert.equal(placement.x % GRID, 0);
  assert.equal(placement.y % GRID, 0);
  assert.ok(placement.x + placement.width <= 1920);
  assert.ok(placement.y + placement.height <= 1400);
  assert.deepEqual(placement.labels, { x: 'x', y: 'y' });
});

test('fitAxesRangeToCells trims the range instead of the squares when the screen is small', () => {
  // Negen ruitjes hoog beschikbaar: het boekbereik -5..6 wordt -4..5 en blijft
  // één eenheid per ruitje houden.
  assert.deepEqual(fitAxesRangeToCells(AXES_DEFAULT_RANGE, { maxCellsX: 18, maxCellsY: 9 }), {
    xMin: -5,
    xMax: 6,
    yMin: -4,
    yMax: 5
  });

  // Past het al, dan verandert er niets.
  assert.deepEqual(fitAxesRangeToCells(AXES_DEFAULT_RANGE, { maxCellsX: 18, maxCellsY: 13 }), {
    ...AXES_DEFAULT_RANGE
  });

  // De nul blijft altijd binnen het bereik, ook op een heel klein scherm.
  const tiny = fitAxesRangeToCells(AXES_DEFAULT_RANGE, { maxCellsX: 2, maxCellsY: 2 });
  assert.ok(tiny.xMin <= 0 && tiny.xMax >= 0);
  assert.ok(tiny.yMin <= 0 && tiny.yMax >= 0);
});

test('planAxesObjectPlacement fits a new figure inside the visible part of the board', () => {
  const visibleRect = { x: 0, y: 56, width: 1900, height: 930 };
  const placement = planAxesObjectPlacement({
    range: AXES_DEFAULT_RANGE,
    gridSize: GRID,
    ...PAGE,
    visibleRect
  });

  assert.equal(placement.height, 9 * GRID);
  assert.deepEqual(placement.range, { xMin: -5, xMax: 6, yMin: -4, yMax: 5 });
  assert.ok(placement.y >= visibleRect.y);
  assert.ok(placement.y + placement.height <= visibleRect.y + visibleRect.height);
});

test('planAxesUpdate keeps a widened figure inside the visible part of the board', () => {
  const object = axesObject({ x: 192, y: 96 });
  const patch = planAxesUpdate({
    object,
    range: { xMin: 0, xMax: 10, yMin: 0, yMax: 10 },
    gridSize: GRID,
    ...PAGE,
    visibleRect: { x: 0, y: 56, width: 1900, height: 1060 }
  });

  // De onderste 48 units zijn gereserveerd voor de knoppenrij die onder de
  // selectie hangt, dus het kader eindigt daarboven.
  assert.equal(patch.height, 10 * GRID);
  assert.ok(patch.y >= 56);
  assert.ok(patch.y + patch.height <= 56 + 1060 - 48);
  assert.equal(patch.y % GRID, 0);
});

test('planAxesObjectPlacement never pushes the figure off the page', () => {
  const placement = planAxesObjectPlacement({
    range: { xMin: -8, xMax: 10, yMin: -6, yMax: 7 },
    gridSize: GRID,
    ...PAGE,
    visibleRect: { x: 1600, y: 1200, width: 300, height: 190 }
  });

  assert.ok(placement.x >= 0);
  assert.ok(placement.x + placement.width <= 1920);
  assert.ok(placement.y + placement.height <= 1400);
  assert.equal(placement.x % GRID, 0);
});

test('planAxesUpdate applies a new range and keeps the origin in place', () => {
  const object = axesObject({ x: 192, y: 96 });
  const patch = planAxesUpdate({
    object,
    range: { xMin: -5, xMax: 10, yMin: -5, yMax: 6 },
    gridSize: GRID,
    ...PAGE
  });

  assert.deepEqual(patch.range, { xMin: -5, xMax: 10, yMin: -5, yMax: 6 });
  assert.equal(patch.width, 15 * GRID);
  // De oorsprong stond op 192 + 5 ruitjes en staat daar nog steeds.
  assert.equal(patch.x, 192);
  assert.equal(patch.y, 96);
});

test('planAxesUpdate refuses an impossible range instead of silently fixing it', () => {
  assert.equal(
    planAxesUpdate({ object: axesObject(), range: { xMin: 10, xMax: 0, yMin: 0, yMax: 10 }, gridSize: GRID, ...PAGE }),
    null
  );
  assert.equal(
    planAxesUpdate({ object: axesObject(), range: { xMin: '', xMax: '6', yMin: '-5', yMax: '6' }, gridSize: GRID, ...PAGE }),
    null
  );
});

test('planAxesUpdate stores axis names without touching the range', () => {
  const patch = planAxesUpdate({
    object: axesObject(),
    labels: { x: 't (s)', y: 's (m)' },
    gridSize: GRID,
    ...PAGE
  });

  assert.deepEqual(patch.labels, { x: 't (s)', y: 's (m)' });
  assert.deepEqual(patch.range, { ...AXES_DEFAULT_RANGE });
});

test('planAxesResize adds whole squares to the range instead of stretching them', () => {
  const object = axesObject({ x: 192, y: 96 });
  const patch = planAxesResize({ object, gridSize: GRID, ...PAGE, handle: 'se', dx: 150, dy: -40 });

  assert.equal(patch.width % GRID, 0);
  assert.equal(patch.height % GRID, 0);
  assert.equal(patch.range.xMax, 8);
  assert.equal(patch.range.xMin, -5);
  assert.equal(patch.range.yMax, 6);
  assert.equal(patch.range.yMin, -5);
  assert.equal(patch.x, 192);
  assert.equal(patch.y, 96);
});

test('planAxesResize moves the top left corner when dragging the north west handle', () => {
  const object = axesObject({ x: 192, y: 192 });
  const patch = planAxesResize({ object, gridSize: GRID, ...PAGE, handle: 'nw', dx: -192, dy: -96 });

  assert.equal(patch.range.xMin, -7);
  assert.equal(patch.range.xMax, 6);
  assert.equal(patch.range.yMax, 7);
  assert.equal(patch.x, 0);
  assert.equal(patch.y, 96);
  assert.equal(patch.width, 13 * GRID);
  assert.equal(patch.height, 12 * GRID);
});

test('planAxesResize keeps at least two squares and never grows past the page', () => {
  const small = planAxesResize({ object: axesObject(), gridSize: GRID, ...PAGE, handle: 'se', dx: -5000, dy: -5000 });

  assert.equal(small.width, 2 * GRID);
  assert.equal(small.height, 2 * GRID);

  const big = planAxesResize({ object: axesObject(), gridSize: GRID, ...PAGE, handle: 'se', dx: 5000, dy: 5000 });

  assert.equal(big.width, 18 * GRID);
  assert.equal(big.height, 13 * GRID);
});

test('planAxesResize keeps the step per square stable while dragging', () => {
  const object = axesObject({
    x: 96,
    y: 96,
    width: 960,
    height: 960,
    range: { xMin: -10, xMax: 10, yMin: -10, yMax: 10 }
  });
  const patch = planAxesResize({ object, gridSize: GRID, ...PAGE, handle: 'se', dx: -300, dy: 0 });

  // Zeven ruitjes van elk 2 eenheden: de stap blijft 2 in plaats van halverwege
  // de beweging naar 1 te springen.
  assert.equal(patch.width, 7 * GRID);
  assert.equal(patch.range.xMax - patch.range.xMin, 14);
  assert.equal(patch.range.xMin, -10);
});

test('getAxesMoveSnap puts a dragged figure back on the grid lines', () => {
  const objects = [axesObject(), { id: 'rect-1', type: 'rectangle', x: 40, y: 40, width: 100, height: 80 }];
  const bounds = { x: 192, y: 192, width: 1056, height: 1056 };

  const single = getAxesMoveSnap({ objects, objectIds: ['axes-1'], bounds, dx: 61, dy: -37, gridSize: GRID });

  assert.equal((bounds.x + 61 + single.dx) % GRID, 0);
  assert.equal((bounds.y - 37 + single.dy) % GRID, 0);
  assert.deepEqual(single.guides, []);

  // In een groep verschuift de hele selectie een heel aantal ruitjes, zodat de
  // objecten onderling op hun plek blijven staan.
  const group = getAxesMoveSnap({ objects, objectIds: ['axes-1', 'rect-1'], bounds, dx: 61, dy: -37, gridSize: GRID });

  assert.equal((61 + group.dx) % GRID, 0);
  assert.equal((-37 + group.dy) % GRID, 0);

  // Zonder assenstelsel in de selectie blijft het gewone uitlijnen gelden.
  assert.equal(getAxesMoveSnap({ objects, objectIds: ['rect-1'], bounds, dx: 61, dy: -37, gridSize: GRID }), null);
});

test('snapAxesPositionToGrid rounds a position onto the nearest grid line', () => {
  assert.equal(snapAxesPositionToGrid(203, 96), 192);
  assert.equal(snapAxesPositionToGrid(203, 0), 192);
  assert.equal(snapAxesPositionToGrid(Number.NaN, 96), 0);
});

test('isAxesDoubleTap recognises two quick taps on the same figure', () => {
  const first = { objectId: 'axes-1', x: 400, y: 300, time: 1000 };

  assert.equal(isAxesDoubleTap(first, { objectId: 'axes-1', x: 404, y: 306, time: 1200 }), true);
  // Te laat, te ver, een ander object, of helemaal geen eerste tik.
  assert.equal(isAxesDoubleTap(first, { objectId: 'axes-1', x: 400, y: 300, time: 1600 }), false);
  assert.equal(isAxesDoubleTap(first, { objectId: 'axes-1', x: 460, y: 300, time: 1200 }), false);
  assert.equal(isAxesDoubleTap(first, { objectId: 'axes-2', x: 400, y: 300, time: 1200 }), false);
  assert.equal(isAxesDoubleTap(null, { objectId: 'axes-1', x: 400, y: 300, time: 1200 }), false);
});

test('getAxesPanelPosition hangs the panel beside the figure and never off the board', () => {
  const right = getAxesPanelPosition({
    bounds: { x: 96, y: 192, width: 480, height: 480 },
    scale: 1,
    boardWidth: 1920,
    boardHeight: 1400
  });

  assert.equal(right.left, 96 + 480 + 14);
  assert.equal(right.top, 192);

  const flipped = getAxesPanelPosition({
    bounds: { x: 900, y: 100, width: 960, height: 900 },
    scale: 1,
    boardWidth: 1920,
    boardHeight: 1400
  });

  assert.equal(flipped.left, 900 - 14 - 336);

  const squeezed = getAxesPanelPosition({
    bounds: { x: 0, y: 1300, width: 1920, height: 100 },
    scale: 1,
    boardWidth: 1920,
    boardHeight: 1400
  });

  assert.ok(squeezed.left >= 8);
  assert.ok(squeezed.left + 336 <= 1920);
  assert.ok(squeezed.top + 356 <= 1400);
});

test('getAxesGridSizePatch keeps one unit on one square after a grid size change', () => {
  const object = axesObject({ x: 192, y: 192 });
  const patch = getAxesGridSizePatch(object, { gridSize: 72, ...PAGE });

  assert.equal(patch.width, 11 * 72);
  assert.equal(patch.height, 11 * 72);
  assert.equal(patch.x % 72, 0);
  assert.equal(patch.y % 72, 0);
  assert.deepEqual(patch.range, { ...AXES_DEFAULT_RANGE });
});

test('getAxesGridSizePatch upgrades an axes object from before the range existed', () => {
  const patch = getAxesGridSizePatch({ type: 'axes', x: 220, y: 180, width: 360, height: 260 }, { gridSize: GRID, ...PAGE });

  assert.deepEqual(patch.range, { xMin: -1, xMax: 3, yMin: -1, yMax: 2 });
  assert.equal(patch.width, 4 * GRID);
  assert.equal(patch.height, 3 * GRID);
  assert.equal(patch.x, 192);
  assert.equal(patch.y, 192);
});
