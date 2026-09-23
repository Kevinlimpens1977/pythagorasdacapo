import test from 'node:test';
import assert from 'node:assert/strict';
import {
  beloningMelding,
  buildTokenAwardPayload,
  shouldRequestTokenAward
} from './tokenAwardUtils.js';

test('shouldRequestTokenAward: sinds fase 1 elk afgerond blok (XP), ook fout of zonder tokens', () => {
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: true, extra: { isCorrect: true } }), true);
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: false, extra: { isCorrect: true } }), false);
  assert.equal(shouldRequestTokenAward({ block: { type: 'question', content: { tokenConfig: { totalTokens: 4 } } }, completed: true, extra: { isCorrect: false } }), true);
  assert.equal(shouldRequestTokenAward({ block: { type: 'theory', content: {} }, completed: true, extra: {} }), true);
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

test('buildTokenAwardPayload stuurt de score mee voor tokens naar beheersing', () => {
  const payload = buildTokenAwardPayload({
    block: { id: 't1', type: 'toets', content: { tokenConfig: { totalTokens: 30 } } },
    paragraafId: 'p1',
    completed: true,
    extra: { isCorrect: false, resultTier: 'failed', score: 7, maxScore: 10, itemsCorrect: 7, itemCount: 10 }
  });
  assert.deepEqual(payload.result, {
    completed: true, isCorrect: false, resultTier: 'failed', score: 7, maxScore: 10, itemsCorrect: 7, itemCount: 10
  });
});

test('beloningMelding vat XP, tokens, reden en niveau samen', () => {
  assert.equal(beloningMelding({ awarded: false }), '');
  assert.equal(beloningMelding({ awarded: true, xp: 30, amount: 12, reden: '90% goed' }), '+30 XP · +12 tokens · 90% goed');
  assert.equal(beloningMelding({ awarded: true, xp: 10, amount: 0, reden: 'afgerond' }), '+10 XP · afgerond');
  assert.equal(
    beloningMelding({ awarded: true, xp: 50, amount: 55, niveauTokens: 25, reden: '100% goed', ster: true, niveauOmhoog: true, niveau: 3 }),
    '+50 XP · +30 tokens · 100% goed · ster verdiend · niveau 3 gehaald (+25 tokens)'
  );
  assert.match(beloningMelding({ awarded: true, xp: 20, amount: 5, plafondBereikt: true }), /weekplafond bereikt/);
});

test('beloningMelding noemt weekdoel, weekkist, reeks en huiswerkbonus', () => {
  assert.equal(
    beloningMelding({ awarded: true, xp: 10, amount: 0, reden: 'afgerond', weekdoel: { gedaan: 2, totaal: 5, gehaald: false } }),
    '+10 XP · afgerond · weekdoel 2 van 5'
  );
  assert.equal(
    beloningMelding({
      awarded: true, xp: 30, amount: 12 + 45 + 30, reden: '100% goed',
      weekdoel: { gedaan: 5, totaal: 5, gehaald: true }, kistTokens: 45, reeks: { aantal: 3 }, mijlpaalTokens: 30
    }),
    '+30 XP · +12 tokens · 100% goed · weekdoel gehaald: weekkist +45 · weekreeks 3 (+30)'
  );
  assert.match(beloningMelding({ awarded: true, xp: 10, amount: 20, huiswerkTokens: 20 }), /^\+10 XP · huiswerkbonus \+20$/);
});
