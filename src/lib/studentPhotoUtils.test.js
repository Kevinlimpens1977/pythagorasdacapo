import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getStudentInitial,
  getStudentPhotoDirectUrl,
  getStudentPhotoStoragePath,
  hasStudentPhoto
} from './studentPhotoUtils.js';

test('student photo helpers prefer direct URLs before storage paths', () => {
  assert.equal(
    getStudentPhotoDirectUrl({
      photoURL: 'https://example.test/auth.jpg',
      photo: { url: 'https://example.test/profile.jpg' }
    }),
    'https://example.test/auth.jpg'
  );
  assert.equal(
    getStudentPhotoDirectUrl({
      photo: {
        thumbUrl: 'https://example.test/thumb.jpg',
        url: 'https://example.test/profile.jpg'
      }
    }),
    'https://example.test/thumb.jpg'
  );
});

test('student photo helpers resolve structured and legacy storage paths', () => {
  assert.equal(
    getStudentPhotoStoragePath({
      photo: {
        thumbStoragePath: 'student-photos/k1/s1/thumb.webp',
        storagePath: 'student-photos/k1/s1/avatar.webp'
      }
    }),
    'student-photos/k1/s1/thumb.webp'
  );
  assert.equal(getStudentPhotoStoragePath({ photoPath: 'legacy/path.jpg' }), 'legacy/path.jpg');
});

test('hasStudentPhoto supports the same fields as the avatar resolver', () => {
  assert.equal(hasStudentPhoto({ photo: { url: 'https://example.test/photo.jpg' } }), true);
  assert.equal(hasStudentPhoto({ photo: { storagePath: 'student-photos/avatar.webp' } }), true);
  assert.equal(hasStudentPhoto({}), false);
});

test('getStudentInitial falls back from display name to email', () => {
  assert.equal(getStudentInitial({ displayName: 'Dj orlando Rummens' }), 'D');
  assert.equal(getStudentInitial({ email: 'lyndi@example.test' }), 'L');
  assert.equal(getStudentInitial({}), '?');
});
