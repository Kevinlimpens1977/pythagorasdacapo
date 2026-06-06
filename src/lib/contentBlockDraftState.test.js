import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildContentBlockDraftSnapshot,
  buildStoredContentBlockDraft,
  getContentBlockDraftStorageKey,
  hasContentBlockDraftChanges,
  parseStoredContentBlockDraft,
  shouldRecoverStoredContentBlockDraft,
  shouldCloseContentBlockDraft
} from './contentBlockDraftState.js';

test('buildContentBlockDraftSnapshot keeps editable block fields only', () => {
  const snapshot = buildContentBlockDraftSnapshot({
    title: 'Uitleg',
    status: 'ready',
    content: { html: '<p>Les</p>' },
    settings: { allowAiHelp: true },
    linkedVraagId: 'vraag-1',
    publicationOverride: { enabled: true, reason: 'Live voor demonstratie.' },
    updatedAt: 'server-field'
  });

  assert.deepEqual(snapshot, {
    title: 'Uitleg',
    status: 'ready',
    content: { html: '<p>Les</p>' },
    settings: { allowAiHelp: true },
    linkedVraagId: 'vraag-1',
    publicationOverride: { enabled: true, reason: 'Live voor demonstratie.' }
  });
});

test('hasContentBlockDraftChanges detects changed title, status, content, settings, linked question and override', () => {
  const initial = {
    title: 'Uitleg',
    status: 'draft',
    content: { html: '<p>Start</p>' },
    settings: { allowAiHelp: false },
    linkedVraagId: '',
    publicationOverride: { enabled: false, reason: '' }
  };

  assert.equal(hasContentBlockDraftChanges(initial, { ...initial }), false);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, title: 'Nieuwe titel' }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, status: 'ready' }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, content: { html: '<p>Anders</p>' } }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, settings: { allowAiHelp: true } }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, linkedVraagId: 'vraag-1' }), true);
  assert.equal(hasContentBlockDraftChanges(initial, { ...initial, publicationOverride: { enabled: true, reason: 'Live voor demonstratie.' } }), true);
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

test('shouldCloseContentBlockDraft only asks confirmation when there are unsaved changes', () => {
  let confirmCalls = 0;
  const confirmFn = () => {
    confirmCalls += 1;
    return false;
  };

  assert.equal(shouldCloseContentBlockDraft(false, confirmFn), true);
  assert.equal(confirmCalls, 0);
  assert.equal(shouldCloseContentBlockDraft(true, confirmFn), false);
  assert.equal(confirmCalls, 1);
  assert.equal(shouldCloseContentBlockDraft(true, () => true), true);
});

test('content block draft storage keys are scoped per block', () => {
  assert.equal(
    getContentBlockDraftStorageKey('block-1'),
    'helix:content-block-draft:block-1'
  );
  assert.equal(getContentBlockDraftStorageKey(''), '');
});

test('stored content block drafts parse only for the expected block', () => {
  const snapshot = buildContentBlockDraftSnapshot({
    title: 'Lokale versie',
    status: 'draft',
    content: { html: '<p>Werk</p>' },
    settings: { allowAiHelp: true },
    linkedVraagId: 'vraag-1'
  });
  const stored = buildStoredContentBlockDraft({
    blockId: 'block-1',
    snapshot,
    savedAt: 1710000000000
  });

  assert.deepEqual(parseStoredContentBlockDraft(JSON.stringify(stored), 'block-1'), stored);
  assert.equal(parseStoredContentBlockDraft(JSON.stringify(stored), 'block-2'), null);
  assert.equal(parseStoredContentBlockDraft('geen json', 'block-1'), null);
});

test('shouldRecoverStoredContentBlockDraft detects a meaningful local draft', () => {
  const initial = buildContentBlockDraftSnapshot({
    title: 'Server',
    content: { html: '<p>Server</p>' }
  });
  const sameStored = buildStoredContentBlockDraft({
    blockId: 'block-1',
    snapshot: initial,
    savedAt: 1710000000000
  });
  const changedStored = buildStoredContentBlockDraft({
    blockId: 'block-1',
    snapshot: { ...initial, title: 'Lokaal' },
    savedAt: 1710000000001
  });

  assert.equal(shouldRecoverStoredContentBlockDraft(initial, null), false);
  assert.equal(shouldRecoverStoredContentBlockDraft(initial, sameStored), false);
  assert.equal(shouldRecoverStoredContentBlockDraft(initial, changedStored), true);
});
