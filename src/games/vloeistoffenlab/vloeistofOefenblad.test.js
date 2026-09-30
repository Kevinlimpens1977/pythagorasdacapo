import test from 'node:test';
import assert from 'node:assert/strict';
import { AANTAL_OEFENVRAGEN, maakOefenblad, oefenAntwoordGoed, toonAntwoord } from './vloeistofOefenblad.js';

test('oefenblad lab: acht sommen, het getoonde antwoord is altijd goed', () => {
  for (let i = 0; i < 300; i += 1) {
    const blad = maakOefenblad();
    assert.equal(blad.length, AANTAL_OEFENVRAGEN);
    for (const vraag of blad) {
      assert.ok(Number.isFinite(vraag.antwoord) && vraag.antwoord > 0, vraag.vraag);
      assert.ok(!/NaN|undefined/.test(vraag.vraag + vraag.uitwerking), vraag.vraag);
      assert.equal(oefenAntwoordGoed(toonAntwoord(vraag), vraag.antwoord, vraag), true, `${vraag.vraag} -> ${toonAntwoord(vraag)}`);
    }
  }
});
