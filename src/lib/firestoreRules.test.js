import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rules = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');

const getRuleBlock = (matchLine) => {
  const matchStart = rules.indexOf(matchLine);
  assert.notEqual(matchStart, -1);
  const nextComment = rules.indexOf('\n    //', matchStart + matchLine.length);
  return rules.slice(matchStart, nextComment === -1 ? undefined : nextComment);
};

test('firestore rules let students create and read only their own bug reports', () => {
  const block = getRuleBlock('match /studentBugReports/{reportId}');

  assert.match(block, /allow create:/);
  assert.match(block, /request\.resource\.data\.student\.uid == request\.auth\.uid/);
  assert.match(block, /request\.resource\.data\.status == 'new'/);
  assert.match(block, /allow read:/);
  assert.match(block, /resource\.data\.student\.uid == request\.auth\.uid/);
});

test('firestore rules keep bug report moderation admin-only', () => {
  const block = getRuleBlock('match /studentBugReports/{reportId}');

  assert.match(block, /allow update, delete: if isAdmin\(\)/);
});
