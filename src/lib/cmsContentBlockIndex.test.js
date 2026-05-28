import test from 'node:test';
import assert from 'node:assert/strict';
import {
  replaceContentBlocksForParagraaf,
  selectContentBlocksForParagraaf
} from './cmsContentBlockIndex.js';

test('replaceContentBlocksForParagraaf updates one paragraph without dropping sibling counts', () => {
  const currentBlocks = [
    { id: 'p11-a', paragraafId: 'p-1-1' },
    { id: 'p11-b', paragraafId: 'p-1-1' },
    { id: 'p12-old', paragraafId: 'p-1-2' }
  ];
  const nextBlocks = [
    { id: 'p12-a', paragraafId: 'p-1-2' },
    { id: 'p12-b', paragraafId: 'p-1-2' },
    { id: 'p12-c', paragraafId: 'p-1-2' }
  ];

  const updated = replaceContentBlocksForParagraaf(currentBlocks, 'p-1-2', nextBlocks);

  assert.deepEqual(updated.map((block) => block.id), ['p11-a', 'p11-b', 'p12-a', 'p12-b', 'p12-c']);
  assert.equal(selectContentBlocksForParagraaf(updated, 'p-1-1').length, 2);
  assert.equal(selectContentBlocksForParagraaf(updated, 'p-1-2').length, 3);
});
