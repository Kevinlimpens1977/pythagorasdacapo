import test from 'node:test';
import assert from 'node:assert/strict';

import { controleerWoordenboekCompleet, uiAantal, uiStudieduur, uiTekst } from './uiTaal.js';

test('elke schermtekst bestaat in elke lestaal, met dezelfde plaatshouders', () => {
  assert.deepEqual(controleerWoordenboekCompleet(), []);
});

test('uiTekst valt terug op het Nederlands', () => {
  assert.equal(uiTekst('knop.gaVerder', ''), 'Ga verder');
  assert.equal(uiTekst('knop.gaVerder', 'xx'), 'Ga verder');
  assert.equal(uiTekst('knop.gaVerder', 'el'), 'Συνέχισε');
  assert.equal(uiTekst('knop.gaVerder', 'it'), 'Continua');
});

test('uiTekst vult plaatshouders in en laat onbekende sleutels zien', () => {
  assert.equal(uiTekst('onderdeel.af', 'nl', { done: 3, total: 7 }), '3 van 7 onderdelen af');
  assert.equal(uiTekst('onderdeel.af', 'it', { done: 3, total: 7 }), '3 di 7 parti completate');
  assert.equal(uiTekst('bestaat.niet', 'nl'), 'bestaat.niet');
});

test('uiAantal kiest enkelvoud of meervoud', () => {
  assert.equal(uiAantal('paragraaf.aantal', 1, 'nl'), '1 paragraaf');
  assert.equal(uiAantal('paragraaf.aantal', 4, 'nl'), '4 paragrafen');
  assert.equal(uiAantal('intro.stappen', 7, 'it'), '7 passaggi');
});

test('uiStudieduur rekent net als formatStudyDuration, maar vertaald', () => {
  assert.equal(uiStudieduur(0, 'nl'), '');
  assert.equal(uiStudieduur(25, 'nl'), '25 min');
  assert.equal(uiStudieduur(60, 'nl'), '1 uur');
  assert.equal(uiStudieduur(95, 'nl'), '1 uur 35 min');
  assert.equal(uiStudieduur(95, 'el'), '1 ώρες 35 λεπτά');
});
