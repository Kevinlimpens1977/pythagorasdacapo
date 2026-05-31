import test from 'node:test';
import assert from 'node:assert/strict';

import { formatProgressAnswer } from './progressAnswerFormatter.js';

test('formatProgressAnswer shows empty answers clearly', () => {
  assert.equal(formatProgressAnswer(null), 'Geen antwoord opgeslagen');
  assert.equal(formatProgressAnswer({}), 'Geen antwoord opgeslagen');
});

test('formatProgressAnswer formats open answers and math toolbox work', () => {
  const formatted = formatProgressAnswer({
    openAnswer: 'Ik zet eerst 70 gelijk aan 100%.',
    mathTools: [
      {
        id: 'ratio',
        type: 'ratioTable',
        topValues: ['70', '42'],
        bottomValues: ['100%', '60%'],
        operations: [': 70 x 42']
      }
    ]
  });

  assert.match(formatted, /Open antwoord: Ik zet eerst 70/);
  assert.match(formatted, /Wiskunde: Verhoudingstabel/);
});

test('formatProgressAnswer formats gap and option answers without raw JSON noise', () => {
  assert.equal(
    formatProgressAnswer({ gap_1: 'oppervlakte', gap_2: 'cm2' }),
    'gap_1: oppervlakte; gap_2: cm2'
  );
  assert.equal(
    formatProgressAnswer({ 'option-a': false, 'option-b': true }),
    'option-b: gekozen'
  );
});
