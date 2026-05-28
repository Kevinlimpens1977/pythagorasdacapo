import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildStudentMatchCandidates,
  countStudentPhotos,
  createPhotoImportRows,
  getMatchStatus,
  getPhotoImportReadiness,
  normalizeStudentName,
  sanitizeImportFileName
} from './studentPhotoImportUtils.js';

test('normalizeStudentName trims, lowercases and removes accents', () => {
  assert.equal(normalizeStudentName('  Éva   van  Dijk '), 'eva van dijk');
});

test('buildStudentMatchCandidates prefers exact display name matches', () => {
  const students = [
    { uid: 's1', displayName: 'Luna Balan', email: '50119088@example.com' },
    { uid: 's2', displayName: 'Luna Janssen', email: 'luna@example.com' }
  ];

  const candidates = buildStudentMatchCandidates(students, 'Luna Balan');
  assert.equal(candidates[0].student.uid, 's1');
  assert.equal(candidates[0].score, 1);
});

test('getMatchStatus distinguishes missing, none, duplicate, review and matched states', () => {
  assert.equal(getMatchStatus({ proposedName: '' }), 'naam ontbreekt');
  assert.equal(getMatchStatus({ proposedName: 'Ada', candidates: [] }), 'geen match');
  assert.equal(getMatchStatus({ proposedName: 'Ada', matchedUserId: 's1' }), 'matched');
  assert.equal(getMatchStatus({ proposedName: 'Ada', candidates: [{ score: 0.7 }] }), 'controle nodig');
  assert.equal(getMatchStatus({ proposedName: 'Ada', candidates: [{ score: 0.8 }, { score: 0.8 }] }), 'dubbele match');
});

test('createPhotoImportRows auto-links only confident matches', () => {
  const rows = createPhotoImportRows(
    [{ id: 'crop-1', label: 'Luna Balan' }],
    [{ uid: 's1', displayName: 'Luna Balan', email: 'luna@example.com' }]
  );

  assert.equal(rows[0].id, 'crop-1');
  assert.equal(rows[0].selection.id, 'crop-1');
  assert.equal(rows[0].decision, 'link');
  assert.equal(rows[0].matchedUserId, 's1');
});

test('getPhotoImportReadiness requires every row to have an explicit decision', () => {
  assert.deepEqual(getPhotoImportReadiness([]), { total: 0, ready: 0, isReady: false });
  assert.deepEqual(
    getPhotoImportReadiness([
      { decision: 'link', matchedUserId: 's1' },
      { decision: 'skip' },
      { decision: 'pending', proposedName: 'Nieuwe leerling' }
    ]),
    { total: 3, ready: 3, isReady: true }
  );
  assert.deepEqual(
    getPhotoImportReadiness([
      { decision: 'link' },
      { decision: 'pending' },
      { decision: 'review' }
    ]),
    { total: 3, ready: 0, isReady: false }
  );
});

test('countStudentPhotos supports structured and legacy photo fields', () => {
  assert.deepEqual(
    countStudentPhotos([
      { photo: { thumbStoragePath: 'a' } },
      { photoURL: 'b' },
      {}
    ]),
    { withPhoto: 2, withoutPhoto: 1 }
  );
});

test('sanitizeImportFileName strips unsafe filename characters', () => {
  assert.equal(sanitizeImportFileName('  klas foto 1/2.png  '), 'klas-foto-1-2.png');
});
