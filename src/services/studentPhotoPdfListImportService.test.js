import test from 'node:test';
import assert from 'node:assert/strict';
import {
  groupPdfWordsIntoLines,
  isLikelyPdfStudentName,
  mergeWrappedPdfNameSegments,
  splitPdfLineIntoNameSegments
} from '../lib/studentPhotoPdfListUtils.js';

test('PDF photo list helpers split wide line into student name segments', () => {
  const line = {
    y: 100,
    words: [
      { text: 'Monaco', x: 10, y: 100, width: 30, height: 10, right: 40, bottom: 110 },
      { text: 'Cempel', x: 43, y: 100, width: 32, height: 10, right: 75, bottom: 110 },
      { text: 'Jaäresja', x: 130, y: 100, width: 38, height: 10, right: 168, bottom: 110 },
      { text: 'Corver', x: 171, y: 100, width: 32, height: 10, right: 203, bottom: 110 }
    ]
  };

  const segments = splitPdfLineIntoNameSegments(line, 25);
  assert.deepEqual(segments.map((segment) => segment.text), ['Monaco Cempel', 'Jaäresja Corver']);
});

test('PDF photo list helpers merge wrapped surname below first name', () => {
  const merged = mergeWrappedPdfNameSegments(
    [
      { text: 'Ivana', x: 100, y: 100, width: 30, height: 10, right: 130, bottom: 110 },
      { text: 'Eijkenboom', x: 100, y: 112, width: 56, height: 10, right: 156, bottom: 122 }
    ],
    18
  );

  assert.equal(merged.length, 1);
  assert.equal(merged[0].text, 'Ivana Eijkenboom');
});

test('PDF photo list helpers reject header and footer text as student names', () => {
  assert.equal(isLikelyPdfStudentName({ text: 'Lesgroep Fotolijst' }), false);
  assert.equal(isLikelyPdfStudentName({ text: '29-05-2026' }), false);
  assert.equal(isLikelyPdfStudentName({ text: 'Monaco Cempel' }), true);
});

test('PDF photo list helpers group close words into text lines', () => {
  const lines = groupPdfWordsIntoLines([
    { text: 'A', x: 0, y: 101, width: 8, height: 10, right: 8, bottom: 111 },
    { text: 'B', x: 20, y: 100, width: 8, height: 10, right: 28, bottom: 110 },
    { text: 'C', x: 0, y: 150, width: 8, height: 10, right: 8, bottom: 160 }
  ]);

  assert.equal(lines.length, 2);
  assert.deepEqual(lines[0].words.map((word) => word.text), ['A', 'B']);
});
