import test from 'node:test';
import assert from 'node:assert/strict';
import {
  berekenLevelMaxScore,
  berekenLevelResultaat,
  berekenTurboMaxScore,
  berekenWoordScore,
  buildTurboDetails,
  FOUTLOOS_LEVEL_BONUS,
  isInGevaar,
  schudWoorden,
  TURBO_LEVELS,
  verwerkToetsaanslag
} from './turboTypenLogic.js';

test('5 levels met oplopende woordlengte en oplopend tempo', () => {
  assert.equal(TURBO_LEVELS.length, 5);

  let vorigeGemiddelde = 0;
  let vorigeBaan = Infinity;
  for (const level of TURBO_LEVELS) {
    const gemiddelde = level.woorden.reduce((som, woord) => som + woord.length, 0) / level.woorden.length;
    assert.equal(gemiddelde > vorigeGemiddelde, true, `level ${level.nummer} woordlengte stijgt`);
    assert.equal(level.baanSeconden <= vorigeBaan, true, `level ${level.nummer} tempo stijgt`);
    vorigeGemiddelde = gemiddelde;
    vorigeBaan = level.baanSeconden;

    for (const woord of level.woorden) {
      assert.match(woord, /^[a-z]+$/, `woord "${woord}" alleen kleine letters`);
    }
    assert.equal(new Set(level.woorden).size, level.woorden.length, `level ${level.nummer} unieke woorden`);
  }
});

test('maxScore is deterministisch: letterscore plus foutloos-bonus per level', () => {
  const verwacht = TURBO_LEVELS.reduce((totaal, level) => (
    totaal + level.woorden.reduce((som, woord) => som + woord.length * 10, 0) + FOUTLOOS_LEVEL_BONUS
  ), 0);

  assert.equal(berekenTurboMaxScore(), verwacht);
  assert.equal(berekenWoordScore('wifi'), 40);
  assert.equal(berekenLevelMaxScore(TURBO_LEVELS[0]), 31 * 10 + 100);
});

test('schudWoorden houdt dezelfde set woorden', () => {
  const origineel = TURBO_LEVELS[2].woorden;
  const geschud = schudWoorden(origineel);
  assert.equal(geschud.length, origineel.length);
  assert.deepEqual([...geschud].sort(), [...origineel].sort());
});

test('toetsaanslag: eerste letter lockt het verst gevorderde woord', () => {
  const actief = [
    { id: 'a', woord: 'wifi', voortgang: 0.2 },
    { id: 'b', woord: 'wachtwoord', voortgang: 0.6 }
  ];

  const stap = verwerkToetsaanslag({ actieveWoorden: actief, lockId: null, getypt: '', letter: 'w' });
  assert.equal(stap.resultaat, 'voortgang');
  assert.equal(stap.lockId, 'b');
  assert.equal(stap.getypt, 'w');
});

test('toetsaanslag: goed doortypen rondt het woord af, fout telt als typefout', () => {
  const actief = [{ id: 'a', woord: 'app', voortgang: 0.4 }];

  let staat = verwerkToetsaanslag({ actieveWoorden: actief, lockId: null, getypt: '', letter: 'a' });
  staat = verwerkToetsaanslag({ actieveWoorden: actief, lockId: staat.lockId, getypt: staat.getypt, letter: 'p' });
  assert.equal(staat.resultaat, 'voortgang');

  const fout = verwerkToetsaanslag({ actieveWoorden: actief, lockId: staat.lockId, getypt: staat.getypt, letter: 'x' });
  assert.equal(fout.resultaat, 'fout');
  assert.equal(fout.getypt, 'ap', 'voortgang blijft staan na typefout');

  const af = verwerkToetsaanslag({ actieveWoorden: actief, lockId: staat.lockId, getypt: staat.getypt, letter: 'p' });
  assert.equal(af.resultaat, 'afgerond');
  assert.equal(af.afgerondId, 'a');
});

test('toetsaanslag: niet-letters worden genegeerd, onbekende startletter is fout', () => {
  const actief = [{ id: 'a', woord: 'wifi', voortgang: 0.1 }];
  assert.equal(verwerkToetsaanslag({ actieveWoorden: actief, letter: '3' }).resultaat, 'genegeerd');
  assert.equal(verwerkToetsaanslag({ actieveWoorden: actief, letter: 'q' }).resultaat, 'fout');
});

test('gevaarzone begint bij 72% van de baan', () => {
  assert.equal(isInGevaar(0.5), false);
  assert.equal(isInGevaar(0.72), true);
  assert.equal(isInGevaar(0.9), true);
});

test('levelresultaat: foutloos level krijgt de bonus, met missers niet', () => {
  const level = TURBO_LEVELS[0];
  const foutloos = berekenLevelResultaat({ level, geraakteWoorden: level.woorden, gemisteWoorden: [] });
  assert.equal(foutloos.foutloos, true);
  assert.equal(foutloos.score, 31 * 10 + 100);

  const metMisser = berekenLevelResultaat({
    level,
    geraakteWoorden: level.woorden.slice(1),
    gemisteWoorden: [level.woorden[0]]
  });
  assert.equal(metMisser.foutloos, false);
  assert.equal(metMisser.bonus, 0);
  assert.equal(metMisser.score, (31 - 3) * 10);
});

test('buildTurboDetails levert compacte statistieken', () => {
  const details = buildTurboDetails({
    levelResultaten: [{ nummer: 1, score: 410, geraakt: 8, gemist: 0, foutloos: true }],
    typefouten: 4.6
  });
  assert.deepEqual(details, {
    levels: [{ nummer: 1, score: 410, geraakt: 8, gemist: 0, foutloos: true }],
    typefouten: 5
  });
});
