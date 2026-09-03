import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLessonProgress,
  findResumeBlockIndex,
  getCompletedBlockIds,
  getLessonBlockRenderKey,
  resolveRequestedBlockIndex,
  shouldSaveBlockProgressBeforeNavigation
} from './studentLessonProgress.js';
import { normalizeContentBlockSettings, normalizeContentBlocks } from './contentBlockUtils.js';
import { buildQuestionDraftProgressPayload } from './questionDraftProgress.js';
import { buildContentBlockVoortgangUpdate } from './voortgangPayload.js';
import { groupProgressRecordsByStudent } from './progressRecordUtils.js';

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

test('resolveRequestedBlockIndex opens the requested block when the route allows it', () => {
  const routeBlocks = [
    { id: 'theory-1', type: 'theory' },
    { id: 'question-1', type: 'question' },
    { id: 'quiz-1', type: 'quiz' }
  ];

  assert.equal(
    resolveRequestedBlockIndex({
      blocks: routeBlocks,
      progressRecords: [{ blockId: 'question-1', completed: true }],
      requestedBlockId: 'quiz-1'
    }),
    2
  );
});

test('resolveRequestedBlockIndex falls back to the resume block for unknown or locked steps', () => {
  const routeBlocks = [
    { id: 'theory-1', type: 'theory' },
    { id: 'question-1', type: 'question' },
    { id: 'quiz-1', type: 'quiz' }
  ];

  // Een onafgeronde kernvraag ervoor houdt de stap dicht.
  assert.equal(
    resolveRequestedBlockIndex({ blocks: routeBlocks, progressRecords: [], requestedBlockId: 'quiz-1' }),
    0
  );
  assert.equal(
    resolveRequestedBlockIndex({ blocks: routeBlocks, progressRecords: [], requestedBlockId: 'bestaat-niet' }),
    0
  );
  assert.equal(resolveRequestedBlockIndex({ blocks: routeBlocks, progressRecords: [] }), 0);
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
  // Een quiz of toets rondt af via zijn vragen, nooit door doorklikken.
  assert.equal(
    shouldSaveBlockProgressBeforeNavigation({ block: { id: 'toets-open', type: 'toets' }, completedIds }),
    false
  );
  assert.equal(
    shouldSaveBlockProgressBeforeNavigation({ block: { id: 'quiz-open', type: 'quiz' }, completedIds }),
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
  assert.deepEqual(normalizeContentBlockSettings({ allowCalculator: true, allowAiHelp: false }), {
    allowAiHelp: false,
    allowMathToolbox: true,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });
  assert.deepEqual(normalizeContentBlockSettings({ allowCalculator: true, allowMathToolbox: false, allowAiHelp: false }), {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlocks([{ id: 'block-1', order: 1 }])[0].settings, {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });
});

test('student progress lifecycle supports draft save, resume, completion and admin visibility', () => {
  const questionBlock = {
    id: 'question-1',
    type: 'question',
    title: 'Vraag 1',
    paragraafId: 'par-1',
    hoofdstukId: 'h-1'
  };
  const lessonBlocks = [
    { id: 'theory-1', type: 'theory' },
    questionBlock,
    { id: 'summary-1', type: 'summary' }
  ];
  const linkedVraag = {
    title: 'Open vraag',
    vraagtype: 'open'
  };
  const preview = { type: 'open' };

  const draftPayload = buildQuestionDraftProgressPayload({
    block: questionBlock,
    linkedVraag,
    preview,
    previewAnswers: { openAnswer: 'ik denk eerst zelf' },
    attempts: 0,
    aiHelpCount: 0
  });
  const draftRecord = buildContentBlockVoortgangUpdate({
    userId: 'student-1',
    blockId: questionBlock.id,
    paragraafId: questionBlock.paragraafId,
    hoofdstukId: questionBlock.hoofdstukId,
    klasId: 'klas-1',
    data: draftPayload,
    timestamp: 'draft-time'
  });

  assert.equal(draftRecord.completed, false);
  assert.equal(draftRecord.draftSaved, true);
  assert.equal(draftRecord.attempts, 0);
  assert.equal(findResumeBlockIndex(lessonBlocks, [
    { blockId: 'theory-1', completed: true },
    draftRecord
  ]), 1);

  const completedRecord = buildContentBlockVoortgangUpdate({
    userId: 'student-1',
    blockId: questionBlock.id,
    paragraafId: questionBlock.paragraafId,
    hoofdstukId: questionBlock.hoofdstukId,
    klasId: 'klas-1',
    existingData: draftRecord,
    data: {
      completed: true,
      isCorrect: true,
      attempts: 1,
      aiHelpCount: 1,
      lastAnswer: { openAnswer: 'definitief antwoord' },
      blockTitle: questionBlock.title,
      vraagTitle: linkedVraag.title,
      vraagType: preview.type
    },
    timestamp: 'done-time'
  });

  assert.equal(completedRecord.completed, true);
  assert.equal(completedRecord.draftSaved, false);
  assert.equal(completedRecord.helpTier, 'guided');
  assert.equal(completedRecord.resultTier, 'guided');
  assert.equal(completedRecord.scoreWeight, 0.75);
  assert.equal(completedRecord.completedAt, 'done-time');
  assert.deepEqual(groupProgressRecordsByStudent([completedRecord]), {
    'student-1': [completedRecord]
  });
  assert.deepEqual(calculateLessonProgress(lessonBlocks, [
    { blockId: 'theory-1', completed: true },
    completedRecord
  ]), {
    totalBlocks: 3,
    completedBlocks: 2,
    percentage: 67,
    isCompleted: false
  });
});
