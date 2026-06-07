import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildTokenAwardPayload,
  shouldRequestTokenAward
} from './tokenAwardUtils.js';

test('shouldRequestTokenAward only allows completed correct work with a token value or game block', () => {
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: true, extra: { isCorrect: true } }), true);
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: false, extra: { isCorrect: true } }), false);
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: true, extra: { isCorrect: false } }), false);
  assert.equal(shouldRequestTokenAward({ block: { type: 'game', content: { gameId: 'dv-account-escape' } }, completed: true, extra: { lastAnswer: { accuracy: 90 } } }), true);
});

test('buildTokenAwardPayload creates content block source data from lesson context', () => {
  const payload = buildTokenAwardPayload({
    block: {
      id: 'block-1',
      type: 'question',
      title: 'Vraag 1',
      paragraafId: 'p1',
      publishedVersion: 'v3',
      content: { tokenConfig: { totalTokens: 6 } }
    },
    paragraafId: 'p1',
    completed: true,
    extra: { isCorrect: true, resultTier: 'independent' }
  });

  assert.deepEqual(payload, {
    sourceKind: 'contentBlock',
    sourceId: 'block-1',
    sourceVersion: 'v3',
    sourceTitle: 'Vraag 1',
    paragraafId: 'p1',
    blockId: 'block-1',
    result: { completed: true, isCorrect: true, resultTier: 'independent' }
  });
});

test('buildTokenAwardPayload creates game source data with block-scoped idempotency', () => {
  const payload = buildTokenAwardPayload({
    block: {
      id: 'game-block-1',
      type: 'game',
      title: 'Account Escape',
      content: { gameId: 'dv-account-escape' }
    },
    paragraafId: 'p2',
    completed: true,
    extra: { lastAnswer: { completed: true, passed: true, accuracy: 100, suggestedTokenReward: 10 } }
  });

  assert.deepEqual(payload, {
    sourceKind: 'game',
    sourceId: 'dv-account-escape',
    sourceVersion: 'game-block-1',
    sourceTitle: 'Account Escape',
    paragraafId: 'p2',
    blockId: 'game-block-1',
    gameId: 'dv-account-escape',
    result: { completed: true, passed: true, accuracy: 100, suggestedTokenReward: 10 }
  });
});
