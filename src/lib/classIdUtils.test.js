import test from 'node:test';
import assert from 'node:assert/strict';
import { getEffectiveKlasId } from './classIdUtils.js';

test('getEffectiveKlasId prefers the auth klasId from the user document', () => {
  assert.equal(
    getEffectiveKlasId({
      authKlasId: 'user-klas',
      userData: { klasId: 'userdata-klas' },
      klasData: { id: 'doc-klas', klasId: 'data-klas' }
    }),
    'user-klas'
  );
});

test('getEffectiveKlasId falls back to userData and class document identifiers', () => {
  assert.equal(getEffectiveKlasId({ userData: { klasId: 'userdata-klas' } }), 'userdata-klas');
  assert.equal(getEffectiveKlasId({ klasData: { klasId: 'data-klas' } }), 'data-klas');
  assert.equal(getEffectiveKlasId({ klasData: { id: 'doc-klas' } }), 'doc-klas');
});

test('getEffectiveKlasId returns an empty string when no class is known', () => {
  assert.equal(getEffectiveKlasId(), '');
  assert.equal(getEffectiveKlasId({ userData: {}, klasData: {} }), '');
});
