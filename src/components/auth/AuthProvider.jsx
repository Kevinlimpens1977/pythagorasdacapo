import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

const AuthContext = createContext();
const DEV_BYPASS_STORAGE_KEY = 'helix-dev-auth-bypass-role';

const canUseDevBypass = () => {
  return import.meta.env.DEV || import.meta.env.VITE_TEST_MODE === 'true';
};

const buildBypassUser = (role, firebaseUser = null) => ({
  ...(firebaseUser || {}),
  uid: firebaseUser?.uid || `dev_${role}`,
  email: role === 'admin' ? 'dev-admin@helix.local' : 'dev-leerling@helix.local',
  displayName: role === 'admin' ? 'Dev Admin' : 'Dev Leerling',
  isAnonymous: firebaseUser?.isAnonymous ?? true
});

const buildBypassUserData = (role, user) => ({
  email: user.email,
  displayName: user.displayName,
  role,
  createdAt: new Date(),
  lastActive: new Date(),
  completedChapters: [],
  completedSlides: [],
  needsNameSetup: false,
  klasId: null,
  isDevBypass: true
});

export function AuthProvider({ children }) {
  const getInitialBypassRole = () => {
    if (!canUseDevBypass()) return null;
    try {
      return localStorage.getItem(DEV_BYPASS_STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const initialBypassRole = getInitialBypassRole();
  const initialBypassUser = initialBypassRole ? buildBypassUser(initialBypassRole) : null;

  const [currentUser, setCurrentUser] = useState(initialBypassUser);
  const [userRole, setUserRole] = useState(initialBypassRole);
  const [userData, setUserData] = useState(
    initialBypassUser ? buildBypassUserData(initialBypassRole, initialBypassUser) : null
  );
  const [klasId, setKlasId] = useState(null);
  const [klasData, setKlasData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Real-time listener for klas data when klasId changes
  useEffect(() => {
    if (!userData?.klasId) {
      setKlasId(null);
      setKlasData(null);
      return;
    }

    setKlasId(userData.klasId);

    // Subscribe to klas document changes in real-time
    const klasRef = doc(db, 'klassen', userData.klasId);
    const unsubscribeKlas = onSnapshot(klasRef, (docSnap) => {
      if (docSnap.exists()) {
        setKlasData({ ...docSnap.data(), id: docSnap.id });
      } else {
        setKlasData(null);
      }
    }, (error) => {
      console.error('Error loading klas data:', error);
      setKlasData(null);
    });

    return () => unsubscribeKlas();
  }, [userData?.klasId]);

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      const activeBypassRole = canUseDevBypass()
        ? localStorage.getItem(DEV_BYPASS_STORAGE_KEY)
        : null;

      if (activeBypassRole && !user) {
        localStorage.removeItem(DEV_BYPASS_STORAGE_KEY);
        setCurrentUser(null);
        setUserData(null);
        setUserRole(null);
        setLoading(false);
        return;
      }

      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);

          // Set up real-time listener for user data
          unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
              setUserRole(data.role || 'student');

              // Sync displayName from Auth to Firestore if out of sync
              if (user.displayName && user.displayName.trim() && (!data.displayName || data.displayName.trim() === '')) {
                console.log(`Syncing displayName for ${user.email}: "${user.displayName}"`);
                setDoc(userRef, {
                  displayName: user.displayName,
                  needsNameSetup: false
                }, { merge: true }).catch(err => console.error('Error syncing displayName:', err));
              }
            }
          });

          // Initial check/creation
          const userDoc = await getDoc(userRef);
          let role = activeBypassRole || 'student';
          if (!activeBypassRole && user.email === 'kevlimpens@gmail.com') {
            role = 'admin';
          }

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role !== role) {
              await setDoc(userRef, { role }, { merge: true });
            }

            const updates = { lastActive: new Date() };
            // Always sync displayName from Auth to Firestore if Auth has it
            if (user.displayName && user.displayName.trim()) {
              updates.displayName = user.displayName;
              updates.needsNameSetup = false;
            }
            // If Firestore has no displayName but Auth does, update it
            if (!data.displayName && user.displayName && user.displayName.trim()) {
              updates.displayName = user.displayName;
            }
            if (activeBypassRole) {
              updates.email = role === 'admin' ? 'dev-admin@helix.local' : 'dev-leerling@helix.local';
              updates.displayName = role === 'admin' ? 'Dev Admin' : 'Dev Leerling';
              updates.needsNameSetup = false;
              updates.isDevBypass = true;
            }
            await setDoc(userRef, updates, { merge: true });
          } else {
            const bypassUser = activeBypassRole ? buildBypassUser(role, user) : user;
            const initialData = {
              email: bypassUser.email,
              displayName: bypassUser.displayName || '',
              role: role,
              createdAt: new Date(),
              lastActive: new Date(),
              completedChapters: [],
              completedSlides: [],
              needsNameSetup: !bypassUser.displayName || bypassUser.displayName.trim() === '',
              klasId: null,
              isDevBypass: Boolean(activeBypassRole)
            };
            await setDoc(userRef, initialData);
          }
        } catch (error) {
          console.error("Error fetching/creating user doc:", error);
          setUserRole(activeBypassRole || (user.email === 'kevlimpens@gmail.com' ? 'admin' : 'student'));
        }
        setCurrentUser(activeBypassRole ? buildBypassUser(activeBypassRole, user) : user);
      } else {
        if (unsubscribeSnapshot) unsubscribeSnapshot();
        setCurrentUser(null);
        setUserData(null);
        setUserRole(null);
        setKlasId(null);
        setKlasData(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  // For testing/bypass mode
  const loginAsRole = async (role) => {
    if (!canUseDevBypass()) {
      throw new Error('Testmodus is alleen beschikbaar in development.');
    }

    try {
      localStorage.setItem(DEV_BYPASS_STORAGE_KEY, role);
    } catch {
      throw new Error('Kon testmodus niet lokaal bewaren.');
    }

    const credential = await signInAnonymously(auth);
    const bypassUser = buildBypassUser(role, credential.user);
    await setDoc(doc(db, 'users', credential.user.uid), buildBypassUserData(role, bypassUser), { merge: true });

    setCurrentUser(bypassUser);
    setUserData(buildBypassUserData(role, bypassUser));
    setUserRole(role);
    setLoading(false);
  };

  const logout = () => {
    try {
      localStorage.removeItem(DEV_BYPASS_STORAGE_KEY);
    } catch {
      // Ignore local storage failures during logout.
    }
    auth.signOut();
    setCurrentUser(null);
    setUserData(null);
    setUserRole(null);
    setKlasId(null);
    setKlasData(null);
  };

  const value = {
    currentUser,
    userRole,
    userData,
    klasId,
    klasData,
    isAdmin: userRole === 'admin',
    isStudent: userRole === 'student',
    isDevBypass: Boolean(userData?.isDevBypass),
    loginAsRole,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
