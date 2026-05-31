import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldFallbackToUserProgressQuery } from './voortgangQueryUtils.js';

test('shouldFallbackToUserProgressQuery falls back when class-scoped results are empty', () => {
  assert.equal(shouldFallbackToUserProgressQuery({ klasId: 'klas-1', classScopedCount: 0 }), true);
});

test('shouldFallbackToUserProgressQuery does not fall back when class-scoped results exist', () => {
  assert.equal(shouldFallbackToUserProgressQuery({ klasId: 'klas-1', classScopedCount: 3 }), false);
});

test('shouldFallbackToUserProgressQuery uses user-only query when no class id is known', () => {
  assert.equal(shouldFallbackToUserProgressQuery({ klasId: '', classScopedCount: 0 }), true);
});
