import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCURACY_BONUS_HOOG,
  buildIntroStappen,
  buildIntroVoorleesTekst,
  introStapDuurMs,
  ACCURACY_BONUS_MIDDEN,
  berekenAccuracy,
  berekenAccuracyBonus,
  berekenGecorrigeerdWpm,
  berekenSessieMaxScore,
  berekenTopritTijdBonus,
  berekenWpm,
  bepaalRouteStatussen,
  bepaalVerbeterTip,
  bepaalZwaksteToetsen,
  buildDetails,
  buildEindresultaat,
  buildSessie,
  buildToegestaneTekens,
  buildTopritSessie,
  isRouteGehaald,
  isTopritOntgrendeld,
  isTypbaarTeken,
  maakOefenDrill,
  maakSessieStats,
  PUNTEN_EERSTE_KEER,
  PUNTEN_NA_FOUT,
  regelAccuracy,
  schud,
  STREAK_BONUS,
  STREAK_STAP,
  valideerRegel,
  valideerRoutes,
  valideerToprit,
  verwerkCorrectTeken,
  verwerkFout
} from './dataKoerierLogic.js';
import {
  basisToetsVoor,
  shiftHandVoor,
  TOETS_VINGER,
  TOETSENBORD_RIJEN,
  vingerInstructie,
  vingerVoor
} from './dataKoerierToetsenbord.js';

const vasteRng = () => 0.42;

const testRoute = {
  id: 'route-test',
  nummer: 1,
  titel: 'Test',
  hoofdletters: false,
  nieuweToetsen: ['f', 'j'],
  blokken: [
    { titel: 'A', type: 'reeks', kies: 2, pool: ['ff jj', 'fj jf', 'jj ff', 'fj fj', 'jf jf', 'ff ff'] },
    { titel: 'B', type: 'reeks', kies: 1, pool: ['fjf jfj', 'jfj fjf', 'ffj jjf', 'jjf ffj', 'fjj jff', 'jff fjj'] }
  ]
};

test('toetsenbordkaart dekt alle rijen met een vinger', () => {
  TOETSENBORD_RIJEN.flat().forEach((toets) => {
    assert.ok(TOETS_VINGER[toets], `geen vinger voor '${toets}'`);
  });
  assert.equal(TOETS_VINGER[' '], 'duim');
});

test('basisToetsVoor en shift-tekens', () => {
  assert.equal(basisToetsVoor('A'), 'a');
  assert.equal(basisToetsVoor('?'), '/');
  assert.equal(basisToetsVoor('@'), '2');
  assert.equal(basisToetsVoor('!'), '1');
});

test('shiftHandVoor gebruikt de andere hand', () => {
  assert.equal(shiftHandVoor('A'), 'rechts');
  assert.equal(shiftHandVoor('J'), 'links');
  assert.equal(shiftHandVoor('?'), 'links');
  assert.equal(shiftHandVoor('!'), 'rechts');
  assert.equal(shiftHandVoor('a'), null);
  assert.equal(shiftHandVoor(' '), null);
});

test('vingerInstructie noemt vinger en shift', () => {
  assert.equal(vingerVoor('f'), 'links-wijs');
  assert.match(vingerInstructie('f'), /linkerwijsvinger/);
  assert.match(vingerInstructie('J'), /rechterwijsvinger.*linkerpink/);
  assert.match(vingerInstructie(' '), /duim/);
});

test('isTypbaarTeken filtert modifier-keys', () => {
  assert.equal(isTypbaarTeken('a'), true);
  assert.equal(isTypbaarTeken(' '), true);
  assert.equal(isTypbaarTeken('Shift'), false);
  assert.equal(isTypbaarTeken('Enter'), false);
});

test('schud behoudt inhoud en muteert de bron niet', () => {
  const bron = ['a', 'b', 'c', 'd'];
  const resultaat = schud(bron, vasteRng);
  assert.deepEqual([...bron].sort(), [...resultaat].sort());
  assert.deepEqual(bron, ['a', 'b', 'c', 'd']);
});

test('buildSessie kiest per blok het juiste aantal regels uit de pool', () => {
  const sessie = buildSessie(testRoute, vasteRng);
  assert.equal(sessie.regels.length, 3);
  sessie.regels.forEach((regel) => {
    const blok = testRoute.blokken.find((b) => b.titel === regel.blokTitel);
    assert.ok(blok.pool.includes(regel.tekst));
  });
  const verwachtTekens = sessie.regels.reduce((som, regel) => som + regel.tekst.length, 0);
  assert.equal(sessie.totaalTekens, verwachtTekens);
  assert.equal(sessie.maxScore, berekenSessieMaxScore(verwachtTekens));
});

test('maxScore bevat streakbonussen en accuracybonus', () => {
  assert.equal(
    berekenSessieMaxScore(100),
    100 * PUNTEN_EERSTE_KEER + 4 * STREAK_BONUS + ACCURACY_BONUS_HOOG.punten
  );
  assert.equal(berekenSessieMaxScore(24), 24 * PUNTEN_EERSTE_KEER + ACCURACY_BONUS_HOOG.punten);
});

test('perfecte sessie haalt exact maxScore', () => {
  const totaalTekens = 60;
  let stats = maakSessieStats();
  for (let i = 0; i < totaalTekens; i += 1) {
    ({ stats } = verwerkCorrectTeken(stats, { teken: 'f', tijdMs: 200 }));
  }
  const sessie = { maxScore: berekenSessieMaxScore(totaalTekens) };
  const eind = buildEindresultaat({ sessie, stats, verstrekenMs: 60000 });
  assert.equal(eind.accuracy, 100);
  assert.equal(eind.score, sessie.maxScore);
  assert.equal(eind.gehaald, true);
});

test('correct na fout levert minder punten en breekt de streak', () => {
  let stats = maakSessieStats();
  ({ stats } = verwerkCorrectTeken(stats, { teken: 'f' }));
  stats = verwerkFout(stats, { verwacht: 'j' });
  const { stats: naFout, punten } = verwerkCorrectTeken(stats, { teken: 'j', hadFout: true });
  assert.equal(punten, PUNTEN_NA_FOUT);
  assert.equal(naFout.streak, 0);
  assert.equal(naFout.eersteKeerGoed, 1);
  assert.equal(naFout.naFoutGoed, 1);
  assert.equal(naFout.fouten, 1);
});

test('streakbonus valt exact op de streak-stap', () => {
  let stats = maakSessieStats();
  let bonusGezien = false;
  for (let i = 0; i < STREAK_STAP; i += 1) {
    const resultaat = verwerkCorrectTeken(stats, { teken: 'f' });
    stats = resultaat.stats;
    if (resultaat.streakBonusGehaald) bonusGezien = true;
  }
  assert.equal(bonusGezien, true);
  assert.equal(stats.score, STREAK_STAP * PUNTEN_EERSTE_KEER + STREAK_BONUS);
  assert.equal(stats.streakBonussen, 1);
});

test('accuracy en wpm-berekeningen', () => {
  assert.equal(berekenAccuracy({ eersteKeerGoed: 90, naFoutGoed: 5, fouten: 5 }), 95);
  assert.equal(berekenAccuracy(maakSessieStats()), 0);
  assert.equal(berekenWpm({ correctTekens: 200, ms: 60000 }), 40);
  assert.equal(berekenGecorrigeerdWpm({ correctTekens: 200, fouten: 25, ms: 60000 }), 35);
  assert.equal(berekenGecorrigeerdWpm({ correctTekens: 10, fouten: 50, ms: 60000 }), 0);
  assert.equal(berekenWpm({ correctTekens: 10, ms: 0 }), 0);
});

test('accuracybonus-drempels', () => {
  assert.equal(berekenAccuracyBonus(100), ACCURACY_BONUS_HOOG.punten);
  assert.equal(berekenAccuracyBonus(ACCURACY_BONUS_HOOG.drempel), ACCURACY_BONUS_HOOG.punten);
  assert.equal(berekenAccuracyBonus(ACCURACY_BONUS_MIDDEN.drempel), ACCURACY_BONUS_MIDDEN.punten);
  assert.equal(berekenAccuracyBonus(80), 0);
  assert.equal(isRouteGehaald(90), true);
  assert.equal(isRouteGehaald(89), false);
});

test('toprit-tijdbonus vereist accuracy en beloont snelheid in tredes', () => {
  assert.equal(berekenTopritTijdBonus({ seconden: 80, accuracy: 95 }), 150);
  assert.equal(berekenTopritTijdBonus({ seconden: 120, accuracy: 95 }), 100);
  assert.equal(berekenTopritTijdBonus({ seconden: 160, accuracy: 95 }), 50);
  assert.equal(berekenTopritTijdBonus({ seconden: 300, accuracy: 95 }), 0);
  assert.equal(berekenTopritTijdBonus({ seconden: 80, accuracy: 85 }), 0);
});

test('buildTopritSessie maakt van elk woord een pakketje', () => {
  const toprit = { id: 'toprit', kiesWoorden: 3, woordenPool: ['wifi', 'cloud', 'app', 'spam', 'mail', 'chat'] };
  const sessie = buildTopritSessie(toprit, vasteRng);
  assert.equal(sessie.regels.length, 3);
  assert.equal(sessie.isToprit, true);
  sessie.regels.forEach((regel) => assert.ok(toprit.woordenPool.includes(regel.tekst)));
});

test('zwakste toetsen vereisen minimaal 2 fouten', () => {
  const perToets = {
    r: { pogingen: 10, fouten: 4, totaalMs: 3000 },
    e: { pogingen: 10, fouten: 2, totaalMs: 5000 },
    f: { pogingen: 10, fouten: 1, totaalMs: 1000 }
  };
  const zwakste = bepaalZwaksteToetsen(perToets);
  assert.deepEqual(zwakste.map((item) => item.toets), ['r', 'e']);
});

test('oefendrill gebruikt alleen toegestane toetsen en is scoreloos', () => {
  const drill = maakOefenDrill(
    [{ toets: 'r', fouten: 3 }, { toets: 'x', fouten: 2 }],
    new Set(['r', 'e', ' '])
  );
  assert.equal(drill.scoreloos, true);
  assert.match(drill.tekst, /^[r ]+$/);
  assert.equal(maakOefenDrill([{ toets: 'x', fouten: 3 }], new Set(['a'])), null);
  assert.equal(maakOefenDrill([], new Set(['a'])), null);
});

test('regelAccuracy en drill-drempel', () => {
  assert.equal(regelAccuracy({ goed: 8, fouten: 2 }), 80);
  assert.equal(regelAccuracy({ goed: 0, fouten: 0 }), 100);
});

test('routes ontgrendelen op volgorde', () => {
  const routes = [
    { id: 'r1', nummer: 1 },
    { id: 'r2', nummer: 2 },
    { id: 'r3', nummer: 3 }
  ];
  const statussen = bepaalRouteStatussen(routes, { r1: { gehaald: true } });
  assert.deepEqual(statussen.map((s) => s.ontgrendeld), [true, true, false]);
  assert.deepEqual(statussen.map((s) => s.gehaald), [true, false, false]);
});

test('toprit ontgrendelt na route 8', () => {
  const routes = Array.from({ length: 13 }, (_, i) => ({ id: `r${i + 1}`, nummer: i + 1 }));
  const bijna = Object.fromEntries(routes.slice(0, 7).map((route) => [route.id, { gehaald: true }]));
  assert.equal(isTopritOntgrendeld(routes, bijna), false);
  const genoeg = Object.fromEntries(routes.slice(0, 8).map((route) => [route.id, { gehaald: true }]));
  assert.equal(isTopritOntgrendeld(routes, genoeg), true);
});

test('validatie: cumulatieve tekens en hoofdletterregel', () => {
  const routes = [
    { id: 'a', nummer: 1, hoofdletters: false, nieuweToetsen: ['f', 'j'], blokken: [] },
    { id: 'b', nummer: 2, hoofdletters: true, nieuweToetsen: ['e'], blokken: [] }
  ];
  const toegestaanA = buildToegestaneTekens(routes, 0);
  assert.equal(toegestaanA.has('f'), true);
  assert.equal(toegestaanA.has('e'), false);
  assert.equal(toegestaanA.has(' '), true);

  assert.deepEqual(valideerRegel('fj fj', toegestaanA, { hoofdletters: false }), []);
  assert.equal(valideerRegel('fe', toegestaanA, { hoofdletters: false }).length, 1);
  assert.equal(valideerRegel('Fj', toegestaanA, { hoofdletters: false }).length, 1);
  assert.deepEqual(valideerRegel('Fj', toegestaanA, { hoofdletters: true }), []);
});

test('valideerRoutes vangt te kleine pools en dubbele regels', () => {
  const routes = [{
    id: 'r1',
    nummer: 1,
    hoofdletters: false,
    nieuweToetsen: ['f', 'j'],
    blokken: [
      { titel: 'A', type: 'reeks', kies: 2, pool: ['ff', 'ff', 'jj'] }
    ]
  }];
  const problemen = valideerRoutes(routes);
  assert.ok(problemen.some((p) => p.includes('pool te klein')));
  assert.ok(problemen.some((p) => p.includes('dubbele regel')));
});

test('valideerToprit controleert woorden tegen de volledige tekenset', () => {
  const routes = [{ id: 'r1', nummer: 1, hoofdletters: false, nieuweToetsen: ['w', 'i', 'f'], blokken: [] }];
  const problemen = valideerToprit({ kiesWoorden: 1, woordenPool: ['wifi', 'xx'] }, routes);
  assert.ok(problemen.some((p) => p.includes("'xx'")));
});

test('eindresultaat klemt score op maxScore en telt bonussen', () => {
  let stats = maakSessieStats();
  for (let i = 0; i < 30; i += 1) {
    ({ stats } = verwerkCorrectTeken(stats, { teken: 'f', tijdMs: 100 }));
  }
  stats = verwerkFout(stats, { verwacht: 'j', tijdMs: 100 });
  ({ stats } = verwerkCorrectTeken(stats, { teken: 'j', hadFout: true, tijdMs: 100 }));
  const sessie = { maxScore: berekenSessieMaxScore(31) };
  const eind = buildEindresultaat({ sessie, stats, verstrekenMs: 45000 });
  assert.equal(eind.accuracy, 97);
  assert.equal(eind.accuracyBonus, ACCURACY_BONUS_HOOG.punten);
  assert.ok(eind.score <= sessie.maxScore);
  assert.equal(eind.fouten, 1);
  assert.equal(eind.correctTekens, 31);
});

test('details blijven compact en zonder ruwe aanslagen', () => {
  const eind = {
    accuracy: 95, wpm: 30, gecorrigeerdWpm: 28, langsteStreak: 40, fouten: 3,
    gehaald: true, zwaksteToetsen: [{ toets: 'r', fouten: 2, pogingen: 9 }]
  };
  const details = buildDetails({ routeId: 'route-1', routeTitel: 'Start', eindresultaat: eind, isRecord: true });
  assert.deepEqual(details.zwaksteToetsen, ['r']);
  assert.equal(details.record, true);
  assert.equal(Object.prototype.hasOwnProperty.call(details, 'perToets'), false);
});

test('introstappen: thuisrij eerst, elke nieuwe toets een stap, tip als laatste', () => {
  const route = { nummer: 2, titel: 'Test', tip: 'Doe rustig aan.', nieuweToetsen: ['a', 's', 'g'] };
  const stappen = buildIntroStappen(route, vingerInstructie);
  assert.equal(stappen[0].soort, 'thuisrij');
  assert.deepEqual(stappen.slice(1, 4).map((s) => s.toets), ['a', 's', 'g']);
  assert.match(stappen[1].tekst, /linkerpink/);
  assert.equal(stappen.at(-1).soort, 'tip');
  assert.equal(stappen.at(-1).tekst, 'Doe rustig aan.');
});

test('introstappen: route 7 krijgt een shift-stap met hoofdletter-doel', () => {
  const route = { nummer: 7, titel: 'Hoofdletters', tip: 'Tip.', nieuweToetsen: [] };
  const stappen = buildIntroStappen(route, vingerInstructie);
  const shiftStap = stappen.find((s) => s.id === 'shift');
  assert.ok(shiftStap);
  assert.equal(shiftStap.toets, 'A');
  assert.match(shiftStap.tekst, /pink van je andere hand/);
});

test('voorleestekst is de aaneenschakeling van de stappen', () => {
  const route = { nummer: 1, titel: 'Start', tip: 'Tip.', nieuweToetsen: ['f'] };
  const stappen = buildIntroStappen(route, vingerInstructie);
  assert.equal(buildIntroVoorleesTekst(route, vingerInstructie), stappen.map((s) => s.tekst).join(' '));
});

test('introstapduur schaalt met tekstlengte binnen grenzen', () => {
  assert.equal(introStapDuurMs({ tekst: 'kort' }), 3200);
  assert.equal(introStapDuurMs({ tekst: 'x'.repeat(500) }), 9000);
  const middel = introStapDuurMs({ tekst: 'x'.repeat(100) });
  assert.ok(middel > 3200 && middel < 9000);
});

test('verbetertip kiest zwakste toets, dan accuracy, dan ritme', () => {
  const metZwakste = bepaalVerbeterTip(
    { zwaksteToetsen: [{ toets: 'r' }], accuracy: 95, wpm: 30, gecorrigeerdWpm: 29 },
    vingerInstructie
  );
  assert.match(metZwakste, /R/);
  const laagAccuracy = bepaalVerbeterTip({ zwaksteToetsen: [], accuracy: 80, wpm: 30, gecorrigeerdWpm: 20 }, vingerInstructie);
  assert.match(laagAccuracy, /langzamer/i);
  const ritme = bepaalVerbeterTip({ zwaksteToetsen: [], accuracy: 95, wpm: 40, gecorrigeerdWpm: 30 }, vingerInstructie);
  assert.match(ritme, /ritme/i);
  const sterk = bepaalVerbeterTip({ zwaksteToetsen: [], accuracy: 98, wpm: 40, gecorrigeerdWpm: 39 }, vingerInstructie);
  assert.match(sterk, /Sterk/);
});
