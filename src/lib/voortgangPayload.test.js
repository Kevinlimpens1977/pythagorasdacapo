import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContentBlockVoortgangUpdate } from './voortgangPayload.js';

const base = {
  userId: 'student-1',
  blockId: 'block-1',
  paragraafId: 'par-1',
  hoofdstukId: 'h-1',
  klasId: 'klas-1',
  timestamp: 'now'
};

test('buildContentBlockVoortgangUpdate stores an incomplete attempt with answer and AI metadata', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: false,
      isCorrect: false,
      attempts: 2,
      aiHelpCount: 2,
      lastAnswer: { openAnswer: 'ik denk 42' },
      blockTitle: 'Vraag 1',
      blockType: 'question',
      vraagTitle: 'Open vraag',
      vraagType: 'open'
    }
  });

  assert.equal(update.completed, false);
  assert.equal(update.isCorrect, false);
  assert.equal(update.attempts, 2);
  assert.deepEqual(update.lastAnswer, { openAnswer: 'ik denk 42' });
  assert.equal(update.aiHelpCount, 2);
  assert.equal(update.aiHelpUsed, true);
  assert.equal(update.helpTier, 'in_progress');
  assert.equal(update.scoreWeight, 0);
  assert.equal(update.completedAt, undefined);
  assert.equal(update.blockTitle, 'Vraag 1');
  assert.equal(update.vraagType, 'open');
});

test('buildContentBlockVoortgangUpdate stores completed independent work with full score', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: true,
      isCorrect: true,
      attempts: 1,
      aiHelpCount: 0,
      lastAnswer: { gap_1: 'oppervlakte' }
    }
  });

  assert.equal(update.completed, true);
  assert.equal(update.isCorrect, true);
  assert.equal(update.helpTier, 'independent');
  assert.equal(update.scoreWeight, 1);
  assert.equal(update.completedAt, 'now');
});

test('buildContentBlockVoortgangUpdate stores draft answers without counting an attempt', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    data: {
      completed: false,
      isCorrect: false,
      attempts: 0,
      lastAnswer: { openAnswer: 'conceptantwoord' },
      draftSaved: true
    }
  });

  assert.equal(update.completed, false);
  assert.equal(update.isCorrect, false);
  assert.equal(update.attempts, 0);
  assert.equal(update.draftSaved, true);
  assert.deepEqual(update.lastAnswer, { openAnswer: 'conceptantwoord' });
});

test('buildContentBlockVoortgangUpdate preserves first attempt and existing completed timestamp', () => {
  const update = buildContentBlockVoortgangUpdate({
    ...base,
    existingData: {
      firstAttemptAt: 'first',
      completedAt: 'done',
      attempts: 3,
      lastAnswer: { gap_1: 'oud' }
    },
    data: {
      completed: true,
      isCorrect: true
    }
  });

  assert.equal(update.firstAttemptAt, 'first');
  assert.equal(update.completedAt, undefined);
  assert.equal(update.attempts, 3);
  assert.deepEqual(update.lastAnswer, { gap_1: 'oud' });
});
