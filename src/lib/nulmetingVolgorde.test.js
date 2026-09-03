import test from 'node:test';
import assert from 'node:assert/strict';

import { nulmetingDeelSlot } from './nulmetingVolgorde.js';

const deelA = {
  id: 'blok-a',
  title: 'Nulmeting deel A',
  content: { nulmeting: { deel: 'A' }, items: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }] }
};
const deelB = {
  id: 'blok-b',
  title: 'Nulmeting deel B',
  content: { nulmeting: { deel: 'B' }, items: [{ id: 'b1' }] }
};
const blocks = [deelA, deelB];

test('deel B zit op slot zolang deel A niet elke vraag ingeleverd heeft', () => {
  const zonderRecords = nulmetingDeelSlot({ block: deelB, blocks, itemRecordsByBlock: {} });
  assert.equal(zonderRecords.vergrendeld, true);
  assert.deepEqual(zonderRecords.vereist.map((v) => [v.title, v.itemsAf, v.itemCount]), [['Nulmeting deel A', 0, 3]]);

  // Een concept telt niet mee; een afgeronde vraag en een wachtende open vraag wel.
  const deels = nulmetingDeelSlot({
    block: deelB,
    blocks,
    itemRecordsByBlock: {
      'blok-a': {
        a1: { completed: true },
        a2: { attemptStatus: 'pending_teacher_review' },
        a3: { concept: { value: 'x' } }
      }
    }
  });
  assert.equal(deels.vergrendeld, true);
  assert.equal(deels.vereist[0].itemsAf, 2);

  const klaar = nulmetingDeelSlot({
    block: deelB,
    blocks,
    itemRecordsByBlock: { 'blok-a': { a1: { completed: true }, a2: { completed: true }, a3: { completed: true } } }
  });
  assert.equal(klaar.vergrendeld, false);
});

test('deel A en gewone toetsen zitten nooit op slot', () => {
  assert.equal(nulmetingDeelSlot({ block: deelA, blocks, itemRecordsByBlock: {} }).vergrendeld, false);
  assert.equal(nulmetingDeelSlot({ block: { id: 'quiz', type: 'quiz', content: {} }, blocks, itemRecordsByBlock: {} }).vergrendeld, false);
  assert.equal(nulmetingDeelSlot({ block: null }).vergrendeld, false);
});
