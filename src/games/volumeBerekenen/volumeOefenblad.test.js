import test from 'node:test';
import assert from 'node:assert/strict';
import { AANTAL_OEFENVRAGEN, maakOefenblad, oefenAntwoordGoed } from './volumeOefenblad.js';

const zaad = (start) => {
  let s = start;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

test('oefenblad: acht sommen per missie, drie omrekeningen en vijf verhaalsommen', () => {
  for (const missie of ['maatcilinder', 'balk', 'onderdompelen']) {
    for (let i = 1; i <= 30; i += 1) {
      const blad = maakOefenblad(missie, zaad(i));
      assert.equal(blad.length, AANTAL_OEFENVRAGEN);
      assert.equal(blad.filter((vraag) => vraag.soort === 'omrekenen').length, 3);
      for (const vraag of blad) {
        assert.ok(Number.isFinite(vraag.antwoord) && vraag.antwoord > 0, `${missie}: ${vraag.vraag}`);
        assert.ok(vraag.uitwerking.length > 10);
        assert.ok(!/NaN|undefined/.test(vraag.vraag + vraag.uitwerking), vraag.vraag);
      }
    }
  }
});

test('oefenblad: Kevins voorbeelden rekenen goed', () => {
  const blad = maakOefenblad('onderdompelen', zaad(7));
  const eind = blad.find((vraag) => /eindvolume/.test(vraag.vraag));
  const [begin, v] = eind.vraag.match(/\d+/g).map(Number);
  assert.equal(eind.antwoord, begin + v);

  const blokjes = maakOefenblad('balk', zaad(3)).find((vraag) => /blokjes van/.test(vraag.vraag));
  const [aantal, gram, , keer] = blokjes.vraag.match(/\d+/g).map(Number);
  assert.equal(blokjes.antwoord, (aantal * gram * (1 + keer)) / 1000);
});

test('oefenblad: komma en punt worden allebei goed gerekend', () => {
  assert.equal(oefenAntwoordGoed('1,2', 1.2), true);
  assert.equal(oefenAntwoordGoed('1.2', 1.2), true);
  assert.equal(oefenAntwoordGoed('12', 1.2), false);
  assert.equal(oefenAntwoordGoed('', 1.2), false);
});
