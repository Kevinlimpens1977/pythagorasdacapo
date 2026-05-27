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
