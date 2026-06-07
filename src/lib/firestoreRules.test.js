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

test('firestore rules treat the configured admin email as administrator', () => {
  assert.match(rules, /function isAdminEmail\(\)/);
  assert.match(rules, /request\.auth\.token\.email == 'kevlimpens@gmail\.com'/);
  assert.match(rules, /userDoc\(\)\.data\.role == 'admin' \|\| isAdminEmail\(\)/);
});

test('firestore rules expose token accounts to owner and admin but keep writes server-only', () => {
  const block = getRuleBlock('match /tokenAccounts/{studentUid}');

  assert.match(block, /allow read: if isOwner\(studentUid\) \|\| isAdmin\(\)/);
  assert.match(block, /allow create, update, delete: if false/);
});

test('firestore rules expose token transactions and purchases to owner and admin without client writes', () => {
  const transactions = getRuleBlock('match /tokenTransactions/{transactionId}');
  const purchases = getRuleBlock('match /tokenPurchases/{purchaseId}');

  assert.match(transactions, /resource\.data\.studentUid == request\.auth\.uid/);
  assert.match(transactions, /allow create, update, delete: if false/);
  assert.match(purchases, /resource\.data\.studentUid == request\.auth\.uid/);
  assert.match(purchases, /allow create, update, delete: if false/);
});

test('firestore rules expose token loadouts to owner and admin without client writes', () => {
  const block = getRuleBlock('match /studentTokenLoadouts/{studentUid}');

  assert.match(block, /allow read: if isOwner\(studentUid\) \|\| isAdmin\(\)/);
  assert.match(block, /allow create, update, delete: if false/);
});

test('firestore rules let students read active shop items while catalog management stays admin-only', () => {
  const block = getRuleBlock('match /tokenShopItems/{itemId}');

  assert.match(block, /resource\.data\.enabled == true/);
  assert.match(block, /allow create, update, delete: if isAdmin\(\)/);
});
