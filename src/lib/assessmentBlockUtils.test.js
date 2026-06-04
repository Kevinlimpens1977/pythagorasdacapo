import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createAssessmentItem,
  duplicateAssessmentItem,
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
  assert.equal(multipleChoice.options.length, 2);
  assert.equal(multipleChoice.options[0].correct, true);
  assert.equal(multipleChoice.tokens, 4);

  const trueFalse = createAssessmentItem({ type: 'waar-niet-waar' });
  assert.deepEqual(trueFalse.options.map((option) => option.text), ['Waar', 'Niet waar']);

  const open = createAssessmentItem({ type: 'open' });
  assert.equal(open.options.length, 0);
});

test('normalizeAssessmentItem repairs missing ids, invalid type and missing correct option', () => {
  const item = normalizeAssessmentItem({
    type: 'unknown',
    question: 'Kies veilig',
    options: [{ text: 'A' }, { text: 'B' }],
    tokens: '3'
  });

  assert.equal(item.type, 'meerkeuze');
  assert.equal(item.prompt, 'Kies veilig');
  assert.equal(item.options.length, 2);
  assert.equal(item.options[0].correct, true);
  assert.equal(item.tokens, 3);
  assert.ok(item.id);
});

test('normalizeAssessmentItems tolerates non-array input', () => {
  assert.deepEqual(normalizeAssessmentItems(null), []);
});

test('sumAssessmentItemTokens totals normalized item tokens', () => {
  assert.equal(sumAssessmentItemTokens([{ tokens: 3 }, { tokens: '4' }, { tokens: -2 }]), 7);
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

