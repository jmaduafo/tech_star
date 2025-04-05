"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import Loading from '@/components/ui/Loading';

function Logout() {
    const [loading, setLoading] = useState(false);
    
      const router = useRouter();
    
      function logout() {
        setLoading(true);
    
        signOut(auth)
          .then(() => {
            // Sign-out successful.
            router.push("/");
            router.refresh()
          })
          .catch((error) => {
            console.log(error.message);
          })
          .finally(() => {
            setLoading(false);
          });
      }
  return (
    <button
      onClick={logout}
      className={`text-left outline-none border-b border-b-dark10 py-4 `}
    >
      {loading ? <Loading className="w-5 h-5" /> : "Logout"}
    </button>
  )
}

export default Logout