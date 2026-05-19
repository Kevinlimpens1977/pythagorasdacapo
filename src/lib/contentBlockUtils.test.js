import test from 'node:test';
import assert from 'node:assert/strict';
import {
  blockToSlide,
  getReorderedBlocks,
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
});
