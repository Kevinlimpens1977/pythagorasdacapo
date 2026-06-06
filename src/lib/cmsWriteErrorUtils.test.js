import test from 'node:test';
import assert from 'node:assert/strict';
import { getCmsWriteErrorMessage } from './cmsWriteErrorUtils.js';

test('getCmsWriteErrorMessage explains local admin without Firebase auth on permission errors', () => {
  const message = getCmsWriteErrorMessage(
    { code: 'permission-denied', message: 'Missing or insufficient permissions.' },
    { hasFirebaseUser: false },
    'Kon lesblok niet aanmaken.'
  );

  assert.match(message, /lokale admin-testlogin/i);
  assert.match(message, /echte Firebase-admin/i);
});

test('getCmsWriteErrorMessage explains missing Firestore write rights for authenticated users', () => {
  const message = getCmsWriteErrorMessage(
    { code: 'permission-denied', message: 'Missing or insufficient permissions.' },
    { hasFirebaseUser: true },
    'Kon lesblok niet aanmaken.'
  );

  assert.match(message, /geen schrijfrechten/i);
  assert.match(message, /users\/\{uid\}\.role/i);
});

test('getCmsWriteErrorMessage keeps useful unexpected error details', () => {
  const message = getCmsWriteErrorMessage(
    new Error('Paragraaf not found'),
    { hasFirebaseUser: true },
    'Kon lesblok niet aanmaken.'
  );

  assert.equal(message, 'Kon lesblok niet aanmaken. Paragraaf not found');
});
