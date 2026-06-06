import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildContentBlockArchiveUndo,
  shouldShowContentBlockArchiveUndo
} from './contentBlockArchiveUndo.js';

test('buildContentBlockArchiveUndo creates a concise restore notice', () => {
  const undo = buildContentBlockArchiveUndo({ id: 'block-1', title: 'Korte uitleg' });

  assert.deepEqual(undo, {
    blockId: 'block-1',
    title: 'Korte uitleg',
    message: 'Korte uitleg is gearchiveerd.'
  });
  assert.equal(shouldShowContentBlockArchiveUndo(undo), true);
});

test('buildContentBlockArchiveUndo handles missing titles and invalid blocks', () => {
  assert.equal(buildContentBlockArchiveUndo(null), null);
  assert.equal(buildContentBlockArchiveUndo({ id: '' }), null);
  assert.equal(buildContentBlockArchiveUndo({ id: 'block-2' }).message, 'Lesblok is gearchiveerd.');
});
