"use client"; // This ensures it only runs on the client

import { useEffect, useState } from "react";
import { auth } from "@/firebase/config"; // Adjust import path
import { onAuthStateChanged, User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);

      setLoading(false);
    });

    return () => unsub()

     // Cleanup on unmount
}, []);

return { user, loading };
}
