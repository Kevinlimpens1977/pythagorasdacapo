import test from 'node:test';
import assert from 'node:assert/strict';
import { beoordeelSnel, juistTekst, maakSnelOpgave } from './dichtheidSnelronde.js';

test('snelronde: elke opgave is met het getoonde antwoord goed', () => {
  let vorige = null;
  for (let i = 0; i < 500; i += 1) {
    const opgave = maakSnelOpgave(Math.random, vorige);
    assert.equal(opgave.gegeven.length, 2);
    assert.equal(beoordeelSnel(opgave, juistTekst(opgave).split(' ')[0]), true, JSON.stringify(opgave));
    vorige = opgave;
  }
});
