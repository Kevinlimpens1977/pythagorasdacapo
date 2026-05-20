import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAssignedProgress,
  getAssignedContentBlockIds,
  getEffectiveContentBlocks,
  getStudentEffectiveParagrafen
} from './assignmentUtils.js';

test('getStudentEffectiveParagrafen merges class paragraphs with student extras', () => {
  const result = getStudentEffectiveParagrafen(
    {
      enabledParagrafen: ['p1', 'p2'],
      studentOverrides: {
        studentA: { extraParagrafen: ['p2', 'p3'] }
      }
    },
    'studentA'
  );

  assert.deepEqual(result, ['p1', 'p2', 'p3']);
});

test('getAssignedContentBlockIds returns all published blocks when no explicit block selection exists', () => {
  const blocks = [
    { id: 'b1', status: 'published' },
    { id: 'b2', status: 'concept' },
    { id: 'b3', isArchived: true },
    { id: 'b4', status: 'published' }
  ];

  assert.deepEqual(
    getAssignedContentBlockIds({}, 'studentA', 'p1', blocks),
    ['b1', 'b4']
  );
});

test('getAssignedContentBlockIds uses class block selection and student extra blocks when present', () => {
  const blocks = [
    { id: 'b1', status: 'published' },
    { id: 'b2', status: 'published' },
    { id: 'b3', status: 'published' }
  ];

  const result = getAssignedContentBlockIds(
    {
      enabledContentBlocks: { p1: ['b2'] },
      studentOverrides: {
        studentA: {
          extraContentBlocks: { p1: ['b3'] }
        }
      }
    },
    'studentA',
    'p1',
    blocks
  );

  assert.deepEqual(result, ['b2', 'b3']);
});

test('getEffectiveContentBlocks filters blocks while preserving lesson order', () => {
  const blocks = [
    { id: 'b1', order: 2, status: 'published' },
    { id: 'b2', order: 1, status: 'published' },
    { id: 'b3', order: 3, status: 'published' }
  ];

  const result = getEffectiveContentBlocks(
    { enabledContentBlocks: { p1: ['b1', 'b2'] } },
    'studentA',
    'p1',
    blocks
  );

  assert.deepEqual(result.map((block) => block.id), ['b2', 'b1']);
});

test('calculateAssignedProgress uses assigned block totals as denominator', () => {
  const summary = calculateAssignedProgress({
    assignments: [
      { paragraafId: 'p1', blocks: [{ id: 'b1' }, { id: 'b2' }] },
      { paragraafId: 'p2', blocks: [{ id: 'b3' }] }
    ],
    progressRecords: [
      { blockId: 'b1', completed: true },
      { blockId: 'b2', completed: false },
      { blockId: 'unassigned', completed: true }
    ]
  });

  assert.deepEqual(summary, {
    assignedItems: 3,
    startedItems: 2,
    completedItems: 1,
    percentage: 33,
    startedPercentage: 67
  });
});
