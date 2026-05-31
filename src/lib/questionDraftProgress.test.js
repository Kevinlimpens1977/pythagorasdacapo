import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildQuestionDraftProgressPayload,
  hasQuestionDraftAnswer
} from './questionDraftProgress.js';

test('hasQuestionDraftAnswer ignores empty answer shells', () => {
  assert.equal(hasQuestionDraftAnswer({}), false);
  assert.equal(hasQuestionDraftAnswer({ openAnswer: '   ' }), false);
  assert.equal(hasQuestionDraftAnswer({ 'option-a': false }), false);
  assert.equal(hasQuestionDraftAnswer({ mathTools: [{ type: 'ratioTable', topValues: ['', ''] }] }), false);
});

test('hasQuestionDraftAnswer detects actual student input', () => {
  assert.equal(hasQuestionDraftAnswer({ openAnswer: 'ik denk 42' }), true);
  assert.equal(hasQuestionDraftAnswer({ expectedValue: '60' }), true);
  assert.equal(hasQuestionDraftAnswer({ 'option-b': true }), true);
  assert.equal(hasQuestionDraftAnswer({ orderTouched: true, orderItems: [{ id: 'a' }] }), true);
  assert.equal(
    hasQuestionDraftAnswer({ mathTools: [{ type: 'ratioTable', topValues: ['70', ''] }] }),
    true
  );
});

test('buildQuestionDraftProgressPayload stores a draft without correctness or attempt increase', () => {
  const payload = buildQuestionDraftProgressPayload({
    block: { id: 'block-1', title: 'Vraagblok', type: 'question' },
    linkedVraag: { title: 'Vraag 1' },
    preview: { type: 'open' },
    previewAnswers: { openAnswer: 'concept' },
    attempts: 0,
    aiHelpCount: 1
  });

  assert.equal(payload.completed, false);
  assert.equal(payload.isCorrect, false);
  assert.equal(payload.attempts, 0);
  assert.equal(payload.draftSaved, true);
  assert.deepEqual(payload.lastAnswer, { openAnswer: 'concept' });
  assert.equal(payload.blockTitle, 'Vraagblok');
  assert.equal(payload.vraagTitle, 'Vraag 1');
  assert.equal(payload.vraagType, 'open');
  assert.equal(payload.aiHelpCount, 1);
});
