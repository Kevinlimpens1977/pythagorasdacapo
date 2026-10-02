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

test('met spelBlok tellen alleen de stappen ervoor mee (spel in het midden)', () => {
  const midden = [
    { id: 'a', type: 'theory', title: 'Theorie' },
    { id: 'g', type: 'game', title: 'Vloeistoffenlab' },
    { id: 'q', type: 'quiz', title: 'Toets jezelf' },
    { id: 's', type: 'summary', title: 'Samenvatting' }
  ];
  const open = spelSlotStatus({ blocks: midden, progressRecords: [{ blockId: 'a', completed: true }], spelBlok: midden[1] });
  assert.equal(open.vergrendeld, false);
  const dicht = spelSlotStatus({ blocks: midden, progressRecords: [], spelBlok: midden[1] });
  assert.deepEqual(dicht.resterend, ['Theorie']);
  // Een spel achteraan werkt als vroeger: alles ervoor moet af.
  const achteraan = spelSlotStatus({ blocks, progressRecords: [{ blockId: 'a', completed: true }], spelBlok: blocks[2] });
  assert.deepEqual(achteraan.resterend, ['Afsluitquiz']);
});

test('records op vraagId tellen ook mee', () => {
  const status = spelSlotStatus({
    blocks,
    progressRecords: [{ vraagId: 'a', completed: true }, { vraagId: 'b', completed: true }]
  });
  assert.equal(status.vergrendeld, false);
});
