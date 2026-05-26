import test from 'node:test';
import assert from 'node:assert/strict';

import {
  QUESTION_TYPES,
  buildDefaultAnswerForQuestionType,
  buildDefaultTokenConfigForQuestionType,
  normalizeQuestionTokenConfig
} from './questionTypeRegistry.js';

test('question type registry exposes ordered extensible definitions', () => {
  assert.deepEqual(
    QUESTION_TYPES.map((type) => type.id),
    ['open', 'meerkeuze', 'numeriek', 'koppelen', 'invullen', 'volgorde']
  );

  assert.equal(QUESTION_TYPES.every((type) => type.label && type.description && type.template), true);
});

test('default answers are created per question type without shared references', () => {
  const first = buildDefaultAnswerForQuestionType('koppelen');
  const second = buildDefaultAnswerForQuestionType('koppelen');

  first.pairs[0].left = 'been';

  assert.equal(first.type, 'koppelen');
  assert.equal(second.pairs[0].left, '');
  assert.deepEqual(buildDefaultAnswerForQuestionType('unknown'), { type: 'open', modelAnswer: '' });
});

test('token config distributes default tokens over answer parts', () => {
  assert.deepEqual(
    buildDefaultTokenConfigForQuestionType('invullen', {
      gaps: [
        { id: 'gap-1', answer: 'a' },
        { id: 'gap-2', answer: 'b' }
      ]
    }),
    {
      enabled: true,
      totalTokens: 10,
      distribution: [
        { id: 'gap-1', label: 'Invulveld 1', tokens: 5 },
        { id: 'gap-2', label: 'Invulveld 2', tokens: 5 }
      ]
    }
  );
});

test('token config normalization preserves existing values and adds missing answer parts', () => {
  const normalized = normalizeQuestionTokenConfig(
    'koppelen',
    {
      pairs: [
        { id: 'pair-a', left: 'a', right: '1' },
        { id: 'pair-b', left: 'b', right: '2' }
      ]
    },
    {
      enabled: true,
      totalTokens: 8,
      distribution: [{ id: 'pair-a', label: 'Oud label', tokens: 6 }]
    }
  );

  assert.deepEqual(normalized, {
    enabled: true,
    totalTokens: 8,
    distribution: [
      { id: 'pair-a', label: 'Oud label', tokens: 6 },
      { id: 'pair-b', label: 'Koppelpaar 2', tokens: 2 }
    ]
  });
});
