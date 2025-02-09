"use client"

import React from 'react'
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
 
 function CheckAuth({ children}: { children: React.ReactNode }) {
    const route = useRouter()
    
    onAuthStateChanged(auth, (user) => {
        if (!user) {
          route.push('/')
        }
    });

   return (
     <div>{children}</div>
   )
 }
 
 export default CheckAuth