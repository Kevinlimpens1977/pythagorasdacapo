import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudentProgressSummary } from './progressSummary.js';

test('buildStudentProgressSummary groups paragraphs by chapter and totals completed questions', () => {
  const paragrafen = [
    {
      id: 'para-73',
      hoofdstukId: 'hoofdstuk-7',
      number: '7.3',
      title: 'Langste zijde berekenen',
      vragen: [{ id: 'vraag-1' }, { id: 'vraag-2' }]
    },
    {
      id: 'para-74',
      hoofdstukId: 'hoofdstuk-7',
      number: '7.4',
      title: 'Rechthoekszijden berekenen',
      vragen: [{ id: 'vraag-3' }]
    }
  ];

  const hoofdstukkenMap = {
    'hoofdstuk-7': {
      id: 'hoofdstuk-7',
      number: 7,
      title: 'Pythagoras',
      order: 1
    }
  };

  const voortgangMap = {
    'para-73': [
      { vraagId: 'vraag-1', completed: true },
      { vraagId: 'vraag-2', completed: false }
    ],
    'para-74': [
      { vraagId: 'vraag-3', completed: true }
    ]
  };

  const summary = buildStudentProgressSummary(paragrafen, hoofdstukkenMap, voortgangMap);

  assert.equal(summary.totalQuestions, 3);
  assert.equal(summary.completedQuestions, 2);
  assert.equal(summary.progressPercent, 67);
  assert.equal(summary.chapterGroups.length, 1);
  assert.equal(summary.chapterGroups[0].completedQuestions, 2);
  assert.deepEqual(
    summary.chapterGroups[0].paragrafen.map((paragraaf) => ({
      id: paragraaf.id,
      completedQuestions: paragraaf.completedQuestions,
      totalQuestions: paragraaf.totalQuestions,
      progressPercent: paragraaf.progressPercent
    })),
    [
      { id: 'para-73', completedQuestions: 1, totalQuestions: 2, progressPercent: 50 },
      { id: 'para-74', completedQuestions: 1, totalQuestions: 1, progressPercent: 100 }
    ]
  );
});

test('buildStudentProgressSummary returns zero totals for empty input', () => {
  const summary = buildStudentProgressSummary([], {}, {});

  assert.equal(summary.totalQuestions, 0);
  assert.equal(summary.completedQuestions, 0);
  assert.equal(summary.progressPercent, 0);
  assert.deepEqual(summary.chapterGroups, []);
});
