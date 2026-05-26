import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildFillBlankTextFromSegments,
  buildSegmentsFromLegacyFillBlank,
  isSmartFillBlankAnswerCorrect
} from './fillBlankUtils.js';

test('buildSegmentsFromLegacyFillBlank converts legacy GAP text to editable segments', () => {
  assert.deepEqual(
    buildSegmentsFromLegacyFillBlank('De [GAP] is [GAP].', [
      { id: 'gap-1', answer: 'oppervlakte' },
      { id: 'gap-2', answer: 'cm2' }
    ]),
    [
      { type: 'text', text: 'De ' },
      { type: 'gap', id: 'gap-1', answer: 'oppervlakte' },
      { type: 'text', text: ' is ' },
      { type: 'gap', id: 'gap-2', answer: 'cm2' },
      { type: 'text', text: '.' }
    ]
  );
});

test('buildFillBlankTextFromSegments keeps legacy text available', () => {
  assert.equal(
    buildFillBlankTextFromSegments([
      { type: 'text', text: 'De ' },
      { type: 'gap', id: 'gap-1', answer: 'oppervlakte' },
      { type: 'text', text: ' is bekend.' }
    ]),
    'De [GAP] is bekend.'
  );
});

test('isSmartFillBlankAnswerCorrect allows small spelling mistakes', () => {
  assert.equal(isSmartFillBlankAnswerCorrect('opervlakte', 'oppervlakte'), true);
  assert.equal(isSmartFillBlankAnswerCorrect('oppervlak', 'oppervlakte'), false);
});

test('isSmartFillBlankAnswerCorrect accepts common square centimeter variants', () => {
  assert.equal(isSmartFillBlankAnswerCorrect('vierkantecen t i meter', 'cm2'), true);
  assert.equal(isSmartFillBlankAnswerCorrect('vierkante centimeter', 'cm²'), true);
  assert.equal(isSmartFillBlankAnswerCorrect('cm^2', 'vierkante centimeter'), true);
});
