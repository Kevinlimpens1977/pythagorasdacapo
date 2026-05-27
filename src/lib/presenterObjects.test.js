import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPresenterObject,
  canRotatePresenterObject,
  canDuplicatePresenterObject,
  getPresenterObjectLabel
} from './presenterObjects.js';

const v1aShapeTypes = [
  'rectangle',
  'ellipse',
  'line',
  'arrow',
  'triangle',
  'polygon',
  'axes',
  'table',
  'angle'
];

const v1aShapeDefaults = {
  rectangle: {
    width: 240,
    height: 160
  },
  ellipse: {
    width: 220,
    height: 160
  },
  line: {
    width: 260,
    height: 0
  },
  arrow: {
    width: 260,
    height: 0
  },
  triangle: {
    width: 240,
    height: 180
  },
  polygon: {
    width: 240,
    height: 180,
    points: [
      { x: 0, y: 180 },
      { x: 120, y: 0 },
      { x: 240, y: 180 }
    ]
  },
  axes: {
    width: 360,
    height: 260
  },
  table: {
    width: 360,
    height: 240,
    rows: 4,
    columns: 5
  },
  angle: {
    width: 180,
    height: 120,
    angleDegrees: 90
  }
};

test('createPresenterObject creates rectangle defaults', () => {
  const object = createPresenterObject('rectangle', { x: 10, y: 20 });

  assert.equal(object.type, 'rectangle');
  assert.equal(object.x, 10);
  assert.equal(object.y, 20);
  assert.equal(object.width, 240);
  assert.equal(object.height, 160);
  assert.equal(object.rotation, 0);
});

test('createPresenterObject creates all V1A shape types', () => {
  const objects = v1aShapeTypes.map((type) => createPresenterObject(type));

  assert.deepEqual(objects.map((object) => object.type), v1aShapeTypes);
});

test('createPresenterObject applies exact V1A shape defaults', () => {
  for (const type of v1aShapeTypes) {
    const object = createPresenterObject(type);

    assert.deepEqual(
      Object.fromEntries(Object.keys(v1aShapeDefaults[type]).map((key) => [key, object[key]])),
      v1aShapeDefaults[type],
      `${type} defaults should match metadata`
    );
  }
});

test('createPresenterObject preserves nullish-safe overrides', () => {
  const object = createPresenterObject('rectangle', {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    strokeWidth: 0,
    showLabel: false
  });

  assert.equal(object.x, 0);
  assert.equal(object.y, 0);
  assert.equal(object.width, 0);
  assert.equal(object.height, 0);
  assert.equal(object.rotation, 0);
  assert.equal(object.strokeWidth, 0);
  assert.equal(object.showLabel, false);
});

test('createPresenterObject clones nested polygon defaults', () => {
  const first = createPresenterObject('polygon');
  const second = createPresenterObject('polygon');

  assert.notEqual(first.points, second.points);
  assert.notEqual(first.points[0], second.points[0]);

  first.points[0].x = 99;

  assert.deepEqual(second.points, v1aShapeDefaults.polygon.points);
});

test('canRotatePresenterObject returns true for V1A shapes and false for content/question objects', () => {
  for (const type of v1aShapeTypes) {
    assert.equal(canRotatePresenterObject({ type }), true, `${type} should rotate`);
  }

  assert.equal(canRotatePresenterObject({ type: 'lessonBlock' }), false);
  assert.equal(canRotatePresenterObject({ type: 'questionWindow' }), false);
});

test('canDuplicatePresenterObject returns true for V1A shapes and text, false for lesson blocks', () => {
  for (const type of v1aShapeTypes) {
    assert.equal(canDuplicatePresenterObject({ type }), true, `${type} should duplicate`);
  }

  assert.equal(canDuplicatePresenterObject({ type: 'text' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'lessonBlock' }), false);
});

test('getPresenterObjectLabel returns readable Dutch labels', () => {
  assert.equal(getPresenterObjectLabel({ type: 'rectangle' }), 'Rechthoek');
  assert.equal(getPresenterObjectLabel({ type: 'ellipse' }), 'Cirkel/ovaal');
  assert.equal(getPresenterObjectLabel({ type: 'line' }), 'Lijn');
  assert.equal(getPresenterObjectLabel({ type: 'arrow' }), 'Pijl');
  assert.equal(getPresenterObjectLabel({ type: 'triangle' }), 'Driehoek');
  assert.equal(getPresenterObjectLabel({ type: 'polygon' }), 'Veelhoek');
  assert.equal(getPresenterObjectLabel({ type: 'axes' }), 'Assenstelsel');
  assert.equal(getPresenterObjectLabel({ type: 'table' }), 'Tabel/raster');
  assert.equal(getPresenterObjectLabel({ type: 'angle' }), 'Hoekmarkering');
  assert.equal(getPresenterObjectLabel({ type: 'text' }), 'Tekst');
  assert.equal(getPresenterObjectLabel({ type: 'lessonBlock' }), 'Lesblok');
  assert.equal(getPresenterObjectLabel({ type: 'questionWindow' }), 'Vraag');
  assert.equal(getPresenterObjectLabel({ type: 'unknown' }), 'Object');
});
