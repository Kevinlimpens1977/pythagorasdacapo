import test from 'node:test';
import assert from 'node:assert/strict';

import { sanitizeOpenAnswerAssessmentFeedback } from './openAnswerAssessmentFeedback.js';

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
