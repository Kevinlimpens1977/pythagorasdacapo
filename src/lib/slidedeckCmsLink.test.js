import test from 'node:test';
import assert from 'node:assert/strict';

import { buildSlidedeckCreatorUrl } from './slidedeckCmsLink.js';

test('buildSlidedeckCreatorUrl links a CMS paragraph to the Slidedeckcreator', () => {
  assert.equal(
    buildSlidedeckCreatorUrl({ paragraafId: 'paragraaf 7.3' }),
    '/admin/slidedecks?paragraafId=paragraaf+7.3'
  );
});

test('buildSlidedeckCreatorUrl falls back to the Slidedeckcreator without query data', () => {
  assert.equal(buildSlidedeckCreatorUrl({ paragraafId: '' }), '/admin/slidedecks');
});
