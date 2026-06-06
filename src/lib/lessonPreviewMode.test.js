import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getLessonPreviewMode,
  shouldIncludeDraftBlocksForPreview
} from './lessonPreviewMode.js';

test('getLessonPreviewMode normalizes supported preview modes', () => {
  assert.equal(getLessonPreviewMode('draft'), 'draft');
  assert.equal(getLessonPreviewMode('published'), 'published');
  assert.equal(getLessonPreviewMode('iets-anders'), 'published');
  assert.equal(getLessonPreviewMode(''), 'published');
});

test('shouldIncludeDraftBlocksForPreview only allows draft preview for admins', () => {
  assert.equal(shouldIncludeDraftBlocksForPreview({ isAdmin: true, previewMode: 'draft' }), true);
  assert.equal(shouldIncludeDraftBlocksForPreview({ isAdmin: true, previewMode: 'published' }), false);
  assert.equal(shouldIncludeDraftBlocksForPreview({ isAdmin: false, previewMode: 'draft' }), false);
});
