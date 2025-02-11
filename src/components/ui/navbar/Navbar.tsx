"use client";
import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { getDoc, doc } from "firebase/firestore";
import { User } from "@/types/types";

function Navbar() {
  const [userData, setUserData] = useState<User | undefined>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user?.uid);

        async function userInfo() {
          const docSnap = await getDoc(userRef);
          setUserData(docSnap?.data() as User);
        }

        userInfo();
      }
    });
  }, []);

  return (
    <header className="">
      <TopBar user={userData} />
      <div className="mt-2">
        <BottomBar user={userData} />
      </div>
    </header>
  );
}

export default Navbar;
