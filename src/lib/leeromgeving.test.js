import test from 'node:test';
import assert from 'node:assert/strict';

import {
  aantalTekst,
  bewaarTestsessieDoel,
  neemTestsessieDoel,
  hoofdstukOnderregel,
  splitsParagraafLabel,
  testsessieDoelRoute,
  zonderHoofdstukVoorvoegsel
} from './leeromgeving.js';

test('aantallen staan voluit, enkelvoud bij precies één', () => {
  assert.equal(aantalTekst(1, 'paragraaf', 'paragrafen'), '1 paragraaf');
  assert.equal(aantalTekst(3, 'paragraaf', 'paragrafen'), '3 paragrafen');
  assert.equal(aantalTekst(0, 'lesblok', 'lesblokken'), '0 lesblokken');
});

test('het voorvoegsel H2: gaat van de hoofdstuktitel af', () => {
  assert.equal(zonderHoofdstukVoorvoegsel('H2: Wat zit er in je device?'), 'Wat zit er in je device?');
  assert.equal(zonderHoofdstukVoorvoegsel('h1 Stoffen'), 'Stoffen');
  assert.equal(zonderHoofdstukVoorvoegsel('Massa, volume en dichtheid'), 'Massa, volume en dichtheid');
  assert.equal(zonderHoofdstukVoorvoegsel(undefined), '');
});

test('een paragraaflabel splitst in code en naam, ook als de code dubbel staat', () => {
  assert.deepEqual(splitsParagraafLabel('2.3 Dichtheid'), { code: '2.3', naam: 'Dichtheid' });
  assert.deepEqual(splitsParagraafLabel('3.1 3.1 Van jouw scherm'), { code: '3.1', naam: 'Van jouw scherm' });
  assert.deepEqual(splitsParagraafLabel('Nulmeting'), { code: '', naam: 'Nulmeting' });
});

test('de onderregel van een hoofdstuk noemt paragrafen en lesblokken', () => {
  assert.equal(hoofdstukOnderregel({ paragrafen: 3, lesblokken: 41 }), '3 paragrafen · 41 lesblokken');
  assert.equal(hoofdstukOnderregel({ paragrafen: 1, lesblokken: 1 }), '1 paragraaf · 1 lesblok');
});

test('een testsessie gaat naar de startpagina, een hoofdstuk of een paragraaf', () => {
  assert.equal(testsessieDoelRoute(null), '/');
  assert.equal(testsessieDoelRoute({ soort: 'start' }), '/');
  assert.equal(testsessieDoelRoute({ soort: 'hoofdstuk', id: 'hoofdstuk-dv-klas1-h2' }), '/hoofdstuk/hoofdstuk-dv-klas1-h2');
  assert.equal(testsessieDoelRoute({ soort: 'paragraaf', id: 'paragraaf-dv-klas1-incl-21' }), '/chapter/paragraaf-dv-klas1-incl-21');
  assert.equal(testsessieDoelRoute({ soort: 'hoofdstuk' }), '/');
});

test('de plek van een testsessie wordt onthouden tot precies die testleerling binnen is', () => {
  const opslag = new Map();
  const fake = { getItem: (k) => (opslag.has(k) ? opslag.get(k) : null), setItem: (k, v) => opslag.set(k, String(v)), removeItem: (k) => opslag.delete(k) };
  bewaarTestsessieDoel(fake, 'testleerling-h1i1', '/hoofdstuk/hoofdstuk-dv-klas1-h2');
  assert.equal(neemTestsessieDoel(fake, 'admin-uid'), null, 'de beheerder neemt hem niet mee');
  assert.equal(neemTestsessieDoel(fake, 'testleerling-h1i1'), '/hoofdstuk/hoofdstuk-dv-klas1-h2');
  assert.equal(neemTestsessieDoel(fake, 'testleerling-h1i1'), null, 'maar één keer');
  bewaarTestsessieDoel(fake, 'testleerling-h1i1', '/');
  assert.equal(neemTestsessieDoel(fake, 'testleerling-h1i1'), null, 'de startpagina hoeft niet bewaard');
  fake.setItem('helix-testsessie-doel', '{kapot');
  assert.equal(neemTestsessieDoel(fake, 'testleerling-h1i1'), null);
  assert.equal(neemTestsessieDoel(null, 'x'), null, 'zonder opslag geen fout');
});
