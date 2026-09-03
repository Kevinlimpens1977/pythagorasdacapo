import test from 'node:test';
import assert from 'node:assert/strict';
import {
  blockToSlide,
  buildContentBlockPreview,
  buildContentBlocksFromQuerySnapshot,
  buildContentBlockFromSnapshot,
  getDefaultContentForBlockType,
  getReorderedBlocks,
  getReorderedBlocksByIndex,
  getToggledContentBlockStatus,
  formatQuestionLabel,
  mergeCropResultsIntoBlockContent,
  normalizeContentBlockSettings,
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

test('normalizeContentBlockSettings enables Digidocent by default for answer practice blocks and preserves explicit toolbox choice', () => {
  assert.deepEqual(normalizeContentBlockSettings(undefined, 'question'), {
    allowAiHelp: true,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlockSettings(undefined, 'quiz'), {
    allowAiHelp: true,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlockSettings({ allowMathToolbox: true, allowCalculator: true }, 'quiz'), {
    allowAiHelp: true,
    allowMathToolbox: true,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlockSettings(undefined, 'toets'), {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlockSettings({}, 'slidedeck'), {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });

  assert.deepEqual(normalizeContentBlockSettings({ allowAiHelp: false }, 'question'), {
    allowAiHelp: false,
    allowMathToolbox: false,
    differentiationLevel: 'basis',
    scaffoldingRole: 'zelf_proberen'
  });
});

test('normalizeContentBlockSettings keeps supported differentiation levels', () => {
  assert.equal(normalizeContentBlockSettings({ differentiationLevel: 'steun' }, 'theory').differentiationLevel, 'steun');
  assert.equal(normalizeContentBlockSettings({ differentiationLevel: 'plus' }, 'summary').differentiationLevel, 'plus');
  assert.equal(normalizeContentBlockSettings({ differentiationLevel: 'anders' }, 'media').differentiationLevel, 'basis');
});

test('normalizeContentBlockSettings keeps supported scaffolding roles per block', () => {
  assert.equal(normalizeContentBlockSettings({ scaffoldingRole: 'ik_doe_voor' }, 'theory').scaffoldingRole, 'ik_doe_voor');
  assert.equal(normalizeContentBlockSettings({ learningPhase: 'samen_oefenen' }, 'example').scaffoldingRole, 'samen_oefenen');
  assert.equal(normalizeContentBlockSettings({ blockRole: 'bewijs_leveren' }, 'question').scaffoldingRole, 'bewijs_leveren');
  assert.equal(normalizeContentBlockSettings({ scaffoldingRole: 'anders' }, 'summary').scaffoldingRole, 'zelf_proberen');
});

test('normalizeContentBlocks treats existing question blocks without settings as Digidocent-enabled', () => {
  const [question, media] = normalizeContentBlocks([
    { id: 'question-1', order: 1, type: 'question' },
    { id: 'media-1', order: 2, type: 'media' }
  ]);

  assert.equal(question.settings.allowAiHelp, true);
  assert.equal(media.settings.allowAiHelp, false);
  assert.equal(question.settings.differentiationLevel, 'basis');
  assert.equal(question.settings.scaffoldingRole, 'zelf_proberen');
});

test('buildContentBlockFromSnapshot keeps Firestore document id when stored data contains an id field', () => {
  const block = buildContentBlockFromSnapshot({
    id: 'firestore-doc-id',
    data: () => ({
      id: 'stale-imported-id',
      title: 'Vraag',
      type: 'question'
    })
  });

  assert.equal(block.id, 'firestore-doc-id');
  assert.equal(block.sourceDataId, 'stale-imported-id');
});

test('buildContentBlocksFromQuerySnapshot keeps unique Firestore ids when stored ids are duplicated', () => {
  const blocks = buildContentBlocksFromQuerySnapshot({
    docs: [
      {
        id: 'firestore-doc-a',
        data: () => ({
          id: 'block_question_missing',
          type: 'question',
          order: 1
        })
      },
      {
        id: 'firestore-doc-b',
        data: () => ({
          id: 'block_question_missing',
          type: 'question',
          order: 2
        })
      }
    ]
  });

  assert.deepEqual(blocks.map((block) => block.id), ['firestore-doc-a', 'firestore-doc-b']);
  assert.deepEqual(blocks.map((block) => block.sourceDataId), ['block_question_missing', 'block_question_missing']);
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

test('getReorderedBlocksByIndex moves dragged blocks directly to a target index', () => {
  const blocks = [
    { id: 'a', order: 10 },
    { id: 'b', order: 20 },
    { id: 'c', order: 30 },
    { id: 'd', order: 40 }
  ];

  const reordered = getReorderedBlocksByIndex(blocks, 'd', 1);

  assert.deepEqual(
    reordered.map((block) => ({ id: block.id, order: block.order })),
    [
      { id: 'a', order: 1 },
      { id: 'd', order: 2 },
      { id: 'b', order: 3 },
      { id: 'c', order: 4 }
    ]
  );
});

test('getReorderedBlocksByIndex is a no-op for missing ids and clamps target bounds', () => {
  const blocks = [
    { id: 'a', order: 1 },
    { id: 'b', order: 2 },
    { id: 'c', order: 3 }
  ];

  assert.deepEqual(
    getReorderedBlocksByIndex(blocks, 'missing', 0).map((block) => block.id),
    ['a', 'b', 'c']
  );

  assert.deepEqual(
    getReorderedBlocksByIndex(blocks, 'a', 99).map((block) => ({ id: block.id, order: block.order })),
    [
      { id: 'b', order: 1 },
      { id: 'c', order: 2 },
      { id: 'a', order: 3 }
    ]
  );
});

test('formatQuestionLabel suppresses duplicate default question titles', () => {
  assert.equal(formatQuestionLabel({ number: 6, title: 'Vraag 6' }), 'Vraag 6');
  assert.equal(formatQuestionLabel({ number: '6', title: 'Wat betekent DV?' }), 'Vraag 6 - Wat betekent DV?');
  assert.equal(formatQuestionLabel({ title: 'Controleer begrip' }), 'Controleer begrip');
  assert.equal(formatQuestionLabel(null), 'Vraag');
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
  assert.equal(blockToSlide({ id: 'quiz-1', type: 'quiz', content: { items: [{ id: 'q1' }] } }).type, 'quiz');
  assert.equal(blockToSlide({ id: 'toets-1', type: 'toets', content: { items: [{ id: 't1' }] } }).type, 'toets');
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
    mediaKind: 'image',
    mediaUrl: '',
    storagePath: '',
    fileName: '',
    contentType: '',
    size: 0,
    caption: '',
    altText: '',
    thumbnailUrl: '',
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('game'), {
    html: '',
    gameId: '',
    settings: {},
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('quiz'), {
    html: '',
    assessmentType: 'quiz',
    items: [],
    attemptPolicy: {
      maxAttempts: null,
      scoring: 'best',
      allowTeacherReset: true
    },
    tokenConfig: {
      enabled: true,
      totalTokens: 15
    },
    retryPolicy: {
      enabled: true,
      aiHelp: true
    },
    sourceBasis: [],
    sourceNotes: '',
    crops: []
  });

  assert.deepEqual(getDefaultContentForBlockType('toets'), {
    html: '',
    assessmentType: 'toets',
    items: [],
    attemptPolicy: {
      maxAttempts: 2,
      scoring: 'best',
      allowTeacherReset: true
    },
    tokenConfig: {
      enabled: true,
      totalTokens: 25
    },
    retryPolicy: {
      enabled: true,
      aiHelp: true
    },
    sourceBasis: [],
    sourceNotes: '',
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
      mediaKind: 'image',
      mediaUrl: 'https://example.test/crop.jpg',
      storagePath: '',
      contentType: 'image/jpeg',
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

  assert.equal(
    buildContentBlockPreview({
      type: 'quiz',
      content: { items: [{ id: 'q1' }, { id: 'q2' }], tokenConfig: { totalTokens: 15 } }
    }),
    '2 items · 15 tokens'
  );

  assert.equal(
    buildContentBlockPreview({
      type: 'media',
      content: { mediaKind: 'youtube', mediaUrl: 'https://youtu.be/demo' }
    }),
    'YouTube toegevoegd'
  );
  assert.equal(
    buildContentBlockPreview({
      type: 'media',
      content: { videoUrl: 'https://example.test/uitleg.mp4', contentType: 'video/mp4' }
    }),
    'Video toegevoegd'
  );
});

test('getToggledContentBlockStatus cycles route statuses through ready before published', () => {
  assert.equal(getToggledContentBlockStatus('published'), 'draft');
  assert.equal(getToggledContentBlockStatus('ready'), 'published');
  assert.equal(getToggledContentBlockStatus('needs_review'), 'ready');
  assert.equal(getToggledContentBlockStatus('draft'), 'ready');
  assert.equal(getToggledContentBlockStatus(undefined), 'ready');
});
