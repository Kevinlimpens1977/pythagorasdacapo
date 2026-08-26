import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLOSED_GRADE_REVIEW_REASONS,
  CLOSED_GRADE_SOURCES,
  buildClosedQuestionAccessMessage,
  buildClosedQuestionReviewMessage,
  isClosedQuestionAccessError,
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

// Verkeerde lesstof of geen klas is een bewuste weigering van de server, geen
// storing. De leerling hoort dan de echte melding en er wordt niets geparkeerd.
test('a deliberate server refusal is an access error, not a teacher-review case', () => {
  assert.equal(
    isClosedQuestionAccessError({ success: false, code: 'functions/permission-denied' }),
    true
  );
  assert.equal(
    isClosedQuestionAccessError({ success: false, code: 'functions/failed-precondition' }),
    true
  );
});

test('real unavailability is NOT an access error and keeps the teacher-review fallback', () => {
  assert.equal(isClosedQuestionAccessError(null), false);
  assert.equal(isClosedQuestionAccessError({ success: false, code: 'functions/not-found' }), false);
  assert.equal(isClosedQuestionAccessError({ success: false, code: 'functions/internal' }), false);
  assert.equal(
    isClosedQuestionAccessError({ success: false, code: 'functions/resource-exhausted' }),
    false
  );
  // Een geslaagd antwoord kan nooit een weigering zijn, wat de code ook zegt.
  assert.equal(
    isClosedQuestionAccessError({ success: true, code: 'functions/permission-denied' }),
    false
  );
});

test('the access message passes the real server message through, plus what to do', () => {
  assert.equal(
    buildClosedQuestionAccessMessage({
      success: false,
      code: 'functions/permission-denied',
      error: 'Dit toetsblok hoort niet bij jouw lesstof.'
    }),
    'Dit toetsblok hoort niet bij jouw lesstof. Vraag je docent om de paragraaf toe te wijzen.'
  );

  assert.equal(
    buildClosedQuestionAccessMessage({
      success: false,
      code: 'functions/failed-precondition',
      error: 'Je bent nog niet aan een klas gekoppeld.'
    }),
    'Je bent nog niet aan een klas gekoppeld. Vraag je docent om je aan een klas te koppelen.'
  );
});

test('the access message never doubles the advice when the server already names the teacher', () => {
  assert.equal(
    buildClosedQuestionAccessMessage({
      success: false,
      code: 'functions/permission-denied',
      error: 'Dit hoort niet bij jouw lesstof. Vraag je docent om hulp.'
    }),
    'Dit hoort niet bij jouw lesstof. Vraag je docent om hulp.'
  );
});

test('the access message has a readable fallback when the server message is empty', () => {
  const message = buildClosedQuestionAccessMessage({
    success: false,
    code: 'functions/permission-denied',
    error: ''
  });
  assert.ok(message.includes('hoort niet bij jouw lesstof'));
  assert.ok(message.includes('docent'));
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
