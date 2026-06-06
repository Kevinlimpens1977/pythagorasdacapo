import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSlidedeckCreatorUrl } from './slidedeckCmsLink.js';

test('buildSlidedeckCreatorUrl links a CMS paragraph to the Slidedeckcreator', () => {
  assert.equal(
    buildSlidedeckCreatorUrl({ paragraafId: 'paragraaf 7.3' }),
    '/admin/slidedecks?paragraafId=paragraaf+7.3'
  );
});

test('buildSlidedeckCreatorUrl can carry the source CMS slidedeck block id', () => {
  assert.equal(
    buildSlidedeckCreatorUrl({ paragraafId: 'paragraaf 7.3', contentBlockId: 'block deck 1' }),
    '/admin/slidedecks?paragraafId=paragraaf+7.3&contentBlockId=block+deck+1'
  );
});

test('buildSlidedeckCreatorUrl falls back to the Slidedeckcreator without query data', () => {
  assert.equal(buildSlidedeckCreatorUrl({ paragraafId: '' }), '/admin/slidedecks');
});
