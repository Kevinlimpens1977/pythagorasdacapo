import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createPresenterInstrument,
  getInstrumentAngleLabel,
  getInstrumentCenter,
  getInstrumentEdgeLine,
  isPointNearInstrumentEdge,
  PRESENTER_INSTRUMENT_DEFS,
  projectPointOntoEdge
} from './presenterInstruments.js';

test('createPresenterInstrument gebruikt defaults en kent onbekende ids niet', () => {
  const ruler = createPresenterInstrument('ruler');
  assert.equal(ruler.id, 'ruler');
  assert.equal(ruler.rotation, 0);
  assert.equal(createPresenterInstrument('onzin'), null);
});

test('liniaal heeft een top-tekenrand die meedraait met rotatie', () => {
  const ruler = createPresenterInstrument('ruler', { x: 100, y: 200, rotation: 0 });
  const edge = getInstrumentEdgeLine(ruler);
  assert.equal(edge.y1, 200);
  assert.equal(edge.y2, 200);
  assert.equal(edge.x1, 100);
  assert.equal(edge.x2, 100 + PRESENTER_INSTRUMENT_DEFS.ruler.width);

  const rotated = getInstrumentEdgeLine({ ...ruler, rotation: 90 });
  const center = getInstrumentCenter(ruler);
  assert.equal(Math.abs(rotated.x1 - rotated.x2) < 0.01, true);
  assert.equal(Math.round(rotated.x1), Math.round(center.x + (center.y - 200)));
});

test('passer heeft geen tekenrand', () => {
  const compass = createPresenterInstrument('compass');
  assert.equal(getInstrumentEdgeLine(compass), null);
  assert.equal(isPointNearInstrumentEdge({ x: 0, y: 0 }, compass), false);
});

test('projectPointOntoEdge klemt op het segment', () => {
  const edge = { x1: 0, y1: 100, x2: 200, y2: 100 };
  assert.deepEqual(projectPointOntoEdge({ x: 50, y: 80 }, edge), { x: 50, y: 100 });
  assert.deepEqual(projectPointOntoEdge({ x: -40, y: 90 }, edge), { x: 0, y: 100 });
  assert.deepEqual(projectPointOntoEdge({ x: 260, y: 90 }, edge), { x: 200, y: 100 });
});

test('isPointNearInstrumentEdge respecteert de tolerantie', () => {
  const ruler = createPresenterInstrument('ruler', { x: 0, y: 100, rotation: 0 });
  assert.equal(isPointNearInstrumentEdge({ x: 100, y: 90 }, ruler), true);
  assert.equal(isPointNearInstrumentEdge({ x: 100, y: 40 }, ruler), false);
});

test('getInstrumentAngleLabel normaliseert naar 0-360', () => {
  assert.equal(getInstrumentAngleLabel({ rotation: 45 }), '45°');
  assert.equal(getInstrumentAngleLabel({ rotation: -90 }), '270°');
  assert.equal(getInstrumentAngleLabel({}), '0°');
});
