import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateCalculatorExpression } from './calculatorEvaluator.js';

test('evaluates common student calculator expressions', () => {
  assert.equal(evaluateCalculatorExpression('42:70x100'), 60);
  assert.equal(evaluateCalculatorExpression('sqrt(49)'), 7);
  assert.equal(evaluateCalculatorExpression('6^2'), 36);
  assert.equal(evaluateCalculatorExpression('-(3+2)'), -5);
  assert.equal(evaluateCalculatorExpression('1,5 + 2,25'), 3.75);
});

test('evaluateCalculatorExpression evaluates compact square root notation', () => {
  assert.equal(evaluateCalculatorExpression('√100'), 10);
  assert.equal(evaluateCalculatorExpression('√100+5'), 15);
});

test('evaluateCalculatorExpression evaluates square roots with parentheses', () => {
  assert.equal(evaluateCalculatorExpression('√(25+75)'), 10);
  assert.equal(evaluateCalculatorExpression('sqrt(25+75)'), 10);
});

test('evaluateCalculatorExpression accepts Dutch root text input', () => {
  assert.equal(evaluateCalculatorExpression('wortel 100'), 10);
  assert.equal(evaluateCalculatorExpression('wortel(81)'), 9);
});

test('rejects unsafe or invalid calculator expressions', () => {
  assert.throws(() => evaluateCalculatorExpression('alert(1)'), /Ongeldige berekening/);
  assert.throws(() => evaluateCalculatorExpression('4/0'), /Delen door nul/);
  assert.throws(() => evaluateCalculatorExpression('sqrt(-1)'), /Wortel van negatief getal/);
  assert.throws(() => evaluateCalculatorExpression(''), /Vul eerst/);
});
