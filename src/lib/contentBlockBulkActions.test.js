import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildDuplicateContentBlockPayload,
  getBulkSelectionLabel,
  getSelectedContentBlocks
} from './contentBlockBulkActions.js';

const blocks = [
  { id: 'b1', type: 'theory', title: 'Uitleg', order: 1, content: { html: '<p>A</p>' }, settings: { differentiationLevel: 'basis' } },
  { id: 'b2', type: 'question', title: 'Vraag', order: 2, linkedVraagId: 'v1', content: { html: '<p>B</p>' } },
  { id: 'b3', type: 'summary', title: 'Afsluiting', order: 3 }
];

test('getSelectedContentBlocks preserves visible block order', () => {
  const selected = getSelectedContentBlocks(blocks, new Set(['b3', 'b1']));

  assert.deepEqual(selected.map((block) => block.id), ['b1', 'b3']);
});

test('getBulkSelectionLabel describes empty and selected states', () => {
  assert.equal(getBulkSelectionLabel(0), 'Geen blokken geselecteerd');
  assert.equal(getBulkSelectionLabel(1), '1 blok geselecteerd');
  assert.equal(getBulkSelectionLabel(3), '3 blokken geselecteerd');
});

test('buildDuplicateContentBlockPayload creates draft copy without source ids', () => {
  const payload = buildDuplicateContentBlockPayload(blocks[0]);

  assert.equal(payload.type, 'theory');
  assert.equal(payload.title, 'Uitleg (kopie)');
  assert.equal(payload.status, 'draft');
  assert.equal(payload.linkedVraagId, null);
  assert.deepEqual(payload.content, { html: '<p>A</p>' });
  assert.deepEqual(payload.settings, {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });
});

test('buildDuplicateContentBlockPayload marks linked question copies as draft wrappers', () => {
  const payload = buildDuplicateContentBlockPayload(blocks[1]);

  assert.equal(payload.type, 'question');
  assert.equal(payload.title, 'Vraag (kopie)');
  assert.equal(payload.status, 'draft');
  assert.equal(payload.linkedVraagId, null);
});
