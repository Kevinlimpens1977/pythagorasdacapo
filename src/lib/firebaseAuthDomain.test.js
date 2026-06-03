import assert from 'node:assert/strict';
import test from 'node:test';

import { getFirebaseAuthDomain } from './firebaseAuthDomain.js';

test('uses the current localhost host as authDomain during local development', () => {
  assert.equal(
    getFirebaseAuthDomain({ hostname: 'localhost', host: 'localhost:2222' }),
    'localhost:2222'
  );
});

test('keeps the Firebase Hosting authDomain outside local development', () => {
  assert.equal(
    getFirebaseAuthDomain({ hostname: 'example.com', host: 'example.com' }),
    'pythagoras-eoa.firebaseapp.com'
  );
});
