import test from 'node:test';
import assert from 'node:assert/strict';
import {
  blockToSlide,
  buildContentBlockPreview,
  getDefaultContentForBlockType,
  getReorderedBlocks,
  mergeCropResultsIntoBlockContent,
  normalizeContentBlocks
} from './contentBlockUtils.js';

test('normalizeContentBlocks filters archived blocks and sorts by order', () => {
  const blocks = normalizeContentBlocks([
    { id: 'b', order: 2, type: 'summary', isArchived: false },
    { id: 'archived', order: 1, type: 'theory', isArchived: true },
    { id: 'a', order: 1, type: 'theory', isArchived: false }
  ]);

  assert.deepEqual(blocks.map((block) => block.id), ['a', 'b']);
});

test('getReorderedBlocks moves a block up and normalizes order values', () => {
  const blocks = [
    { id: 'a', order: 1 },
    { id: 'b', order: 2 },
    { id: 'c', order: 3 }
  ];

  const reordered = getReorderedBlocks(blocks, 'c', 'up');

  assert.deepEqual(
    reordered.map((block) => ({ id: block.id, order: block.order })),
    [
      { id: 'a', order: 1 },
      { id: 'c', order: 2 },
      { id: 'b', order: 3 }
    ]
  );
});

test('blockToSlide maps supported content block types to slide types', () => {
  assert.deepEqual(
    blockToSlide({
      id: 'theory-1',
      type: 'theory',
      title: 'Pythagoras',
      content: { html: '<p>a² + b² = c²</p>' }
    }),
    {
      id: 'theory-1',
      blockId: 'theory-1',
      type: 'theory',
      heading: 'Pythagoras',
      content: 'a² + b² = c²'
    }
  );

  assert.equal(blockToSlide({ id: 'example-1', type: 'example' }).type, 'demo_exercise');
  assert.equal(blockToSlide({ id: 'media-1', type: 'media' }).type, 'theory');
  assert.equal(blockToSlide({ id: 'summary-1', type: 'summary' }).type, 'summary');
  assert.equal(blockToSlide({ id: 'game-1', type: 'game', content: { gameId: 'pythagoras-trainer' } }).type, 'game');
  assert.equal(blockToSlide({ id: 'deck-1', type: 'slidedeck', content: { generatedDeckUrl: 'https://example.test/deck.pdf' } }).type, 'slidedeck');
});

test('getDefaultContentForBlockType gives every studio block a stable editable shape', () => {
  assert.deepEqual(getDefaultContentForBlockType('theory'), {
    html: '',
    imageUrl: '',
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('example'), {
    html: '',
    steps: [],
    imageUrl: '',
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('media'), {
    html: '',
    mediaUrl: '',
    caption: '',
    altText: '',
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('game'), {
    html: '',
    gameId: '',
    settings: {},
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('slidedeck'), {
    html: '',
    slidedeckPackageId: '',
    deckTitle: '',
    generatedDeckUrl: '',
    generatedDeckStoragePath: '',
    sourcePdfUrl: '',
    sourcePdfStoragePath: ''
  });
});

test('mergeCropResultsIntoBlockContent routes OCR text and images by block type', () => {
  const cropResults = [
    { type: 'text', text: 'Nieuwe uitleg uit OCR', label: 'A' },
    { type: 'image', downloadURL: 'https://example.test/crop.jpg', label: 'B' }
  ];

  assert.deepEqual(
    mergeCropResultsIntoBlockContent('theory', { html: 'Bestaande uitleg' }, cropResults),
    {
      html: 'Bestaande uitleg\n\nNieuwe uitleg uit OCR',
      imageUrl: 'https://example.test/crop.jpg',
      crops: [
        { type: 'text', text: 'Nieuwe uitleg uit OCR', label: 'A' },
        { type: 'image', downloadURL: 'https://example.test/crop.jpg', label: 'B' }
      ]
    }
  );

  assert.deepEqual(
    mergeCropResultsIntoBlockContent('media', { caption: '', mediaUrl: '' }, cropResults),
    {
      caption: 'Nieuwe uitleg uit OCR',
      mediaUrl: 'https://example.test/crop.jpg',
      crops: [
        { type: 'text', text: 'Nieuwe uitleg uit OCR', label: 'A' },
        { type: 'image', downloadURL: 'https://example.test/crop.jpg', label: 'B' }
      ]
    }
  );
});

test('buildContentBlockPreview shows useful route card text', () => {
  assert.equal(
    buildContentBlockPreview({
      type: 'example',
      content: { html: '<p>Lees de opgave.</p>', steps: ['Stap 1', 'Stap 2'] }
    }),
    'Lees de opgave. 2 stappen'
  );

  assert.equal(
    buildContentBlockPreview({
      type: 'question',
      linkedVraagId: 'vraag-1'
    }),
    'Gekoppelde vraag: vraag-1'
  );

  assert.equal(
    buildContentBlockPreview({
      type: 'slidedeck',
      content: { deckTitle: 'Digitale vaardigheden' }
    }),
    'Digitale vaardigheden'
  );
});
