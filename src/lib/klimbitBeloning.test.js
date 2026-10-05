import test from 'node:test';
import assert from 'node:assert/strict';
import {
  erkendeKlimbitHoogte,
  isGeldigeKlimbitHoogte,
  klimbitTokens,
  klimbitWaarde,
  KLIMBIT_DREMPEL_METER,
  KLIMBIT_HOOGTE_MARGE_METER,
  KLIMBIT_MAX_HOOGTE,
  KLIMBIT_MAX_KLIMSNELHEID_MPS,
  KLIMBIT_MAX_TOKENS,
  KLIMBIT_STAFFEL
} from './klimbitBeloning.js';
import * as beloning from './klimbitBeloning.js';

const leerling = (hoogte, alUitbetaald = 0) => klimbitTokens({ hoogte, alUitbetaald, rol: 'student' });

test('de staffel en het maximum zijn vastgelegd zoals Kevin besloot (5 okt 2026)', () => {
  assert.deepEqual(KLIMBIT_STAFFEL, [[400, 0], [1000, 200], [2000, 250], [3000, 350]]);
  assert.equal(KLIMBIT_MAX_TOKENS, 350);
  assert.equal(KLIMBIT_DREMPEL_METER, 400);
  assert.equal(KLIMBIT_MAX_HOOGTE, 5000, 'de bovengrens van de erkende hoogte blijft');
  assert.equal('KLIMBIT_BASIS_PER_KEER' in beloning, false, 'de oude regel per keer is weg');
});

test('waardetabel: 400, 700, 1000, 1500, 2000, 2500, 3000 en 4800 m', () => {
  const tabel = [[400, 0], [700, 100], [1000, 200], [1500, 225], [2000, 250], [2500, 300], [3000, 350], [4800, 350]];
  for (const [hoogte, waarde] of tabel) {
    assert.equal(klimbitWaarde(hoogte), waarde, `${hoogte} m`);
  }
});

test('waarde: tot en met 400 m niets, ook bij rommel', () => {
  assert.equal(klimbitWaarde(0), 0);
  assert.equal(klimbitWaarde(380), 0);
  assert.equal(klimbitWaarde(-50), 0);
  assert.equal(klimbitWaarde(Number.NaN), 0);
  assert.equal(klimbitWaarde(undefined), 0);
  assert.equal(klimbitWaarde(), 0);
});

test('waarde: naar beneden afgerond op hele tokens en op hele meters', () => {
  assert.equal(klimbitWaarde(401), 0, '200/600 van een token is nog geen token');
  assert.equal(klimbitWaarde(403), 1);
  assert.equal(klimbitWaarde(437), 12, '37 x 200/600 = 12,33');
  assert.equal(klimbitWaarde(1001), 200, '1 x 50/1000 = 0,05');
  assert.equal(klimbitWaarde(1020), 201);
  assert.equal(klimbitWaarde(2999), 349);
  assert.equal(klimbitWaarde(999.9), klimbitWaarde(999), 'eerst hele meters');
  // Bewust dicht: Infinity komt nooit door isGeldigeKlimbitHoogte en nooit uit
  // erkendeKlimbitHoogte (die kapt af op KLIMBIT_MAX_HOOGTE). Komt hij hier toch
  // aan, dan levert hij 0 op en niet het maximum.
  assert.equal(klimbitWaarde(Infinity), 0, 'geen eindig getal, geen waarde');
});

test('waarde: vanaf 3000 m nooit meer dan het maximum', () => {
  assert.equal(klimbitWaarde(3000), KLIMBIT_MAX_TOKENS);
  assert.equal(klimbitWaarde(KLIMBIT_MAX_HOOGTE), KLIMBIT_MAX_TOKENS);
  assert.equal(klimbitWaarde(1e9), KLIMBIT_MAX_TOKENS);
});

test('waarde loopt nooit terug als je hoger klimt', () => {
  let vorige = 0;
  for (let hoogte = 0; hoogte <= KLIMBIT_MAX_HOOGTE; hoogte += 1) {
    const waarde = klimbitWaarde(hoogte);
    assert.ok(waarde >= vorige, `${hoogte} m`);
    assert.ok(waarde <= KLIMBIT_MAX_TOKENS, `${hoogte} m`);
    vorige = waarde;
  }
});

test('eerste klim boven 400 m: de hele waarde', () => {
  assert.deepEqual(leerling(700), {
    tokens: 100,
    waarde: 100,
    alUitbetaald: 0,
    nieuwUitbetaald: 100,
    uitleg: 'Nieuwe hoogste opbrengst: 700 m is 100 tokens waard. Je krijgt 100.'
  });
});

test('nieuw record: alleen het verschil met wat al is uitbetaald', () => {
  assert.deepEqual(leerling(1500, 200), {
    tokens: 25,
    waarde: 225,
    alUitbetaald: 200,
    nieuwUitbetaald: 225,
    uitleg: 'Nieuwe hoogste opbrengst: 1500 m is 225 tokens waard. Je had al 200, dus je krijgt 25.'
  });
  assert.equal(leerling(2500, 225).tokens, 75);
});

test('een klim die evenveel waard is als al uitbetaald levert 0 op', () => {
  assert.deepEqual(leerling(1000, 200), {
    tokens: 0,
    waarde: 200,
    alUitbetaald: 200,
    nieuwUitbetaald: 200,
    uitleg: 'Deze klim is 200 tokens waard. Dat had je al, dus nu 0. Klim hoger dan je record voor meer.'
  });
});

test('alUitbetaald hoger dan de waarde: 0, nooit negatief, en de teller zakt niet', () => {
  const uit = leerling(1200, 225);
  assert.equal(uit.waarde, 210);
  assert.equal(uit.tokens, 0);
  assert.equal(uit.alUitbetaald, 225);
  assert.equal(uit.nieuwUitbetaald, 225);
  assert.equal(uit.uitleg, 'Deze klim is 210 tokens waard. Je had al 225, dus nu 0. Klim hoger dan je record voor meer.');
  assert.equal(leerling(380, 200).nieuwUitbetaald, 200);
});

test('onder of op 400 m zegt de uitleg waar de tokens beginnen', () => {
  const uit = leerling(380);
  assert.equal(uit.tokens, 0);
  assert.equal(uit.waarde, 0);
  assert.equal(uit.nieuwUitbetaald, 0);
  assert.equal(uit.uitleg, 'Boven 400 m verdien je tokens. Je kwam tot 380 m.');
  assert.equal(leerling(400).uitleg, 'Boven 400 m verdien je tokens. Je kwam tot 400 m.');
  assert.equal(leerling(0).tokens, 0);
});

test('net boven 400 m maar nog geen hele token: 0 met een eerlijke uitleg', () => {
  const uit = leerling(401);
  assert.equal(uit.tokens, 0);
  assert.equal(uit.waarde, 0);
  assert.equal(uit.uitleg, 'Je kwam tot 401 m. Dat is nog geen hele token waard, klim iets hoger.');
});

test('in totaal nooit meer dan 350 per leerling', () => {
  const eerste = leerling(3000, 0);
  assert.equal(eerste.tokens, 350);
  assert.equal(eerste.nieuwUitbetaald, KLIMBIT_MAX_TOKENS);
  assert.equal(eerste.uitleg, 'Nieuwe hoogste opbrengst: 3000 m is 350 tokens waard. Je krijgt 350. Dat is het maximum met KlimBit.');

  const laatste = leerling(4800, 300);
  assert.equal(laatste.tokens, 50);
  assert.equal(laatste.nieuwUitbetaald, 350);
  assert.equal(laatste.uitleg, 'Nieuwe hoogste opbrengst: 4800 m is 350 tokens waard. Je had al 300, dus je krijgt 50. Dat is het maximum met KlimBit.');

  // Een reeks klimmen tot boven het maximum: de som blijft 350.
  let uitbetaald = 0;
  let som = 0;
  for (const hoogte of [700, 300, 1000, 1500, 1200, 2500, 4800, 5000, 3000]) {
    const uit = leerling(hoogte, uitbetaald);
    assert.ok(uit.tokens >= 0);
    assert.equal(uit.nieuwUitbetaald, uitbetaald + uit.tokens);
    som += uit.tokens;
    uitbetaald = uit.nieuwUitbetaald;
  }
  assert.equal(som, KLIMBIT_MAX_TOKENS);
  assert.equal(uitbetaald, KLIMBIT_MAX_TOKENS);
});

test('het maximum al verdiend: 0, en het record telt wel', () => {
  const uit = leerling(5000, 350);
  assert.equal(uit.tokens, 0);
  assert.equal(uit.waarde, 350);
  assert.equal(uit.nieuwUitbetaald, 350);
  assert.equal(uit.uitleg, 'Je hebt het maximum van 350 tokens met KlimBit al verdiend. Je record telt wel.');
  assert.equal(leerling(380, 350).uitleg, 'Je hebt het maximum van 350 tokens met KlimBit al verdiend. Je record telt wel.');
  assert.equal(leerling(5000, 9999).tokens, 0, 'een te hoge teller levert nooit iets op');
});

test('een rommelige alUitbetaald telt als 0; een gebroken getal gaat naar boven, zodat er nooit te veel uitgaat', () => {
  assert.equal(leerling(700, -40).tokens, 100);
  assert.equal(leerling(700, Number.NaN).tokens, 100);
  assert.equal(leerling(700, undefined).tokens, 100);
  assert.equal(leerling(700, 99.2).alUitbetaald, 100);
  assert.equal(leerling(700, 99.2).tokens, 0);
  assert.equal(leerling(1000, 99.2).tokens, 100);
});

test('niet-leerlingen verdienen nooit tokens en de teller loopt niet op', () => {
  const beheer = klimbitTokens({ hoogte: 900, alUitbetaald: 0, rol: 'admin' });
  assert.equal(beheer.tokens, 0);
  assert.equal(beheer.alUitbetaald, 0);
  assert.equal(beheer.nieuwUitbetaald, 0);
  assert.equal(beheer.uitleg, 'Beheerders verdienen geen tokens.');
  assert.equal(klimbitTokens({ hoogte: 900, rol: 'supervisor' }).uitleg, 'Beheerders verdienen geen tokens.');
  const docent = klimbitTokens({ hoogte: 3000, alUitbetaald: 100, rol: 'docent' });
  assert.equal(docent.tokens, 0);
  assert.equal(docent.nieuwUitbetaald, 100);
  assert.equal(docent.uitleg, 'Alleen leerlingen verdienen tokens met KlimBit.');
  assert.equal(klimbitTokens({ hoogte: 900 }).tokens, 0);
  assert.equal(klimbitTokens().tokens, 0);
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
