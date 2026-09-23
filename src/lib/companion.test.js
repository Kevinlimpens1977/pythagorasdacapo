import test from 'node:test';
import assert from 'node:assert/strict';
import { companionStadium, normaliseerCompanion } from './companion.js';
import { adviesVoorWeek } from './beloningMeting.js';

test('companion groeit met sterren en krimpt nooit', () => {
  assert.equal(companionStadium(0).stadium, 1);
  assert.equal(companionStadium(0).nogSterren, 3);
  assert.equal(companionStadium(3).stadium, 2);
  assert.equal(companionStadium(24).stadium, 3);
  assert.equal(companionStadium(24).nogSterren, 1);
  assert.equal(companionStadium(500).stadium, 5);
  assert.equal(companionStadium(500).nogSterren, 0);
  assert.equal(companionStadium(-4).stadium, 1);
});

test('companion: onbekende soort of kleur valt terug', () => {
  assert.deepEqual(normaliseerCompanion({ soort: 'draak', kleur: 'comp-roze' }), { soort: 'draak', kleur: 'comp-roze' });
  assert.deepEqual(normaliseerCompanion({ soort: 'eenhoorn', kleur: 'rood' }), { soort: '', kleur: 'comp-blauw' });
});

test('meting: advies bij weinig activiteit, plafond en sparen zonder kopen', () => {
  assert.deepEqual(adviesVoorWeek({ leerlingen: 0 }), []);
  const advies = adviesVoorWeek({ leerlingen: 20, actief: 8, plafondGeraakt: 7, aankopen: 0, privileges: 0, gemiddeldSaldo: 450 });
  assert.equal(advies.length, 3);
  assert.equal(adviesVoorWeek({ leerlingen: 20, actief: 18, plafondGeraakt: 1, aankopen: 6, gemiddeldSaldo: 120 }).length, 0);
});
