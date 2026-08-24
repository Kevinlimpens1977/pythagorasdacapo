import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BOARD_KEY_BACKSPACE,
  BOARD_KEY_CLEAR,
  BOARD_KEY_SPACE,
  BOARD_LETTER_ROWS,
  BOARD_NUMERIC_ROWS,
  applyBoardKey,
  applyBoardKeys,
  getBoardKeyLabel,
  shiftBoardKey
} from './presenterBoardKeyboard.js';

test('typing on the board keyboard appends characters', () => {
  assert.equal(applyBoardKeys('', ['c', 'm']), 'cm');
  assert.equal(applyBoardKey('12', ','), '12,');
});

test('backspace, clear and space behave like a real keyboard', () => {
  assert.equal(applyBoardKey('cm2', BOARD_KEY_BACKSPACE), 'cm');
  assert.equal(applyBoardKey('', BOARD_KEY_BACKSPACE), '');
  assert.equal(applyBoardKey('van alles', BOARD_KEY_CLEAR), '');
  assert.equal(applyBoardKey('rechte', BOARD_KEY_SPACE), 'rechte ');
});

test('an undefined value never crashes the keyboard', () => {
  assert.equal(applyBoardKey(undefined, 'a'), 'a');
  assert.equal(applyBoardKey(null, BOARD_KEY_BACKSPACE), '');
});

test('shift only capitalises single characters', () => {
  assert.equal(shiftBoardKey('a', true), 'A');
  assert.equal(shiftBoardKey('a', false), 'a');
  assert.equal(shiftBoardKey(BOARD_KEY_BACKSPACE, true), BOARD_KEY_BACKSPACE);
});

test('action keys have readable Dutch labels', () => {
  assert.equal(getBoardKeyLabel(BOARD_KEY_BACKSPACE), 'Wis');
  assert.equal(getBoardKeyLabel(BOARD_KEY_CLEAR), 'Leeg');
  assert.equal(getBoardKeyLabel('7'), '7');
});

test('the numeric pad carries comma and minus for Dutch answers', () => {
  const keys = BOARD_NUMERIC_ROWS.flat();
  assert.equal(keys.includes(','), true);
  assert.equal(keys.includes('-'), true);
  assert.equal(keys.filter((key) => /^[0-9]$/.test(key)).length, 10);
});

test('the letter rows cover the whole alphabet', () => {
  const letters = new Set(BOARD_LETTER_ROWS.flat().filter((key) => /^[a-z]$/.test(key)));
  assert.equal(letters.size, 26);
});
