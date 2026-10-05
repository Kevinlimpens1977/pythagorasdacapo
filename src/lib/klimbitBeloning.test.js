import test from 'node:test';
import assert from 'node:assert/strict';
import {
  erkendeKlimbitHoogte,
  isGeldigeKlimbitHoogte,
  klimbitTokens,
  KLIMBIT_HOOGTE_MARGE_METER,
  KLIMBIT_MAX_HOOGTE,
  KLIMBIT_MAX_KLIMSNELHEID_MPS
} from './klimbitBeloning.js';

const leerling = (hoogte, keerBoven400Eerder = 0) => klimbitTokens({ hoogte, keerBoven400Eerder, rol: 'student' });

test('precies 400 m levert niets op en telt niet als keer boven 400', () => {
  const uit = leerling(400);
  assert.equal(uit.tokens, 0);
  assert.equal(uit.teltMee, false);
  assert.equal(uit.runNummer, null);
  assert.match(uit.uitleg, /nog 1 m hoger/);
});

test('onder 400 m zegt de uitleg hoeveel er nog nodig is', () => {
  assert.match(leerling(380).uitleg, /tot 380 m, je moet nog 21 m hoger/);
  assert.equal(leerling(0).tokens, 0);
});

test('401 m de eerste keer: 300 + 1 = 301', () => {
  const uit = leerling(401, 0);
  assert.equal(uit.tokens, 301);
  assert.equal(uit.runNummer, 1);
  assert.equal(uit.teltMee, true);
  assert.equal(uit.uitleg, 'Eerste keer boven 400 m: 300 + 1 = 301 tokens.');
});

test('tweede keer 450 m: 200 + 50 = 250', () => {
  const uit = leerling(450, 1);
  assert.equal(uit.tokens, 250);
  assert.equal(uit.runNummer, 2);
  assert.equal(uit.uitleg, 'Tweede keer boven 400 m: 200 + 50 = 250 tokens.');
});

test('derde keer 500 m: 100 + 100 = 200', () => {
  const uit = leerling(500, 2);
  assert.equal(uit.tokens, 200);
  assert.equal(uit.runNummer, 3);
});

test('vanaf de vierde keer niets meer, ook geen meters, maar de teller loopt door', () => {
  const vierde = leerling(900, 3);
  assert.equal(vierde.tokens, 0);
  assert.equal(vierde.runNummer, 4);
  assert.equal(vierde.teltMee, true);
  assert.equal(leerling(5000, 10).tokens, 0);
});

test('niet-leerlingen verdienen nooit tokens en tellen niet mee', () => {
  const beheer = klimbitTokens({ hoogte: 900, keerBoven400Eerder: 0, rol: 'admin' });
  assert.equal(beheer.tokens, 0);
  assert.equal(beheer.teltMee, false);
  assert.equal(beheer.uitleg, 'Beheerders verdienen geen tokens.');
  assert.equal(klimbitTokens({ hoogte: 900, rol: 'docent' }).tokens, 0);
  assert.equal(klimbitTokens({ hoogte: 900 }).tokens, 0);
});

test('meters worden naar beneden afgerond', () => {
  assert.equal(leerling(450.9, 1).tokens, 250);
  assert.equal(leerling(400.99, 0).tokens, 0, '400,99 m is in hele meters 400 en dus niet boven de drempel');
});

test('erkende hoogte wordt afgekapt op duur x maximale klimsnelheid plus marge', () => {
  // 10 seconden: hooguit 10 x snelheid + marge.
  const grens = 10 * KLIMBIT_MAX_KLIMSNELHEID_MPS + KLIMBIT_HOOGTE_MARGE_METER;
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: 5000, duurMs: 10_000 }), grens);
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: 30.7, duurMs: 10_000 }), 30, 'eerlijke hoogte blijft staan, naar beneden afgerond');
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: 450, duurMs: 100_000, maxSnelheid: 2, marge: 0 }), 200);
});

test('erkende hoogte komt nooit boven het maximum en nooit onder nul', () => {
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: 1e9, duurMs: 1e9 }), KLIMBIT_MAX_HOOGTE);
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: -5, duurMs: 60_000 }), 0);
  assert.equal(erkendeKlimbitHoogte({ piekHoogte: 100, duurMs: -1 }), Math.min(100, KLIMBIT_HOOGTE_MARGE_METER));
});

test('alleen eindige getallen van nul of meer zijn een geldige hoogte', () => {
  assert.equal(isGeldigeKlimbitHoogte(0), true);
  assert.equal(isGeldigeKlimbitHoogte(437.5), true);
  assert.equal(isGeldigeKlimbitHoogte(-1), false);
  assert.equal(isGeldigeKlimbitHoogte(Number.NaN), false);
  assert.equal(isGeldigeKlimbitHoogte(Infinity), false);
  assert.equal(isGeldigeKlimbitHoogte('500'), false);
});
