"use client"; // Ensure it runs only on the client

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/types/types";

// Define context type
interface AuthContextType {
  // user: User | null;
  userData: User | undefined;
  loading: boolean;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [userData, setUserData] = useState<User | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          return;
        }

        setLoading(true);

        const userRef = doc(db, "users", user?.uid);
        const userSnap = await getDoc(userRef);
        let firebaseData = {};

        if (userSnap?.exists()) {
          firebaseData = userSnap.data();
        }
        setUserData(firebaseData as User);
      } catch (err: any) {
        console.log(err.message)
      } finally {
        setLoading(false)
      }
    });

    return unsubscribe; // Cleanup on unmount
  }, []);

  const memoizedUser = useMemo(() => userData, [userData]);

  const value = useMemo(() => ({ userData: memoizedUser, loading }), [memoizedUser, loading]);   

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
