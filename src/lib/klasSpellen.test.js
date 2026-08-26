import test from 'node:test';
import assert from 'node:assert/strict';
import { speelbareKlasSpellen, toggleSpelVoorKlas } from './klasSpellen.js';
import { GAME_STATUSES } from './gameRegistry.js';

const registry = [
  { gameId: 'turbo-typen', status: GAME_STATUSES.ACTIVE },
  { gameId: 'dvlingo', status: GAME_STATUSES.PROTOTYPE }
];

test('alleen actieve en klaargezette spellen zijn speelbaar', () => {
  const klas = { enabledGames: ['turbo-typen', 'dvlingo', 'bestaat-niet'] };
  assert.deepEqual(speelbareKlasSpellen(klas, registry).map((g) => g.gameId), ['turbo-typen']);
});

test('zonder klaargezette spellen is de lijst leeg', () => {
  assert.deepEqual(speelbareKlasSpellen({}, registry), []);
  assert.deepEqual(speelbareKlasSpellen({ enabledGames: [] }, registry), []);
});

test('toggle zet aan en weer uit', () => {
  assert.deepEqual(toggleSpelVoorKlas([], 'turbo-typen'), ['turbo-typen']);
  assert.deepEqual(toggleSpelVoorKlas(['turbo-typen'], 'turbo-typen'), []);
  assert.deepEqual(toggleSpelVoorKlas(['a'], 'b'), ['a', 'b']);
});
