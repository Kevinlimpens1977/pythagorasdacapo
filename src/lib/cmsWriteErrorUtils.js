const isPermissionDeniedError = (error = {}) =>
  error?.code === 'permission-denied' ||
  error?.code === 'firestore/permission-denied' ||
  /missing or insufficient permissions/i.test(String(error?.message || ''));

const cleanFallback = (fallbackMessage = '') => String(fallbackMessage || 'Er ging iets mis.').trim();

export const getCmsWriteErrorMessage = (error, context = {}, fallbackMessage = 'Er ging iets mis.') => {
  const fallback = cleanFallback(fallbackMessage);

  if (isPermissionDeniedError(error)) {
    if (context.hasFirebaseUser === false) {
      return `${fallback} Je gebruikt waarschijnlijk de lokale admin-testlogin. Log in met een echte Firebase-admin om CMS-wijzigingen op te slaan.`;
    }

    return `${fallback} Je account heeft geen schrijfrechten in Firestore. Controleer of users/{uid}.role op admin staat.`;
  }

  const detail = String(error?.message || '').trim();
  return detail ? `${fallback} ${detail}` : fallback;
};
