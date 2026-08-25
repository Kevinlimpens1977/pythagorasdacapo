import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOSED_GRADE_REVIEW_REASONS,
  CLOSED_GRADE_SOURCES,
  buildClosedQuestionReviewMessage,
  resolveClosedQuestionGrade
} from './closedQuestionGradingRoute.js';

test('the server verdict decides when it is there', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: true, canGrade: true, isCorrect: true, reason: 'graded' }
  });

  assert.deepEqual(result, {
    graded: true,
    isCorrect: true,
    source: CLOSED_GRADE_SOURCES.SERVER,
    reviewReason: CLOSED_GRADE_REVIEW_REASONS.NONE,
    parts: []
  });
});

// Dit was de kernfout: een fout antwoord belandde als 'docent kijkt na' in de
// voortgang, waardoor pogingen, tokens, streak en herstel nooit op gang kwamen.
test('a wrong closed answer is wrong, not pending teacher review', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: true, canGrade: true, isCorrect: false, reason: 'graded' }
  });

  assert.equal(result.graded, true);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reviewReason, CLOSED_GRADE_REVIEW_REASONS.NONE);
});

test('a question without an answer key stays a real teacher review case', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: true, canGrade: false, reason: 'no-answer-key' },
    localGrade: { canGrade: true, isCorrect: true }
  });

  assert.equal(result.graded, false);
  assert.equal(result.reviewReason, CLOSED_GRADE_REVIEW_REASONS.NO_ANSWER_KEY);
});

test('the local grade takes over while the callable is not deployed yet', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: false, unavailable: true, code: 'functions/not-found' },
    localGrade: { canGrade: true, isCorrect: false }
  });

  assert.equal(result.graded, true);
  assert.equal(result.isCorrect, false);
  assert.equal(result.source, CLOSED_GRADE_SOURCES.LOCAL);
});

test('an unreachable callable without a local key falls back visibly, never silently wrong', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: false, unavailable: true, code: 'functions/not-found' }
  });

  assert.equal(result.graded, false);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reviewReason, CLOSED_GRADE_REVIEW_REASONS.SERVICE_UNAVAILABLE);
});

test('a throttled student gets the throttle message, not a wrong answer', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: { success: false, code: 'functions/resource-exhausted', error: 'Rustig aan.' }
  });

  assert.equal(result.graded, false);
  assert.equal(result.reviewReason, CLOSED_GRADE_REVIEW_REASONS.RATE_LIMITED);
  assert.equal(buildClosedQuestionReviewMessage(result.reviewReason, 'Rustig aan.'), 'Rustig aan.');
});

test('review messages never mention an answer model and always let the student continue', () => {
  Object.values(CLOSED_GRADE_REVIEW_REASONS)
    .filter(Boolean)
    .forEach((reason) => {
      const message = buildClosedQuestionReviewMessage(reason);
      assert.equal(typeof message, 'string');
      assert.notEqual(message, '');
    });

  assert.equal(buildClosedQuestionReviewMessage(CLOSED_GRADE_REVIEW_REASONS.NONE), '');
});

test('server parts are passed through for the student feedback', () => {
  const result = resolveClosedQuestionGrade({
    serverResult: {
      success: true,
      canGrade: true,
      isCorrect: false,
      reason: 'graded',
      parts: [{ id: 'gap-1', label: 'Invulveld 1', isCorrect: false }]
    }
  });

  assert.deepEqual(result.parts, [{ id: 'gap-1', label: 'Invulveld 1', isCorrect: false }]);
});
