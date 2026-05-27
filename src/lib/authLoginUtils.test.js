import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGoogleLoginErrorMessage,
  isAdminEmail,
  shouldFallbackToRedirectLogin
} from './authLoginUtils.js';

test('isAdminEmail matches the configured admin case-insensitively', () => {
  assert.equal(isAdminEmail('kevlimpens@gmail.com'), true);
  assert.equal(isAdminEmail(' KevLimpens@gmail.com '), true);
  assert.equal(isAdminEmail('iemand@school.nl'), false);
});

test('shouldFallbackToRedirectLogin only accepts popup environment failures', () => {
  assert.equal(shouldFallbackToRedirectLogin({ code: 'auth/popup-blocked' }), true);
  assert.equal(shouldFallbackToRedirectLogin({ code: 'auth/cancelled-popup-request' }), true);
  assert.equal(shouldFallbackToRedirectLogin({ code: 'auth/operation-not-supported-in-this-environment' }), true);
  assert.equal(shouldFallbackToRedirectLogin({ code: 'auth/popup-closed-by-user' }), false);
  assert.equal(shouldFallbackToRedirectLogin({ code: 'auth/unauthorized-domain' }), false);
});

test('getGoogleLoginErrorMessage explains known Google login failures', () => {
  assert.equal(
    getGoogleLoginErrorMessage({ code: 'auth/popup-closed-by-user' }),
    'Google login is gesloten voordat het inloggen klaar was.'
  );
  assert.equal(
    getGoogleLoginErrorMessage({ code: 'auth/unauthorized-domain' }),
    'Google login mislukt: dit domein staat niet in Firebase Authorized domains.'
  );
  assert.equal(getGoogleLoginErrorMessage({ code: 'auth/unknown' }), 'Google login mislukt.');
});
