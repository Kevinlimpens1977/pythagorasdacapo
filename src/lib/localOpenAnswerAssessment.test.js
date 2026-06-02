import test from 'node:test';
import assert from 'node:assert/strict';
import { assessOpenAnswerLocally } from './localOpenAnswerAssessment.js';

test('assessOpenAnswerLocally accepts a simple square-root answer without AI', () => {
  const result = assessOpenAnswerLocally({
    questionPrompt: 'Wat is de wortel van 100?',
    modelAnswer: '10',
    studentAnswer: '10'
  });

  assert.deepEqual(result, {
    canAssess: true,
    isCorrect: true,
    feedback: 'Goed gerekend. Je antwoord klopt.',
    missing: []
  });
});

test('assessOpenAnswerLocally can compare a model expression with a numeric answer', () => {
  const result = assessOpenAnswerLocally({
    questionPrompt: 'Bereken de wortel.',
    modelAnswer: '√100 = 10',
    studentAnswer: '10'
  });

  assert.equal(result.canAssess, true);
  assert.equal(result.isCorrect, true);
});

test('assessOpenAnswerLocally declines broad text answers so AI can assess them', () => {
  const result = assessOpenAnswerLocally({
    questionPrompt: 'Wat zijn digitale vaardigheden?',
    modelAnswer: 'Dat je goed met computers en internet kunt omgaan.',
    studentAnswer: 'alles over computers en internet'
  });

  assert.equal(result.canAssess, false);
});
