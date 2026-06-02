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
    ringClass: '',
    scoreWeight: 1
  });
});

test('getLearningResultTone marks chat-guided correct work as green with a red dotted outline', () => {
  assert.deepEqual(getLearningResultTone({ isCorrect: true, aiHelpCount: 1 }), {
    tier: 'guided',
    label: 'Goed met Digidocent-hulp',
    borderClass: 'border-emerald-700',
    fillClass: 'bg-emerald-100',
    ringClass: 'outline outline-2 outline-offset-2 outline-dotted outline-rose-500',
    scoreWeight: 0.75
  });
});

test('getLearningResultTone marks max-attempt failures as red completed work', () => {
  assert.deepEqual(getLearningResultTone({ completed: true, isCorrect: false, resultTier: 'failed' }), {
    tier: 'failed',
    label: 'Geparkeerd voor herstel',
    borderClass: 'border-red-700',
    fillClass: 'bg-red-100',
    ringClass: '',
    scoreWeight: 0
  });
});

test('getLearningResultTone marks AI assessment failures as amber teacher review', () => {
  assert.deepEqual(getLearningResultTone({ completed: true, isCorrect: false, resultTier: 'pending_teacher_review' }), {
    tier: 'pending_teacher_review',
    label: 'Docentbeoordeling nodig',
    borderClass: 'border-amber-500',
    fillClass: 'bg-amber-100',
    ringClass: '',
    scoreWeight: 0
  });
});

test('buildLearningResultMetadata stores result details for Firestore', () => {
  assert.deepEqual(buildLearningResultMetadata({ completed: true, isCorrect: false, aiHelpCount: 2, resultTier: 'failed' }), {
    aiHelpCount: 2,
    aiHelpUsed: true,
    helpTier: 'failed',
    resultTier: 'failed',
    resultLabel: 'Geparkeerd voor herstel',
    scoreWeight: 0
  });
});
