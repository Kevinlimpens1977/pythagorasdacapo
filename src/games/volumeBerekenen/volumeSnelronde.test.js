import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIES, SCHALEN, streepjeVan } from './volumeLogic.js';
import { beoordeelSnel, formatKlok, juistTekst, maakSnelOpgave } from './volumeSnelronde.js';

test('snelronde maakt geldige opgaven per missie, nooit twee keer dezelfde', () => {
  for (const missie of Object.values(MISSIES)) {
    let vorige = null;
    for (let i = 0; i < 300; i += 1) {
      const opgave = maakSnelOpgave(missie, { vorige });
      assert.ok(opgave.juist > 0, `${missie}: ${JSON.stringify(opgave)}`);
      if (vorige) assert.notEqual(opgave.sleutel, vorige.sleutel);
      if (opgave.soort === 'aflezen') {
        assert.notEqual(streepjeVan(opgave.juist, SCHALEN[opgave.schaal]), null);
      }
      if (opgave.soort === 'dompel') {
        const schaal = SCHALEN[opgave.schaal];
        assert.ok(opgave.eind > opgave.begin && opgave.eind < schaal.max);
        assert.notEqual(streepjeVan(opgave.begin, schaal), null);
        assert.notEqual(streepjeVan(opgave.eind, schaal), null);
      }
      if (opgave.soort === 'balk') assert.equal(opgave.juist, opgave.l * opgave.b * opgave.h);
      vorige = opgave;
    }
  }
});

test('beoordeelSnel: komma en punt, leeg geeft null', () => {
  const opgave = { soort: 'aflezen', schaal: 'ml10', juist: 7.4 };
  assert.equal(beoordeelSnel(opgave, '7,4'), true);
  assert.equal(beoordeelSnel(opgave, '7.4'), true);
  assert.equal(beoordeelSnel(opgave, '7,6'), false);
  assert.equal(beoordeelSnel(opgave, ''), null);
  assert.equal(juistTekst(opgave), '7,4 ml');
  assert.equal(juistTekst({ soort: 'balk', juist: 60 }), '60 cm³');
});

test('formatKlok toont mm:ss en rondt naar boven af', () => {
  assert.equal(formatKlok(60_000), '01:00');
  assert.equal(formatKlok(59_001), '01:00');
  assert.equal(formatKlok(9_000), '00:09');
  assert.equal(formatKlok(-5), '00:00');
});
