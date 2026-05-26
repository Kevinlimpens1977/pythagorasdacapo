import test from 'node:test';
import assert from 'node:assert/strict';

import { isAnswerCorrect } from './answerNormalization.js';

test('isAnswerCorrect accepts smart fill blank spelling variants', () => {
  assert.equal(isAnswerCorrect('opervlakte', 'oppervlakte'), true);
});

test('isAnswerCorrect accepts smart square centimeter variants', () => {
  assert.equal(isAnswerCorrect('vierkantecen t i meter', 'cm2'), true);
});
