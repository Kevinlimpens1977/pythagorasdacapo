import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePythagorasTrainerScore,
  isPythagorasAnswerCorrect,
  normalizeNumericAnswer,
  PYTHAGORAS_TRAINER_ROUNDS
} from './pythagorasTrainerLogic.js';

test('Pythagoras Trainer has five playable rounds', () => {
  assert.equal(PYTHAGORAS_TRAINER_ROUNDS.length, 5);
  assert.equal(PYTHAGORAS_TRAINER_ROUNDS.every((round) => round.id && round.prompt && round.answer), true);
});

test('normalizeNumericAnswer accepts comma and dot decimals', () => {
  assert.equal(normalizeNumericAnswer('5'), 5);
  assert.equal(normalizeNumericAnswer('12,5'), 12.5);
  assert.equal(normalizeNumericAnswer('12.5'), 12.5);
  assert.equal(normalizeNumericAnswer('abc'), null);
});

test('isPythagorasAnswerCorrect applies small tolerance', () => {
  assert.equal(isPythagorasAnswerCorrect('5', 5), true);
  assert.equal(isPythagorasAnswerCorrect('5,03', 5), true);
  assert.equal(isPythagorasAnswerCorrect('5,2', 5), false);
});

test('calculatePythagorasTrainerScore counts correct rounds', () => {
  assert.equal(calculatePythagorasTrainerScore([
    { isCorrect: true },
    { isCorrect: false },
    { isCorrect: true }
  ]), 2);
});
