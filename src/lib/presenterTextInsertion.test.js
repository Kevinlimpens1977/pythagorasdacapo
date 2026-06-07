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

test('insertTextAtSelection replaces a reversed selected text range', () => {
  assert.deepEqual(
    insertTextAtSelection('abcdef', 'X', { start: 4, end: 2 }),
    { text: 'abXef', caretOffset: 3 }
  );
});

test('insertTextAtSelection appends when either offset is malformed', () => {
  assert.deepEqual(
    insertTextAtSelection('abcdef', 'X', { start: 'bad', end: 2 }),
    { text: 'abcdefX', caretOffset: 7 }
  );

  assert.deepEqual(
    insertTextAtSelection('abcdef', 'X', { start: 2, end: {} }),
    { text: 'abcdefX', caretOffset: 7 }
  );
});

test('insertTextAtSelection treats null, empty string, false, and objects as invalid offsets', () => {
  for (const invalidOffset of [null, '', false, {}]) {
    assert.deepEqual(
      insertTextAtSelection('abc', 'X', { start: invalidOffset, end: 1 }),
      { text: 'abcX', caretOffset: 4 }
    );
  }
});

test('insertTextAtSelection coerces non-string text and insertion values', () => {
  assert.deepEqual(
    insertTextAtSelection(12345, 0, { start: 2, end: 4 }),
    { text: '1205', caretOffset: 3 }
  );
});
