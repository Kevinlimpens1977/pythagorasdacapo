import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLessonProgress,
  findResumeBlockIndex,
  getCompletedBlockIds,
  getLessonBlockRenderKey,
  shouldSaveBlockProgressBeforeNavigation
} from './studentLessonProgress.js';
import { normalizeContentBlockSettings, normalizeContentBlocks } from './contentBlockUtils.js';

const blocks = [
  { id: 'block-1' },
  { id: 'block-2' },
  { id: 'block-3' }
];

test('getCompletedBlockIds supports contentBlock records', () => {
  const ids = getCompletedBlockIds([
    { blockId: 'block-1', completed: true },
    { blockId: 'block-2', completed: false },
    { vraagId: 'legacy-question', completed: true }
  ]);

  assert.equal(ids.has('block-1'), true);
  assert.equal(ids.has('block-2'), false);
  assert.equal(ids.has('legacy-question'), true);
});

test('calculateLessonProgress returns totals and percentage', () => {
  const progress = calculateLessonProgress(blocks, [
    { blockId: 'block-1', completed: true },
    { blockId: 'block-3', completed: true }
  ]);

  assert.deepEqual(progress, {
    totalBlocks: 3,
    completedBlocks: 2,
    percentage: 67,
    isCompleted: false
  });
});

test('findResumeBlockIndex returns first incomplete block', () => {
  assert.equal(findResumeBlockIndex(blocks, [
    { blockId: 'block-1', completed: true }
  ]), 1);
});

test('findResumeBlockIndex returns last block when lesson is completed', () => {
  assert.equal(findResumeBlockIndex(blocks, [
    { blockId: 'block-1', completed: true },
    { blockId: 'block-2', completed: true },
    { blockId: 'block-3', completed: true }
  ]), 2);
});

test('shouldSaveBlockProgressBeforeNavigation saves non-question blocks that are not completed yet', () => {
  const completedIds = new Set(['theory-done']);

  assert.equal(
    shouldSaveBlockProgressBeforeNavigation({ block: { id: 'theory-open', type: 'theory' }, completedIds }),
    true
  );
  assert.equal(
    shouldSaveBlockProgressBeforeNavigation({ block: { id: 'theory-done', type: 'theory' }, completedIds }),
    false
  );
  assert.equal(
    shouldSaveBlockProgressBeforeNavigation({ block: { id: 'question-open', type: 'question' }, completedIds }),
    false
  );
});

test('shouldSaveBlockProgressBeforeNavigation ignores missing blocks', () => {
  assert.equal(shouldSaveBlockProgressBeforeNavigation({ block: null, completedIds: new Set() }), false);
});

test('getLessonBlockRenderKey creates a stable key per lesson block', () => {
  assert.equal(getLessonBlockRenderKey({ id: 'block-1', type: 'question' }), 'lesson-block:block-1');
  assert.equal(getLessonBlockRenderKey({ type: 'question' }), 'lesson-block:missing');
});

test('normalizes lesson block settings without overwriting explicit false values', () => {
  assert.deepEqual(normalizeContentBlockSettings({ allowCalculator: true, allowAiHelp: false, allowMathToolbox: true }), {
    allowCalculator: true,
    allowAiHelp: false,
    allowMathToolbox: true
  });

  assert.deepEqual(normalizeContentBlocks([{ id: 'block-1', order: 1 }])[0].settings, {
    allowCalculator: false,
    allowAiHelp: false,
    allowMathToolbox: false
  });
});
