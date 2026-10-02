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

test('een spel voor iedereen staat er altijd bij, ook zonder klas of toewijzing', () => {
  const metKlimbit = [...registry, { gameId: 'klimbit', status: GAME_STATUSES.ACTIVE, voorIedereen: true }];
  assert.deepEqual(speelbareKlasSpellen(null, metKlimbit).map((g) => g.gameId), ['klimbit']);
  assert.deepEqual(speelbareKlasSpellen({}, metKlimbit).map((g) => g.gameId), ['klimbit']);
  assert.deepEqual(
    speelbareKlasSpellen({ enabledGames: ['turbo-typen'] }, metKlimbit).map((g) => g.gameId),
    ['turbo-typen', 'klimbit']
  );
});

test('een spel voor iedereen dat niet actief is, blijft weg', () => {
  const prototype = [{ gameId: 'klimbit', status: GAME_STATUSES.PROTOTYPE, voorIedereen: true }];
  assert.deepEqual(speelbareKlasSpellen({}, prototype), []);
});
