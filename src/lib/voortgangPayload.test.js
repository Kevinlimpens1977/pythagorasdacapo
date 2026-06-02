import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContentBlockVoortgangUpdate } from './voortgangPayload.js';

const base = {
  userId: 'student-1',
  blockId: 'block-1',
  paragraafId: 'par-1',
  hoofdstukId: 'h-1',
  klasId: 'klas-1',
  timestamp: 'now'
};

test('buildContentBlockVoortgangUpdate stores an incomplete attempt with answer and AI metadata', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: false,
      isCorrect: false,
      attempts: 2,
      aiHelpCount: 2,
      lastAnswer: { openAnswer: 'ik denk 42' },
      blockTitle: 'Vraag 1',
      blockType: 'question',
      vraagTitle: 'Open vraag',
      vraagType: 'open'
    }
  });

  assert.equal(update.completed, false);
  assert.equal(update.isCorrect, false);
  assert.equal(update.attempts, 2);
  assert.deepEqual(update.lastAnswer, { openAnswer: 'ik denk 42' });
  assert.equal(update.aiHelpCount, 2);
  assert.equal(update.aiHelpUsed, true);
  assert.equal(update.helpTier, 'in_progress');
  assert.equal(update.scoreWeight, 0);
  assert.equal(update.completedAt, undefined);
  assert.equal(update.blockTitle, 'Vraag 1');
  assert.equal(update.vraagType, 'open');
});

test('buildContentBlockVoortgangUpdate stores completed independent work with full score', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: true,
      isCorrect: true,
      attempts: 1,
      aiHelpCount: 0,
      lastAnswer: { gap_1: 'oppervlakte' }
    }
  });

  assert.equal(update.completed, true);
  assert.equal(update.isCorrect, true);
  assert.equal(update.helpTier, 'independent');
  assert.equal(update.scoreWeight, 1);
  assert.equal(update.completedAt, 'now');
});

test('buildContentBlockVoortgangUpdate preserves explicit amber review status without treating AI failure as a score', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      attempts: 2
    },
    data: {
      completed: true,
      isCorrect: false,
      attempts: 2,
      maxAttempts: 4,
      resultTier: 'pending_teacher_review',
      completionReason: 'teacher_review_pending',
      attemptStatus: 'pending_teacher_review',
      teacherSignal: 'ai_assessment_failed',
      lastAnswer: { openAnswer: 'mijn antwoord' }
    }
  });

  assert.equal(update.attempts, 2);
  assert.equal(update.resultTier, 'pending_teacher_review');
  assert.equal(update.helpTier, 'pending_teacher_review');
  assert.equal(update.completionReason, 'teacher_review_pending');
  assert.equal(update.attemptStatus, 'pending_teacher_review');
  assert.equal(update.teacherSignal, 'ai_assessment_failed');
  assert.equal(update.scoreWeight, 0);
});

test('buildContentBlockVoortgangUpdate stores paragraph end progress type', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      progressType: 'paragraphEnd',
      assignmentKind: 'remediation',
      completed: true,
      isCorrect: true,
      completionReason: 'remediation_completed',
      attempts: 1
    }
  });

  assert.equal(update.progressType, 'paragraphEnd');
  assert.equal(update.assignmentKind, 'remediation');
  assert.equal(update.completionReason, 'remediation_completed');
});

test('buildContentBlockVoortgangUpdate stores question snapshots for remediation', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: true,
      isCorrect: false,
      resultTier: 'failed',
      questionPlainText: 'Bereken: 3 + 3',
      expectedAnswer: '6',
      modelAnswer: '6'
    }
  });

  assert.equal(update.questionPlainText, 'Bereken: 3 + 3');
  assert.equal(update.expectedAnswer, '6');
  assert.equal(update.modelAnswer, '6');
});

test('buildContentBlockVoortgangUpdate stores draft answers without counting an attempt', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: false,
      isCorrect: false,
      attempts: 0,
      lastAnswer: { openAnswer: 'conceptantwoord' },
      draftSaved: true
    }
  });

  assert.equal(update.completed, false);
  assert.equal(update.isCorrect, false);
  assert.equal(update.attempts, 0);
  assert.equal(update.draftSaved, true);
  assert.deepEqual(update.lastAnswer, { openAnswer: 'conceptantwoord' });
});

test('buildContentBlockVoortgangUpdate clears stale assessment feedback when a new draft answer is saved', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      lastAnswer: { openAnswer: 'oud antwoord' },
      openAnswerAssessment: { feedback: 'oude feedback', answerSignature: 'old' }
    },
    data: {
      completed: false,
      isCorrect: false,
      attempts: 1,
      lastAnswer: { openAnswer: 'nieuw antwoord' },
      draftSaved: true
    }
  });

  assert.equal(update.openAnswerAssessment, null);
});

test('buildContentBlockVoortgangUpdate clears stale last assessment and amber status when a new draft answer is saved', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      completed: true,
      resultTier: 'pending_teacher_review',
      attemptStatus: 'pending_teacher_review',
      completionReason: 'teacher_review_pending',
      teacherSignal: 'ai_assessment_failed',
      lastAnswer: { openAnswer: 'oud antwoord' },
      lastAssessment: {
        feedback: 'oude feedback',
        answerSignature: 'old'
      }
    },
    data: {
      completed: false,
      isCorrect: false,
      resultTier: 'in_progress',
      attemptStatus: 'open',
      completionReason: '',
      teacherSignal: '',
      attempts: 1,
      lastAnswer: { openAnswer: 'nieuw antwoord' },
      draftSaved: true
    }
  });

  assert.equal(update.completed, false);
  assert.equal(update.resultTier, 'in_progress');
  assert.equal(update.attemptStatus, 'open');
  assert.equal(update.completionReason, '');
  assert.equal(update.teacherSignal, '');
  assert.equal(update.lastAssessment, null);
});

test('buildContentBlockVoortgangUpdate clears draft state when work is completed', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      draftSaved: true,
      attempts: 0,
      lastAnswer: { openAnswer: 'conceptantwoord' }
    },
    data: {
      completed: true,
      isCorrect: true,
      attempts: 1,
      lastAnswer: { openAnswer: 'definitief antwoord' }
    }
  });

  assert.equal(update.completed, true);
  assert.equal(update.draftSaved, false);
  assert.deepEqual(update.lastAnswer, { openAnswer: 'definitief antwoord' });
});

test('buildContentBlockVoortgangUpdate preserves first attempt and existing completed timestamp', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      firstAttemptAt: 'first',
      completedAt: 'done',
      attempts: 3,
      lastAnswer: { gap_1: 'oud' }
    },
    data: {
      completed: true,
      isCorrect: true
    }
  });

  assert.equal(update.firstAttemptAt, 'first');
  assert.equal(update.completedAt, undefined);
  assert.equal(update.attempts, 3);
  assert.deepEqual(update.lastAnswer, { gap_1: 'oud' });
});
