import test from 'node:test';
import assert from 'node:assert/strict';
import { AANTAL_OEFENVRAGEN, maakOefenblad, oefenAntwoordGoed, toonAntwoord } from './dichtheidOefenblad.js';
import { STOFFEN } from './dichtheidLogic.js';

const zaad = (start) => {
  let s = start;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

test('oefenblad: acht sommen per missie, drie omrekeningen, geen rommel', () => {
  for (const missie of ['meten', 'driehoek', 'practicum']) {
    for (let i = 1; i <= 200; i += 1) {
      const blad = maakOefenblad(missie, zaad(i));
      assert.equal(blad.length, AANTAL_OEFENVRAGEN);
      assert.equal(blad.filter((vraag) => vraag.soort === 'omrekenen').length, 3);
      for (const vraag of blad) {
        assert.ok(Number.isFinite(vraag.antwoord) && vraag.antwoord > 0, `${missie}: ${vraag.vraag}`);
        assert.ok(!/NaN|undefined|null/.test(vraag.vraag + vraag.uitwerking), vraag.vraag);
        assert.ok(oefenAntwoordGoed(toonAntwoord(vraag), vraag.antwoord, vraag), vraag.vraag);
      }
    }
  }
});

test('oefenblad: dichtheidsommen komen uit op een stof uit het boekje', () => {
  for (let i = 1; i <= 200; i += 1) {
    for (const vraag of maakOefenblad('meten', zaad(i)).filter((item) => item.afronden)) {
      const rho = Math.round(vraag.antwoord * 10) / 10;
      assert.ok(STOFFEN.some((stof) => Math.abs(stof.rho - rho) < 1e-9), `${vraag.vraag} -> ${rho}`);
    }
  }
});

test('oefenblad: afronden mag op één of twee decimalen', () => {
  const vraag = { afronden: true };
  assert.equal(oefenAntwoordGoed('8,9', 106.8 / 12, vraag), true);
  assert.equal(oefenAntwoordGoed('8,90', 106.8 / 12, vraag), true);
  assert.equal(oefenAntwoordGoed('9', 106.8 / 12, vraag), false);
  assert.equal(oefenAntwoordGoed('90,4', 90.4), true);
});
