import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPdfPageUrl, createPdfJsLoadOptions } from './pdfPresenterUtils.js';

test('createPdfJsLoadOptions disables range and stream loading for storage URLs', () => {
  const options = createPdfJsLoadOptions('https://firebasestorage.googleapis.com/v0/b/demo/o/deck.pdf?alt=media');

  assert.equal(options.url, 'https://firebasestorage.googleapis.com/v0/b/demo/o/deck.pdf?alt=media');
  assert.equal(options.disableRange, true);
  assert.equal(options.disableStream, true);
  assert.equal(options.disableAutoFetch, true);
  assert.equal(options.withCredentials, false);
});

test('buildPdfPageUrl replaces existing hash and targets a page in native PDF viewer', () => {
  assert.equal(
    buildPdfPageUrl('https://example.test/deck.pdf#page=7', 3),
    'https://example.test/deck.pdf#page=3&toolbar=0&navpanes=0&scrollbar=0'
  );
});

test('buildPdfPageUrl clamps invalid page numbers to page one', () => {
  assert.equal(
    buildPdfPageUrl('https://example.test/deck.pdf', 0),
    'https://example.test/deck.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0'
  );
});
