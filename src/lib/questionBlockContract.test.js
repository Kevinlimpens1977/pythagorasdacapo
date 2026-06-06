import test from 'node:test';
import assert from 'node:assert/strict';

import { buildQuestionContentBlockCreateBundle } from './questionBlockContract.js';

const paragraaf = {
  id: 'par-73',
  code: '7.3',
  vakId: 'vak-wis',
  leerjaarId: 'lj-1',
  niveauId: 'niv-vmbo',
  hoofdstukId: 'h7'
};

test('buildQuestionContentBlockCreateBundle creates linked vraag and content block data', () => {
  const bundle = buildQuestionContentBlockCreateBundle({
    paragraaf,
    vraagData: {
      number: 4,
      title: 'Vraag 4',
      vraagtype: 'open',
      content: { text: '<p>Bereken c.</p>', images: [] },
      antwoord: { type: 'open', correct: '5' }
    },
    blockData: {
      title: 'Vraag',
      content: { html: '<p>Maak de vraag.</p>' }
    },
    nextVraagOrder: 7,
    nextBlockOrder: 12,
    userId: 'admin-1',
    nowMs: 12345,
    timestamp: 'SERVER_TIME'
  });

  assert.equal(bundle.vraagId, 'vraag-73-4-12345');
  assert.equal(bundle.blockId, 'block-73-question-12345');
  assert.equal(bundle.vraag.id, bundle.vraagId);
  assert.equal(bundle.block.id, bundle.blockId);
  assert.equal(bundle.block.linkedVraagId, bundle.vraagId);
  assert.equal(bundle.vraag.paragraafId, 'par-73');
  assert.equal(bundle.block.paragraafId, 'par-73');
  assert.equal(bundle.vraag.order, 7);
  assert.equal(bundle.block.order, 12);
  assert.equal(bundle.vraag.createdAt, 'SERVER_TIME');
  assert.equal(bundle.block.updatedAt, 'SERVER_TIME');
});

test('buildQuestionContentBlockCreateBundle rejects missing paragraph context', () => {
  assert.throws(
    () => buildQuestionContentBlockCreateBundle({ paragraaf: null }),
    /Paragraaf not found/
  );
});
