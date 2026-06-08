import assert from 'node:assert/strict';
import test from 'node:test';

import {
  appendCalculatorInput,
  formatCalculatorInput,
  normalizeCalculatorKeyboardValue
} from './calculatorInputUtils.js';

test('formatCalculatorInput renders root notation as a square root symbol', () => {
  assert.equal(formatCalculatorInput('sqrt100'), '√100');
  assert.equal(formatCalculatorInput('wortel 100'), '√100');
});

test('appendCalculatorInput replaces empty and invalid display states', () => {
  assert.equal(appendCalculatorInput('0', '√'), '√');
  assert.equal(appendCalculatorInput('Ongeldig', '7'), '7');
  assert.equal(appendCalculatorInput('√', '100'), '√100');
});

test('normalizeCalculatorKeyboardValue accepts classroom operator variants', () => {
  assert.equal(normalizeCalculatorKeyboardValue('wortel 100 × 2 ÷ 4'), '√100 x 2 : 4');
});
