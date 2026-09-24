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

test('aangekondigde hoofdstukken: op slot en nog zonder kaart', async () => {
  const { aangekondigdeHoofdstukIds } = await import('./hoofdstukSlot.js');
  const klas = { vergrendeldeHoofdstukken: ['h2', 'h3', 'h4', ' '] };
  assert.deepEqual(aangekondigdeHoofdstukIds([{ id: 'h1' }, { id: 'h2' }], klas), ['h3', 'h4']);
  assert.deepEqual(aangekondigdeHoofdstukIds([], null), []);
});

test('paragraaf los op slot: rij gemarkeerd, toets eruit, verder-waar-je-was slaat hem over', async () => {
  const { isParagraafVergrendeld, markeerVergrendeldeHoofdstukken, wisselParagraafSlot } = await import('./hoofdstukSlot.js');
  const { buildResumePointer } = await import('./chapterOutline.js');
  const klas = { vergrendeldeParagrafen: ['p3'] };
  assert.equal(isParagraafVergrendeld(klas, { id: 'p3', hoofdstukId: 'h2' }), true);
  assert.equal(isParagraafVergrendeld(klas, { id: 'p2', hoofdstukId: 'h2' }), false);
  assert.deepEqual(wisselParagraafSlot(klas, 'p4', true), ['p3', 'p4']);
  assert.deepEqual(wisselParagraafSlot(klas, 'p3', false), []);

  const rij = (id, klaar) => ({ id, title: id, number: id, progress: { done: 0, total: 1 }, onderdelen: [{ id: `${id}-b`, isDone: klaar }] });
  const [hoofdstuk] = markeerVergrendeldeHoofdstukken([{
    id: 'h2', paragraphRows: [rij('p2', true), rij('p3', false)], voorkennisRows: [], oefentoetsRows: [{ id: 'q', paragraafId: 'p3' }], toetsRows: []
  }], klas);
  assert.equal(hoofdstuk.paragraphRows[1].vergrendeld, true);
  assert.equal(hoofdstuk.oefentoetsRows.length, 0);
  assert.equal(buildResumePointer([hoofdstuk]), null, 'alleen p3 is nog open, en die staat op slot');
});
