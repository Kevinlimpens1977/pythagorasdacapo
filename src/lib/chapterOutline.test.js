import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildChapterOutline,
  buildChapterOutlines,
  buildLessonPath,
  buildParagraphNumber,
  classifyParagraph,
  getShowAllLabel,
  getStartLabel,
  getVisibleParagraphRows,
  shouldOfferShowAll,
  stripChapterTitlePrefix,
  stripParagraphTitlePrefix
} from './chapterOutline.js';

const hoofdstuk = {
  id: 'hoofdstuk-dv-h1',
  number: 1,
  title: 'H1: Starten en Account & Veilig',
  description: 'Hoofdstuk 1 van Digitale vaardigheden.',
  badge: 'Account Starter'
};

const makeParagraaf = (id, order, title, blocks = [], extra = {}) => ({
  id,
  order,
  title,
  hoofdstukId: 'hoofdstuk-dv-h1',
  contentBlocks: blocks,
  ...extra
});

const paragrafen = [
  makeParagraaf('p-intro', 1, 'Introductie: wat je in dit hoofdstuk doet', [
    { id: 'p-intro-b1', type: 'theory', title: 'Welkom' }
  ]),
  makeParagraaf('p-voorkennis', 2, 'Voorkennis: wat weet je al?', [
    { id: 'p-voor-b1', type: 'quiz', title: 'Instapcheck' }
  ]),
  makeParagraaf(
    'p-1',
    3,
    'Mijn digitale schooltas',
    [
      { id: 'p1-b1', type: 'theory', title: 'Je schoolaccount' },
      { id: 'p1-b2', type: 'question', title: 'Korte check' },
      { id: 'p1-b3', type: 'quiz', title: 'Afsluitquiz' }
    ],
    { code: '1.1', learningGoals: ['Je weet wat een schoolaccount is.', 'Je slaat werk op in OneDrive.'], estimatedMinutes: 12 }
  ),
  makeParagraaf('p-2', 4, 'Veilig wachtwoord', [{ id: 'p2-b1', type: 'theory', title: 'Sterke wachtwoorden' }], { code: '1.2' }),
  makeParagraaf('p-3', 5, 'Checkpoint', [{ id: 'p3-b1', type: 'toets', title: 'Hoofdstuktoets' }], { code: '1.3' })
];

const voortgangMap = {
  'p-1': [
    { blockId: 'p1-b1', completed: true },
    { blockId: 'p1-b2', completed: false }
  ]
};

test('titels verliezen hun dubbele nummering', () => {
  assert.equal(stripChapterTitlePrefix('H1: Starten en Account & Veilig'), 'Starten en Account & Veilig');
  assert.equal(stripChapterTitlePrefix('Hoofdstuk 2 - Microsoft tools'), 'Microsoft tools');
  assert.equal(stripChapterTitlePrefix('Starten zonder prefix'), 'Starten zonder prefix');
  assert.equal(stripParagraphTitlePrefix('1.1 Mijn digitale schooltas', '1.1'), 'Mijn digitale schooltas');
  assert.equal(stripParagraphTitlePrefix('1.1. Mijn digitale schooltas'), 'Mijn digitale schooltas');
  assert.equal(stripParagraphTitlePrefix('Mijn digitale schooltas'), 'Mijn digitale schooltas');
});

test('classifyParagraph herkent introductie en voorkennis', () => {
  assert.equal(classifyParagraph({ title: 'Introductie: wat je gaat doen' }), 'introductie');
  assert.equal(classifyParagraph({ title: 'Voorkennis: wat weet je al?' }), 'voorkennis');
  assert.equal(classifyParagraph({ title: 'Mijn digitale schooltas', code: '1.1' }), 'paragraaf');
  assert.equal(classifyParagraph({ title: 'Van alles', section: 'voorkennis' }), 'voorkennis');
});

test('paragraafnummers komen uit de code, anders uit hoofdstuk en positie', () => {
  assert.equal(buildParagraphNumber({ code: '1.4' }), '1.4');
  assert.equal(buildParagraphNumber({ chapterNumber: 2, position: 2 }), '2.3');
  assert.equal(buildParagraphNumber({ position: 0 }), '1');
});

test('buildChapterOutline zet de ruggengraat van het hoofdstuk klaar', () => {
  const outline = buildChapterOutline({ hoofdstuk, paragrafen, voortgangMap });

  assert.equal(outline.anchorId, 'hoofdstuk-hoofdstuk-dv-h1');
  assert.equal(outline.title, 'Starten en Account & Veilig');
  assert.equal(outline.introRow.id, 'p-intro');
  assert.equal(outline.voorkennisRows.map((row) => row.id).join(), 'p-voorkennis');
  assert.deepEqual(outline.paragraphRows.map((row) => row.number), ['1.1', '1.2', '1.3']);
  assert.equal(outline.paragraphRows[0].title, 'Mijn digitale schooltas');
  assert.deepEqual(outline.paragraphRows[0].learningGoals, [
    'Je weet wat een schoolaccount is.',
    'Je slaat werk op in OneDrive.'
  ]);
  assert.deepEqual(outline.paragraphRows[0].onderdelen.map((onderdeel) => onderdeel.typeLabel), [
    'Theorie',
    'Vraag',
    'Quiz'
  ]);
  assert.equal(outline.paragraphRows[0].onderdelen[0].isDone, true);
  assert.equal(outline.paragraphRows[0].resumeOnderdeelId, 'p1-b2');
  assert.equal(outline.paragraphRows[0].progress.done, 1);
  assert.equal(outline.paragraphRows[0].progress.total, 3);
});

test('oefentoetsen en toetsen komen uit de echte blokken van het hoofdstuk', () => {
  const outline = buildChapterOutline({ hoofdstuk, paragrafen, voortgangMap });

  assert.deepEqual(outline.oefentoetsRows.map((row) => row.id), ['p-voor-b1', 'p1-b3']);
  assert.equal(outline.oefentoetsRows[1].paragraafNumber, '1.1');
  assert.deepEqual(outline.toetsRows.map((row) => row.id), ['p3-b1']);
});

test('rijen zonder inhoud blijven weg', () => {
  const outline = buildChapterOutline({
    hoofdstuk: { id: 'h9', number: 9, title: 'Kaal hoofdstuk' },
    paragrafen: [makeParagraaf('p-9-1', 1, 'Alleen theorie', [{ id: 'b1', type: 'theory', title: 'Tekst' }], { code: '9.1' })]
  });

  assert.equal(outline.introRow, null);
  assert.deepEqual(outline.voorkennisRows, []);
  assert.deepEqual(outline.oefentoetsRows, []);
  assert.deepEqual(outline.toetsRows, []);
  assert.equal(outline.paragraphRows.length, 1);
});

test('zonder introductieparagraaf vult de hoofdstukbeschrijving de introductierij', () => {
  const outline = buildChapterOutline({
    hoofdstuk,
    paragrafen: [paragrafen[2]]
  });

  assert.equal(outline.introRow.kind, 'chapterIntro');
  assert.equal(outline.introRow.description, 'Hoofdstuk 1 van Digitale vaardigheden.');
});

test('buildChapterOutlines groepeert en sorteert op hoofdstuknummer', () => {
  const outlines = buildChapterOutlines({
    hoofdstukken: {
      'hoofdstuk-dv-h1': hoofdstuk,
      'hoofdstuk-dv-h2': { id: 'hoofdstuk-dv-h2', number: 2, title: 'H2: Microsoft tools' }
    },
    paragrafen: [
      makeParagraaf('p-2-1', 1, 'Word', [], { code: '2.1', hoofdstukId: 'hoofdstuk-dv-h2' }),
      ...paragrafen
    ].map((paragraaf) => (paragraaf.code === '2.1' ? { ...paragraaf, hoofdstukId: 'hoofdstuk-dv-h2' } : paragraaf)),
    voortgangMap
  });

  assert.deepEqual(outlines.map((outline) => outline.number), [1, 2]);
  assert.equal(outlines[1].title, 'Microsoft tools');
});

test('"Toon alles" verschijnt pas als er meer paragrafen zijn dan de voorvertoning', () => {
  const rows = [1, 2, 3, 4, 5].map((value) => ({ id: `row-${value}` }));

  assert.equal(shouldOfferShowAll(rows), true);
  assert.equal(shouldOfferShowAll(rows.slice(0, 3)), false);
  assert.equal(getVisibleParagraphRows(rows).length, 3);
  assert.equal(getVisibleParagraphRows(rows, true).length, 5);
  assert.equal(getShowAllLabel(rows), 'Toon alles (5)');
  assert.equal(getShowAllLabel(rows, true), 'Toon minder');
});

test('startknop vertelt of je begint of verdergaat', () => {
  assert.equal(getStartLabel({ progress: { total: 0, done: 0, isCompleted: false } }), 'Openen');
  assert.equal(getStartLabel({ progress: { total: 3, done: 0, isCompleted: false } }), 'Start');
  assert.equal(getStartLabel({ progress: { total: 3, done: 1, isCompleted: false } }), 'Ga verder');
  assert.equal(getStartLabel({ progress: { total: 3, done: 3, isCompleted: true } }), 'Opnieuw bekijken');
});

test('buildLessonPath verwijst naar de paragraaf of rechtstreeks naar een onderdeel', () => {
  assert.equal(buildLessonPath('paragraaf-dv-1-1'), '/chapter/paragraaf-dv-1-1');
  assert.equal(buildLessonPath('paragraaf-dv-1-1', 'blok 3'), '/chapter/paragraaf-dv-1-1?stap=blok%203');
  assert.equal(buildLessonPath(''), '/');
});
