import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getVergrendeldeHoofdstukken,
  isHoofdstukVergrendeld,
  isParagraafVergrendeld,
  markeerVergrendeldeHoofdstukken,
  wisselHoofdstukSlot,
  zonderVergrendeldeHoofdstukken
} from './hoofdstukSlot.js';

const klas = (lijst) => ({ id: 'klas-1', vergrendeldeHoofdstukken: lijst });

test('een klas zonder slotenlijst heeft niets op slot', () => {
  assert.deepEqual(getVergrendeldeHoofdstukken(null), []);
  assert.deepEqual(getVergrendeldeHoofdstukken({}), []);
  assert.deepEqual(getVergrendeldeHoofdstukken({ vergrendeldeHoofdstukken: 'h2' }), []);
  assert.equal(isHoofdstukVergrendeld({}, 'h2'), false);
});

test('rommel in de lijst telt niet mee en dubbele staan er maar één keer in', () => {
  const data = klas(['h2', ' h2 ', '', null, 'h3']);
  assert.deepEqual(getVergrendeldeHoofdstukken(data), ['h2', 'h3']);
});

test('isHoofdstukVergrendeld kijkt naar precies dit hoofdstuk', () => {
  const data = klas(['h2']);
  assert.equal(isHoofdstukVergrendeld(data, 'h2'), true);
  assert.equal(isHoofdstukVergrendeld(data, 'h3'), false);
  assert.equal(isHoofdstukVergrendeld(data, ''), false);
});

test('isParagraafVergrendeld gaat via het hoofdstuk van de paragraaf', () => {
  const data = klas(['h2']);
  assert.equal(isParagraafVergrendeld(data, { id: 'p-1', hoofdstukId: 'h2' }), true);
  assert.equal(isParagraafVergrendeld(data, { id: 'p-2', hoofdstukId: 'h1' }), false);
  assert.equal(isParagraafVergrendeld(data, null), false);
});

test('wisselHoofdstukSlot zet het slot erop en eraf zonder dubbele', () => {
  const data = klas(['h2']);
  assert.deepEqual(wisselHoofdstukSlot(data, 'h3', true), ['h2', 'h3']);
  assert.deepEqual(wisselHoofdstukSlot(data, 'h2', true), ['h2']);
  assert.deepEqual(wisselHoofdstukSlot(data, 'h2', false), []);
  assert.deepEqual(wisselHoofdstukSlot(data, '', true), ['h2']);
});

test('markeerVergrendeldeHoofdstukken laat elk hoofdstuk staan en zet alleen de vlag', () => {
  const chapters = [{ id: 'h1', title: 'Een' }, { id: 'h2', title: 'Twee' }];

  const zonderSlot = markeerVergrendeldeHoofdstukken(chapters, klas([]));
  assert.deepEqual(zonderSlot.map((c) => c.vergrendeld), [false, false]);

  const metSlot = markeerVergrendeldeHoofdstukken(chapters, klas(['h2']));
  assert.deepEqual(metSlot.map((c) => [c.id, c.vergrendeld]), [['h1', false], ['h2', true]]);
  assert.equal(metSlot.length, chapters.length, 'een vergrendeld hoofdstuk blijft zichtbaar');
});

test('zonderVergrendeldeHoofdstukken geeft alleen wat open staat', () => {
  const chapters = markeerVergrendeldeHoofdstukken(
    [{ id: 'h1' }, { id: 'h2' }, { id: 'h3' }],
    klas(['h2'])
  );

  assert.deepEqual(zonderVergrendeldeHoofdstukken(chapters).map((c) => c.id), ['h1', 'h3']);
});
