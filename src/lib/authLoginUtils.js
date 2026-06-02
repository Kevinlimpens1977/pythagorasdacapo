export const ADMIN_EMAIL = 'kevlimpens@gmail.com';

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
