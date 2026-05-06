import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
            if (!data.displayName && user.displayName) {
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
              completedSlides: []
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
