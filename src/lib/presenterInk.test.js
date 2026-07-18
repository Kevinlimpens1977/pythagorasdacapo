import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSmoothedStrokePath, constrainLineEnd, getStrokePressureWidth } from './presenterInk.js';

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

test('constrainLineEnd snapt op 45-graden stappen wanneer gevraagd', () => {
  const start = { x: 0, y: 0 };
  assert.deepEqual(constrainLineEnd(start, { x: 100, y: 8 }), { x: 100, y: 8 });

  const snapped = constrainLineEnd(start, { x: 100, y: 8 }, { angleSnap: true });
  assert.equal(snapped.y, 0);
  assert.equal(Math.abs(snapped.x - Math.hypot(100, 8)) < 0.01, true);

  const diagonal = constrainLineEnd(start, { x: 95, y: 105 }, { angleSnap: true });
  assert.equal(Math.abs(diagonal.x - diagonal.y) < 0.01, true);
});
