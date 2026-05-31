import test from 'node:test';
import assert from 'node:assert/strict';

import {
  addRatioColumn,
  createMathToolWork,
  getMathToolSummary,
  hasFilledMathToolWork,
  normalizeMathToolWork,
  removeRatioColumn,
  resetMathTool,
  updateMathToolValue
} from './mathToolboxUtils.js';

test('creates empty manual worksheets without calculated values', () => {
  const ratio = createMathToolWork('ratioTable', 'tool-1');
  const pythagoras = createMathToolWork('pythagoras', 'tool-2');

  assert.equal(ratio.type, 'ratioTable');
  assert.deepEqual(ratio.topValues, ['', '']);
  assert.deepEqual(ratio.bottomValues, ['', '']);
  assert.deepEqual(ratio.operations, ['']);

  assert.equal(pythagoras.type, 'pythagoras');
  assert.deepEqual(pythagoras.rows.map((row) => row.side), ['', '', '']);
  assert.deepEqual(pythagoras.squareAddition, { top: '', bottom: '', sum: '' });
  assert.deepEqual(pythagoras.conclusion, { lzSquared: '', root: '', length: '' });
});

test('adds and removes ratio columns while keeping arrow operation slots aligned', () => {
  const ratio = createMathToolWork('ratioTable', 'tool-1');
  const withColumn = addRatioColumn(ratio);
  const edited = updateMathToolValue(withColumn, ['operations', 1], 'x 4');
  const reduced = removeRatioColumn(edited, 1);

  assert.equal(withColumn.topValues.length, 3);
  assert.equal(withColumn.bottomValues.length, 3);
  assert.equal(withColumn.operations.length, 2);
  assert.equal(reduced.topValues.length, 2);
  assert.equal(reduced.operations.length, 1);
  assert.equal(reduced.operations[0], 'x 4');
});

test('normalizes and resets worksheets safely', () => {
  const rawTools = [
    {
      id: 'ratio',
      type: 'ratioTable',
      topValues: ['2', '4', '8'],
      bottomValues: ['3'],
      operations: ['x 2']
    },
    {
      id: 'py',
      type: 'pythagoras',
      rows: [{ side: 'RZ AB', length: '6', square: '36' }]
    },
    { id: 'unknown', type: 'calculator' }
  ];

  const normalized = normalizeMathToolWork(rawTools);
  assert.equal(normalized.length, 2);
  assert.deepEqual(normalized[0].bottomValues, ['3', '', '']);
  assert.deepEqual(normalized[0].operations, ['x 2', '']);
  assert.equal(normalized[1].rows.length, 3);

  const reset = resetMathTool(normalized[1]);
  assert.deepEqual(reset.rows.map((row) => row.length), ['', '', '']);
});

test('summarizes filled worksheets for tutor and teacher context', () => {
  const ratio = updateMathToolValue(createMathToolWork('ratioTable', 'ratio'), ['topValues', 0], '70');
  const pythagoras = updateMathToolValue(createMathToolWork('pythagoras', 'py'), ['rows', 0, 'square'], '36');

  assert.match(getMathToolSummary([ratio, pythagoras]), /Verhoudingstabel/);
  assert.match(getMathToolSummary([ratio, pythagoras]), /Pythagoras schema/);
  assert.match(getMathToolSummary([]), /Geen wiskunde-uitwerkingen/);
});

test('detects whether a worksheet contains student input', () => {
  const empty = createMathToolWork('ratioTable', 'ratio');
  const filled = updateMathToolValue(empty, ['bottomValues', 1], '60%');

  assert.equal(hasFilledMathToolWork([empty]), false);
  assert.equal(hasFilledMathToolWork([filled]), true);
});
