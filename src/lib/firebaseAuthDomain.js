export const FIREBASE_AUTH_DOMAIN = 'pythagoras-eoa.firebaseapp.com';

export const isLocalAuthHost = (hostname = '') =>
  ['localhost', '127.0.0.1', '[::1]', '::1'].includes(String(hostname || '').toLowerCase());

export const getFirebaseAuthDomain = ({
  hostname = globalThis.window?.location?.hostname,
  host = globalThis.window?.location?.host
} = {}) => {
  if (isLocalAuthHost(hostname) && host) {
    return host;
  }

  return FIREBASE_AUTH_DOMAIN;
};
