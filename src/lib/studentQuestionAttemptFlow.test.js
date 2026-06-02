import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildParagraphEndPlan,
  buildQuestionAttemptOutcome,
  MAX_CORE_QUESTION_ATTEMPTS
} from './studentQuestionAttemptFlow.js';

test('buildQuestionAttemptOutcome marks AI assessment failure amber without counting an attempt', () => {
  const outcome = buildQuestionAttemptOutcome({
    currentAttempts: 2,
    isCorrect: false,
    aiAssessmentFailed: true,
    aiHelpCount: 0
  });

  assert.equal(outcome.attempts, 2);
  assert.equal(outcome.completed, true);
  assert.equal(outcome.isCorrect, false);
  assert.equal(outcome.resultTier, 'pending_teacher_review');
  assert.equal(outcome.attemptStatus, 'pending_teacher_review');
  assert.equal(outcome.completionReason, 'teacher_review_pending');
  assert.equal(outcome.shouldAutoAdvance, true);
});

test('buildQuestionAttemptOutcome marks correct answers independent or guided', () => {
  assert.deepEqual(
    buildQuestionAttemptOutcome({ currentAttempts: 0, isCorrect: true, aiHelpCount: 0 }),
    {
      attempts: 1,
      maxAttempts: MAX_CORE_QUESTION_ATTEMPTS,
      completed: true,
      isCorrect: true,
      resultTier: 'independent',
      attemptStatus: 'completed',
      completionReason: 'correct',
      teacherSignal: '',
      shouldAutoAdvance: true
    }
  );

  assert.equal(
    buildQuestionAttemptOutcome({ currentAttempts: 1, isCorrect: true, aiHelpCount: 1 }).resultTier,
    'guided'
  );
});

test('buildQuestionAttemptOutcome allows retry before the fourth wrong attempt', () => {
  const outcome = buildQuestionAttemptOutcome({
    currentAttempts: 2,
    isCorrect: false,
    aiHelpCount: 0
  });

  assert.equal(outcome.attempts, 3);
  assert.equal(outcome.completed, false);
  assert.equal(outcome.resultTier, 'in_progress');
  assert.equal(outcome.attemptStatus, 'open');
  assert.equal(outcome.completionReason, '');
  assert.equal(outcome.shouldAutoAdvance, false);
});

test('buildQuestionAttemptOutcome parks a question red after the fourth wrong attempt', () => {
  const outcome = buildQuestionAttemptOutcome({
    currentAttempts: 3,
    isCorrect: false,
    aiHelpCount: 0
  });

  assert.equal(outcome.attempts, 4);
  assert.equal(outcome.completed, true);
  assert.equal(outcome.resultTier, 'failed');
  assert.equal(outcome.attemptStatus, 'locked');
  assert.equal(outcome.completionReason, 'max_attempts');
  assert.equal(outcome.shouldAutoAdvance, true);
});

test('buildParagraphEndPlan chooses remediation for failed core questions', () => {
  const plan = buildParagraphEndPlan({
    coreQuestionRecords: [
      { resultTier: 'independent', completed: true, isCorrect: true },
      { resultTier: 'failed', completed: true, isCorrect: false }
    ]
  });

  assert.equal(plan.kind, 'remediation');
  assert.equal(plan.assignmentKind, 'remediation');
});

test('buildParagraphEndPlan chooses challenge only when all core questions are green', () => {
  assert.equal(buildParagraphEndPlan({
    coreQuestionRecords: [
      { resultTier: 'independent', completed: true, isCorrect: true },
      { resultTier: 'guided', completed: true, isCorrect: true }
    ]
  }).kind, 'challenge');

  assert.equal(buildParagraphEndPlan({
    coreQuestionRecords: [
      { resultTier: 'independent', completed: true, isCorrect: true },
      { resultTier: 'pending_teacher_review', completed: true, isCorrect: false }
    ]
  }).kind, 'teacher_review_pending');
});

test('buildParagraphEndPlan stays in progress when any assigned core question has no terminal record', () => {
  const plan = buildParagraphEndPlan({
    coreQuestionRecords: [
      { resultTier: 'independent', completed: true, isCorrect: true },
      null
    ]
  });

  assert.equal(plan.kind, 'in_progress');
  assert.equal(plan.required, false);
});
