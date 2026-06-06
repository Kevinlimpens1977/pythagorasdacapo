import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAssessmentItem,
  duplicateAssessmentItem,
  evaluateAssessmentAnswer,
  getAssessmentMatrixSummary,
  moveAssessmentItem,
  normalizeAssessmentItem,
  normalizeAssessmentItems,
  removeAssessmentItem,
  sumAssessmentItemTokens,
  updateAssessmentItemType
} from './assessmentBlockUtils.js';

test('createAssessmentItem creates useful defaults for supported item types', () => {
  const multipleChoice = createAssessmentItem({ type: 'meerkeuze', tokens: 4 });
  assert.equal(multipleChoice.type, 'meerkeuze');
  assert.equal(multipleChoice.vraagtype, 'meerkeuze');
  assert.equal(multipleChoice.options.length, 2);
  assert.equal(multipleChoice.options[0].correct, true);
  assert.equal(multipleChoice.answer.options.length, 2);
  assert.equal(multipleChoice.tokens, 4);
  assert.deepEqual(multipleChoice.taxonomy, {
    learningGoal: '',
    cognitiveSkill: 'begrijpen',
    masteryLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  const trueFalse = createAssessmentItem({ type: 'waar-niet-waar' });
  assert.deepEqual(trueFalse.options.map((option) => option.text), ['Waar', 'Niet waar']);

  const open = createAssessmentItem({ type: 'open' });
  assert.equal(open.options.length, 0);

  const numeric = createAssessmentItem({ type: 'numeriek' });
  assert.equal(numeric.answer.type, 'numeriek');
  assert.equal(numeric.answer.tolerance, 0.5);

  const matching = createAssessmentItem({ type: 'koppelen' });
  assert.equal(matching.answer.pairs.length, 2);

  const fillIn = createAssessmentItem({ type: 'invullen' });
  assert.equal(fillIn.answer.gaps.length, 1);

  const order = createAssessmentItem({ type: 'volgorde' });
  assert.equal(order.answer.items.length, 3);
});

test('normalizeAssessmentItem repairs missing ids, invalid type and missing correct option', () => {
  const item = normalizeAssessmentItem({
    type: 'unknown',
    question: 'Kies veilig',
    options: [{ text: 'A' }, { text: 'B' }],
    tokens: '3'
  });

  assert.equal(item.type, 'meerkeuze');
  assert.equal(item.vraagtype, 'meerkeuze');
  assert.equal(item.prompt, 'Kies veilig');
  assert.equal(item.options.length, 2);
  assert.equal(item.options[0].correct, true);
  assert.equal(item.answer.options[0].correct, true);
  assert.equal(item.tokens, 3);
  assert.deepEqual(item.taxonomy, {
    learningGoal: '',
    cognitiveSkill: 'begrijpen',
    masteryLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });
  assert.ok(item.id);
});

test('normalizeAssessmentItem preserves option feedback and misconception notes privately', () => {
  const item = normalizeAssessmentItem({
    type: 'meerkeuze',
    answer: {
      options: [
        { text: '123456', correct: false, explanation: 'Te raden', misconception: 'Leerling denkt dat kort makkelijker is.' },
        { text: 'Wachtwoordzin', correct: true, feedback: 'Sterk', misconceptie: 'Legacy veld' }
      ]
    }
  });

  assert.equal(item.answer.options[0].explanation, 'Te raden');
  assert.equal(item.answer.options[0].misconception, 'Leerling denkt dat kort makkelijker is.');
  assert.equal(item.answer.options[1].explanation, 'Sterk');
  assert.equal(item.answer.options[1].misconception, 'Legacy veld');
  assert.equal(item.options[0].misconception, 'Leerling denkt dat kort makkelijker is.');
});

test('normalizeAssessmentItem preserves didactic taxonomy fields', () => {
  const item = normalizeAssessmentItem({
    type: 'open',
    prompt: 'Leg uit hoe je broncontrole doet.',
    learningGoal: 'Ik kan een bron controleren',
    cognitiveSkill: 'uitleggen',
    masteryLevel: 'plus',
    scaffoldingRole: 'bewijs_leveren',
    taxonomy: {
      learningGoal: 'Ik kan veilig informatie beoordelen',
      cognitiveSkill: 'maken_controleren',
      masteryLevel: 'verdieping',
      scaffoldingRole: 'reflecteren'
    }
  });

  assert.deepEqual(item.taxonomy, {
    learningGoal: 'Ik kan veilig informatie beoordelen',
    cognitiveSkill: 'maken_controleren',
    masteryLevel: 'verdieping',
    scaffoldingRole: 'reflecteren'
  });
});

test('normalizeAssessmentItem keeps professional answer models for all assessment types', () => {
  assert.deepEqual(
    normalizeAssessmentItem({
      type: 'numeriek',
      prompt: 'Hoeveel tekens minimaal?',
      answer: { expected: '12', tolerance: '1', unit: 'tekens' }
    }).answer,
    { type: 'numeriek', expected: 12, tolerance: 1, unit: 'tekens', hintBijFout: '' }
  );

  assert.deepEqual(
    normalizeAssessmentItem({
      type: 'koppelen',
      answer: { pairs: [{ left: 'Word', right: 'Tekstverwerker' }] }
    }).answer.pairs.map((pair) => [pair.left, pair.right]),
    [['Word', 'Tekstverwerker']]
  );

  assert.deepEqual(
    normalizeAssessmentItem({
      type: 'invullen',
      answer: { text: 'Een sterk wachtwoord heeft [[12]] tekens.', gaps: [{ answer: '12' }] }
    }).answer.gaps.map((gap) => gap.answer),
    ['12']
  );

  assert.deepEqual(
    normalizeAssessmentItem({
      type: 'volgorde',
      answer: { items: [{ text: 'Open OneDrive' }, { text: 'Maak map' }] }
    }).answer.items.map((item) => item.text),
    ['Open OneDrive', 'Maak map']
  );
});

test('normalizeAssessmentItems tolerates non-array input', () => {
  assert.deepEqual(normalizeAssessmentItems(null), []);
});

test('sumAssessmentItemTokens totals normalized item tokens', () => {
  assert.equal(sumAssessmentItemTokens([{ tokens: 3 }, { tokens: '4' }, { tokens: -2 }]), 7);
});

test('getAssessmentMatrixSummary groups items by learning goal, skill and level', () => {
  const summary = getAssessmentMatrixSummary([
    {
      type: 'meerkeuze',
      tokens: 2,
      taxonomy: { learningGoal: 'Bronnen checken', cognitiveSkill: 'herkennen', masteryLevel: 'basis' }
    },
    {
      type: 'open',
      tokens: 4,
      taxonomy: { learningGoal: 'Bronnen checken', cognitiveSkill: 'uitleggen', masteryLevel: 'plus' }
    },
    {
      type: 'numeriek',
      tokens: 1,
      taxonomy: { learningGoal: '', cognitiveSkill: 'toepassen', masteryLevel: 'basis' }
    }
  ]);

  assert.equal(summary.totalItems, 3);
  assert.equal(summary.totalTokens, 7);
  assert.deepEqual(summary.byLearningGoal, [
    { key: 'Bronnen checken', label: 'Bronnen checken', items: 2, tokens: 6 },
    { key: 'geen_leerdoel', label: 'Geen leerdoel gekoppeld', items: 1, tokens: 1 }
  ]);
  assert.deepEqual(summary.byCognitiveSkill.map((row) => [row.key, row.items]), [
    ['herkennen', 1],
    ['toepassen', 1],
    ['uitleggen', 1]
  ]);
  assert.deepEqual(summary.byMasteryLevel.map((row) => [row.key, row.tokens]), [
    ['basis', 3],
    ['plus', 4]
  ]);
});

test('move, duplicate and remove assessment items keep stable behavior', () => {
  const items = [
    { id: 'a', type: 'open', prompt: 'A', tokens: 1 },
    { id: 'b', type: 'open', prompt: 'B', tokens: 2 },
    { id: 'c', type: 'open', prompt: 'C', tokens: 3 }
  ];

  assert.deepEqual(moveAssessmentItem(items, 0, 2).map((item) => item.id), ['b', 'c', 'a']);

  const duplicated = duplicateAssessmentItem(items, 1);
  assert.equal(duplicated.length, 4);
  assert.equal(duplicated[2].prompt, 'B (kopie)');
  assert.notEqual(duplicated[2].id, 'b');

  assert.deepEqual(removeAssessmentItem(items, 1).map((item) => item.id), ['a', 'c']);
});

test('updateAssessmentItemType resets options for the next type', () => {
  const item = updateAssessmentItemType({ id: 'x', type: 'open', prompt: 'Vraag' }, 'waar-niet-waar');
  assert.equal(item.type, 'waar-niet-waar');
  assert.deepEqual(item.options.map((option) => option.text), ['Waar', 'Niet waar']);
});

test('evaluateAssessmentAnswer checks closed assessment item answers', () => {
  const choice = normalizeAssessmentItem({
    id: 'choice',
    type: 'meerkeuze',
    options: [
      { id: 'a', text: 'Onveilig', correct: false },
      { id: 'b', text: 'Veilig', correct: true }
    ]
  });
  assert.equal(evaluateAssessmentAnswer(choice, 'b').correct, true);
  assert.equal(evaluateAssessmentAnswer(choice, 'a').correct, false);

  const numeric = normalizeAssessmentItem({
    type: 'numeriek',
    answer: { expected: 10, tolerance: 0.5 }
  });
  assert.equal(evaluateAssessmentAnswer(numeric, '10.4').correct, true);
  assert.equal(evaluateAssessmentAnswer(numeric, '11').correct, false);

  const matching = normalizeAssessmentItem({
    type: 'koppelen',
    answer: { pairs: [{ id: 'p1', left: 'Word', right: 'Tekst' }] }
  });
  assert.equal(evaluateAssessmentAnswer(matching, { p1: 'Tekst' }).correct, true);

  const fillIn = normalizeAssessmentItem({
    type: 'invullen',
    answer: { gaps: [{ id: 'g1', answer: 'OneDrive' }] }
  });
  assert.equal(evaluateAssessmentAnswer(fillIn, { g1: 'onedrive' }).correct, true);

  const order = normalizeAssessmentItem({
    type: 'volgorde',
    answer: { items: [{ id: 'one', text: 'Eerst' }, { id: 'two', text: 'Daarna' }] }
  });
  assert.equal(evaluateAssessmentAnswer(order, ['one', 'two']).correct, true);
  assert.equal(evaluateAssessmentAnswer(order, ['two', 'one']).correct, false);
});
