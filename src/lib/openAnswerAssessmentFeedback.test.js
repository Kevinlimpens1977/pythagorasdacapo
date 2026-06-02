import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAnswerSignature,
  isAssessmentForAnswer,
  sanitizeOpenAnswerAssessmentFeedback
} from './openAnswerAssessmentFeedback.js';

test('sanitizeOpenAnswerAssessmentFeedback hides raw JSON parser messages', () => {
  assert.equal(
    sanitizeOpenAnswerAssessmentFeedback('No JSON object found'),
    'Digidocent kon je antwoord niet beoordelen. Probeer het nog eens.'
  );
});

test('sanitizeOpenAnswerAssessmentFeedback keeps normal didactic feedback', () => {
  assert.equal(
    sanitizeOpenAnswerAssessmentFeedback('Welke eenheid hoort bij je antwoord?'),
    'Welke eenheid hoort bij je antwoord?'
  );
});

test('isAssessmentForAnswer matches feedback to the exact answer signature', () => {
  const answer = { openAnswer: 'dus 50', mathTools: [] };
  const assessment = {
    feedback: 'Welke berekening hoort hierbij?',
    answerSignature: buildAnswerSignature(answer)
  };

  assert.equal(isAssessmentForAnswer(assessment, answer), true);
  assert.equal(isAssessmentForAnswer(assessment, { openAnswer: 'dus 50%', mathTools: [] }), false);
  assert.equal(isAssessmentForAnswer({ feedback: 'oud' }, answer), false);
});
