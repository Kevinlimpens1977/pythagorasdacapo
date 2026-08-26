import test from 'node:test';
import assert from 'node:assert/strict';
import { isSpelAfsluitingActief, spelSlotStatus } from './spelSlot.js';

const blocks = [
  { id: 'a', type: 'theory', title: 'Theorie' },
  { id: 'b', type: 'quiz', title: 'Afsluitquiz' },
  { id: 'g', type: 'game', title: 'Inlog Escape' }
];

test('spel is vergrendeld zolang niet alles af is', () => {
  const status = spelSlotStatus({ blocks, progressRecords: [{ blockId: 'a', completed: true }] });
  assert.equal(status.vergrendeld, true);
  assert.deepEqual(status.resterend, ['Afsluitquiz']);
});

test('spel ontgrendelt als alle andere stappen af zijn', () => {
  const status = spelSlotStatus({
    blocks,
    progressRecords: [{ blockId: 'a', completed: true }, { blockId: 'b', completed: true }]
  });
  assert.equal(status.vergrendeld, false);
});

test('instelling uit betekent meteen speelbaar', () => {
  const status = spelSlotStatus({ blocks, progressRecords: [], klasSettings: { spelAlsAfsluiting: false } });
  assert.equal(status.vergrendeld, false);
});

test('de instelling staat standaard aan, ook zonder klasdocumentveld', () => {
  assert.equal(isSpelAfsluitingActief({}), true);
  assert.equal(isSpelAfsluitingActief(undefined), true);
  assert.equal(isSpelAfsluitingActief({ spelAlsAfsluiting: false }), false);
});

test('records op vraagId tellen ook mee', () => {
  const status = spelSlotStatus({
    blocks,
    progressRecords: [{ vraagId: 'a', completed: true }, { vraagId: 'b', completed: true }]
  });
  assert.equal(status.vergrendeld, false);
});
