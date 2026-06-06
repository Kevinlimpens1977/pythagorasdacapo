import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildContentBlockDraftSnapshot,
  hasContentBlockDraftChanges
} from './contentBlockDraftState.js';

test('buildContentBlockDraftSnapshot keeps editable block fields only', () => {
  const snapshot = buildContentBlockDraftSnapshot({
    title: 'Uitleg',
    status: 'ready',
    content: { html: '<p>Les</p>' },
    settings: { allowAiHelp: true },
    linkedVraagId: 'vraag-1',
    updatedAt: 'server-field'
  });

  assert.deepEqual(snapshot, {
    title: 'Uitleg',
    status: 'ready',
    content: { html: '<p>Les</p>' },
    settings: { allowAiHelp: true },
    linkedVraagId: 'vraag-1'
  });
});

test('hasContentBlockDraftChanges detects changed title, status, content, settings and linked question', () => {
  const initial = {
    title: 'Uitleg',
    status: 'draft',
    content: { html: '<p>Start</p>' },
    settings: { allowAiHelp: false },
    linkedVraagId: ''
  };

  assert.equal(hasContentBlockDraftChanges(initial, { ...initial }), false);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, title: 'Nieuwe titel' }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, status: 'ready' }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, content: { html: '<p>Anders</p>' } }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, settings: { allowAiHelp: true } }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, linkedVraagId: 'vraag-1' }), true);
});

test('hasContentBlockDraftChanges is stable for object key order', () => {
  assert.equal(
    hasContentBlockDraftChanges(
      { content: { a: 1, b: 2 }, settings: { y: false, x: true } },
      { settings: { x: true, y: false }, content: { b: 2, a: 1 } }
    ),
    false
  );
});
