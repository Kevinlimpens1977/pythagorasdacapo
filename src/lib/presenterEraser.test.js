import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_PRESENTER_ERASER_SIZE,
  findStrokeIdsHitByEraser,
  getPresenterEraserRadius,
  PRESENTER_ERASER_SIZES
} from './presenterEraser.js';

const horizontalStroke = {
  id: 'stroke-1',
  width: 6,
  points: [
    { x: 100, y: 100 },
    { x: 300, y: 100 }
  ]
};

const lowerStroke = {
  id: 'stroke-2',
  width: 6,
  points: [
    { x: 100, y: 400 },
    { x: 300, y: 400 }
  ]
};

test('er zijn drie borstelgroottes met oplopende radius', () => {
  assert.equal(PRESENTER_ERASER_SIZES.length, 3);
  const radii = PRESENTER_ERASER_SIZES.map((size) => size.radius);
  assert.deepEqual([...radii].sort((a, b) => a - b), radii);
  assert.equal(getPresenterEraserRadius('large') > getPresenterEraserRadius('small'), true);
  assert.equal(getPresenterEraserRadius('onbekend'), getPresenterEraserRadius(DEFAULT_PRESENTER_ERASER_SIZE));
});

test('gum raakt een stroke die binnen de borstelradius ligt', () => {
  const hits = findStrokeIdsHitByEraser([horizontalStroke, lowerStroke], {
    from: { x: 200, y: 120 },
    to: { x: 200, y: 120 },
    radius: 30
  });
  assert.deepEqual(hits, ['stroke-1']);
});

test('gumbeweging over een stroke heen raakt hem ook tussen samples', () => {
  const hits = findStrokeIdsHitByEraser([horizontalStroke], {
    from: { x: 200, y: 40 },
    to: { x: 200, y: 180 },
    radius: 14
  });
  assert.deepEqual(hits, ['stroke-1']);
});

test('gum mist strokes buiten de radius', () => {
  const hits = findStrokeIdsHitByEraser([horizontalStroke, lowerStroke], {
    from: { x: 200, y: 250 },
    to: { x: 200, y: 250 },
    radius: 30
  });
  assert.deepEqual(hits, []);
});

test('stroke-breedte telt mee in de raakafstand', () => {
  const fat = { ...horizontalStroke, id: 'stroke-fat', width: 40 };
  const hits = findStrokeIdsHitByEraser([fat], {
    from: { x: 200, y: 140 },
    to: { x: 200, y: 140 },
    radius: 22
  });
  assert.deepEqual(hits, ['stroke-fat']);
});

test('enkelpuntsstrokes en ongeldige input zijn veilig', () => {
  const dot = { id: 'stroke-dot', width: 6, points: [{ x: 50, y: 50 }] };
  assert.deepEqual(
    findStrokeIdsHitByEraser([dot], { from: { x: 60, y: 50 }, to: { x: 60, y: 50 }, radius: 14 }),
    ['stroke-dot']
  );
  assert.deepEqual(findStrokeIdsHitByEraser([dot], { from: null, to: null, radius: 14 }), []);
  assert.deepEqual(findStrokeIdsHitByEraser(null, { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }), []);
});

test('erasePartialStrokes wist alleen het geraakte stuk en splitst de streek', async () => {
  const { erasePartialStrokes } = await import('./presenterEraser.js');
  const lijn = { id: 'lijn-1', width: 6, color: '#111827', points: [{ x: 0, y: 100 }, { x: 400, y: 100 }] };

  const result = erasePartialStrokes([lijn], { from: { x: 200, y: 100 }, to: { x: 200, y: 100 }, radius: 20 });
  assert.equal(result.changed, true);
  assert.equal(result.strokes.length, 2);

  const [links, rechts] = result.strokes;
  assert.equal(links.id, 'lijn-1');
  assert.notEqual(rechts.id, 'lijn-1');
  assert.equal(links.color, '#111827');
  assert.equal(Math.max(...links.points.map((p) => p.x)) < 180, true);
  assert.equal(Math.min(...rechts.points.map((p) => p.x)) > 220, true);
});

test('erasePartialStrokes verwijdert een streek volledig als alles geraakt is', async () => {
  const { erasePartialStrokes } = await import('./presenterEraser.js');
  const kort = { id: 'kort', width: 6, points: [{ x: 0, y: 0 }, { x: 20, y: 0 }] };

  const result = erasePartialStrokes([kort], { from: { x: 10, y: 0 }, to: { x: 10, y: 0 }, radius: 60 });
  assert.equal(result.changed, true);
  assert.equal(result.strokes.length, 0);
});

test('erasePartialStrokes laat niet-geraakte strokes ongemoeid', async () => {
  const { erasePartialStrokes } = await import('./presenterEraser.js');
  const strokes = [{ id: 'ver-weg', width: 6, points: [{ x: 0, y: 500 }, { x: 100, y: 500 }] }];

  const result = erasePartialStrokes(strokes, { from: { x: 50, y: 0 }, to: { x: 60, y: 0 }, radius: 20 });
  assert.equal(result.changed, false);
  assert.equal(result.strokes, strokes);
});

test('erasePartialStrokes interpoleert druk bij het verdichten', async () => {
  const { erasePartialStrokes } = await import('./presenterEraser.js');
  const drukLijn = { id: 'druk', width: 6, pointerType: 'pen', points: [{ x: 0, y: 0, p: 0.2 }, { x: 300, y: 0, p: 1 }] };

  const result = erasePartialStrokes([drukLijn], { from: { x: 150, y: 0 }, to: { x: 150, y: 0 }, radius: 15 });
  assert.equal(result.changed, true);
  assert.equal(result.strokes.length, 2);
  const alleP = result.strokes.flatMap((s) => s.points).map((p) => p.p);
  assert.equal(alleP.every((p) => Number.isFinite(p) && p >= 0.2 && p <= 1), true);
});
