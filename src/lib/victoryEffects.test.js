import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildVictoryEffectPlayback,
  createVictoryStreakState,
  resolveActiveVictoryEffect,
  updateVictoryStreak,
  VICTORY_STREAK_MILESTONE
} from './victoryEffects.js';

test('streak telt goede vraagblokken en geeft een mijlpaal bij elke vijfde', () => {
  let state = createVictoryStreakState();
  for (let index = 1; index <= VICTORY_STREAK_MILESTONE; index += 1) {
    state = updateVictoryStreak(state, { blockType: 'question', completed: true, isCorrect: true });
    assert.equal(state.count, index);
    assert.equal(state.milestone, index === VICTORY_STREAK_MILESTONE);
  }

  state = updateVictoryStreak(state, { blockType: 'question', completed: true, isCorrect: true });
  assert.deepEqual(state, { count: 6, milestone: false });
});

test('streak reset bij een fout antwoord', () => {
  let state = { count: 4 };
  state = updateVictoryStreak(state, { blockType: 'question', completed: true, isCorrect: false });
  assert.deepEqual(state, { count: 0, milestone: false });
});

test('niet-vraagblokken laten de streak ongemoeid', () => {
  const state = updateVictoryStreak({ count: 3 }, { blockType: 'theory', completed: true, isCorrect: true });
  assert.deepEqual(state, { count: 3, milestone: false });
});

test('tiende goede antwoord is opnieuw een mijlpaal', () => {
  const state = updateVictoryStreak({ count: 9 }, { blockType: 'question', completed: true, isCorrect: true });
  assert.deepEqual(state, { count: 10, milestone: true });
});

test('resolveActiveVictoryEffect vindt het actieve effect uit de loadout', () => {
  const items = [
    { id: 'effect-confetti', itemType: 'victoryEffect', title: 'Confettiregen', previewStyle: { effect: 'confetti', accent: '#f43f5e' } },
    { id: 'pin-1', itemType: 'shopBadge', title: 'Pin' }
  ];

  assert.deepEqual(
    resolveActiveVictoryEffect({ loadout: { activeVictoryEffectId: 'effect-confetti' }, items }),
    { id: 'effect-confetti', title: 'Confettiregen', effect: 'confetti', accent: '#f43f5e' }
  );

  assert.equal(resolveActiveVictoryEffect({ loadout: {}, items }), null);
});

test('resolveActiveVictoryEffect valt terug op een geldige effect-key', () => {
  const items = [
    { id: 'effect-x', itemType: 'victoryEffect', title: 'X', previewStyle: { effect: 'onbekend' } }
  ];
  const resolved = resolveActiveVictoryEffect({ loadout: { activeVictoryEffectId: 'effect-x' }, items });
  assert.equal(resolved.effect, 'confetti');
});

test('playback: paragraafafsluiting speelt vol, streak subtiel', () => {
  const effectItem = { effect: 'starfall', accent: '#f59e0b', title: 'Sterrenregen' };

  const full = buildVictoryEffectPlayback({ effectItem, trigger: 'paragraphEnd' });
  assert.equal(full.variant, 'full');
  assert.equal(full.heading, 'Paragraaf afgerond!');
  assert.equal(full.durationMs > 2000, true);

  const subtle = buildVictoryEffectPlayback({ effectItem, trigger: 'streak', streakCount: 5 });
  assert.equal(subtle.variant, 'subtle');
  assert.equal(subtle.heading, '5 goed op rij!');
  assert.equal(subtle.durationMs < full.durationMs, true);
});

test('playback: geen effect zonder gekocht/actief item of bij onbekende trigger', () => {
  assert.equal(buildVictoryEffectPlayback({ effectItem: null, trigger: 'paragraphEnd' }), null);
  assert.equal(buildVictoryEffectPlayback({ effectItem: { effect: 'confetti' }, trigger: 'elkeVraag' }), null);
});
