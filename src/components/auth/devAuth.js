import { isDevAdminLoginEnabled } from '../../lib/authLoginUtils.js';

const DEV_USER_STORAGE_KEY = 'helix.devUser';

export const isDevLoginEnabled = () =>
  import.meta.env.DEV === true && import.meta.env.VITE_ENABLE_DEV_LOGIN === 'true';

export { isDevAdminLoginEnabled };

export const createDevStudentUser = () => ({
  uid: 'dev-student',
  email: 'dev-student@helix.local',
  displayName: 'Dev Student',
  role: 'student',
  isDevUser: true
});

export const createDevStudentUserData = (user = createDevStudentUser()) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  role: 'student',
  createdAt: null,
  lastActive: null,
  completedChapters: [],
  completedSlides: [],
  needsNameSetup: false,
  klasId: null,
  isDevUser: true
});

export const createDevAdminUser = () => ({
  uid: 'dev-admin',
  email: 'dev-admin@helix.local',
  displayName: 'Dev Admin',
  role: 'admin',
  isDevUser: true
});

export const createDevAdminUserData = (user = createDevAdminUser()) => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  role: 'admin',
  createdAt: null,
  lastActive: null,
  completedChapters: [],
  completedSlides: [],
  needsNameSetup: false,
  klasId: null,
  isDevUser: true
});

export const shouldClearDevUserForFirebaseUser = (firebaseUser) => Boolean(firebaseUser?.uid);

export const loadDevUser = () => {
  const devStudentEnabled = isDevLoginEnabled();
  const devAdminEnabled = isDevAdminLoginEnabled();

  if (!devStudentEnabled && !devAdminEnabled) return null;

  try {
    const raw = localStorage.getItem(DEV_USER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.uid === 'dev-student' && parsed?.isDevUser === true && devStudentEnabled) {
      return createDevStudentUser();
    }

    if (parsed?.uid === 'dev-admin' && parsed?.isDevUser === true && devAdminEnabled) {
      return createDevAdminUser();
    }

    return null;
  } catch {
    return null;
  }
};

export const saveDevStudentUser = () => {
  if (!isDevLoginEnabled()) {
    throw new Error('Developer login is alleen beschikbaar in lokale development met VITE_ENABLE_DEV_LOGIN=true.');
  }

  const user = createDevStudentUser();
  localStorage.setItem(DEV_USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const saveDevAdminUser = () => {
  if (!isDevAdminLoginEnabled()) {
    throw new Error('Admin developer login is alleen beschikbaar in lokale development met VITE_ENABLE_DEV_ADMIN_LOGIN=true.');
  }

  const user = createDevAdminUser();
  localStorage.setItem(DEV_USER_STORAGE_KEY, JSON.stringify(user));
  return user;
};

export const clearDevUser = () => {
  try {
    localStorage.removeItem(DEV_USER_STORAGE_KEY);
  } catch {
    // Ignore localStorage cleanup failures during logout.
  }
};
