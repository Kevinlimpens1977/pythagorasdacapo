import test from 'node:test';
import assert from 'node:assert/strict';
import { entryUitHtml, isNieuweVersie } from './appVersie.js';

test('entryUitHtml vindt het gehashte hoofdscript', () => {
  const html = '<script type="module" crossorigin src="/assets/index-COynGsYw.js"></script>';
  assert.equal(entryUitHtml(html), '/assets/index-COynGsYw.js');
  assert.equal(entryUitHtml('<script type="module" src="/src/main.jsx"></script>'), null);
  assert.equal(entryUitHtml(), null);
});

test('isNieuweVersie alleen bij twee bekende, verschillende versies', () => {
  assert.equal(isNieuweVersie('/assets/index-a.js', '/assets/index-b.js'), true);
  assert.equal(isNieuweVersie('/assets/index-a.js', '/assets/index-a.js'), false);
  assert.equal(isNieuweVersie(null, '/assets/index-b.js'), false);
  assert.equal(isNieuweVersie('/assets/index-a.js', null), false);
});
