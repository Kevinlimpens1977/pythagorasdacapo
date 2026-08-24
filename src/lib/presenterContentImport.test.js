import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendHelixContentImportToPresenterSession,
  buildPresenterPagesFromHelixContent
} from './presenterContentImport.js';
import { createPresenterSession } from './presenterModel.js';

const paragraaf = {
  id: 'paragraaf-7-3',
  title: '7.3 Stelling van Pythagoras',
  hoofdstukId: 'hoofdstuk-7',
  order: 3
};

const linkedQuestions = [
  {
    id: 'vraag-1',
    number: '1',
    title: 'Bereken de schuine zijde',
    vraagtype: 'numeriek',
    content: {
      text: '<p>Wat is c als a = 3 en b = 4?</p>'
    },
    antwoord: {
      type: 'numeriek',
      expected: 5,
      unit: 'cm'
    },
    vraagMetadata: {
      difficulty: 2,
      hints: ['Gebruik a^2 + b^2 = c^2'],
      tokenConfig: {
        enabled: true,
        totalTokens: 10
      }
    }
  }
];

test('buildPresenterPagesFromHelixContent imports only published blocks as snapshot pages', () => {
  const pages = buildPresenterPagesFromHelixContent({
    paragraaf,
    contentBlocks: [
      {
        id: 'block-draft',
        type: 'theory',
        title: 'Concept',
        status: 'draft',
        order: 1,
        content: { html: '<p>Nog niet tonen</p>' }
      },
      {
        id: 'block-theory',
        type: 'theory',
        title: 'Pythagoras',
        status: 'published',
        order: 2,
        content: { html: '<p>a^2 + b^2 = c^2</p>', imageUrl: 'theory.png' }
      },
      {
        id: 'block-example',
        type: 'example',
        title: 'Voorbeeld',
        status: 'published',
        order: 3,
        content: { html: '<p>3-4-5 driehoek</p>', steps: ['Kwadrateer', 'Tel op'] }
      }
    ],
    linkedQuestions,
    importedAt: '2026-05-29T10:00:00.000Z'
  });

  assert.equal(pages.length, 2);
  assert.deepEqual(pages.map((page) => page.title), ['Pythagoras', 'Voorbeeld']);
  assert.equal(pages[0].source.kind, 'helix-content-block');
  assert.deepEqual(pages[0].source.paragraaf, {
    id: 'paragraaf-7-3',
    title: '7.3 Stelling van Pythagoras',
    hoofdstukId: 'hoofdstuk-7',
    order: 3
  });
  assert.deepEqual(pages[0].source.block, {
    id: 'block-theory',
    type: 'theory',
    title: 'Pythagoras',
    order: 2
  });
  assert.equal(pages[0].objects.length, 1);
  assert.equal(pages[0].objects[0].type, 'lessonBlock');
  assert.equal(pages[0].objects[0].data.kind, 'theory');
  assert.equal(pages[0].objects[0].data.html, '<p>a^2 + b^2 = c^2</p>');
  assert.equal(pages[0].objects[0].data.imageUrl, 'theory.png');
  assert.deepEqual(JSON.parse(JSON.stringify(pages)), pages);
});

test('buildPresenterPagesFromHelixContent creates question windows without token metadata', () => {
  const pages = buildPresenterPagesFromHelixContent({
    paragraaf,
    contentBlocks: [
      {
        id: 'block-question',
        type: 'question',
        title: 'Oefenvraag',
        status: 'published',
        order: 1,
        linkedVraagId: 'vraag-1',
        content: {
          html: '<p>Maak de vraag.</p>',
          exercise: { fields: [{ id: 'legacy', answer: 'wordt vervangen' }] }
        }
      }
    ],
    linkedQuestions
  });

  const object = pages[0].objects[0];

  assert.equal(object.type, 'questionWindow');
  assert.equal(object.data.kind, 'question');
  assert.equal(object.data.question.id, 'vraag-1');
  assert.equal(object.data.question.vraagtype, 'numeriek');
  assert.equal(object.data.question.vraagMetadata.difficulty, 2);
  assert.equal(object.data.question.vraagMetadata.tokenConfig, undefined);
  assert.equal(JSON.stringify(object).includes('totalTokens'), false);
  assert.equal(JSON.stringify(object).includes('tokenConfig'), false);
  assert.equal(object.source.kind, 'helix-content-block');
  assert.equal(object.source.block.id, 'block-question');
  assert.equal(object.source.question.id, 'vraag-1');
});

test('buildPresenterPagesFromHelixContent preserves media and slidedeck object data', () => {
  const pages = buildPresenterPagesFromHelixContent({
    paragraaf,
    contentBlocks: [
      {
        id: 'block-media',
        type: 'media',
        title: 'Video uitleg',
        status: 'published',
        order: 1,
        content: {
          html: '<p>Bekijk dit fragment.</p>',
          mediaKind: 'video',
          mediaUrl: 'https://example.test/video.mp4',
          caption: 'Pythagoras animatie',
          storagePath: 'media/video.mp4'
        }
      },
      {
        id: 'block-deck',
        type: 'slidedeck',
        title: 'Digibord deck',
        status: 'published',
        order: 2,
        content: {
          deckTitle: 'Pythagoras uitleg',
          generatedDeckUrl: 'https://example.test/deck.pdf',
          generatedDeckStoragePath: 'decks/deck.pdf',
          slidedeckPackageId: 'deck-package-1',
          sourcePdfUrl: 'https://example.test/source.pdf'
        }
      }
    ]
  });

  assert.equal(pages[0].objects[0].data.kind, 'media');
  assert.equal(pages[0].objects[0].data.media.mediaKind, 'video');
  assert.equal(pages[0].objects[0].data.media.mediaUrl, 'https://example.test/video.mp4');
  assert.equal(pages[1].objects[0].data.kind, 'slidedeck');
  assert.equal(pages[1].objects[0].data.slidedeck.deckTitle, 'Pythagoras uitleg');
  assert.equal(pages[1].objects[0].data.slidedeck.pdfUrl, 'https://example.test/deck.pdf');
});

test('appendHelixContentImportToPresenterSession appends pages and activates the first imported page', () => {
  const session = createPresenterSession();
  const next = appendHelixContentImportToPresenterSession(session, {
    paragraaf,
    contentBlocks: [
      {
        id: 'block-theory',
        type: 'theory',
        title: 'Nieuwe uitleg',
        status: 'published',
        order: 1,
        content: { html: '<p>Uitleg</p>' }
      }
    ]
  });

  assert.equal(next.pages.length, 2);
  assert.equal(next.pages[0], session.pages[0]);
  assert.equal(next.pages[1].title, 'Nieuwe uitleg');
  assert.equal(next.activePageId, next.pages[1].id);
  assert.equal(next.dirty, true);
  assert.deepEqual(next.selectedObjectIds, []);
});

test('appendHelixContentImportToPresenterSession leaves session unchanged without published blocks', () => {
  const session = createPresenterSession();
  const next = appendHelixContentImportToPresenterSession(session, {
    paragraaf,
    contentBlocks: [
      {
        id: 'block-draft',
        type: 'theory',
        title: 'Concept',
        status: 'draft',
        order: 1,
        content: { html: '<p>Nog niet publiceren</p>' }
      }
    ]
  });

  assert.equal(next, session);
});

test('exercise blocks without a linked question keep their numbered fields on the board', () => {
  const pages = buildPresenterPagesFromHelixContent({
    paragraaf,
    contentBlocks: [
      {
        id: 'block-dv',
        type: 'question',
        title: 'Bestanden ordenen',
        status: 'published',
        order: 1,
        content: {
          html: '<p>Voer de stappen uit.</p>',
          exercise: {
            fields: [
              { id: 'f1', label: 'Noteer de bestandsnaam' },
              { id: 'f2', label: 'Noteer de mapnaam' }
            ]
          }
        }
      }
    ]
  });

  const question = pages[0].objects[0].data.question;

  // Zonder dit werd het vraagtype 'open': alle invulvelden verdwenen achter een
  // enkel tekstvak en de controleknop kleurde elk antwoord rood.
  assert.equal(question.vraagtype, 'exercise');
  assert.equal(question.antwoord.type, 'exercise');
  assert.deepEqual(question.antwoord.fields, [
    { id: 'f1', label: 'Noteer de bestandsnaam' },
    { id: 'f2', label: 'Noteer de mapnaam' }
  ]);
});

test('question blocks without a question document and without exercise fields stay open', () => {
  const pages = buildPresenterPagesFromHelixContent({
    paragraaf,
    contentBlocks: [
      {
        id: 'block-plain',
        type: 'question',
        title: 'Losse vraag',
        status: 'published',
        order: 1,
        content: { html: '<p>Wat denk je?</p>' }
      }
    ]
  });

  assert.equal(pages[0].objects[0].data.question.vraagtype, 'open');
});
