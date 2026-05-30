import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLessonProgress,
  findResumeBlockIndex,
  getCompletedBlockIds
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

test('normalizes lesson block settings without overwriting explicit false values', () => {
  assert.deepEqual(normalizeContentBlockSettings({ allowCalculator: true, allowAiHelp: false }), {
    allowCalculator: true,
    allowAiHelp: false
  });

  assert.deepEqual(normalizeContentBlocks([{ id: 'block-1', order: 1 }])[0].settings, {
    allowCalculator: false,
    allowAiHelp: false
  });
});
