export const ADMIN_EMAIL = 'kevlimpens@gmail.com';

export const getAdminPasswordResetSuccessMessage = (email = ADMIN_EMAIL) =>
  `Er is een wachtwoordlink verstuurd naar ${email}. Stel je wachtwoord in en log daarna hier in met e-mail en wachtwoord.`;

export const getAdminPasswordResetErrorMessage = (error) => {
  if (error?.code === 'auth/user-not-found') {
    return `Er bestaat nog geen Firebase Auth-account voor ${ADMIN_EMAIL}.`;
  }

  if (error?.code === 'auth/too-many-requests') {
    return 'Te veel pogingen. Wacht even en probeer de wachtwoordlink daarna opnieuw.';
  }

  return 'Kon de wachtwoordlink niet versturen. Probeer het opnieuw of controleer Firebase Auth.';
};

export const isAdminEmail = (email) =>
  String(email || '').trim().toLowerCase() === ADMIN_EMAIL;

export const getEffectiveUserRole = ({ email = '', storedRole = '' } = {}) => {
  if (isAdminEmail(email)) return 'admin';
  return storedRole || 'student';
};

export const shouldFallbackToRedirectLogin = (error) => {
  const code = error?.code || '';

  return [
    'auth/popup-blocked',
    'auth/cancelled-popup-request',
    'auth/operation-not-supported-in-this-environment'
  ].includes(code);
};

export const isLocalhostAuthOrigin = ({ hostname = globalThis.window?.location?.hostname } = {}) =>
  ['localhost', '127.0.0.1', '[::1]', '::1'].includes(String(hostname || '').toLowerCase());

export const shouldUseRedirectLoginFallback = (
  error,
  { hostname = globalThis.window?.location?.hostname } = {}
) => shouldFallbackToRedirectLogin(error) && !isLocalhostAuthOrigin({ hostname });

export const isDevAdminLoginEnabled = (env = import.meta.env) =>
  env.DEV === true && env.VITE_ENABLE_DEV_ADMIN_LOGIN === 'true';

export const getSafePostLoginTarget = ({
  isAdmin = false,
  fromPathname = '',
  fromSearch = '',
  adminFallback = '/admin/instellingen',
  studentFallback = '/'
} = {}) => {
  const fallback = isAdmin ? adminFallback : studentFallback;
  const pathname = String(fromPathname || '');
  const search = String(fromSearch || '');

  if (
    !pathname ||
    pathname === '/login' ||
    !pathname.startsWith('/') ||
    pathname.startsWith('//') ||
    pathname.includes('\\')
  ) {
    return fallback;
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    return studentFallback;
  }

  if (isAdmin && pathname === '/admin') {
    return adminFallback;
  }

  if (isAdmin && !pathname.startsWith('/admin')) {
    return adminFallback;
  }

  return `${pathname}${search.startsWith('?') ? search : ''}`;
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
