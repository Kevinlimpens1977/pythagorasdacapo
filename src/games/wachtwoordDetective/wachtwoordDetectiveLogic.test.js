import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAttemptFromFragments,
  calculateMaxScore,
  canGiveUp,
  CASE_MODES,
  crackPointsForAttempt,
  evaluateFinaleSelection,
  FINALE_CARDS,
  giveUpPoints,
  isCaseCracked,
  isDebriefCorrect,
  WACHTWOORD_DETECTIVE_CASES
} from './wachtwoordDetectiveLogic.js';

const getCase = (id) => WACHTWOORD_DETECTIVE_CASES.find((item) => item.id === id);

test('het spel heeft 4 zaken met oplopende mechaniek en een vaste maxScore van 15', () => {
  assert.equal(WACHTWOORD_DETECTIVE_CASES.length, 4);
  assert.equal(getCase('daan').mode, CASE_MODES.MULTIPLE_CHOICE);
  assert.equal(getCase('sofia').mode, CASE_MODES.MULTIPLE_CHOICE);
  assert.equal(getCase('truus').mode, CASE_MODES.COMBINE);
  assert.equal(getCase('jayden').mode, CASE_MODES.COMBINE);
  assert.equal(calculateMaxScore(), 15);
});

test('elke zaak heeft een debriefvraag met precies één goed antwoord', () => {
  for (const caseItem of WACHTWOORD_DETECTIVE_CASES) {
    const correctOptions = caseItem.debrief.options.filter((option) => option.correct === true);
    assert.equal(correctOptions.length, 1, `zaak ${caseItem.id}`);
    assert.equal(typeof caseItem.debrief.explanation, 'string');
  }
});

test('meerkeuze-wachtwoorden staan tussen de keuzeopties', () => {
  for (const caseItem of WACHTWOORD_DETECTIVE_CASES.filter((item) => item.mode === CASE_MODES.MULTIPLE_CHOICE)) {
    assert.equal(caseItem.choices.includes(caseItem.password), true, `zaak ${caseItem.id}`);
  }
});

test('isCaseCracked vergelijkt zonder hoofdletters en spaties', () => {
  const sofia = getCase('sofia');
  assert.equal(isCaseCracked(sofia, 'Messi10'), true);
  assert.equal(isCaseCracked(sofia, 'messi10'), true);
  assert.equal(isCaseCracked(sofia, 'Messi 10'), true);
  assert.equal(isCaseCracked(sofia, 'Leeuwen2024'), false);
});

test('fragmenten combineren bouwt het wachtwoord van oma Truus', () => {
  const truus = getCase('truus');
  const attempt = buildAttemptFromFragments(truus, ['minoes', '2018']);
  assert.equal(attempt, 'Minoes2018');
  assert.equal(isCaseCracked(truus, attempt), true);
  assert.equal(isCaseCracked(truus, buildAttemptFromFragments(truus, ['lisa', '2018'])), false);
});

test('Jaydens zaak is onkraakbaar: geen enkele fragmentcombinatie werkt', () => {
  const jayden = getCase('jayden');
  assert.equal(jayden.uncrackable, true);
  assert.equal(isCaseCracked(jayden, 'Rocky2012'), false);
  assert.equal(isCaseCracked(jayden, jayden.password), false);
});

test('opgeven kan pas na 2 pogingen en levert dan volle punten op', () => {
  const jayden = getCase('jayden');
  assert.equal(canGiveUp(jayden, 0), false);
  assert.equal(canGiveUp(jayden, 1), false);
  assert.equal(canGiveUp(jayden, 2), true);
  assert.equal(giveUpPoints(2), 2);
  assert.equal(giveUpPoints(3), 1);

  const daan = getCase('daan');
  assert.equal(canGiveUp(daan, 5), false);
});

test('kraakpunten: eerste poging 2, daarna 1', () => {
  assert.equal(crackPointsForAttempt(1), 2);
  assert.equal(crackPointsForAttempt(2), 1);
  assert.equal(crackPointsForAttempt(3), 1);
});

test('isDebriefCorrect herkent het goede antwoord', () => {
  const daan = getCase('daan');
  assert.equal(isDebriefCorrect(daan, 'b'), true);
  assert.equal(isDebriefCorrect(daan, 'a'), false);
  assert.equal(isDebriefCorrect(daan, 'bestaat-niet'), false);
});

test('finale: 4 sterke kaarten = 3 punten en 100% sterkte', () => {
  const result = evaluateFinaleSelection(['pannenkoek', 'raket', 'negen', 'teken']);
  assert.equal(result.complete, true);
  assert.equal(result.score, 3);
  assert.equal(result.strengthPercent, 100);
  assert.equal(result.trapCards.length, 0);
  assert.equal(result.passwordPreview, 'PannenkoekRaket9!');
});

test('finale: elke valkuilkaart kost een punt, incompleet telt niet', () => {
  const withTrap = evaluateFinaleSelection(['pannenkoek', 'raket', 'negen', '123']);
  assert.equal(withTrap.score, 2);
  assert.equal(withTrap.trapCards[0].id, '123');

  const allTraps = evaluateFinaleSelection(['eigennaam', '123', 'geboortejaar', 'welkom']);
  assert.equal(allTraps.score, 0);

  const incomplete = evaluateFinaleSelection(['pannenkoek', 'raket']);
  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.score, 0);
});

test('finalekaarten: 6 sterke en 4 valkuilen, valkuilen hebben uitleg', () => {
  assert.equal(FINALE_CARDS.filter((card) => card.type === 'strong').length, 6);
  const traps = FINALE_CARDS.filter((card) => card.type === 'trap');
  assert.equal(traps.length, 4);
  assert.equal(traps.every((card) => typeof card.reason === 'string' && card.reason.length > 0), true);
});
