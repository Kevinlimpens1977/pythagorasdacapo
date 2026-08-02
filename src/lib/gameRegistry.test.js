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

const demoGame = {
  gameId: 'demo-spel',
  title: 'Demo Spel',
  description: 'Testfixture.',
  subject: 'Digitale vaardigheden',
  topic: 'Demo',
  level: 'VMBO leerjaar 1',
  learningGoals: ['Doel 1'],
  skills: ['vaardigheid'],
  estimatedMinutes: 5,
  route: '/admin/spellen/demo-spel',
  componentKey: 'demoSpel',
  cmsEmbeddable: true,
  supportedModes: ['standalone', 'cmsBlock'],
  tokenRewardPotential: { min: 0, max: 25, basis: 'score_accuracy_completion' },
  status: 'prototype'
};

test('game registry bevat alleen serialiseerbare metadata', () => {
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

test('lookup-helpers geven null of lege lijst bij onbekende of ontbrekende games', () => {
  assert.equal(getGameById('bestaat-niet'), null);
  assert.equal(getCmsEmbeddableGames().every((game) => game.supportedModes.includes('cmsBlock')), true);
});

test('createLocalGameResult levert het vaste resultaatcontract zonder Firebase', () => {
  const result = createLocalGameResult({
    game: demoGame,
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
    gameId: 'demo-spel',
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

test('createLocalGameResult klemt score en behandelt maxScore 0 veilig', () => {
  const result = createLocalGameResult({
    game: demoGame,
    context: {},
    score: -3,
    maxScore: 0,
    startedAt: '2026-05-19T10:00:00.000Z',
    completedAt: '2026-05-19T10:00:10.000Z'
  });

  assert.equal(result.score, 0);
  assert.equal(result.accuracy, 0);
  assert.equal(result.suggestedTokenReward, 0);
});
