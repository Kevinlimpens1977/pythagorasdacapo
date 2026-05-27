export const PRESENTER_STORAGE_KEY = 'helix.presenter.recovery.v1';

const hasPageContent = (page) =>
  Array.isArray(page?.strokes) && page.strokes.length > 0 ||
  Array.isArray(page?.objects) && page.objects.length > 0;

const isValidRecoverySession = (session) =>
  session?.version === 1 && Array.isArray(session.pages);

export const hasRecoverablePresenterState = (session) => {
  if (!session) return false;
  if (session.dirty) return true;
  if (!Array.isArray(session.pages)) return false;

  return session.pages.some((page) => hasPageContent(page));
};

export const savePresenterRecoveryState = (storage, session) => {
  if (!storage || typeof storage.setItem !== 'function' || !hasRecoverablePresenterState(session)) return;

  try {
    storage.setItem(PRESENTER_STORAGE_KEY, JSON.stringify({
      savedAt: new Date().toISOString(),
      session
    }));
  } catch {
    // Browser storage can be unavailable, blocked, or quota-limited.
  }
};

export const loadPresenterRecoveryState = (storage) => {
  if (!storage || typeof storage.getItem !== 'function') return null;

  try {
    const saved = storage.getItem(PRESENTER_STORAGE_KEY);
    if (!saved) return null;

    const parsed = JSON.parse(saved);
    return isValidRecoverySession(parsed?.session) ? parsed.session : null;
  } catch {
    return null;
  }
};

export const clearPresenterRecoveryState = (storage) => {
  if (typeof storage?.removeItem !== 'function') return;

  try {
    storage.removeItem(PRESENTER_STORAGE_KEY);
  } catch {
    // Clearing recovery data should never block the presenter UI.
  }
};
