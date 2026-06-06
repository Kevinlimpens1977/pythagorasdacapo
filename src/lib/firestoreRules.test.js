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

test('firestore rules keep private question answer documents admin-only', () => {
  const block = getRuleBlock('match /vraag/{document=**}');

  assert.match(block, /allow read: if isAdminOrSupervisor\(\)/);
  assert.match(block, /allow create, update, delete: if isAdmin\(\)/);
});

test('firestore rules expose sanitized public questions only when published and assigned', () => {
  const block = getRuleBlock('match /publicQuestions/{document=**}');

  assert.match(block, /allow read: if canReadPublicParagraphContent\(\)/);
  assert.match(block, /allow create, update, delete: if isAdmin\(\)/);
});

test('firestore rules keep private content blocks admin-only', () => {
  const block = getRuleBlock('match /contentBlocks/{document=**}');

  assert.match(block, /allow read: if isAdminOrSupervisor\(\)/);
  assert.match(block, /allow create, update, delete: if isAdmin\(\)/);
});

test('firestore rules expose sanitized public content blocks only when published and assigned', () => {
  const block = getRuleBlock('match /publicContentBlocks/{blockId}');

  assert.match(block, /allow read: if canReadPublicContentBlock\(blockId\)/);
  assert.match(block, /allow create, update, delete: if isAdmin\(\)/);
});

test('firestore rules define published assignment helpers for public student content', () => {
  assert.match(rules, /function isPublishedPublicResource\(\)/);
  assert.match(rules, /resource\.data\.status == 'published'/);
  assert.match(rules, /resource\.data\.isArchived != true/);
  assert.match(rules, /function isAssignedParagraph\(paragraafId\)/);
  assert.match(rules, /studentKlasDoc\(\)\.data\.enabledParagrafen\.hasAny\(\[paragraafId\]\)/);
  assert.match(rules, /function isAssignedContentBlock\(paragraafId, blockId\)/);
  assert.match(rules, /blockId in studentKlasDoc\(\)\.data\.enabledContentBlocks\[paragraafId\]/);
});
