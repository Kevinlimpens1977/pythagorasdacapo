import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CMS_RESET_COLLECTIONS,
  CMS_RESET_CONFIRM_TEXT,
  CMS_RESET_PROGRESS_COLLECTIONS,
  CMS_RESET_UNTOUCHED,
  isQuestionMetadataPath
} from './cmsResetConfig.js';

test('CMS reset targets only lesson content collections', () => {
  assert.deepEqual(CMS_RESET_COLLECTIONS, [
    'publicContentBlocks',
    'publicQuestions',
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

test('CMS reset wist ook de leerlingveilige snapshots', () => {
  // Zonder deze twee blijven leerlingen de oude lesstof zien, omdat de
  // leerlingroute uitsluitend de publieke snapshots leest.
  assert.equal(CMS_RESET_COLLECTIONS.includes('publicContentBlocks'), true);
  assert.equal(CMS_RESET_COLLECTIONS.includes('publicQuestions'), true);
});

test('de snapshots gaan eerst, zodat een halve reset een veilige tussenstand geeft', () => {
  const snapshotPosities = ['publicContentBlocks', 'publicQuestions']
    .map((naam) => CMS_RESET_COLLECTIONS.indexOf(naam));
  const bronPosities = ['contentBlocks', 'vraag']
    .map((naam) => CMS_RESET_COLLECTIONS.indexOf(naam));

  assert.ok(Math.max(...snapshotPosities) < Math.min(...bronPosities));
});

test('voortgang is een aparte, opt-in stap en geen onderdeel van de standaardreset', () => {
  assert.deepEqual(CMS_RESET_PROGRESS_COLLECTIONS, ['voortgang', 'progressSignalAcknowledgements']);

  CMS_RESET_PROGRESS_COLLECTIONS.forEach((naam) => {
    assert.equal(CMS_RESET_COLLECTIONS.includes(naam), false);
  });
});

test('het dialoogvenster kan benoemen wat er blijft staan', () => {
  assert.ok(CMS_RESET_UNTOUCHED.length > 0);

  CMS_RESET_UNTOUCHED.forEach((item) => {
    assert.equal(typeof item.label, 'string');
    assert.ok(item.label.length > 0);
    assert.equal(typeof item.reason, 'string');
    assert.ok(item.reason.length > 0);
  });

  const labels = CMS_RESET_UNTOUCHED.map((item) => item.label).join(' ');
  assert.ok(labels.includes('badges'));
});

test('CMS reset confirmation requires explicit reset phrase', () => {
  assert.equal(CMS_RESET_CONFIRM_TEXT, 'RESET CMS');
});

test('question metadata reset only accepts questionMetadata subcollection paths', () => {
  assert.equal(isQuestionMetadataPath('questionMetadata/para-1/questions/q-1'), true);
  assert.equal(isQuestionMetadataPath('otherMetadata/para-1/questions/q-1'), false);
});
