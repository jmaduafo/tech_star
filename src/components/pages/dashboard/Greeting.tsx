"use client";
import React, { useState, useEffect } from "react";
import { greeting } from "@/utils/greeting";
import Header4 from "@/components/fontsize/Header4";
import Header2 from "@/components/fontsize/Header2";
import { auth, db } from "@/firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { User } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";

function Greeting() {
  const [greet, setGreet] = useState("---");
  const [userData, setUserData] = useState<User | undefined>();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userRef = doc(db, "users", user?.uid);

      async function auth() {
        const docSnap = await getDoc(userRef);
        setUserData(docSnap?.data() as User);
      }

      auth();
    }
  });

  useEffect(() => {
    const userGreet = setInterval(() => {
      setGreet(greeting());
    }, 1000);

    return () => clearInterval(userGreet);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="">
        <Header4 text={`Good ${greet},`} />
        {userData?.first_name ? (
          <Header2
            text={userData?.first_name}
            className="capitalize font-semibold"
          />
        ) : (
          <div className="mt-3">
            <Skeleton className="w-[85%] h-[26px]" />
          </div>
        )}

        <div className="mt-3">
          {userData?.is_admin ? (
            <p className="px-3 py-[1px] text-[13.5px] rounded-full border-[1.5px] border-lightText w-fit">
              Admin
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-auto">
        <p>hu</p>
      </div>
    </div>
  );
}

export default Greeting;
