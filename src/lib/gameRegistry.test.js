import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createLocalGameResult,
  GAME_REGISTRY,
  GAME_RESULT_HANDLING,
  getCmsEmbeddableGames,
  getGameById,
  isSerializableGameRegistryItem
} from './gameRegistry.js';

test('game registry contains serializable metadata only', () => {
  assert.equal(GAME_REGISTRY.length > 0, true);

  for (const game of GAME_REGISTRY) {
    assert.equal(isSerializableGameRegistryItem(game), true);
    assert.equal(typeof game.componentKey, 'string');
    assert.equal(typeof game.route, 'string');
    assert.equal(typeof game.title, 'string');
    assert.equal(Array.isArray(game.learningGoals), true);
    assert.equal(Array.isArray(game.skills), true);
    assert.equal(Array.isArray(game.supportedModes), true);
  }
});

test('cms embeddable game list only returns games that support cmsBlock mode', () => {
  const games = getCmsEmbeddableGames();

  assert.equal(games.length > 0, true);
  assert.equal(games.every((game) => game.supportedModes.includes('cmsBlock')), true);
});

test('createLocalGameResult produces the required V1 result contract without Firebase', () => {
  const game = getGameById('pythagoras-trainer');
  const result = createLocalGameResult({
    game,
    context: {
      mode: 'standalone',
      resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY
    },
    score: 4,
    maxScore: 5,
    startedAt: '2026-05-19T10:00:00.000Z',
    completedAt: '2026-05-19T10:02:30.000Z',
    attemptId: 'attempt-test-1'
  });

  assert.deepEqual(result, {
    attemptId: 'attempt-test-1',
    gameId: 'pythagoras-trainer',
    studentId: undefined,
    lessonId: undefined,
    blockId: undefined,
    score: 4,
    maxScore: 5,
    accuracy: 80,
    timeSpentSeconds: 150,
    startedAt: '2026-05-19T10:00:00.000Z',
    completedAt: '2026-05-19T10:02:30.000Z',
    suggestedTokenReward: 20
  });
});

test('Pythagoras Trainer can be selected as a CMS game block', () => {
  const pythagorasTrainer = getGameById('pythagoras-trainer');

  assert.equal(pythagorasTrainer.cmsEmbeddable, true);
  assert.equal(pythagorasTrainer.supportedModes.includes('cmsBlock'), true);
});

test('GO 2B marks Pythagoras Trainer as the first playable prototype', () => {
  const pythagorasTrainer = getGameById('pythagoras-trainer');

  assert.equal(pythagorasTrainer.componentKey, 'pythagorasTrainer');
  assert.equal(pythagorasTrainer.status, 'prototype');
});
