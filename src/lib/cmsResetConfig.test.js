import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CMS_RESET_COLLECTIONS,
  CMS_RESET_CONFIRM_TEXT,
  isQuestionMetadataPath
} from './cmsResetConfig.js';

test('CMS reset targets only lesson content collections', () => {
  assert.deepEqual(CMS_RESET_COLLECTIONS, [
    'contentBlocks',
    'slidedeckPackages',
    'vraag',
    'paragraaf',
    'hoofdstuk',
    'niveau',
    'leerjaar',
    'vak',
    'vakken'
  ]);

  assert.equal(CMS_RESET_COLLECTIONS.includes('users'), false);
  assert.equal(CMS_RESET_COLLECTIONS.includes('klassen'), false);
  assert.equal(CMS_RESET_COLLECTIONS.includes('voortgang'), false);
  assert.equal(CMS_RESET_COLLECTIONS.includes('userAnswers'), false);
});

test('CMS reset confirmation requires explicit reset phrase', () => {
  assert.equal(CMS_RESET_CONFIRM_TEXT, 'RESET CMS');
});

test('question metadata reset only accepts questionMetadata subcollection paths', () => {
  assert.equal(isQuestionMetadataPath('questionMetadata/para-1/questions/q-1'), true);
  assert.equal(isQuestionMetadataPath('otherMetadata/para-1/questions/q-1'), false);
});
