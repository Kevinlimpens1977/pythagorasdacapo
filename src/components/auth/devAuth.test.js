import assert from 'node:assert/strict';
import test from 'node:test';

import { shouldClearDevUserForFirebaseUser } from './devAuth.js';

test('keeps the local dev user when Firebase has no authenticated user', () => {
  assert.equal(shouldClearDevUserForFirebaseUser(null), false);
});

test('clears the local dev user when Firebase reports a real authenticated user', () => {
  assert.equal(shouldClearDevUserForFirebaseUser({ uid: 'firebase-user' }), true);
});
