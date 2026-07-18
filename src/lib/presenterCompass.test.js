import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceCompassSweep,
  buildCompassArcPoints,
  buildCompassCirclePoints,
  clampCompassRadius,
  COMPASS_MIN_RADIUS,
  formatCompassRadius,
  getCompassPencilPoint,
  getCompassPointerAngle,
  snapCompassRadius
} from './presenterCompass.js';

test('clampCompassRadius begrenst de straal', () => {
  assert.equal(clampCompassRadius(5), COMPASS_MIN_RADIUS);
  assert.equal(clampCompassRadius(200), 200);
  assert.equal(clampCompassRadius(99999), 1200);
  assert.equal(clampCompassRadius(Number.NaN), 200);
});

test('snapCompassRadius snapt zacht op halve ruitjes', () => {
  assert.equal(snapCompassRadius(190, 96), 192);
  assert.equal(snapCompassRadius(101, 96), 96);
  assert.equal(snapCompassRadius(120, 96), 120);
});

test('getCompassPencilPoint volgt straal en hoek', () => {
  const pencil = getCompassPencilPoint({ x: 100, y: 100, radius: 50, angle: 0 });
  assert.deepEqual(pencil, { x: 150, y: 100 });

  const onder = getCompassPencilPoint({ x: 100, y: 100, radius: 50, angle: 90 });
  assert.equal(Math.round(onder.x), 100);
  assert.equal(Math.round(onder.y), 150);
});

test('advanceCompassSweep telt kortste hoekstappen op en klemt op 360', () => {
  let state = { angle: 10, sweep: 0 };
  state = advanceCompassSweep(state.angle, state.sweep, 40);
  assert.equal(state.sweep, 30);

  state = advanceCompassSweep(state.angle, state.sweep, 20);
  assert.equal(state.sweep, 10);

  const overWrap = advanceCompassSweep(170, 0, -170);
  assert.equal(overWrap.sweep, 20);

  const geklemd = advanceCompassSweep(0, 350, 30);
  assert.equal(geklemd.sweep, 360);
});

test('buildCompassArcPoints maakt een nette boog van start tot eind', () => {
  const points = buildCompassArcPoints({ cx: 0, cy: 0, radius: 100, startAngle: 0, sweep: 90 });
  assert.equal(points.length >= 13, true);

  const eerste = points[0];
  const laatste = points[points.length - 1];
  assert.equal(Math.round(eerste.x), 100);
  assert.equal(Math.round(eerste.y), 0);
  assert.equal(Math.round(laatste.x), 0);
  assert.equal(Math.round(laatste.y), 100);

  const alleOpStraal = points.every((p) => Math.abs(Math.hypot(p.x, p.y) - 100) < 0.5);
  assert.equal(alleOpStraal, true);
});

test('buildCompassArcPoints geeft niets bij minimale sweep', () => {
  assert.deepEqual(buildCompassArcPoints({ cx: 0, cy: 0, radius: 100, startAngle: 0, sweep: 0.5 }), []);
});

test('buildCompassCirclePoints sluit de cirkel', () => {
  const points = buildCompassCirclePoints({ x: 50, y: 50, radius: 80, angle: 0 });
  const eerste = points[0];
  const laatste = points[points.length - 1];
  assert.equal(Math.abs(eerste.x - laatste.x) < 0.5, true);
  assert.equal(Math.abs(eerste.y - laatste.y) < 0.5, true);
});

test('formatCompassRadius toont ruitjes met komma', () => {
  assert.equal(formatCompassRadius(96, 96), 'r = 1 ruitje');
  assert.equal(formatCompassRadius(240, 96), 'r = 2,5 ruitjes');
});

test('getCompassPointerAngle geeft schermhoek in graden', () => {
  assert.equal(getCompassPointerAngle({ x: 0, y: 0 }, { x: 100, y: 0 }), 0);
  assert.equal(getCompassPointerAngle({ x: 0, y: 0 }, { x: 0, y: 100 }), 90);
  assert.equal(getCompassPointerAngle({ x: 0, y: 0 }, { x: -100, y: 0 }), 180);
});
