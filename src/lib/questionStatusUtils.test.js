import test from 'node:test';
import assert from 'node:assert/strict';

import {
  QUESTION_STATUS_OPTIONS,
  getQuestionStatusLabel,
  normalizeQuestionStatus
} from './questionStatusUtils.js';

test('question status labels stay Dutch for CMS consistency', () => {
  assert.deepEqual(QUESTION_STATUS_OPTIONS, [
    { id: 'draft', label: 'Concept' },
    { id: 'published', label: 'Gepubliceerd' }
  ]);
  assert.equal(getQuestionStatusLabel('draft'), 'Concept');
  assert.equal(getQuestionStatusLabel('published'), 'Gepubliceerd');
});

test('normalizeQuestionStatus falls back to draft for unknown values', () => {
  assert.equal(normalizeQuestionStatus('published'), 'published');
  assert.equal(normalizeQuestionStatus('bad-value'), 'draft');
  assert.equal(normalizeQuestionStatus(''), 'draft');
});
