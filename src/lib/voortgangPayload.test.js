import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAssessmentItemVoortgangUpdate,
  buildContentBlockVoortgangUpdate,
  summarizeAssessmentItemProgress
} from './voortgangPayload.js';

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

test('buildContentBlockVoortgangUpdate keeps part scores instead of only right or wrong', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: true,
      isCorrect: false,
      parts: [
        { id: 'gap-1', label: 'Invulveld 1', isCorrect: true },
        { id: 'gap-2', label: 'Invulveld 2', isCorrect: false }
      ],
      score: 1,
      maxScore: 2
    }
  });

  assert.deepEqual(update.parts, [
    { id: 'gap-1', label: 'Invulveld 1', isCorrect: true },
    { id: 'gap-2', label: 'Invulveld 2', isCorrect: false }
  ]);
  assert.equal(update.score, 1);
  assert.equal(update.maxScore, 2);
});

test('buildContentBlockVoortgangUpdate logs attempts instead of only counting them', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      attemptHistory: [{ attemptNr: 1, answer: { openAnswer: 'eerste' }, isCorrect: false, aiHelpCount: 0 }]
    },
    data: {
      completed: true,
      isCorrect: true,
      attempts: 2,
      attemptEntry: { attemptNr: 2, answer: { openAnswer: 'tweede' }, isCorrect: true, aiHelpCount: 1 }
    }
  });

  assert.equal(update.attemptHistory.length, 2);
  assert.deepEqual(update.attemptHistory.map((entry) => entry.isCorrect), [false, true]);
  assert.equal(update.attemptHistory[1].aiHelpCount, 1);
});

test('buildAssessmentItemVoortgangUpdate stores one question inside a toets', () => {
  const update = buildAssessmentItemVoortgangUpdate({
    userId: 'student-1',
    blockId: 'toets-1',
    itemId: 'item-3',
    itemIndex: 2,
    paragraafId: 'par-1',
    hoofdstukId: 'h-1',
    klasId: 'klas-1',
    timestamp: 'now',
    data: {
      completed: true,
      isCorrect: false,
      attempts: 2,
      maxAttempts: 2,
      attemptStatus: 'locked',
      resultTier: 'failed',
      blockType: 'toets',
      vraagTitle: 'Wat is phishing?',
      vraagType: 'meerkeuze',
      parts: [
        { id: 'gap-1', label: 'Invulveld 1', isCorrect: true },
        { id: 'gap-2', label: 'Invulveld 2', isCorrect: false }
      ],
      lastAnswer: { value: ['option-1'] },
      attemptEntry: { attemptNr: 2, answer: ['option-1'], isCorrect: false, aiHelpCount: 1 }
    }
  });

  assert.equal(update.progressType, 'assessmentItem');
  assert.equal(update.itemId, 'item-3');
  assert.equal(update.itemIndex, 2);
  assert.equal(update.blockId, 'toets-1');
  assert.equal(update.maxAttempts, 2);
  assert.equal(update.resultTier, 'failed');
  // Deelscore uit de gedeelde beoordelingslaag: 1 van de 2 onderdelen goed.
  assert.equal(update.score, 1);
  assert.equal(update.maxScore, 2);
  assert.equal(update.attemptHistory.length, 1);
  assert.equal(update.firstAttemptAt, 'now');
  assert.equal(update.completedAt, 'now');
});

test('buildAssessmentItemVoortgangUpdate keeps the first attempt and appends to the log', () => {
  const update = buildAssessmentItemVoortgangUpdate({
    userId: 'student-1',
    blockId: 'toets-1',
    itemId: 'item-1',
    paragraafId: 'par-1',
    klasId: 'klas-1',
    timestamp: 'later',
    existingData: {
      firstAttemptAt: 'first',
      completedAt: 'done',
      attemptHistory: [{ attemptNr: 1, answer: 'option-2', isCorrect: false }]
    },
    data: {
      completed: true,
      isCorrect: true,
      attempts: 2,
      attemptEntry: { attemptNr: 2, answer: 'option-1', isCorrect: true }
    }
  });

  assert.equal(update.firstAttemptAt, 'first');
  assert.equal(update.completedAt, undefined);
  assert.deepEqual(update.attemptHistory.map((entry) => entry.attemptNr), [1, 2]);
});

test('summarizeAssessmentItemProgress rolls items up to the state of the block', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  const halfway = summarizeAssessmentItemProgress({
    items,
    records: { a: { completed: true, isCorrect: true, score: 1, maxScore: 1 } }
  });
  assert.equal(halfway.completed, false);
  assert.equal(halfway.itemsAnswered, 1);
  assert.equal(halfway.resultTier, 'in_progress');

  const allGood = summarizeAssessmentItemProgress({
    items,
    records: {
      a: { completed: true, isCorrect: true, score: 1, maxScore: 1 },
      b: { completed: true, isCorrect: true, score: 2, maxScore: 2 },
      c: { completed: true, isCorrect: true, score: 1, maxScore: 1 }
    }
  });
  assert.equal(allGood.completed, true);
  assert.equal(allGood.isCorrect, true);
  assert.equal(allGood.score, 4);
  assert.equal(allGood.maxScore, 4);
  assert.equal(allGood.resultTier, 'independent');

  // Groen met Digidocent-hulp blijft groen, maar wel herkenbaar anders.
  const withHelp = summarizeAssessmentItemProgress({
    items: [{ id: 'a' }],
    records: { a: { completed: true, isCorrect: true, score: 1, maxScore: 1, aiHelpCount: 1 } }
  });
  assert.equal(withHelp.resultTier, 'guided');

  const pending = summarizeAssessmentItemProgress({
    items: [{ id: 'a' }],
    records: { a: { completed: true, isCorrect: false, attemptStatus: 'pending_teacher_review' } }
  });
  assert.equal(pending.resultTier, 'pending_teacher_review');
  assert.equal(pending.attemptStatus, 'pending_teacher_review');

  const failed = summarizeAssessmentItemProgress({
    items: [{ id: 'a' }],
    records: { a: { completed: true, isCorrect: false, resultTier: 'failed', score: 0, maxScore: 1 } }
  });
  assert.equal(failed.resultTier, 'failed');
});

test('buildContentBlockVoortgangUpdate bewaart zelfbeoordeling en houdt bestaande records vast', () => {
  const records = [
    { fieldId: 'veld-1', zelfoordeel: 'goed', aiCorrect: true, denktijdMs: 30000 }
  ];

  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: { completed: true, isCorrect: true, zelfbeoordeling: records }
  });
  assert.deepEqual(update.zelfbeoordeling, records);

  // Zonder nieuwe records blijft de bestaande zelfbeoordeling staan.
  const behouden = buildContentBlockVoortgangUpdate({
    ...base,
    data: { completed: true },
    existingData: { zelfbeoordeling: records }
  });
  assert.deepEqual(behouden.zelfbeoordeling, records);

  // Zonder enige zelfbeoordeling is het veld een lege lijst, geen undefined:
  // Firestore weigert undefined.
  const leeg = buildContentBlockVoortgangUpdate({ ...base, data: { completed: true } });
  assert.deepEqual(leeg.zelfbeoordeling, []);
});
