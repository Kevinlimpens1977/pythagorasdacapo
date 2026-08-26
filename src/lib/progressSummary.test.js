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

test('een vrijwillige plusparagraaf telt niet mee in het percentage van het hoofdstuk', () => {
  const paragrafen = [
    { id: 'para-11', hoofdstukId: 'hoofdstuk-1', number: '1.1', title: 'Paragraaf een', vragen: [{ id: 'v1' }, { id: 'v2' }] },
    {
      id: 'para-plus',
      hoofdstukId: 'hoofdstuk-1',
      number: '1.2',
      title: 'Plus: verdieping',
      optioneel: true,
      verplicht: false,
      vragen: [{ id: 'v3' }, { id: 'v4' }]
    }
  ];

  const hoofdstukkenMap = { 'hoofdstuk-1': { id: 'hoofdstuk-1', number: 1, title: 'Startklaar', order: 1 } };

  const voortgangMap = {
    'para-11': [{ completed: true }, { completed: true }],
    'para-plus': [{ completed: true }]
  };

  const summary = buildStudentProgressSummary(paragrafen, hoofdstukkenMap, voortgangMap);
  const chapter = summary.chapterGroups[0];

  // Twee van de twee verplichte vragen af: het hoofdstuk staat op 100%, ook al
  // is de plusparagraaf half gedaan.
  assert.equal(chapter.totalQuestions, 2);
  assert.equal(chapter.completedQuestions, 2);
  assert.equal(chapter.progressPercent, 100);
  assert.equal(summary.totalQuestions, 2);
  assert.equal(summary.progressPercent, 100);

  // De plusparagraaf staat wel gewoon in de lijst, met zijn eigen voortgang.
  assert.equal(chapter.paragrafen.length, 2);
  assert.equal(chapter.paragrafen[1].optioneel, true);
  assert.equal(chapter.paragrafen[1].verplicht, false);
  assert.equal(chapter.paragrafen[1].completedQuestions, 1);
  assert.equal(chapter.paragrafen[1].progressPercent, 50);
  assert.equal(chapter.paragrafen[0].optioneel, false);
});

test('alle verplichte paragrafen af zonder een enkele plusparagraaf is 100 procent', () => {
  const paragrafen = [
    { id: 'para-11', hoofdstukId: 'hoofdstuk-1', number: '1.1', title: 'Paragraaf een', vragen: [{ id: 'v1' }, { id: 'v2' }] },
    { id: 'para-12', hoofdstukId: 'hoofdstuk-1', number: '1.2', title: 'Paragraaf twee', vragen: [{ id: 'v3' }] },
    {
      id: 'para-plus',
      hoofdstukId: 'hoofdstuk-1',
      number: '1.3',
      title: 'Plus: verdieping',
      optioneel: true,
      verplicht: false,
      vragen: [{ id: 'v4' }, { id: 'v5' }, { id: 'v6' }]
    }
  ];

  const hoofdstukkenMap = { 'hoofdstuk-1': { id: 'hoofdstuk-1', number: 1, title: 'Startklaar', order: 1 } };

  // Deze leerling raakte de plusparagraaf niet aan: er is geen enkel record.
  const voortgangMap = {
    'para-11': [{ completed: true }, { completed: true }],
    'para-12': [{ completed: true }]
  };

  const summary = buildStudentProgressSummary(paragrafen, hoofdstukkenMap, voortgangMap);
  const chapter = summary.chapterGroups[0];

  assert.equal(summary.totalQuestions, 3);
  assert.equal(summary.completedQuestions, 3);
  assert.equal(summary.progressPercent, 100);
  assert.equal(chapter.progressPercent, 100);

  // De plusparagraaf staat er gewoon bij, op nul, zonder de noemer te raken.
  const plus = chapter.paragrafen.find((paragraaf) => paragraaf.id === 'para-plus');
  assert.equal(plus.optioneel, true);
  assert.equal(plus.completedQuestions, 0);
  assert.equal(plus.progressPercent, 0);
});
