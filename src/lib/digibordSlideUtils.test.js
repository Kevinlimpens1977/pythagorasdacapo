import test from 'node:test';
import assert from 'node:assert/strict';
import {
  contentBlocksToDigibordSlides,
  extractImageAlt,
  extractImageSource
} from './digibordSlideUtils.js';

test('extractImageSource and extractImageAlt read image markup', () => {
  const html = '<p><img src="https://example.test/crop.png" alt="Een crop"></p>';

  assert.equal(extractImageSource(html), 'https://example.test/crop.png');
  assert.equal(extractImageAlt(html), 'Een crop');
});

test('contentBlocksToDigibordSlides filters drafts by default and keeps route order', () => {
  const slides = contentBlocksToDigibordSlides([
    { id: 'draft', type: 'theory', order: 1, status: 'draft', title: 'Concept', content: { html: '<p>Niet tonen</p>' } },
    { id: 'published', type: 'summary', order: 2, status: 'published', title: 'Samenvatting', content: { html: '<p>Wel tonen</p>' } }
  ]);

  assert.equal(slides.length, 1);
  assert.equal(slides[0].blockId, 'published');
  assert.equal(slides[0].number, 1);
});

test('contentBlocksToDigibordSlides can include drafts for teacher preview', () => {
  const slides = contentBlocksToDigibordSlides([
    { id: 'draft', type: 'theory', order: 1, status: 'draft', title: 'Concept', content: { html: '<p>Testversie</p>' } }
  ], { includeDrafts: true });

  assert.equal(slides.length, 1);
  assert.equal(slides[0].meta.status, 'draft');
});

test('heading structure splits a long theory block into multiple slides', () => {
  const slides = contentBlocksToDigibordSlides([
    {
      id: 'theory-1',
      type: 'theory',
      order: 1,
      status: 'published',
      title: 'Digitale vaardigheden',
      content: {
        html: '<h2>Start</h2><p>Eerste uitleg.</p><h2>Veilig werken</h2><p>Tweede uitleg.</p>'
      }
    }
  ]);

  assert.equal(slides.length, 2);
  assert.equal(slides[0].title, 'Start');
  assert.equal(slides[1].title, 'Veilig werken');
  assert.match(slides[0].html, /Eerste uitleg/);
  assert.match(slides[1].html, /Tweede uitleg/);
});

test('standalone images become image slides', () => {
  const slides = contentBlocksToDigibordSlides([
    {
      id: 'media-1',
      type: 'media',
      order: 1,
      status: 'published',
      title: 'Afbeelding',
      content: { mediaUrl: 'https://example.test/image.jpg', altText: 'Schema' }
    }
  ]);

  assert.equal(slides.length, 1);
  assert.equal(slides[0].variant, 'image');
  assert.equal(slides[0].imageUrl, 'https://example.test/image.jpg');
  assert.equal(slides[0].altText, 'Schema');
});

test('question blocks hide answers until presenter reveals them', () => {
  const slides = contentBlocksToDigibordSlides([
    {
      id: 'question-block',
      type: 'question',
      order: 1,
      status: 'published',
      linkedVraagId: 'vraag-1',
      title: 'Vraag',
      content: {}
    }
  ], {
    linkedQuestions: {
      'vraag-1': {
        title: 'Controlevraag',
        content: { text: '<p>Wat is 3 + 4?</p>' },
        antwoord: { answer: '7' }
      }
    }
  });

  assert.equal(slides.length, 1);
  assert.equal(slides[0].variant, 'question');
  assert.match(slides[0].question.promptHtml, /3 \+ 4/);
  assert.match(slides[0].question.answerHtml, /7/);
});

test('game blocks become presentable game slides', () => {
  const slides = contentBlocksToDigibordSlides([
    {
      id: 'game-block',
      type: 'game',
      order: 1,
      status: 'published',
      title: 'Pythagoras Trainer',
      content: {
        gameId: 'pythagoras-trainer',
        gameTitle: 'Pythagoras Trainer',
        html: '<p>Speel deze trainer na de uitleg.</p>'
      }
    }
  ]);

  assert.equal(slides.length, 1);
  assert.equal(slides[0].variant, 'game');
  assert.equal(slides[0].sourceType, 'game');
  assert.match(slides[0].html, /trainer/);
});

test('slidedeck blocks become presentable PDF slides', () => {
  const slides = contentBlocksToDigibordSlides([
    {
      id: 'deck-block',
      type: 'slidedeck',
      order: 1,
      status: 'published',
      title: 'Digitale vaardigheden',
      content: {
        deckTitle: 'Digitale vaardigheden',
        generatedDeckUrl: 'https://example.test/deck.pdf',
        generatedDeckStoragePath: 'slidedecks/package-1/generated-deck.pdf',
        slidedeckPackageId: 'package-1',
        html: '<p>Bekijk deze presentatie.</p>'
      }
    }
  ]);

  assert.equal(slides.length, 1);
  assert.equal(slides[0].variant, 'slidedeck');
  assert.equal(slides[0].sourceType, 'slidedeck');
  assert.equal(slides[0].imageUrl, 'https://example.test/deck.pdf');
  assert.equal(slides[0].pdfStoragePath, 'slidedecks/package-1/generated-deck.pdf');
  assert.equal(slides[0].slidedeckPackageId, 'package-1');
});
