import test from 'node:test';
import assert from 'node:assert/strict';

import {
  aftelTekst,
  formatAftelling,
  getBevestigLabel,
  getMinimaleTijdSeconden,
  leesOfZetStarttijd,
  resterendeSeconden,
  starttijdSleutel
} from './minimaleLeestijd.js';

const nepOpslag = (begin = {}) => {
  const data = { ...begin };
  return {
    data,
    getItem: (sleutel) => (sleutel in data ? data[sleutel] : null),
    setItem: (sleutel, waarde) => { data[sleutel] = String(waarde); }
  };
};

test('getMinimaleTijdSeconden leest een positief getal en rondt af', () => {
  assert.equal(getMinimaleTijdSeconden({ content: { minimaleTijdSeconden: 90 } }), 90);
  assert.equal(getMinimaleTijdSeconden({ content: { minimaleTijdSeconden: '45.4' } }), 45);
  assert.equal(getMinimaleTijdSeconden({ content: { minimaleTijdSeconden: -3 } }), 0);
  assert.equal(getMinimaleTijdSeconden({ content: { minimaleTijdSeconden: 'veel' } }), 0);
  assert.equal(getMinimaleTijdSeconden({ content: {} }), 0);
  assert.equal(getMinimaleTijdSeconden(null), 0);
});

test('getBevestigLabel gebruikt het eigen label, anders de standaard', () => {
  assert.equal(getBevestigLabel({ content: { bevestigLabel: ' Ik heb mijn werk nagekeken ' } }, 'Ik heb het gelezen'), 'Ik heb mijn werk nagekeken');
  assert.equal(getBevestigLabel({ content: { bevestigLabel: '  ' } }, 'Ik heb het gelezen'), 'Ik heb het gelezen');
  assert.equal(getBevestigLabel(null, 'Ik heb het gelezen'), 'Ik heb het gelezen');
});

test('resterendeSeconden telt af en gaat nooit onder nul', () => {
  const start = 1_000_000;
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 60, startMs: start, nuMs: start }), 60);
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 60, startMs: start, nuMs: start + 18_000 }), 42);
  // Een halve seconde over telt als een hele: de knop gaat niet te vroeg aan.
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 60, startMs: start, nuMs: start + 59_500 }), 1);
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 60, startMs: start, nuMs: start + 60_000 }), 0);
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 60, startMs: start, nuMs: start + 600_000 }), 0);
  assert.equal(resterendeSeconden({ minimaleTijdSeconden: 0, startMs: start, nuMs: start }), 0);
});

test('formatAftelling en aftelTekst', () => {
  assert.equal(formatAftelling(42), '0:42');
  assert.equal(formatAftelling(125), '2:05');
  assert.equal(formatAftelling(0), '0:00');
  assert.equal(aftelTekst(42), 'Nakijken kost tijd. Over 0:42 kun je afvinken.');
});

test('starttijdSleutel is per gebruiker en per blok', () => {
  assert.equal(starttijdSleutel('u1', 'b1'), 'helix.leestijdStart.u1.b1');
  assert.notEqual(starttijdSleutel('u1', 'b1'), starttijdSleutel('u2', 'b1'));
  assert.equal(starttijdSleutel('', 'b1'), 'helix.leestijdStart.anoniem.b1');
});

test('leesOfZetStarttijd zet de eerste keer en houdt daarna de oude starttijd', () => {
  const opslag = nepOpslag();
  assert.equal(leesOfZetStarttijd(opslag, 'k', 5000), 5000);
  assert.equal(opslag.data.k, '5000');
  // Verversen: de klok gaat niet terug naar nul.
  assert.equal(leesOfZetStarttijd(opslag, 'k', 9000), 5000);
});

test('leesOfZetStarttijd negeert een starttijd in de toekomst', () => {
  const opslag = nepOpslag({ k: '99999' });
  assert.equal(leesOfZetStarttijd(opslag, 'k', 5000), 5000);
  assert.equal(opslag.data.k, '5000');
});

test('leesOfZetStarttijd werkt zonder opslag of met een opslag die weigert', () => {
  assert.equal(leesOfZetStarttijd(null, 'k', 7000), 7000);
  const weigert = { getItem: () => { throw new Error('geblokkeerd'); }, setItem: () => { throw new Error('geblokkeerd'); } };
  assert.equal(leesOfZetStarttijd(weigert, 'k', 7000), 7000);
});
