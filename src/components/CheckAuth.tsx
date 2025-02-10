"use client";

import React, { useEffect } from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname()
  const route = useRouter();

  // const team_id = pathname.split('/')[1]

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        route.push("/");
      }
      
      async function checkUser() {
        if (user) {
          const userRef = doc(db, "users", user?.uid)
          const docSnap = await getDoc(userRef)

          if (pathname === "/") {
            route.push(`/team/${docSnap?.data()?.team_id}/dashboard`)
          }
        }
      
      }

      checkUser()      
      
    });
  }, []);

  return <div>{children}</div>;
}

export default CheckAuth;
