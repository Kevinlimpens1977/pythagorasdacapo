import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPdfPageUrl,
  createPdfJsDataLoadOptions,
  createPdfJsLoadOptions,
  getPdfLoadErrorMessage,
  withTimeout
} from './pdfPresenterUtils.js';

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

test('createPdfJsDataLoadOptions normalizes ArrayBuffer to Uint8Array', () => {
  const options = createPdfJsDataLoadOptions(new ArrayBuffer(4));

  assert.equal(options.data instanceof Uint8Array, true);
  assert.equal(options.disableRange, true);
  assert.equal(options.disableStream, true);
  assert.equal(options.disableAutoFetch, true);
});

test('buildPdfPageUrl clamps invalid page numbers to page one', () => {
  assert.equal(
    buildPdfPageUrl('https://example.test/deck.pdf', 0),
    'https://example.test/deck.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0'
  );
});

test('withTimeout resolves fast promises', async () => {
  await assert.doesNotReject(async () => {
    assert.equal(await withTimeout(Promise.resolve('ok'), 50, 'Test'), 'ok');
  });
});

test('withTimeout rejects hanging promises', async () => {
  await assert.rejects(
    () => withTimeout(new Promise(() => {}), 5, 'PDF laden'),
    /PDF laden duurde te lang/
  );
});

test('getPdfLoadErrorMessage explains CORS-like failures', () => {
  assert.match(
    getPdfLoadErrorMessage(new Error('Access to XMLHttpRequest has been blocked by CORS policy')),
    /CORS/
  );
});
