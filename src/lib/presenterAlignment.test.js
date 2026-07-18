import assert from 'node:assert/strict';
import test from 'node:test';
import { getAlignmentSnap } from './presenterAlignment.js';

const other = { x: 100, y: 100, width: 200, height: 100 };

test('snapt de linkerkant op de linkerkant van een ander object', () => {
  const moving = { x: 104, y: 400, width: 80, height: 60 };
  const snap = getAlignmentSnap(moving, [other]);
  assert.equal(snap.dx, -4);
  assert.deepEqual(snap.guides.find((g) => g.axis === 'vertical'), { axis: 'vertical', position: 100 });
});

test('snapt middens op elkaar', () => {
  const moving = { x: 163, y: 300, width: 80, height: 60 };
  const snap = getAlignmentSnap(moving, [other]);
  assert.equal(snap.dx, -3);
});

test('geen snap buiten tolerantie', () => {
  const moving = { x: 130, y: 400, width: 80, height: 60 };
  const snap = getAlignmentSnap(moving, [other], { tolerance: 6 });
  assert.equal(snap.dx, 0);
  assert.equal(snap.guides.length, 0);
});

test('verticaal en horizontaal snappen onafhankelijk', () => {
  const moving = { x: 104, y: 153, width: 80, height: 60 };
  const snap = getAlignmentSnap(moving, [other]);
  assert.equal(snap.dx, -4);
  assert.equal(snap.dy, -3);
  assert.equal(snap.guides.length, 2);
});

test('lege input is veilig', () => {
  assert.deepEqual(getAlignmentSnap(null, [other]), { dx: 0, dy: 0, guides: [] });
  assert.deepEqual(getAlignmentSnap({ x: 0, y: 0, width: 10, height: 10 }, []), { dx: 0, dy: 0, guides: [] });
});
