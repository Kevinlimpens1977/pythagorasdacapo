import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildBulkContentBlockSettingsPatch,
  buildDuplicateContentBlockPayload,
  getBulkMovedContentBlocks,
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

test('buildBulkContentBlockSettingsPatch toggles Digidocent and toolbox settings safely', () => {
  assert.deepEqual(
    buildBulkContentBlockSettingsPatch(blocks[0], { allowAiHelp: true, allowMathToolbox: true }),
    {
      settings: {
        allowAiHelp: true,
        allowMathToolbox: true,
        differentiationLevel: 'basis',
        scaffoldingRole: 'zelf_proberen'
      }
    }
  );

  assert.deepEqual(
    buildBulkContentBlockSettingsPatch(blocks[1], { allowAiHelp: false }),
    {
      settings: {
        allowAiHelp: false,
        allowMathToolbox: false,
        differentiationLevel: 'basis',
        scaffoldingRole: 'zelf_proberen'
      }
    }
  );
});

test('getBulkMovedContentBlocks moves selected blocks as one group', () => {
  const movedUp = getBulkMovedContentBlocks(blocks, new Set(['b2', 'b3']), 'up');
  assert.deepEqual(movedUp.map((block) => block.id), ['b2', 'b3', 'b1']);
  assert.deepEqual(movedUp.map((block) => block.order), [1, 2, 3]);

  const movedDown = getBulkMovedContentBlocks(blocks, new Set(['b1', 'b2']), 'down');
  assert.deepEqual(movedDown.map((block) => block.id), ['b3', 'b1', 'b2']);
  assert.deepEqual(movedDown.map((block) => block.order), [1, 2, 3]);
});

test('getBulkMovedContentBlocks is stable at route edges', () => {
  assert.deepEqual(
    getBulkMovedContentBlocks(blocks, new Set(['b1']), 'up').map((block) => block.id),
    ['b1', 'b2', 'b3']
  );
  assert.deepEqual(
    getBulkMovedContentBlocks(blocks, new Set(['b3']), 'down').map((block) => block.id),
    ['b1', 'b2', 'b3']
  );
});
