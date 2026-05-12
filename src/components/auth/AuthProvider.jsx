import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
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
          let role = 'student';
          if (user.email === 'kevlimpens@gmail.com') {
            role = 'admin';
          }

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (role === 'admin' && data.role !== 'admin') {
              await setDoc(userRef, { role: 'admin' }, { merge: true });
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
            await setDoc(userRef, updates, { merge: true });
          } else {
            const initialData = {
              email: user.email,
              displayName: user.displayName || '',
              role: role,
              createdAt: new Date(),
              lastActive: new Date(),
              completedChapters: [],
              completedSlides: [],
              needsNameSetup: !user.displayName || user.displayName.trim() === '',
              klasId: null
            };
            await setDoc(userRef, initialData);
          }
        } catch (error) {
          console.error("Error fetching/creating user doc:", error);
          setUserRole(user.email === 'kevlimpens@gmail.com' ? 'admin' : 'student');
        }
        setCurrentUser(user);
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
  const loginAsRole = (role) => {
    setCurrentUser({ uid: `test_${role}`, email: `test@${role}.local`, displayName: `Test ${role}` });
    setUserRole(role);
  };

  const logout = () => {
    auth.signOut();
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    userData,
    klasId,
    klasData,
    isAdmin: userRole === 'admin',
    isStudent: userRole === 'student',
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
