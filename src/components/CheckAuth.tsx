"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { images } from "@/utils/dataTools";
import { doc, onSnapshot } from "firebase/firestore";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const route = useRouter();

  const [bgIndex, setBgIndex] = useState<number>(0);
  const { userData } = useAuth();

  // GETS THE CURRENT USER'S CHOSEN BACKGROUND IMAGE INDEX
  function getBgIndex() {
    if (!userData) {
      return;
    }

    const userDoc = doc(db, "users", userData?.id);

    const unsub = onSnapshot(userDoc, (doc) => {
      doc.exists() ? setBgIndex(doc.data().bg_image_index) : setBgIndex(0);

      return () => unsub();
    });
  }

  useEffect(() => {
    getBgIndex();
  }, [userData?.id ?? "guest"]);


  useEffect(() => {
    // GETS THE STATE OF USER IF THE USER IS LOGGED IN OR NOT
    // IF LOGGED IN, DIRECT USER TO DASHBOARD
    // IF NOT, DIRECT USER TO SIGN UP
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        route.push("/");
        setBgIndex(0)
      }

      if (user) {
        if (pathname === "/") {
          route.push(`/dashboard`);
          getBgIndex();
        }
      }
    });
  }, []);

  return (
    <main
      style={{
        backgroundImage: `url(${images[bgIndex].image})`
      }}
      className={`w-full bg-fixed bg-cover bg-center bg-no-repeat duration-300`}
    >
      {children}
    </main>
  );
}

export default CheckAuth;
