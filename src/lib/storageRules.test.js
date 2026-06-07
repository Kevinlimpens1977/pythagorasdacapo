import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rules = readFileSync(new URL('../../storage.rules', import.meta.url), 'utf8');

test('storage rules keep token shop images readable to signed-in users and writable only by admins', () => {
  assert.match(rules, /match \/token-shop-items\/\{itemId\}\/\{allPaths=\*\*\}/);
  assert.match(rules, /allow read: if signedIn\(\)/);
  assert.match(rules, /allow write: if isAdmin\(\)/);
});
