import assert from 'node:assert/strict';
import test from 'node:test';
import {
  areExerciseAnswersComplete,
  buildExerciseAnswerPayload,
  buildInitialExerciseAnswers,
  getExerciseFields,
  hasExerciseFields,
  sanitizePublicExercise
} from './exerciseBlockUtils.js';

const seedBlock = {
  content: {
    exercise: {
      fields: [
        { id: 'check-1', label: 'Waar bewaar je schoolwerk?', answer: '' },
        { id: 'check-2', label: 'Wanneer gebruik je Outlook?', answer: '' },
        { label: '  ', answer: '' }
      ]
    }
  }
};

test('getExerciseFields normaliseert velden en laat lege labels weg', () => {
  const fields = getExerciseFields(seedBlock);
  assert.equal(fields.length, 2);
  assert.deepEqual(fields[0], { id: 'check-1', label: 'Waar bewaar je schoolwerk?' });
});

test('getExerciseFields geeft ids aan velden zonder id', () => {
  const fields = getExerciseFields({ content: { exercise: { fields: [{ label: 'Vraag' }] } } });
  assert.deepEqual(fields, [{ id: 'field-1', label: 'Vraag' }]);
});

test('hasExerciseFields herkent blokken met en zonder exercise', () => {
  assert.equal(hasExerciseFields(seedBlock), true);
  assert.equal(hasExerciseFields({ content: {} }), false);
  assert.equal(hasExerciseFields({ content: { exercise: { fields: [] } } }), false);
  assert.equal(hasExerciseFields(null), false);
});

test('buildInitialExerciseAnswers herstelt eerder ingeleverde antwoorden', () => {
  const fields = getExerciseFields(seedBlock);
  const lastAnswer = { kind: 'exercise', answers: [{ id: 'check-2', label: 'x', answer: 'Voor mail' }] };
  const answers = buildInitialExerciseAnswers(fields, lastAnswer);
  assert.deepEqual(answers, { 'check-1': '', 'check-2': 'Voor mail' });
});

test('areExerciseAnswersComplete vereist alle velden ingevuld', () => {
  const fields = getExerciseFields(seedBlock);
  assert.equal(areExerciseAnswersComplete(fields, { 'check-1': 'OneDrive', 'check-2': '' }), false);
  assert.equal(areExerciseAnswersComplete(fields, { 'check-1': 'OneDrive', 'check-2': '  ' }), false);
  assert.equal(areExerciseAnswersComplete(fields, { 'check-1': 'OneDrive', 'check-2': 'Voor mail' }), true);
  assert.equal(areExerciseAnswersComplete([], {}), false);
});

test('buildExerciseAnswerPayload bewaart label en getrimd antwoord per veld', () => {
  const fields = getExerciseFields(seedBlock);
  const payload = buildExerciseAnswerPayload(fields, { 'check-1': ' OneDrive ', 'check-2': 'Voor mail' });
  assert.equal(payload.kind, 'exercise');
  assert.deepEqual(payload.answers[0], { id: 'check-1', label: 'Waar bewaar je schoolwerk?', answer: 'OneDrive' });
});

test('sanitizePublicExercise strips antwoorden en lege velden', () => {
  const sanitized = sanitizePublicExercise({
    fields: [
      { id: 'a', label: 'Vraag A', answer: 'modelantwoord' },
      { label: '' }
    ]
  });
  assert.deepEqual(sanitized, { fields: [{ id: 'a', label: 'Vraag A' }] });
  assert.equal('answer' in sanitized.fields[0], false);
  assert.deepEqual(sanitizePublicExercise(undefined), { fields: [] });
});
