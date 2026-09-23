import test from 'node:test';
import assert from 'node:assert/strict';
import {
  afleesRoute,
  aantalStreepjes,
  AFLEESFOUTEN,
  beoordeelAflezing,
  beoordeelOmrekening,
  beoordeelVerschil,
  beoordeelVolume,
  DOMPELFOUTEN,
  formatGetal,
  kiesStreepje,
  leesGetal,
  maakBalken,
  maakDompelReeks,
  maakResultaat,
  maatGoed,
  maxScore,
  MISSIES,
  REKENFOUTEN,
  SCHAALVOLGORDE,
  SCHALEN,
  streepjeVan,
  streepjesKeuzes,
  vaaksteFout,
  volgendeSchaalIndex,
  waardeVanStreepje
} from './volumeLogic.js';

const vast = (waarden) => {
  let i = 0;
  return () => waarden[i++ % waarden.length];
};

test('leesGetal accepteert komma en punt en weigert onzin', () => {
  assert.equal(leesGetal('7,4'), 7.4);
  assert.equal(leesGetal(' 7.4 '), 7.4);
  assert.equal(leesGetal('35'), 35);
  assert.equal(leesGetal('0,37'), 0.37);
  assert.equal(leesGetal(''), null);
  assert.equal(leesGetal('abc'), null);
  assert.equal(leesGetal('7,4ml'), null);
});

test('formatGetal gebruikt een komma', () => {
  assert.equal(formatGetal(7.4, 1), '7,4');
  assert.equal(formatGetal(0.37, 2), '0,37');
  assert.equal(formatGetal(35, 0), '35');
});

test('opgaven liggen nooit op 0 of op de bovenste streep en herhalen niet direct', () => {
  for (const id of SCHAALVOLGORDE) {
    const schaal = SCHALEN[id];
    const totaal = aantalStreepjes(schaal);
    let vorige = null;
    for (let i = 0; i < 200; i += 1) {
      const k = kiesStreepje(schaal, { vorigeK: vorige });
      assert.ok(k >= 1 && k <= totaal - 1, `${id}: ${k}`);
      assert.notEqual(k, vorige);
      vorige = k;
      const waarde = waardeVanStreepje(k, schaal);
      assert.equal(streepjeVan(waarde, schaal), k);
    }
  }
});

test('waardeVanStreepje geeft geen afrondingsruis', () => {
  assert.equal(waardeVanStreepje(37, SCHALEN.ml10), 7.4);
  assert.equal(waardeVanStreepje(35, SCHALEN.ml25), 17.5);
});

test('aflezen: goed, eenheid, bovenkant, streepjeswaarde, label', () => {
  const s = SCHALEN.ml10;
  assert.equal(beoordeelAflezing({ invoer: '7,4', eenheid: 'ml', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.GOED);
  assert.equal(beoordeelAflezing({ invoer: '7.4', eenheid: 'cm³', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.GOED);
  assert.equal(beoordeelAflezing({ invoer: '7,4', eenheid: 'l', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.EENHEID);
  assert.equal(beoordeelAflezing({ invoer: '7,6', eenheid: 'ml', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.BOVENKANT);
  assert.equal(beoordeelAflezing({ invoer: '9', eenheid: 'ml', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.STREEPJESWAARDE);
  assert.equal(beoordeelAflezing({ invoer: '7,2', eenheid: 'ml', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.STREEPJESWAARDE);
  assert.equal(beoordeelAflezing({ invoer: '', eenheid: 'ml', juist: 7.4, schaal: s }).soort, AFLEESFOUTEN.LEEG);
  const g = SCHALEN.ml100;
  assert.equal(beoordeelAflezing({ invoer: '84', eenheid: 'ml', juist: 74, schaal: g }).soort, AFLEESFOUTEN.LABEL);
  assert.equal(beoordeelAflezing({ invoer: '74', eenheid: 'ml', juist: 74, schaal: g }).punten, 10);
  assert.equal(beoordeelAflezing({ invoer: '74', eenheid: 'l', juist: 74, schaal: g }).punten, 5);
});

test('aflezen in liter telt als goed als het omgerekend is', () => {
  const s = SCHALEN.ml1000;
  assert.equal(beoordeelAflezing({ invoer: '0,73', eenheid: 'l', juist: 730, schaal: s }).soort, AFLEESFOUTEN.GOED);
  assert.equal(beoordeelAflezing({ invoer: '730', eenheid: 'ml', juist: 730, schaal: s }).soort, AFLEESFOUTEN.GOED);
});

test('afleesRoute noemt de getallen en de streepjeswaarde', () => {
  const route = afleesRoute(35, SCHALEN.ml50);
  assert.equal(route.length, 4);
  assert.match(route[0], /30 en 40/);
  assert.match(route[2], /= 1 ml/);
  assert.match(route[3], /35 ml/);
  assert.match(afleesRoute(7.4, SCHALEN.ml10)[2], /0,2 ml/);
});

test('streepjesKeuzes bevat altijd de juiste waarde', () => {
  for (const id of SCHAALVOLGORDE) {
    const schaal = SCHALEN[id];
    const keuzes = streepjesKeuzes(schaal);
    assert.equal(keuzes.length, 4);
    assert.ok(keuzes.some((k) => Math.abs(k - schaal.stap) < 1e-9), id);
  }
});

test('ladder: twee goed omhoog, twee fout omlaag, binnen de grenzen', () => {
  assert.equal(volgendeSchaalIndex({ index: 0, reeksGoed: 2, reeksFout: 0 }), 1);
  assert.equal(volgendeSchaalIndex({ index: 3, reeksGoed: 0, reeksFout: 2 }), 2);
  assert.equal(volgendeSchaalIndex({ index: 0, reeksGoed: 0, reeksFout: 2 }), 0);
  assert.equal(volgendeSchaalIndex({ index: 6, reeksGoed: 2, reeksFout: 0 }), 6);
  assert.equal(volgendeSchaalIndex({ index: 2, reeksGoed: 1, reeksFout: 0 }), 2);
});

test('balk: meten met 1 mm speling en volume met eigen maten', () => {
  assert.equal(maatGoed('5', 5), true);
  assert.equal(maatGoed('5,1', 5), true);
  assert.equal(maatGoed('5,2', 5), false);
  assert.equal(beoordeelVolume({ invoer: '30', l: 5, b: 3, h: 2 }), REKENFOUTEN.GOED);
  assert.equal(beoordeelVolume({ invoer: '10', l: 5, b: 3, h: 2 }), REKENFOUTEN.OPGETELD);
  assert.equal(beoordeelVolume({ invoer: '15', l: 5, b: 3, h: 2 }), REKENFOUTEN.BODEM);
  assert.equal(beoordeelVolume({ invoer: '31,5', l: 5.1, b: 3, h: 2 }), REKENFOUTEN.ANDERS);
  assert.equal(beoordeelVolume({ invoer: '30,6', l: 5.1, b: 3, h: 2 }), REKENFOUTEN.GOED);
  assert.equal(beoordeelOmrekening({ invoer: '60', volumeCm3: 60000, doel: 'l' }), true);
  assert.equal(beoordeelOmrekening({ invoer: '30', volumeCm3: 30, doel: 'ml' }), true);
  assert.equal(beoordeelOmrekening({ invoer: '0,03', volumeCm3: 30, doel: 'ml' }), false);
});

test('maakBalken geeft zes blokken met meetbare maten', () => {
  const balken = maakBalken(vast([0.1, 0.9, 0.5, 0.3]));
  assert.equal(balken.length, 6);
  for (const balk of balken.filter((b) => !b.gegeven)) {
    for (const m of [balk.l, balk.b, balk.h]) {
      assert.ok(m >= 1 && m <= 12, `${balk.id}: ${m}`);
      assert.equal(Math.round(m * 10) / 10, m);
    }
  }
  assert.equal(balken[0].l * balken[0].b * balken[0].h, 30);
});

test('onderdompelen: begin en eind op een streepje, en de fouten', () => {
  for (let i = 0; i < 50; i += 1) {
    for (const opgave of maakDompelReeks()) {
      const schaal = SCHALEN[opgave.schaal];
      assert.notEqual(streepjeVan(opgave.begin, schaal), null);
      assert.notEqual(streepjeVan(opgave.eind, schaal), null);
      assert.ok(opgave.eind > opgave.begin);
      assert.ok(opgave.eind < schaal.max);
    }
  }
  assert.equal(beoordeelVerschil({ invoer: '10', begin: 15, eind: 25 }), DOMPELFOUTEN.GOED);
  assert.equal(beoordeelVerschil({ invoer: '-10', begin: 15, eind: 25 }), DOMPELFOUTEN.NEGATIEF);
  assert.equal(beoordeelVerschil({ invoer: '25', begin: 15, eind: 25 }), DOMPELFOUTEN.EINDVOLUME);
  assert.equal(beoordeelVerschil({ invoer: '40', begin: 15, eind: 25 }), DOMPELFOUTEN.OPGETELD);
  assert.equal(beoordeelVerschil({ invoer: '8,5', begin: 12.5, eind: 21 }), DOMPELFOUTEN.GOED);
});

test('resultaat: maxScore > 0, score begrensd, fouten geteld', () => {
  for (const missie of Object.values(MISSIES)) assert.ok(maxScore(missie) > 0);
  const resultaat = maakResultaat({
    missie: MISSIES.MAATCILINDER,
    opgaven: [
      { id: 1, punten: 10 },
      { id: 2, punten: 0, fouten: ['bovenkant'] },
      { id: 3, punten: 5, fouten: ['bovenkant'] }
    ],
    startedAt: 'a',
    completedAt: 'b'
  });
  assert.equal(resultaat.score, 15);
  assert.equal(resultaat.maxScore, 100);
  assert.equal(resultaat.details.fouten.bovenkant, 2);
  assert.deepEqual(vaaksteFout(resultaat.details.fouten), { soort: 'bovenkant', aantal: 2 });
  assert.equal(vaaksteFout({ eenheid: 1 }), null);
});
