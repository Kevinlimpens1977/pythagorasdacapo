import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildStudentMatchCandidates,
  countStudentPhotos,
  createPhotoImportRows,
  getMatchStatus,
  getPhotoImportReadiness,
  joinStudentName,
  normalizeStudentName,
  sanitizeImportFileName,
  splitStudentFullName
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

test('splitStudentFullName keeps first name and surname separate', () => {
  assert.deepEqual(splitStudentFullName('Luna Bauer'), { firstName: 'Luna', lastName: 'Bauer' });
  assert.deepEqual(splitStudentFullName('Mumtaz Mumtaz Mohamed Omar'), {
    firstName: 'Mumtaz',
    lastName: 'Mumtaz Mohamed Omar'
  });
  assert.equal(joinStudentName({ firstName: 'Luna', lastName: 'Bauer' }), 'Luna Bauer');
});

test('createPhotoImportRows prepares imported names without auto-linking existing accounts', () => {
  const rows = createPhotoImportRows(
    [{ id: 'crop-1', label: 'Luna Balan' }],
    [{ uid: 's1', displayName: 'Luna Balan', email: 'luna@example.com' }]
  );

  assert.equal(rows[0].id, 'crop-1');
  assert.equal(rows[0].selection.id, 'crop-1');
  assert.equal(rows[0].firstName, 'Luna');
  assert.equal(rows[0].lastName, 'Balan');
  assert.equal(rows[0].decision, 'pending');
  assert.equal(rows[0].matchedUserId, '');
});

test('createPhotoImportRows preserves OCR and label matching diagnostics', () => {
  const rows = createPhotoImportRows(
    [
      {
        id: 'crop-1',
        proposedName: 'Damian Bijlsma',
        detectionConfidence: 0.91,
        detectionMethod: 'auto-vision-blue-label-ocr',
        rawOcrText: 'Damian Bijlsma\n',
        cleanedOcrName: 'Damian Bijlsma',
        ocrConfidence: 86,
        labelBox: { x: 12, y: 4, width: 120, height: 22 },
        labelMatchConfidence: 0.82
      }
    ],
    []
  );

  assert.equal(rows[0].detectionMethod, 'auto-vision-blue-label-ocr');
  assert.equal(rows[0].detectionConfidence, 0.91);
  assert.equal(rows[0].rawOcrText, 'Damian Bijlsma\n');
  assert.equal(rows[0].cleanedOcrName, 'Damian Bijlsma');
  assert.equal(rows[0].ocrConfidence, 86);
  assert.deepEqual(rows[0].labelBox, { x: 12, y: 4, width: 120, height: 22 });
  assert.equal(rows[0].labelMatchConfidence, 0.82);
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
