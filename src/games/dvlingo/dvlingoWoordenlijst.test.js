import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DVLINGO_MIN_EIGEN_WOORDEN,
  bouwSpelLijst,
  isBruikbareEigenLijst,
  keurWoord,
  leesWoordenTekst,
  normaliseerWoord,
  schrijfWoordenTekst
} from './dvlingoWoordenlijst.js';

test('normaliseerWoord maakt hoofdletters en haalt streepjes en accenten weg', () => {
  assert.equal(normaliseerWoord('back-up'), 'BACKUP');
  assert.equal(normaliseerWoord(' wacht woord '), 'WACHTWOORD');
  assert.equal(normaliseerWoord('café'), 'CAFE');
  assert.equal(normaliseerWoord(null), '');
});

test('keurWoord volgt dezelfde grenzen als het spel', () => {
  assert.equal(keurWoord('PHISHING').geldig, true);
  assert.equal(keurWoord('').reden, 'leeg');
  assert.equal(keurWoord('wifi2').reden, 'tekens');
  assert.equal(keurWoord('ab').reden, 'kort');
  assert.equal(keurWoord('wachtwoordenlijst').reden, 'lang');
});

test('leesWoordenTekst splitst woord en uitleg op de puntkomma', () => {
  const uit = leesWoordenTekst('FIREWALL; Muur tegen ongewenst verkeer\nPHISHING;Nepbericht');

  assert.equal(uit.woorden.length, 2);
  assert.deepEqual(uit.woorden[0], { woord: 'FIREWALL', uitleg: 'Muur tegen ongewenst verkeer' });
  assert.deepEqual(uit.woorden[1], { woord: 'PHISHING', uitleg: 'Nepbericht' });
});

test('leesWoordenTekst meldt dubbelen en afgekeurde regels apart', () => {
  const uit = leesWoordenTekst('BROWSER\nbrowser\nwifi2\n\nzo');

  assert.deepEqual(uit.woorden.map((w) => w.woord), ['BROWSER']);
  assert.deepEqual(uit.dubbel, ['BROWSER']);
  assert.equal(uit.afgekeurd.length, 2);
  assert.equal(uit.afgekeurd[0].reden, 'tekens');
  assert.equal(uit.afgekeurd[1].reden, 'kort');
});

test('lege regels leveren geen afkeuring op', () => {
  const uit = leesWoordenTekst('\n\n   \nBROWSER\n');
  assert.equal(uit.woorden.length, 1);
  assert.equal(uit.afgekeurd.length, 0);
});

test('schrijfWoordenTekst is de omgekeerde bewerking', () => {
  const tekst = 'FIREWALL; Muur tegen ongewenst verkeer\nPHISHING';
  const heen = leesWoordenTekst(tekst);
  assert.equal(schrijfWoordenTekst(heen.woorden), tekst);
});

test('bouwSpelLijst levert precies de vorm die het spel verwacht', () => {
  const lijst = bouwSpelLijst({
    gebruikEigenLijst: true,
    schud: 'ja',
    woorden: [{ woord: 'back-up', uitleg: ' kopie ' }, { woord: 'x' }]
  });

  assert.deepEqual(lijst, {
    gebruikEigenLijst: true,
    schud: false,
    woorden: [{ woord: 'BACKUP', uitleg: 'kopie' }]
  });
});

test('de terugvalroute valt nooit om op null of rommel', () => {
  // Dit is het pad als de instellingen niet gelezen kunnen worden. Loopt dit
  // stuk, dan krijgt het spel geen woordenlijst klaargezet.
  assert.deepEqual(bouwSpelLijst(null), { gebruikEigenLijst: false, schud: false, woorden: [] });
  assert.deepEqual(bouwSpelLijst(undefined), { gebruikEigenLijst: false, schud: false, woorden: [] });
  assert.deepEqual(bouwSpelLijst('rommel').woorden, []);
  assert.deepEqual(bouwSpelLijst({ woorden: 'geen array' }).woorden, []);
  assert.equal(isBruikbareEigenLijst(null), false);
  assert.equal(isBruikbareEigenLijst(undefined), false);
});

test('een te korte eigen lijst wordt niet gebruikt', () => {
  const woorden = Array.from({ length: DVLINGO_MIN_EIGEN_WOORDEN - 1 }, (_, i) => ({
    woord: `WOORD${'A'.repeat(i % 3)}`.slice(0, 8) + String.fromCharCode(65 + i)
  }));

  assert.equal(isBruikbareEigenLijst({ gebruikEigenLijst: true, woorden }), false);
});

test('een volledige eigen lijst wordt wel gebruikt, maar alleen als hij aanstaat', () => {
  const woorden = Array.from({ length: DVLINGO_MIN_EIGEN_WOORDEN }, (_, i) => ({
    woord: `WOORD${String.fromCharCode(65 + i)}`
  }));

  assert.equal(isBruikbareEigenLijst({ gebruikEigenLijst: true, woorden }), true);
  assert.equal(isBruikbareEigenLijst({ gebruikEigenLijst: false, woorden }), false);
});
