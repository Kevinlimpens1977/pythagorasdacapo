import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BADGES, beloningVoorBlok, nieuweBadges, binnenWeekplafond, isoWeekSleutel, MAX_NIVEAU, niveauVoorXp,
  percentageVanResultaat, tokenFactorVoorPercentage, vakSleutel, volgendeWeekreeks, weekIndex,
  weekkistTokens, xpVoorVolgendNiveau
} from './beloning.js';

test('niveaucurve: niveau 2 na 100 XP, daarna oplopend, maximaal 30', () => {
  assert.equal(niveauVoorXp(0).niveau, 1);
  assert.equal(niveauVoorXp(99).niveau, 1);
  assert.equal(niveauVoorXp(100).niveau, 2);
  assert.equal(niveauVoorXp(100 + 115).niveau, 3);
  assert.deepEqual(niveauVoorXp(110), { niveau: 2, xpInNiveau: 10, xpNodig: 115 });
  assert.equal(niveauVoorXp(1e9).niveau, MAX_NIVEAU);
  assert.equal(niveauVoorXp(1e9).xpNodig, 0);
  assert.equal(xpVoorVolgendNiveau(1), 100);
  // Een jaar DV (±38 lessen x 100 XP) komt rond niveau 15.
  const jaarDv = niveauVoorXp(3800).niveau;
  assert.ok(jaarDv >= 14 && jaarDv <= 18, `jaar DV: ${jaarDv}`);
});

test('percentage uit score, uit items, of uit goed/fout', () => {
  assert.equal(percentageVanResultaat({ score: 9, maxScore: 10 }), 90);
  assert.equal(percentageVanResultaat({ itemsCorrect: 3, itemCount: 4 }), 75);
  assert.equal(percentageVanResultaat({ isCorrect: true }), 100);
  assert.equal(percentageVanResultaat({ resultTier: 'failed' }), 0);
  assert.equal(percentageVanResultaat({ score: 20, maxScore: 10 }), 100);
});

test('tokens naar beheersing', () => {
  assert.equal(tokenFactorVoorPercentage(59), 0);
  assert.equal(tokenFactorVoorPercentage(60), 0.4);
  assert.equal(tokenFactorVoorPercentage(75), 0.7);
  assert.equal(tokenFactorVoorPercentage(90), 1);
});

test('beloning per blok: theorie, toets, 100% met eenmalige bonus', () => {
  assert.deepEqual(beloningVoorBlok({ blokType: 'theory', blokTokens: 0, percentage: 100 }),
    { xp: 10, tokens: 0, ster: false, eersteKeerHonderd: false, percentage: 100 });
  assert.equal(beloningVoorBlok({ blokType: 'toets', blokTokens: 30, percentage: 50 }).tokens, 0);
  assert.equal(beloningVoorBlok({ blokType: 'toets', blokTokens: 30, percentage: 50 }).xp, 20);
  assert.equal(beloningVoorBlok({ blokType: 'toets', blokTokens: 30, percentage: 80 }).tokens, 21);
  const honderd = beloningVoorBlok({ blokType: 'quiz', blokTokens: 20, percentage: 100 });
  assert.deepEqual(honderd, { xp: 50, tokens: 25, ster: true, eersteKeerHonderd: true, percentage: 100 });
});

test('beloning bij een betere tweede poging: alleen het verschil', () => {
  const eerste = beloningVoorBlok({ blokType: 'toets', blokTokens: 40, percentage: 70 });
  const tweede = beloningVoorBlok({
    blokType: 'toets', blokTokens: 40, percentage: 95,
    eerder: { bestePercentage: 70, tokens: eerste.tokens, xp: eerste.xp }
  });
  assert.equal(eerste.tokens, 16);
  assert.equal(tweede.tokens, 40 - 16);
  assert.equal(tweede.xp, 30 - 20);
  const slechter = beloningVoorBlok({
    blokType: 'toets', blokTokens: 40, percentage: 50,
    eerder: { bestePercentage: 70, tokens: 16, xp: 20 }
  });
  assert.equal(slechter.tokens, 0);
  assert.equal(slechter.xp, 0);
});

test('vak en week', () => {
  assert.equal(vakSleutel({ vakId: 'vak-binask-eoa' }), 'binask');
  assert.equal(vakSleutel({ vakId: 'vak-digitale-vaardigheden' }), 'dv');
  assert.equal(vakSleutel({ gameId: 'binask-volume-balk' }), 'binask');
  assert.equal(vakSleutel({ gameId: 'turbo-typen' }), 'dv');
  assert.equal(isoWeekSleutel(new Date('2026-09-23T10:00:00Z')), '2026-W39');
  // Zondagavond laat in Nederland hoort nog bij dezelfde week.
  assert.equal(isoWeekSleutel(new Date('2026-09-27T21:30:00Z')), '2026-W39');
  // Maandag 00:30 Nederlandse tijd is zondag 22:30 UTC: al de volgende week.
  assert.equal(isoWeekSleutel(new Date('2026-09-27T22:30:00Z')), '2026-W40');
  assert.equal(isoWeekSleutel(new Date('2027-01-01T12:00:00Z')), '2026-W53');
});

test('weekplafond', () => {
  assert.equal(binnenWeekplafond(50, 0), 50);
  assert.equal(binnenWeekplafond(50, 180), 20);
  assert.equal(binnenWeekplafond(50, 250), 0);
});


test('weekIndex loopt door over de jaargrens', () => {
  assert.equal(weekIndex('2026-W40') - weekIndex('2026-W39'), 1);
  assert.equal(weekIndex('2027-W01') - weekIndex('2026-W53'), 1);
  assert.equal(weekIndex('onzin'), null);
});

test('weekkist: 30-60 tokens, vast per leerling en week, x1,5 bij comeback', () => {
  const a = weekkistTokens({ uid: 'u1', week: '2026-W39' });
  assert.ok(a >= 30 && a <= 60);
  assert.equal(weekkistTokens({ uid: 'u1', week: '2026-W39' }), a);
  assert.equal(weekkistTokens({ uid: 'u1', week: '2026-W39', comeback: true }), Math.round(a * 1.5));
});

test('weekreeks: begint op 1, loopt door, neutrale weken breken niets', () => {
  const r1 = volgendeWeekreeks({ reeks: null, week: '2026-W39', doelWeken: ['2026-W39'] });
  assert.equal(r1.aantal, 1);
  const r2 = volgendeWeekreeks({ reeks: r1, week: '2026-W40', doelWeken: ['2026-W39', '2026-W40'] });
  assert.equal(r2.aantal, 2);
  // Herfstvakantie W43: geen vrijgave, dus neutraal.
  const r3 = volgendeWeekreeks({ reeks: r2, week: '2026-W44', doelWeken: ['2026-W39', '2026-W40', '2026-W44'] });
  assert.equal(r3.aantal, 3);
  assert.deepEqual(r3.mijlpaal, { aantal: 3, tokens: 30 });
  assert.equal(r3.bevroren, false);
});

test('weekreeks: één gemiste week wordt bevroren, twee breken de reeks (met comeback)', () => {
  const basis = { aantal: 4, laatsteWeek: '2026-W40', bevriezingWeek: null };
  const bevroren = volgendeWeekreeks({ reeks: basis, week: '2026-W42', doelWeken: ['2026-W41', '2026-W42'] });
  assert.equal(bevroren.aantal, 5);
  assert.equal(bevroren.bevroren, true);
  assert.equal(bevroren.bevriezingWeek, '2026-W41');
  // Kort daarna nog een gemiste week: geen nieuwe bevriezing binnen 6 weken.
  const opnieuw = volgendeWeekreeks({ reeks: bevroren, week: '2026-W44', doelWeken: ['2026-W43', '2026-W44'] });
  assert.equal(opnieuw.aantal, 1);
  const gebroken = volgendeWeekreeks({ reeks: basis, week: '2026-W43', doelWeken: ['2026-W41', '2026-W42', '2026-W43'] });
  assert.equal(gebroken.aantal, 1);
  assert.equal(gebroken.comeback, true);
  // Twee keer in dezelfde week: niets verandert.
  assert.equal(volgendeWeekreeks({ reeks: basis, week: '2026-W40', doelWeken: [] }).aantal, 4);
});

test('badges: twaalf stuks, alleen nieuwe worden gemeld', () => {
  assert.equal(BADGES.length, 12);
  assert.equal(new Set(BADGES.map((b) => b.id)).size, 12);
  assert.deepEqual(nieuweBadges([], { sterren: 1, niveau: 1 }), ['eerste-ster']);
  assert.deepEqual(nieuweBadges(['eerste-ster'], { sterren: 5, niveau: 5 }), ['vijf-sterren', 'niveau-5']);
  assert.deepEqual(nieuweBadges([], { weekdoelen: 1, reeks: 3, comeback: true, huiswerkBonussen: 5 }),
    ['eerste-weekdoel', 'reeks-3', 'comeback', 'huiswerkheld']);
  assert.deepEqual(nieuweBadges(['foutloze-toets'], { foutlozeToets: true }), []);
  for (const id of nieuweBadges([], { sterren: 30, foutlozeToets: true, weekdoelen: 9, reeks: 12, comeback: true, huiswerkBonussen: 9, niveau: 12 })) {
    assert.ok(BADGES.some((b) => b.id === id), id);
  }
});
