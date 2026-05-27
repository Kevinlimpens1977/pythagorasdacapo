import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mapClientPointToBoard,
  getBoardScale,
  snapValueToGrid,
  snapPointToGrid,
  getGridLineStyle,
  measureDistance,
  measureAngleDegrees
} from './presenterGeometry.js';

test('getBoardScale uses uniform scale so grid squares stay square', () => {
  assert.equal(getBoardScale({ viewportWidth: 960, boardWidth: 1920 }), 0.5);
  assert.equal(getBoardScale({ viewportWidth: 1440, boardWidth: 1920 }), 0.75);
});

test('getBoardScale falls back to 1 when dimensions are missing or zero', () => {
  assert.equal(getBoardScale({ boardWidth: 1920 }), 1);
  assert.equal(getBoardScale({ viewportWidth: 960 }), 1);
  assert.equal(getBoardScale({ viewportWidth: 0, boardWidth: 1920 }), 1);
  assert.equal(getBoardScale({ viewportWidth: 960, boardWidth: 0 }), 1);
});

test('mapClientPointToBoard maps pointer coordinates into internal board coordinates', () => {
  const point = mapClientPointToBoard({
    clientX: 500,
    clientY: 340,
    rect: { left: 20, top: 40 },
    scrollTop: 120,
    scale: 0.5
  });

  assert.deepEqual(point, { x: 960, y: 840 });
});

test('snapValueToGrid rounds values to the nearest grid multiple', () => {
  assert.equal(snapValueToGrid(143, 48), 144);
  assert.equal(snapValueToGrid(119, 48), 96);
});

test('snapPointToGrid only snaps when grid is enabled', () => {
  assert.deepEqual(snapPointToGrid({ x: 143, y: 151 }, { enabled: true, gridSize: 48 }), { x: 144, y: 144 });
  assert.deepEqual(snapPointToGrid({ x: 143, y: 151 }, { enabled: false, gridSize: 48 }), { x: 143, y: 151 });
});

test('snapPointToGrid returns the original point when grid size is missing', () => {
  const point = { x: 143, y: 151 };

  assert.equal(snapPointToGrid(point, { enabled: true }), point);
  assert.equal(snapPointToGrid(point, { enabled: true, gridSize: 0 }), point);
});

test('getGridLineStyle returns equal horizontal and vertical size', () => {
  assert.deepEqual(getGridLineStyle({ gridSize: 96, scale: 0.5 }), {
    backgroundSize: '48px 48px',
    lineSize: 48
  });
});

test('measureDistance returns Euclidean distance', () => {
  assert.equal(measureDistance({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
});

test('measureAngleDegrees returns positive degrees between two rays', () => {
  const angle = measureAngleDegrees({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 });

  assert.equal(angle, 90);
});

test('measureAngleDegrees returns the smaller positive angle when rays span over 180 degrees', () => {
  const angle = measureAngleDegrees({ x: 0, y: 0 }, { x: -1, y: 0.1763 }, { x: -1, y: -0.1763 });

  assert.equal(angle, 20);
});
