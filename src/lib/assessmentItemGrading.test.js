import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAssessmentGradingAnswers,
  buildAssessmentMatchOptions,
  buildGradableQuestionFromAssessmentItem,
  getAssessmentGradingType,
  gradeAssessmentItemAnswer,
  resolveAssessmentMatchSelection
} from './assessmentItemGrading.js';
import { gradeQuestionAnswer } from './questionGrading.js';
import { buildQuestionPreviewModel } from './questionPreviewUtils.js';

test('getAssessmentGradingType folds waar-niet-waar into meerkeuze', () => {
  assert.equal(getAssessmentGradingType({ type: 'waar-niet-waar' }), 'meerkeuze');
  assert.equal(getAssessmentGradingType({ type: 'koppelen' }), 'koppelen');
  assert.equal(getAssessmentGradingType({ answer: { type: 'numeriek' } }), 'numeriek');
  assert.equal(getAssessmentGradingType({}), 'open');
});

test('a toets item is graded by exactly the same layer as a loose question', () => {
  const item = {
    id: 'item-1',
    type: 'meerkeuze',
    prompt: 'Welke is veilig?',
    answer: {
      type: 'meerkeuze',
      options: [
        { id: 'option-1', text: 'Wachtwoord delen', correct: false },
        { id: 'option-2', text: 'Tweestapsverificatie', correct: true }
      ]
    }
  };

  const viaAdapter = gradeAssessmentItemAnswer({ item, answer: 'option-2' });
  const vraag = buildGradableQuestionFromAssessmentItem(item);
  const viaQuestionRoute = gradeQuestionAnswer({
    vraag,
    preview: buildQuestionPreviewModel(vraag),
    answers: { 'option-2': true }
  });

  assert.deepEqual(viaAdapter, viaQuestionRoute);
  assert.equal(viaAdapter.isCorrect, true);
});

test('a toets item without an answer key is not graded as wrong', () => {
  // Dit is de leerlingsnapshot: opties zonder `correct`. Stilzwijgend "fout"
  // zou een leerling straffen voor iets wat niemand heeft nagekeken.
  const grade = gradeAssessmentItemAnswer({
    item: {
      id: 'item-1',
      type: 'meerkeuze',
      answer: { type: 'meerkeuze', options: [{ id: 'option-1', text: 'A' }, { id: 'option-2', text: 'B' }] }
    },
    answer: 'option-1'
  });

  assert.equal(grade.canGrade, false);
  assert.equal(grade.isCorrect, false);
  assert.equal(grade.reason, 'no-answer-key');
});

test('the adapter never invents an answer key of its own', () => {
  // De CMS-normalisatie vult een lege meerkeuzevraag aan met "optie 1 is goed".
  // Die aanvulling mag nooit in de beoordeling terechtkomen.
  const vraag = buildGradableQuestionFromAssessmentItem({
    type: 'meerkeuze',
    answer: { type: 'meerkeuze', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }] }
  });

  assert.equal(vraag.antwoord.options.some((option) => option.correct === true), false);
});

test('fill-in items grade against gaps, including alternatives', () => {
  const item = {
    type: 'invullen',
    answer: {
      type: 'invullen',
      text: 'Bewaar je bestanden in ...',
      // Standaard-segments met een andere gap-id dan de echte gaps: de gaps
      // horen leidend te zijn, want daar komen ook de invoervelden uit.
      segments: [{ type: 'text', text: 'Bewaar je bestanden in ' }, { type: 'gap', id: 'losse-gap' }],
      gaps: [{ id: 'gap-1', answer: 'OneDrive', alternatives: ['de cloud'] }]
    }
  };

  assert.equal(gradeAssessmentItemAnswer({ item, answer: { 'gap-1': 'onedrive' } }).isCorrect, true);
  assert.equal(gradeAssessmentItemAnswer({ item, answer: { 'gap-1': 'de cloud' } }).isCorrect, true);
  assert.equal(gradeAssessmentItemAnswer({ item, answer: { 'gap-1': 'usb-stick' } }).isCorrect, false);
});

test('order items grade on id order, not on the shown order', () => {
  const item = {
    type: 'volgorde',
    answer: {
      type: 'volgorde',
      items: [{ id: 'one', text: 'Eerst' }, { id: 'two', text: 'Dan' }, { id: 'three', text: 'Slot' }]
    }
  };

  const goed = gradeAssessmentItemAnswer({ item, answer: ['one', 'two', 'three'] });
  assert.equal(goed.isCorrect, true);
  assert.deepEqual(goed.parts.map((part) => part.isCorrect), [true, true, true]);

  const fout = gradeAssessmentItemAnswer({ item, answer: ['three', 'two', 'one'] });
  assert.equal(fout.isCorrect, false);
  assert.deepEqual(fout.parts.map((part) => part.isCorrect), [false, true, false]);
});

test('numeric items keep the tolerance from the studio', () => {
  const item = { type: 'numeriek', answer: { type: 'numeriek', expected: 12, tolerance: 0.5 } };

  assert.equal(gradeAssessmentItemAnswer({ item, answer: '12,3' }).isCorrect, true);
  assert.equal(gradeAssessmentItemAnswer({ item, answer: '13' }).isCorrect, false);
});

test('matching options hide the pairing in their ids', () => {
  const pairs = [
    { id: 'p1', left: 'Privacy', right: 'Persoonsgegevens beschermen' },
    { id: 'p2', left: 'Phishing', right: 'Nepbericht' }
  ];

  const options = buildAssessmentMatchOptions(pairs);
  assert.deepEqual(options.map((option) => option.id), ['match-1', 'match-2']);
  // Geroteerd: de eerste keuze hoort bij het laatste paar.
  assert.deepEqual(options.map((option) => option.pairId), ['p2', 'p1']);
});

test('a matching choice is resolved by id in every snapshot generation', () => {
  const pairs = [
    { id: 'p1', left: 'Privacy', right: 'Persoonsgegevens beschermen' },
    { id: 'p2', left: 'Phishing', right: 'Nepbericht' }
  ];

  assert.equal(resolveAssessmentMatchSelection(pairs, 'match-2'), 'p1');
  assert.equal(resolveAssessmentMatchSelection(pairs, 'p1-option'), 'p1');
  assert.equal(resolveAssessmentMatchSelection(pairs, 'p1'), 'p1');
  assert.equal(resolveAssessmentMatchSelection(pairs, ''), '');

  // Tekst is geen id: koppelen wordt op id vergeleken, net als op het digibord.
  assert.equal(resolveAssessmentMatchSelection(pairs, 'Persoonsgegevens beschermen'), 'Persoonsgegevens beschermen');

  const item = { type: 'koppelen', answer: { type: 'koppelen', pairs } };
  assert.equal(gradeAssessmentItemAnswer({ item, answer: { p1: 'match-2', p2: 'match-1' } }).isCorrect, true);
  assert.equal(gradeAssessmentItemAnswer({ item, answer: { p1: 'match-1', p2: 'match-2' } }).isCorrect, false);
});

test('the answers adapter only reshapes, it never compares', () => {
  const item = {
    type: 'meerkeuze',
    answer: { type: 'meerkeuze', options: [{ id: 'a', correct: true }, { id: 'b' }] }
  };

  assert.deepEqual(buildAssessmentGradingAnswers(item, 'a'), { a: true });
  assert.deepEqual(buildAssessmentGradingAnswers(item, ['a', 'b']), { a: true, b: true });
  assert.deepEqual(buildAssessmentGradingAnswers(item, []), {});
  assert.deepEqual(
    buildAssessmentGradingAnswers({ type: 'volgorde', answer: {} }, ['x', 'y']),
    { orderItems: [{ id: 'x' }, { id: 'y' }] }
  );
  assert.deepEqual(buildAssessmentGradingAnswers({ type: 'open', answer: {} }, ' antwoord '), {
    openAnswer: ' antwoord '
  });
});

test('open toets items stay with the human or Digidocent, never silently wrong', () => {
  const grade = gradeAssessmentItemAnswer({
    item: { type: 'open', answer: { type: 'open', modelAnswer: 'Een lang wachtwoord met symbolen.' } },
    answer: 'weet ik niet'
  });

  assert.equal(grade.canGrade, false);
  assert.equal(grade.reason, 'needs-human');
});
