import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLearningResultMetadata,
  getLearningResultTone,
  normalizeAiHelpCount
} from './learningResultUtils.js';

test('normalizeAiHelpCount clamps invalid values to zero', () => {
  assert.equal(normalizeAiHelpCount(undefined), 0);
  assert.equal(normalizeAiHelpCount(-4), 0);
  assert.equal(normalizeAiHelpCount('2'), 2);
});

test('getLearningResultTone marks correct work without AI as independent green', () => {
  assert.deepEqual(getLearningResultTone({ isCorrect: true, aiHelpCount: 0 }), {
    tier: 'independent',
    label: 'Zelfstandig goed',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-emerald-100',
    scoreWeight: 1
  });
});

test('getLearningResultTone marks one AI question as minimal help', () => {
  assert.deepEqual(getLearningResultTone({ isCorrect: true, aiHelpCount: 1 }), {
    tier: 'ai_minimal',
    label: 'Goed met minimale AI-hulp',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-rose-100',
    scoreWeight: 0.75
  });
});

test('getLearningResultTone marks multiple AI questions as guided help', () => {
  assert.deepEqual(getLearningResultTone({ isCorrect: true, aiHelpCount: 3 }), {
    tier: 'ai_guided',
    label: 'Goed met veel AI-hulp',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-rose-300',
    scoreWeight: 0.5
  });
});

test('buildLearningResultMetadata stores result details for Firestore', () => {
  assert.deepEqual(buildLearningResultMetadata({ isCorrect: false, aiHelpCount: 2 }), {
    aiHelpCount: 2,
    aiHelpUsed: true,
    helpTier: 'in_progress',
    resultLabel: 'Nog niet goed',
    scoreWeight: 0
  });
});
