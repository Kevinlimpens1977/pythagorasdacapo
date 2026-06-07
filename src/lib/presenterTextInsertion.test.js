import test from 'node:test';
import assert from 'node:assert/strict';
import { insertTextAtSelection } from './presenterTextInsertion.js';

test('insertTextAtSelection inserts a symbol at a collapsed cursor offset', () => {
  assert.deepEqual(
    insertTextAtSelection('a = c', '√', { start: 4, end: 4 }),
    { text: 'a = √c', caretOffset: 5 }
  );
});

test('insertTextAtSelection replaces a selected text range', () => {
  assert.deepEqual(
    insertTextAtSelection('hoek 90 graden', '°', { start: 7, end: 16 }),
    { text: 'hoek 90°', caretOffset: 8 }
  );
});

test('insertTextAtSelection clamps offsets to the text length', () => {
  assert.deepEqual(
    insertTextAtSelection('π', '²', { start: 99, end: 99 }),
    { text: 'π²', caretOffset: 2 }
  );
});

test('insertTextAtSelection appends when selection is missing', () => {
  assert.deepEqual(
    insertTextAtSelection('x', '≈', null),
    { text: 'x≈', caretOffset: 2 }
  );
});
