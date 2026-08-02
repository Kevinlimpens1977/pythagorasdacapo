import test from 'node:test';
import assert from 'node:assert/strict';
import { ZOEKTOCHT_SCORE_CONFIG } from './zoektochtConfig.js';
import {
  alleObjectenGevonden,
  berekenLevelScore,
  berekenTotaalScore,
  berekenZoektochtMaxScore,
  buildZoektochtDetails,
  createLevelVoortgang,
  isLevelCompleet,
  isVraagOptieCorrect,
  kiesHintObject,
  levelLabel,
  magHintGebruiken,
  ZOEKTOCHT_LEVELS
} from './zoektochtLogic.js';

test('er zijn 3 gewone levels met 9 objecten en een bonuslevel met 12, alle ids uniek', () => {
  assert.equal(ZOEKTOCHT_LEVELS.length, 4);

  const alleIds = new Set();
  for (const level of ZOEKTOCHT_LEVELS) {
    const verwacht = level.bonus ? 12 : 9;
    assert.equal(level.objecten.length, verwacht, `level ${level.id}`);
    for (const object of level.objecten) {
      const sleutel = `${level.id}:${object.id}`;
      assert.equal(alleIds.has(sleutel), false, `dubbel object ${sleutel}`);
      alleIds.add(sleutel);
    }
  }

  assert.equal(ZOEKTOCHT_LEVELS.filter((level) => level.bonus).length, 1);
  assert.equal(ZOEKTOCHT_LEVELS.at(-1).bonus, true, 'bonuslevel is het laatste level');
  assert.equal(levelLabel(ZOEKTOCHT_LEVELS.at(-1)), 'Bonuslevel');
  assert.equal(levelLabel(ZOEKTOCHT_LEVELS[0]), 'Level 1');
});

test('alle hotspots vallen binnen het 16:9-vlak en hebben hint + toegankelijkheidslabel', () => {
  for (const level of ZOEKTOCHT_LEVELS) {
    assert.equal(typeof level.achtergrond, 'string', `level ${level.id} achtergrond`);
    for (const object of level.objecten) {
      assert.equal(object.x >= 0 && object.x <= 100, true, `${level.id}/${object.id} x`);
      assert.equal(object.y >= 0 && object.y <= 100, true, `${level.id}/${object.id} y`);
      assert.equal(object.breedte > 0 && object.breedte <= 20, true, `${level.id}/${object.id} breedte`);
      assert.equal(object.hoogte > 0 && object.hoogte <= 30, true, `${level.id}/${object.id} hoogte`);
      // Hotspot mag niet buiten het vlak uitsteken
      assert.equal(object.x - object.breedte / 2 >= -2, true, `${level.id}/${object.id} links buiten beeld`);
      assert.equal(object.x + object.breedte / 2 <= 102, true, `${level.id}/${object.id} rechts buiten beeld`);
      assert.equal(typeof object.hint, 'string');
      assert.equal(typeof object.ariaLabel, 'string');
      assert.equal(typeof object.emoji, 'string');
      assert.equal(typeof object.naam, 'string');
    }
  }
});

test('elke eindvraag heeft precies één goed antwoord en feedbackteksten', () => {
  for (const level of ZOEKTOCHT_LEVELS) {
    const goede = level.vraag.opties.filter((optie) => optie.correct === true);
    assert.equal(goede.length, 1, `level ${level.id}`);
    assert.equal(level.vraag.opties.length, 3, `level ${level.id}`);
    assert.equal(typeof level.vraag.uitlegGoed, 'string');
    assert.equal(typeof level.vraag.uitlegFout, 'string');
    assert.equal(isVraagOptieCorrect(level.vraag, goede[0].id), true);
    assert.equal(isVraagOptieCorrect(level.vraag, 'bestaat-niet'), false);
  }
});

test('maxScore is vast en klopt met de configuratie (5750 incl. bonuslevel)', () => {
  const verwacht = 3 * (9 * 100 + 250 + 150) + (12 * 100 + 250 + 150) + 250;
  assert.equal(berekenZoektochtMaxScore(), verwacht);
  assert.equal(verwacht, 5750);
});

test('berekenLevelScore: perfect level levert 1300 punten op', () => {
  const level = ZOEKTOCHT_LEVELS[0];
  const voortgang = {
    ...createLevelVoortgang(),
    gevondenIds: level.objecten.map((object) => object.id),
    vraagInEenKeerGoed: true,
    vraagBeantwoord: true
  };

  assert.equal(berekenLevelScore(level, voortgang), 1300);
  assert.equal(isLevelCompleet(level, voortgang), true);
});

test('berekenLevelScore: strafpunten voor misklikken en hints, zoekdeel nooit onder 0', () => {
  const level = ZOEKTOCHT_LEVELS[0];
  const voortgang = {
    ...createLevelVoortgang(),
    gevondenIds: level.objecten.map((object) => object.id),
    misklikken: 5,
    hintsGebruikt: 2,
    vraagInEenKeerGoed: false,
    vraagBeantwoord: true
  };

  // 900 - 50 - 100 = 750, geen vraagpunten, geen zonder-hint-bonus
  assert.equal(berekenLevelScore(level, voortgang), 750);

  const rampzalig = {
    ...createLevelVoortgang(),
    gevondenIds: [level.objecten[0].id],
    misklikken: 50,
    hintsGebruikt: 3,
    vraagBeantwoord: true
  };
  assert.equal(berekenLevelScore(level, rampzalig), 0);
});

test('berekenTotaalScore telt levels op en geeft eindbonus bij alles voltooid', () => {
  assert.equal(berekenTotaalScore([1300, 1300, 1300], true), 4150);
  assert.equal(berekenTotaalScore([1300, 1300], false), 2600);
});

test('hints: maximaal 3 per level en deterministisch doelobject', () => {
  const level = ZOEKTOCHT_LEVELS[1];
  const voortgang = createLevelVoortgang();

  assert.equal(magHintGebruiken(voortgang), true);
  assert.equal(magHintGebruiken({ ...voortgang, hintsGebruikt: 3 }), false);

  assert.equal(kiesHintObject(level, voortgang).id, level.objecten[0].id);
  const naEerste = { ...voortgang, gevondenIds: [level.objecten[0].id] };
  assert.equal(kiesHintObject(level, naEerste).id, level.objecten[1].id);

  // Geselecteerd woord krijgt voorrang; een al gevonden voorkeur schuift door.
  assert.equal(kiesHintObject(level, voortgang, level.objecten[4].id).id, level.objecten[4].id);
  assert.equal(kiesHintObject(level, naEerste, level.objecten[0].id).id, level.objecten[1].id);

  const allesGevonden = { ...voortgang, gevondenIds: level.objecten.map((object) => object.id) };
  assert.equal(kiesHintObject(level, allesGevonden), null);
  assert.equal(alleObjectenGevonden(level, allesGevonden), true);
});

test('buildZoektochtDetails maakt een compact resultaat voor de voortgangsopslag', () => {
  const details = buildZoektochtDetails({
    levelResultaten: [
      { id: 'klaslokaal', score: 1300, gevonden: 9, misklikken: 0, hintsGebruikt: 0, vraagInEenKeerGoed: true }
    ],
    totaleTijdSeconden: 431.6
  });

  assert.deepEqual(details, {
    levels: [
      { id: 'klaslokaal', score: 1300, gevonden: 9, misklikken: 0, hintsGebruikt: 0, vraagInEenKeerGoed: true }
    ],
    totaleTijdSeconden: 432
  });
});

test('scoreconfig bevat de afgesproken waarden', () => {
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.objectPunten, 100);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.misklikStraf, 10);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.hintStraf, 50);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.hintsPerLevel, 3);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.vraagPunten, 250);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.zonderHintBonus, 150);
  assert.equal(ZOEKTOCHT_SCORE_CONFIG.alleLevelsBonus, 250);
});
