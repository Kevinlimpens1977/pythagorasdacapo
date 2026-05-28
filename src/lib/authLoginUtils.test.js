import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSafePostLoginTarget,
  getGoogleLoginErrorMessage,
  isAdminEmail,
  isDevAdminLoginEnabled,
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

test('isDevAdminLoginEnabled requires local dev mode and the explicit admin flag', () => {
  assert.equal(isDevAdminLoginEnabled({ DEV: true, VITE_ENABLE_DEV_ADMIN_LOGIN: 'true' }), true);
  assert.equal(isDevAdminLoginEnabled({ DEV: true, VITE_ENABLE_DEV_ADMIN_LOGIN: 'false' }), false);
  assert.equal(isDevAdminLoginEnabled({ DEV: false, VITE_ENABLE_DEV_ADMIN_LOGIN: 'true' }), false);
  assert.equal(isDevAdminLoginEnabled({ VITE_ENABLE_DEV_ADMIN_LOGIN: 'true' }), false);
});

test('getSafePostLoginTarget restores safe admin targets for admins', () => {
  assert.equal(
    getSafePostLoginTarget({
      isAdmin: true,
      fromPathname: '/admin/presenter',
      fromSearch: '?deck=test'
    }),
    '/admin/presenter?deck=test'
  );
  assert.equal(getSafePostLoginTarget({ isAdmin: true, fromPathname: '/admin' }), '/admin');
  assert.equal(getSafePostLoginTarget({ isAdmin: true, fromPathname: '/login' }), '/admin');
});

test('getSafePostLoginTarget blocks unsafe or unauthorized restore targets', () => {
  assert.equal(getSafePostLoginTarget({ isAdmin: false, fromPathname: '/admin/presenter' }), '/');
  assert.equal(getSafePostLoginTarget({ isAdmin: true, fromPathname: 'https://evil.test/admin' }), '/admin');
  assert.equal(getSafePostLoginTarget({ isAdmin: true, fromPathname: '//evil.test/admin' }), '/admin');
  assert.equal(getSafePostLoginTarget({ isAdmin: true, fromPathname: '/\\evil' }), '/admin');
});
