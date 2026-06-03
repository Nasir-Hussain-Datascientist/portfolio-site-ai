import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthProfile {
  role?: string;
  name?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  isSuperAdmin: false,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        if (currentUser.email === 'nasir.swat.hussain@gmail.com') {
          setProfile({ role: 'super_admin', name: 'Nasir Hussain' });
        } else {
          try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setProfile(userSnap.data() as AuthProfile);
            } else {
              const fallbackProfile = { role: 'super_admin' };
              setProfile(fallbackProfile);
              try {
                await setDoc(userRef, fallbackProfile, { merge: true });
              } catch (e) {
                console.warn('Failed to save fallback profile to Firestore. Ignoring.');
              }
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setProfile({ role: 'super_admin' });
          }
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = !!user;
  const isSuperAdmin = !!user;

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isSuperAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
