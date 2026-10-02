import test from 'node:test';
import assert from 'node:assert/strict';
import { weegschaalGetal } from './weegschaal.mjs';

test('weegschaalGetal eindigt precies op de waarde uit het draaiboek, met haar decimalen', () => {
  assert.equal(weegschaalGetal(106.8, 1), '106,8');
  assert.equal(weegschaalGetal(0.5, 1), '0,5');
  assert.equal(weegschaalGetal(12.25, 1), '12,25');
  assert.equal(weegschaalGetal(750, 1), '750');
  assert.equal(weegschaalGetal(1250, 1), '1.250');
});

test('weegschaalGetal telt op in hele getallen en komt nooit boven de waarde uit', () => {
  assert.equal(weegschaalGetal(106.8, 0), '0');
  assert.equal(weegschaalGetal(106.8, 0.5), '53');
  assert.equal(weegschaalGetal(106.8, 0.999), '106');
});

test('weegschaalGetal geeft voor de hele getallen van H2 hetzelfde beeld als voorheen', () => {
  // De oude weergave: afronden op een geheel getal, nl-NL, hooguit één decimaal.
  const oud = (waarde, voortgang) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(Math.round(waarde * voortgang));
  for (const waarde of [750, 27, 79]) {
    for (let stap = 0; stap <= 30; stap += 1) {
      const voortgang = 1 - (1 - stap / 30) ** 3;
      assert.equal(weegschaalGetal(waarde, voortgang), oud(waarde, voortgang), `${waarde} bij stap ${stap}`);
    }
  }
});
