import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildChoiceExplanationFeedback,
  buildQuestionExplanationFeedback,
  emptyAnswerExplanation,
  getSelectedChoiceIds
} from './answerExplanationFeedback.js';
import { buildAssessmentItemExplanationFeedback } from './assessmentItemGrading.js';
import { selectAnswerExplanation, hasAnswerExplanation } from './closedQuestionGradingRoute.js';

const opties = [
  {
    id: 'optie-1',
    text: 'Op het bureaublad van de computer thuis.',
    correct: false,
    misconception: 'Denkt dat een bestand vanzelf meereist met de leerling.'
  },
  {
    id: 'optie-2',
    text: 'Op een USB-stick in je etui.',
    correct: false,
    misconception: 'Vertrouwt op een stick die je kunt vergeten of verliezen.'
  },
  {
    id: 'optie-3',
    text: 'In je OneDrive van je schoolaccount.',
    correct: true,
    explanation: 'Wat in OneDrive staat, staat op elk apparaat waar je inlogt.'
  }
];

test('een fout antwoord levert alleen de denkfout van de gekozen optie op', () => {
  const feedback = buildChoiceExplanationFeedback({
    options: opties,
    selectedIds: ['optie-2'],
    isCorrect: false
  });

  assert.deepEqual(feedback.chosen, ['Vertrouwt op een stick die je kunt vergeten of verliezen.']);
  assert.deepEqual(feedback.correct, []);
});

test('een goed antwoord leest zijn eigen uitleg en krijgt geen tweede keer hetzelfde', () => {
  const feedback = buildChoiceExplanationFeedback({
    options: opties,
    selectedIds: ['optie-3'],
    isCorrect: true
  });

  assert.deepEqual(feedback.chosen, ['Wat in OneDrive staat, staat op elk apparaat waar je inlogt.']);
  assert.deepEqual(feedback.correct, []);
});

test('de denkfout van een niet-gekozen afleider blijft weg', () => {
  const feedback = buildChoiceExplanationFeedback({
    options: opties,
    selectedIds: ['optie-1'],
    isCorrect: false
  });

  assert.equal(feedback.chosen.includes('Vertrouwt op een stick die je kunt vergeten of verliezen.'), false);
  assert.deepEqual(feedback.chosen, ['Denkt dat een bestand vanzelf meereist met de leerling.']);
});

test('zonder keuze en zonder uitleg blijft het leeg in plaats van dat er iets verzonnen wordt', () => {
  assert.deepEqual(
    buildChoiceExplanationFeedback({ options: opties, selectedIds: [], isCorrect: false }).chosen,
    []
  );
  assert.deepEqual(
    buildChoiceExplanationFeedback({
      options: [{ id: 'a', correct: true }, { id: 'b', correct: false }],
      selectedIds: ['b'],
      isCorrect: false
    }),
    emptyAnswerExplanation()
  );
});

test('getSelectedChoiceIds leest alleen echte aanvinkingen, geen andere antwoordvelden', () => {
  assert.deepEqual(
    getSelectedChoiceIds({ 'optie-2': true, 'optie-1': false, openAnswer: 'tekst', mathTools: {} }),
    ['optie-2']
  );
  assert.deepEqual(getSelectedChoiceIds(null), []);
  assert.deepEqual(getSelectedChoiceIds(['optie-1']), []);
});

test('alleen keuzevragen dragen uitleg per optie', () => {
  const invullen = buildQuestionExplanationFeedback({
    vraag: {
      vraagtype: 'invullen',
      antwoord: { type: 'invullen', gaps: [{ id: 'gap-1', answer: 'OneDrive', explanation: 'Geheim' }] }
    },
    answers: { 'gap-1': 'usb' },
    isCorrect: false
  });

  assert.deepEqual(invullen, emptyAnswerExplanation());
});

test('een losse vraag uit de collectie vraag loopt door dezelfde keuze', () => {
  const feedback = buildQuestionExplanationFeedback({
    vraag: { vraagtype: 'meerkeuze', antwoord: { type: 'meerkeuze', options: opties } },
    answers: { 'optie-1': true },
    isCorrect: false
  });

  assert.deepEqual(feedback.chosen, ['Denkt dat een bestand vanzelf meereist met de leerling.']);
  assert.deepEqual(feedback.correct, []);
});

test('een toetsitem geeft dezelfde uitleg als een losse vraag met dezelfde opties', () => {
  const item = { id: 'item-1', type: 'meerkeuze', prompt: 'Waar zet je het bestand neer?', answer: { type: 'meerkeuze', options: opties } };

  const viaItem = buildAssessmentItemExplanationFeedback({ item, answer: ['optie-2'], isCorrect: false });
  const viaVraag = buildQuestionExplanationFeedback({
    vraag: { vraagtype: 'meerkeuze', antwoord: { type: 'meerkeuze', options: opties } },
    answers: { 'optie-2': true },
    isCorrect: false
  });

  assert.deepEqual(viaItem, viaVraag);
});

test('waar-niet-waar telt als keuzevraag binnen een toets', () => {
  const item = {
    id: 'item-2',
    type: 'waar-niet-waar',
    answer: {
      type: 'meerkeuze',
      options: [
        { id: 'waar', text: 'Waar', correct: false, misconception: 'Denkt dat een stelling altijd klopt.' },
        { id: 'niet-waar', text: 'Niet waar', correct: true, explanation: 'De stelling gaat over een tijdelijke map.' }
      ]
    }
  };

  const feedback = buildAssessmentItemExplanationFeedback({ item, answer: 'waar', isCorrect: false });
  assert.deepEqual(feedback.chosen, ['Denkt dat een stelling altijd klopt.']);
  assert.deepEqual(feedback.correct, []);
});

test('een open toetsitem krijgt geen optie-uitleg', () => {
  assert.deepEqual(
    buildAssessmentItemExplanationFeedback({
      item: { id: 'item-3', type: 'open', answer: { type: 'open', modelAnswer: 'Geheim modelantwoord' } },
      answer: 'iets',
      isCorrect: false
    }),
    emptyAnswerExplanation()
  );
});

// De kern van de leerlingroute: zolang de vraag nog openstaat, mag de uitleg van
// het juiste antwoord niet in beeld en niet in de voortgang.
test('de uitleg van het juiste antwoord wacht tot de vraag klaar is', () => {
  const explanation = {
    chosen: ['Vertrouwt op een stick die je kunt vergeten of verliezen.'],
    correct: ['Wat in OneDrive staat, staat op elk apparaat waar je inlogt.']
  };

  const nogEenPoging = selectAnswerExplanation({ explanation, questionFinished: false });
  assert.deepEqual(nogEenPoging.chosen, explanation.chosen);
  assert.deepEqual(nogEenPoging.correct, []);
  assert.equal(hasAnswerExplanation(nogEenPoging), true);

  const klaar = selectAnswerExplanation({ explanation, questionFinished: true });
  assert.deepEqual(klaar.correct, explanation.correct);
});

test('selectAnswerExplanation levert altijd twee lijsten, ook zonder uitleg', () => {
  assert.deepEqual(selectAnswerExplanation(), { chosen: [], correct: [] });
  assert.deepEqual(selectAnswerExplanation({ explanation: null, questionFinished: true }), {
    chosen: [],
    correct: []
  });
  assert.equal(hasAnswerExplanation(null), false);
  assert.equal(hasAnswerExplanation({ chosen: [], correct: [] }), false);
});
