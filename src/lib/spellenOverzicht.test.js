import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_REGISTRY } from './gameRegistry.js';
import { ALLE, filterSpellen, vakkenVan } from './spellenOverzicht.js';

const spellen = [
  { gameId: 'a', title: 'Wachtwoord Detective', subject: 'Digitale vaardigheden', status: 'prototype', topic: 'Veilige wachtwoorden', skills: ['veilig handelen'] },
  { gameId: 'b', title: 'Volume berekenen 1: Lees de maatcilinder', subject: 'Binask', status: 'prototype', topic: 'Volume', skills: ['meten'] },
  { gameId: 'c', title: 'Turbo Typen', subject: 'Digitale vaardigheden', status: 'active', topic: 'Sneltypen', skills: [] }
];

test('zonder filter komen alle spellen terug', () => {
  assert.equal(filterSpellen(spellen).length, 3);
});

test('zoeken negeert hoofdletters en vindt op titel, onderwerp en vaardigheid', () => {
  assert.deepEqual(filterSpellen(spellen, { zoek: 'MAATCILINDER' }).map((s) => s.gameId), ['b']);
  assert.deepEqual(filterSpellen(spellen, { zoek: 'veilig' }).map((s) => s.gameId), ['a']);
  assert.deepEqual(filterSpellen(spellen, { zoek: 'volume meten' }).map((s) => s.gameId), ['b']);
  assert.equal(filterSpellen(spellen, { zoek: 'volume typen' }).length, 0);
});

test('filter op vak en status', () => {
  assert.deepEqual(filterSpellen(spellen, { vak: 'Binask' }).map((s) => s.gameId), ['b']);
  assert.deepEqual(filterSpellen(spellen, { status: 'active' }).map((s) => s.gameId), ['c']);
  assert.equal(filterSpellen(spellen, { vak: 'Digitale vaardigheden', status: 'prototype' }).length, 1);
  assert.equal(filterSpellen(spellen, { vak: ALLE, status: ALLE, zoek: '  ' }).length, 3);
});

test('vakkenVan telt per vak', () => {
  assert.deepEqual(vakkenVan(spellen), [
    { vak: 'Digitale vaardigheden', aantal: 2 },
    { vak: 'Binask', aantal: 1 }
  ]);
});

test('de registry bevat geen geplande placeholders meer', () => {
  assert.equal(GAME_REGISTRY.filter((game) => game.status === 'planned').length, 0);
  assert.ok(GAME_REGISTRY.every((game) => game.componentKey), 'elk spel heeft een component');
});
