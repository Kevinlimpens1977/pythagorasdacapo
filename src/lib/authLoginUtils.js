export const ADMIN_EMAIL = 'kevlimpens@gmail.com';

export const isAdminEmail = (email) =>
  String(email || '').trim().toLowerCase() === ADMIN_EMAIL;

export const shouldFallbackToRedirectLogin = (error) => {
  const code = error?.code || '';

  return [
    'auth/popup-blocked',
    'auth/cancelled-popup-request',
    'auth/operation-not-supported-in-this-environment'
  ].includes(code);
};

export const getGoogleLoginErrorMessage = (error) => {
  if (error?.code === 'auth/popup-closed-by-user') {
    return 'Google login is gesloten voordat het inloggen klaar was.';
  }

  if (error?.code === 'auth/unauthorized-domain') {
    return 'Google login mislukt: dit domein staat niet in Firebase Authorized domains.';
  }

  return 'Google login mislukt.';
};
