import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildStepStatuses,
  canJumpTo,
  extractIntroImage,
  findSituatieReferences,
  isAssessmentAnswerEmpty,
  mayNavigateBack,
  pickStartIndex,
  resolvePresentationMode
} from './assessmentPresentation.js';

test('een quiz of toets staat standaard op één vraag per scherm; andere blokken niet', () => {
  assert.equal(resolvePresentationMode({ type: 'quiz', content: {} }), 'een-voor-een');
  assert.equal(resolvePresentationMode({ type: 'toets', content: { presentatie: { mode: 'lijst' } } }), 'lijst');
  assert.equal(resolvePresentationMode({ type: 'toets', content: { presentatie: { mode: 'onzin' } } }), 'een-voor-een');
  assert.equal(resolvePresentationMode({ type: 'theory' }), 'lijst');
});

test('teruglezen mag standaard, niet in de nulmeting, en niet als de docent het uitzet', () => {
  assert.equal(mayNavigateBack({ type: 'quiz', content: {} }), true);
  assert.equal(mayNavigateBack({ type: 'toets', content: { nulmeting: { deel: 'A' } } }), false);
  assert.equal(mayNavigateBack({ type: 'toets', content: { presentatie: { terugbladeren: false } } }), false);
});

test('situatieverwijzingen in de vraagtekst worden herkend', () => {
  assert.deepEqual(findSituatieReferences('Kijk naar situatie A. Welk onderdeel gebruik je?'), ['A']);
  assert.deepEqual(findSituatieReferences('Vergelijk situatie B en C.'), ['B', 'C']);
  assert.deepEqual(findSituatieReferences('Kijk naar de situaties D, E en F.'), ['D', 'E', 'F']);
  assert.deepEqual(findSituatieReferences('Wat is een browser?'), []);
  assert.deepEqual(findSituatieReferences('Situatie Z bestaat niet.'), []);
});

test('de inleidingsafbeelding wordt uit de intro gehaald', () => {
  const html = '<p>Intro</p><figure><img src="https://x/y.webp?alt=media" alt="Situaties A, B en C" loading="eager"></figure>';
  assert.deepEqual(extractIntroImage(html), { src: 'https://x/y.webp?alt=media', alt: 'Situaties A, B en C' });
  assert.equal(extractIntroImage('<p>geen plaatje</p>'), null);
});

test('de startvraag is de eerste zonder afgerond record, of de laatste als alles af is', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  assert.equal(pickStartIndex({ items, records: {} }), 0);
  assert.equal(pickStartIndex({ items, records: { a: { completed: true } } }), 1);
  assert.equal(pickStartIndex({ items, records: { a: { completed: true }, b: { completed: true }, c: { completed: true } } }), 2);
});

test('de voortgangsbalk en het springen volgen de regels voor teruglezen', () => {
  const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const records = { a: { completed: true, isCorrect: true }, b: { completed: true, isCorrect: false } };
  const statuses = buildStepStatuses({ items, records, currentIndex: 2 });
  assert.deepEqual(statuses.map((s) => [s.nummer, s.completed, s.correct, s.current]), [[1, true, true, false], [2, true, false, false], [3, false, false, true]]);

  const quiz = { type: 'quiz', content: {} };
  assert.equal(canJumpTo({ block: quiz, statuses, targetIndex: 0, currentIndex: 2 }), true);
  assert.equal(canJumpTo({ block: quiz, statuses, targetIndex: 2, currentIndex: 2 }), false);
  const nulmeting = { type: 'toets', content: { nulmeting: { deel: 'A' } } };
  assert.equal(canJumpTo({ block: nulmeting, statuses, targetIndex: 0, currentIndex: 2 }), false);
  // Vooruit springen naar een onbeantwoorde vraag mag nooit.
  const eerder = buildStepStatuses({ items, records, currentIndex: 0 });
  assert.equal(canJumpTo({ block: quiz, statuses: eerder, targetIndex: 2, currentIndex: 0 }), false);
});

test('een lege inzending wordt herkend per vraagtype', () => {
  const mk = { type: 'meerkeuze' };
  assert.equal(isAssessmentAnswerEmpty(mk, []), true);
  assert.equal(isAssessmentAnswerEmpty(mk, ''), true);
  assert.equal(isAssessmentAnswerEmpty(mk, 'option-2'), false);
  assert.equal(isAssessmentAnswerEmpty(mk, ['option-1', 'option-3']), false);
  assert.equal(isAssessmentAnswerEmpty({ type: 'waar-niet-waar' }, ''), true);
  assert.equal(isAssessmentAnswerEmpty({ type: 'numeriek' }, '  '), true);
  assert.equal(isAssessmentAnswerEmpty({ type: 'numeriek' }, '0'), false);
  assert.equal(isAssessmentAnswerEmpty({ type: 'open' }, 'Omdat...'), false);
  assert.equal(isAssessmentAnswerEmpty({ type: 'volgorde' }, []), true);
  assert.equal(isAssessmentAnswerEmpty({ type: 'volgorde' }, ['b', 'a']), false);

  const koppel = { type: 'koppelen', answer: { pairs: [{ id: 'p1' }, { id: 'p2' }] } };
  assert.equal(isAssessmentAnswerEmpty(koppel, { p1: '', p2: '' }), true);
  assert.equal(isAssessmentAnswerEmpty(koppel, { p1: 'match-2', p2: '' }), true);
  assert.equal(isAssessmentAnswerEmpty(koppel, { p1: 'match-2', p2: 'match-1' }), false);

  const invul = { type: 'invullen', answer: { gaps: [{ id: 'g1' }, { id: 'g2' }] } };
  assert.equal(isAssessmentAnswerEmpty(invul, { g1: 'CPU', g2: '' }), true);
  assert.equal(isAssessmentAnswerEmpty(invul, { g1: 'CPU', g2: 'RAM' }), false);
});
