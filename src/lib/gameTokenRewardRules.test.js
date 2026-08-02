import test from 'node:test';
import assert from 'node:assert/strict';
import {
  describePlayLimit,
  getEffectiveGameRewardRule,
  getEffectiveMaxPlays,
  getPlayAccess,
  normalizeGameRewardRule,
  normalizeMaxPlays,
  SERVER_DEFAULT_GAME_REWARD_RULES,
  UNLIMITED_PLAYS
} from './gameTokenRewardRules.js';

test('normalizeGameRewardRule keert null terug voor uitgeschakelde of lege regels', () => {
  assert.equal(normalizeGameRewardRule(null), null);
  assert.equal(normalizeGameRewardRule({ enabled: false, max: 25 }), null);
  assert.equal(normalizeGameRewardRule({ max: 0 }), null);
});

test('normalizeGameRewardRule klemt min binnen 0..max en vult basis aan', () => {
  assert.deepEqual(
    normalizeGameRewardRule({ min: 40, max: 25 }),
    { min: 25, max: 25, basis: 'completion' }
  );
  assert.deepEqual(
    normalizeGameRewardRule({ min: -5, max: 10, basis: 'score_accuracy_completion' }),
    { min: 0, max: 10, basis: 'score_accuracy_completion' }
  );
});

test('getEffectiveGameRewardRule geeft custom regel voorrang', () => {
  const configured = { 'demo-spel': { enabled: true, min: 2, max: 12, basis: 'completion' } };
  const effective = getEffectiveGameRewardRule('demo-spel', configured);

  assert.equal(effective.source, 'custom');
  assert.deepEqual(effective.rule, { min: 2, max: 12, basis: 'completion' });
});

test('zonder custom regel of serverdefault geldt: geen tokens', () => {
  const effective = getEffectiveGameRewardRule('spel-zonder-regel', {});
  assert.equal(effective.source, 'none');
  assert.equal(effective.rule, null);
});

test('wachtwoord-detective heeft een serverdefault van maximaal 100 tokens', () => {
  const effective = getEffectiveGameRewardRule('wachtwoord-detective', {});
  assert.equal(effective.source, 'default');
  assert.deepEqual(effective.rule, { min: 0, max: 100, basis: 'score_accuracy_completion' });
  assert.deepEqual(
    SERVER_DEFAULT_GAME_REWARD_RULES['wachtwoord-detective'],
    { enabled: true, min: 0, max: 100, basis: 'score_accuracy_completion' }
  );
});

test('een uitgeschakelde custom regel betekent geen tokens (zoals server-side)', () => {
  const configured = { 'demo-spel': { enabled: false, max: 10 } };
  const effective = getEffectiveGameRewardRule('demo-spel', configured);

  assert.equal(effective.source, 'custom');
  assert.equal(effective.rule, null);
});

test('normalizeMaxPlays klemt naar 0 (onbeperkt) of 1..5', () => {
  assert.equal(normalizeMaxPlays(0), UNLIMITED_PLAYS);
  assert.equal(normalizeMaxPlays(-2), UNLIMITED_PLAYS);
  assert.equal(normalizeMaxPlays(null), UNLIMITED_PLAYS);
  assert.equal(normalizeMaxPlays(3), 3);
  assert.equal(normalizeMaxPlays(9), 5);
});

test('getEffectiveMaxPlays: Firestore-doc gaat voor registry-default, anders onbeperkt', () => {
  const configured = { 'demo-spel': { maxPlays: 2 } };
  assert.equal(getEffectiveMaxPlays('demo-spel', configured, 5), 2);
  assert.equal(getEffectiveMaxPlays('demo-spel', {}, 3), 3);
  assert.equal(getEffectiveMaxPlays('demo-spel', {}, 0), UNLIMITED_PLAYS);
  // maxPlays niet gezet in doc → val terug op registry-default
  assert.equal(getEffectiveMaxPlays('demo-spel', { 'demo-spel': { max: 10 } }, 4), 4);
  // maxPlays expliciet 0 in doc → onbeperkt, overschrijft registry-default
  assert.equal(getEffectiveMaxPlays('demo-spel', { 'demo-spel': { maxPlays: 0 } }, 3), UNLIMITED_PLAYS);
});

test('getPlayAccess bepaalt of er nog gespeeld mag worden', () => {
  const unlimited = getPlayAccess(0, 12);
  assert.equal(unlimited.unlimited, true);
  assert.equal(unlimited.canPlay, true);

  const fresh = getPlayAccess(3, 0);
  assert.equal(fresh.canPlay, true);
  assert.equal(fresh.remaining, 3);

  const used = getPlayAccess(3, 2);
  assert.equal(used.canPlay, true);
  assert.equal(used.remaining, 1);

  const done = getPlayAccess(3, 3);
  assert.equal(done.canPlay, false);
  assert.equal(done.remaining, 0);

  const over = getPlayAccess(3, 9);
  assert.equal(over.canPlay, false);
  assert.equal(over.remaining, 0);
});

test('describePlayLimit geeft leesbare tekst', () => {
  assert.equal(describePlayLimit(0), 'onbeperkt speelbaar');
  assert.equal(describePlayLimit(3), '3x speelbaar');
});
