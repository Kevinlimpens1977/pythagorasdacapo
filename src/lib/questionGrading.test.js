import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GRADE_REASONS,
  QUESTION_GRADERS,
  buildInitialOrderItems,
  gradeQuestionAnswer,
  hasGradableAnswerKey
} from './questionGrading.js';
import { QUESTION_TYPES } from './questionTypeRegistry.js';
import { buildQuestionPreviewModel } from './questionPreviewUtils.js';

const gradeWithPreview = (vraag, answers) =>
  gradeQuestionAnswer({ vraag, preview: buildQuestionPreviewModel(vraag), answers });

// Dit is de structurele bewaker: een nieuw vraagtype toevoegen zonder grader
// laat deze test vallen, zodat bord en leerlingroute niet uiteen kunnen lopen.
test('every question type in the registry has a grader in the shared layer', () => {
  QUESTION_TYPES.forEach((type) => {
    assert.equal(
      typeof QUESTION_GRADERS[type.id],
      'function',
      `vraagtype ${type.id} heeft geen grader in questionGrading.js`
    );
  });
});

test('a missing answer key never means wrong, it means a human checks it', () => {
  const result = gradeWithPreview(
    { vraagtype: 'numeriek', antwoord: { type: 'numeriek', unit: 'cm' } },
    { expectedValue: '12' }
  );

  assert.equal(result.canGrade, false);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reason, GRADE_REASONS.NO_ANSWER_KEY);
});

test('meerkeuze needs every option to match and reports parts per option', () => {
  const vraag = {
    vraagtype: 'meerkeuze',
    antwoord: {
      type: 'meerkeuze',
      options: [
        { id: 'a', text: 'a', correct: true },
        { id: 'b', text: 'b', correct: false }
      ]
    }
  };

  const correct = gradeWithPreview(vraag, { a: true });
  assert.equal(correct.canGrade, true);
  assert.equal(correct.isCorrect, true);
  assert.deepEqual(correct.parts.map((part) => part.isCorrect), [true, true]);

  const wrong = gradeWithPreview(vraag, { a: true, b: true });
  assert.equal(wrong.isCorrect, false);
  assert.deepEqual(wrong.parts.map((part) => part.isCorrect), [true, false]);
});

test('numeriek accepts an answer inside the authored tolerance', () => {
  const vraag = {
    vraagtype: 'numeriek',
    antwoord: { type: 'numeriek', expected: 7.2, tolerance: 0.5 }
  };

  assert.equal(gradeWithPreview(vraag, { expectedValue: '7.2' }).isCorrect, true);
  assert.equal(gradeWithPreview(vraag, { expectedValue: '7,5' }).isCorrect, true);
  assert.equal(gradeWithPreview(vraag, { expectedValue: '7.7' }).isCorrect, true);
  assert.equal(gradeWithPreview(vraag, { expectedValue: '8.4' }).isCorrect, false);
});

test('numeriek without tolerance keeps the exact-match behaviour', () => {
  const vraag = { vraagtype: 'numeriek', antwoord: { type: 'numeriek', expected: 12 } };

  assert.equal(gradeWithPreview(vraag, { expectedValue: '12' }).isCorrect, true);
  assert.equal(gradeWithPreview(vraag, { expectedValue: '12.4' }).isCorrect, false);
});

test('invullen grades every gap and exposes a part per gap', () => {
  const vraag = {
    vraagtype: 'invullen',
    antwoord: {
      type: 'invullen',
      segments: [
        { type: 'text', text: 'De schuine zijde heet ' },
        { type: 'gap', id: 'gap-1', answer: 'hypotenusa' },
        { type: 'text', text: ' en staat tegenover de ' },
        { type: 'gap', id: 'gap-2', answer: 'rechte hoek' }
      ],
      gaps: [
        { id: 'gap-1', answer: 'hypotenusa' },
        { id: 'gap-2', answer: 'rechte hoek' }
      ]
    }
  };

  const result = gradeWithPreview(vraag, { 'gap-1': 'hypotenusa', 'gap-2': 'rechte hoek' });
  assert.equal(result.isCorrect, true);
  assert.equal(result.parts.length, 2);

  const partial = gradeWithPreview(vraag, { 'gap-1': 'hypotenusa', 'gap-2': 'stomp' });
  assert.equal(partial.isCorrect, false);
  assert.deepEqual(partial.parts.map((part) => part.isCorrect), [true, false]);
});

test('invullen with answers only in segments is still gradable on the board', () => {
  const vraag = {
    vraagtype: 'invullen',
    antwoord: {
      type: 'invullen',
      segments: [
        { type: 'text', text: 'a2 + b2 = ' },
        { type: 'gap', id: 'gap-1', answer: 'c2' }
      ],
      gaps: []
    }
  };

  assert.equal(hasGradableAnswerKey(vraag), true);
  assert.equal(gradeWithPreview(vraag, { 'gap-1': 'c2' }).isCorrect, true);
});

test('volgorde compares against the authored order and shares one initial shuffle', () => {
  const vraag = {
    vraagtype: 'volgorde',
    antwoord: {
      type: 'volgorde',
      items: [
        { id: 'i1', text: 'Eerst' },
        { id: 'i2', text: 'Daarna' },
        { id: 'i3', text: 'Tot slot' }
      ]
    }
  };
  const preview = buildQuestionPreviewModel(vraag);

  assert.deepEqual(
    buildInitialOrderItems(preview.orderItems).map((item) => item.id),
    ['i3', 'i2', 'i1']
  );
  // Zonder aanraken staat de startvolgorde er: dat mag nooit "goed" heten.
  assert.equal(gradeQuestionAnswer({ vraag, preview, answers: {} }).isCorrect, false);
  assert.equal(
    gradeQuestionAnswer({ vraag, preview, answers: { orderItems: preview.orderItems } }).isCorrect,
    true
  );
});

test('koppelen is gradable when the full answer key is present', () => {
  const vraag = {
    vraagtype: 'koppelen',
    antwoord: {
      type: 'koppelen',
      pairs: [
        { id: 'p1', left: 'pi', right: '3,14' },
        { id: 'p2', left: 'rechte hoek', right: '90 graden' }
      ]
    }
  };

  assert.equal(hasGradableAnswerKey(vraag), true);
  assert.equal(gradeWithPreview(vraag, { pairs: { p1: 'p1', p2: 'p2' } }).isCorrect, true);
  assert.equal(gradeWithPreview(vraag, { pairs: { p1: 'p2', p2: 'p1' } }).isCorrect, false);
});

test('open questions are only auto-graded when the model answer is calculable', () => {
  const calculable = gradeWithPreview(
    { vraagtype: 'open', antwoord: { type: 'open', modelAnswer: '5' } },
    { openAnswer: '5' }
  );
  assert.equal(calculable.canGrade, true);
  assert.equal(calculable.isCorrect, true);

  const textual = gradeWithPreview(
    { vraagtype: 'open', antwoord: { type: 'open', modelAnswer: 'de hypotenusa' } },
    { openAnswer: 'de hypotenusa' }
  );
  assert.equal(textual.canGrade, false);
  assert.equal(textual.reason, GRADE_REASONS.NEEDS_HUMAN);
});

test('exercise blocks are never scored', () => {
  const vraag = {
    vraagtype: 'exercise',
    antwoord: { type: 'exercise', fields: [{ id: 'f1', label: 'Noteer de bestandsnaam' }] }
  };

  assert.equal(hasGradableAnswerKey(vraag), false);
  const result = gradeWithPreview(vraag, { f1: 'notulen.docx' });
  assert.equal(result.canGrade, false);
  assert.equal(result.isCorrect, false);
  assert.equal(result.reason, GRADE_REASONS.NOT_SCORED);
});

test('the grading layer never leaks token, attempt or progress vocabulary', () => {
  const result = gradeWithPreview(
    { vraagtype: 'numeriek', antwoord: { type: 'numeriek', expected: 3, tokenConfig: { totalTokens: 10 } } },
    { expectedValue: '3' }
  );

  const serialized = JSON.stringify(result).toLowerCase();
  ['token', 'attempt', 'resulttier', 'leerling', 'voortgang'].forEach((forbidden) => {
    assert.equal(serialized.includes(forbidden), false, `grader lekt ${forbidden}`);
  });
});
