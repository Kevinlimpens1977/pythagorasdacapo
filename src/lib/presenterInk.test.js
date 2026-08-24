import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  buildSmoothedStrokePath,
  buildStrokeRenderPath,
  buildVariableWidthStrokeOutline,
  constrainLineEnd,
  getStrokePressureWidth,
  getStrokeWidthProfile,
  getUsableStrokePoints,
  shouldUseVariableStrokeWidth
} from './presenterInk.js';

// Een haal met gelijkmatige samples: alleen de uiteinden mogen dan afwijken.
const evenPoints = (count = 20, spacing = 6) =>
  Array.from({ length: count }, (_, index) => ({ x: index * spacing, y: 100 }));

const middleOf = (values) => values.slice(Math.floor(values.length / 3), Math.ceil((values.length * 2) / 3));

test('buildSmoothedStrokePath rendert punt, lijn en curve correct', () => {
  assert.equal(buildSmoothedStrokePath([]), '');
  assert.equal(buildSmoothedStrokePath([{ x: 10, y: 20 }]), 'M 10 20 L 10 20');
  assert.equal(buildSmoothedStrokePath([{ x: 0, y: 0 }, { x: 10, y: 10 }]), 'M 0 0 L 10 10');

  const path = buildSmoothedStrokePath([
    { x: 0, y: 0 },
    { x: 10, y: 20 },
    { x: 20, y: 0 }
  ]);
  assert.match(path, /^M 0 0 Q 10 20 15 10 L 20 0$/);
});

test('buildSmoothedStrokePath negeert ongeldige punten', () => {
  const path = buildSmoothedStrokePath([
    { x: 0, y: 0 },
    { x: Number.NaN, y: 5 },
    { x: 10, y: 10 }
  ]);
  assert.equal(path, 'M 0 0 L 10 10');
});

test('getStrokePressureWidth moduleert alleen bij echte pendruk', () => {
  const base = 6;
  assert.equal(getStrokePressureWidth({ pointerType: 'mouse', points: [{ x: 0, y: 0, p: 0.5 }] }, base), base);
  assert.equal(getStrokePressureWidth({ pointerType: 'pen', points: [{ x: 0, y: 0 }] }, base), base);

  const licht = getStrokePressureWidth({ pointerType: 'pen', points: [{ x: 0, y: 0, p: 0.2 }] }, base);
  assert.equal(licht < base, true);
  assert.equal(licht >= base * 0.65 - 0.01, true);

  const zwaar = getStrokePressureWidth({ pointerType: 'pen', points: [{ x: 0, y: 0, p: 0.9 }] }, base);
  assert.equal(zwaar > base, true);
  assert.equal(zwaar <= base * 1.35 + 0.01, true);
});

test('getUsableStrokePoints ontdubbelt punten en houdt de laatste druk vast', () => {
  const points = getUsableStrokePoints([
    { x: 0, y: 0, p: 0.3 },
    { x: 0.005, y: 0.004, p: 0.7 },
    { x: 10, y: 0 },
    { x: Number.NaN, y: 4 }
  ]);

  assert.equal(points.length, 2);
  assert.equal(points[0].p, 0.7);
  assert.deepEqual(points[1], { x: 10, y: 0 });
});

test('getStrokeWidthProfile geeft elk punt een eigen breedte met dunne uiteinden', () => {
  const points = evenPoints(24, 6);
  const widths = getStrokeWidthProfile({ variant: 'pen', pointerType: 'mouse', points }, 6);

  assert.equal(widths.length, points.length);

  const middle = middleOf(widths);
  const midWidth = middle[Math.floor(middle.length / 2)];
  assert.equal(widths[0] < midWidth, true, 'aanzetten is dunner dan het midden');
  assert.equal(widths[widths.length - 1] < midWidth, true, 'afzetten is dunner dan het midden');

  // Gelijkmatig tempo zonder druk: het middenstuk houdt één breedte.
  assert.equal(Math.max(...middle) - Math.min(...middle) < 0.01, true);
});

test('getStrokeWidthProfile moduleert de pendruk bínnen de haal', () => {
  const points = Array.from({ length: 20 }, (_, index) => ({
    x: index * 8,
    y: 100,
    p: 0.15 + index * 0.04
  }));
  const widths = getStrokeWidthProfile({ variant: 'pen', pointerType: 'pen', points }, 6);
  const middle = middleOf(widths);

  assert.equal(new Set(middle).size > 1, true, 'de breedte is geen constante over de streek');
  assert.equal(middle[middle.length - 1] > middle[0], true, 'meer druk levert een bredere haal');

  // De oude gemiddeldeberekening gaf elk punt dezelfde breedte.
  const gemiddelde = getStrokePressureWidth({ pointerType: 'pen', points }, 6);
  assert.equal(widths.every((width) => width === gemiddelde), false);
});

test('getStrokeWidthProfile maakt ook muis en vinger levendig via de snelheid', () => {
  // Eerst langzaam (kleine stapjes), daarna snel (grote stappen).
  const points = [];
  let x = 0;
  for (let index = 0; index < 24; index += 1) {
    points.push({ x, y: 100 });
    x += index < 12 ? 2 : 20;
  }

  for (const pointerType of ['mouse', 'touch']) {
    const widths = getStrokeWidthProfile({ variant: 'pen', pointerType, points }, 6);
    const langzaam = widths[6];
    const snel = widths[widths.length - 6];

    assert.equal(langzaam > snel, true, `${pointerType}: langzaam is dikker dan snel`);
    assert.equal(new Set(middleOf(widths)).size > 1, true, `${pointerType}: de breedte varieert`);
  }
});

test('getStrokeWidthProfile blijft binnen redelijke grenzen', () => {
  const grillig = Array.from({ length: 30 }, (_, index) => ({
    x: index * (index % 2 === 0 ? 1 : 40),
    y: 100 + (index % 3) * 12
  }));
  const widths = getStrokeWidthProfile({ variant: 'pen', pointerType: 'mouse', points: grillig }, 6);

  assert.equal(widths.every((width) => Number.isFinite(width) && width > 0), true);
  assert.equal(Math.max(...widths) <= 6 * 1.35 + 0.01, true);
  assert.deepEqual(getStrokeWidthProfile({ points: [] }, 6), []);
  assert.deepEqual(getStrokeWidthProfile({ points: [{ x: 1, y: 1 }] }, 6), [6]);
});

test('buildVariableWidthStrokeOutline levert een gesloten omtrek om de middellijn', () => {
  const points = evenPoints(6, 10);
  const widths = points.map(() => 8);
  const outline = buildVariableWidthStrokeOutline(points, widths);

  assert.match(outline, /^M /);
  assert.match(outline, /Z$/);

  const coordinates = outline.match(/-?\d+(\.\d+)?/g).map(Number);
  const ys = coordinates.filter((_, index) => index % 2 === 1);
  // De omtrek loopt een halve breedte boven én onder de middellijn (y = 100).
  assert.equal(Math.max(...ys) >= 103.9, true);
  assert.equal(Math.min(...ys) <= 96.1, true);

  assert.equal(buildVariableWidthStrokeOutline(points, [8]), '');
  assert.equal(buildVariableWidthStrokeOutline([{ x: 0, y: 0 }], [8]), '');
});

test('shouldUseVariableStrokeWidth geldt alleen voor vrije penhalen', () => {
  const points = evenPoints(10, 6);

  assert.equal(shouldUseVariableStrokeWidth({ variant: 'pen', pointerType: 'pen', points }), true);
  assert.equal(shouldUseVariableStrokeWidth({ variant: 'pen', pointerType: 'touch', points }), true);
  assert.equal(shouldUseVariableStrokeWidth({ variant: 'highlighter', pointerType: 'pen', points }), false);
  assert.equal(shouldUseVariableStrokeWidth({ variant: 'geometry-pen', pointerType: 'pen', points }), false);
  assert.equal(shouldUseVariableStrokeWidth({ variant: 'pen', pointerType: 'pen', straight: true, points }), false);
  // Passerbogen komen niet van een pointer en blijven dus constant van breedte.
  assert.equal(shouldUseVariableStrokeWidth({ variant: 'pen', points }), false);
  assert.equal(
    shouldUseVariableStrokeWidth({ variant: 'pen', pointerType: 'pen', points: [{ x: 0, y: 0 }, { x: 9, y: 9 }] }),
    false
  );
});

test('buildStrokeRenderPath kiest vullen voor vrije inkt en lijnen voor de rest', () => {
  const points = evenPoints(12, 6);

  const vrij = buildStrokeRenderPath({ variant: 'pen', pointerType: 'pen', points }, 6);
  assert.equal(vrij.mode, 'fill');
  assert.match(vrij.d, /Z$/);

  const markeer = buildStrokeRenderPath({ variant: 'highlighter', pointerType: 'pen', points }, 24);
  assert.equal(markeer.mode, 'stroke');
  assert.equal(markeer.d, buildSmoothedStrokePath(points));
  assert.equal(markeer.width, 24);

  const liniaal = buildStrokeRenderPath(
    { variant: 'pen', pointerType: 'pen', straight: true, points: [{ x: 0, y: 0 }, { x: 100, y: 0 }] },
    6
  );
  assert.equal(liniaal.mode, 'stroke');
  assert.equal(liniaal.d, 'M 0 0 L 100 0');

  assert.deepEqual(buildStrokeRenderPath({ points: [] }, 6), { mode: 'stroke', d: '', width: 6 });
});

test('buildStrokeRenderPath is de enige bron voor preview en definitieve inkt', () => {
  const boardSource = readFileSync(new URL('../components/presenter/PresenterBoard.jsx', import.meta.url), 'utf8');
  const inkSource = readFileSync(new URL('../components/presenter/PresenterInkLayer.jsx', import.meta.url), 'utf8');

  for (const source of [boardSource, inkSource]) {
    assert.match(source, /buildStrokeRenderPath\(/);
    assert.doesNotMatch(source, /buildSmoothedStrokePath\(/);
    assert.doesNotMatch(source, /getStrokePressureWidth\(/);
  }

  // Zelfde streek, zelfde pad — canvas en SVG kunnen niet uit elkaar lopen.
  const stroke = { variant: 'pen', pointerType: 'pen', points: evenPoints(15, 7).map((point, index) => ({ ...point, p: 0.2 + index * 0.05 })) };
  assert.equal(buildStrokeRenderPath(stroke, 6).d, buildStrokeRenderPath(stroke, 6).d);
});

test('constrainLineEnd snapt op 45-graden stappen wanneer gevraagd', () => {
  const start = { x: 0, y: 0 };
  assert.deepEqual(constrainLineEnd(start, { x: 100, y: 8 }), { x: 100, y: 8 });

  const snapped = constrainLineEnd(start, { x: 100, y: 8 }, { angleSnap: true });
  assert.equal(snapped.y, 0);
  assert.equal(Math.abs(snapped.x - Math.hypot(100, 8)) < 0.01, true);

  const diagonal = constrainLineEnd(start, { x: 95, y: 105 }, { angleSnap: true });
  assert.equal(Math.abs(diagonal.x - diagonal.y) < 0.01, true);
});
