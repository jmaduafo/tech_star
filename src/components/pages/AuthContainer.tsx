"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../ui/navbar/Navbar";
import { images } from "@/utils/dataTools";
import { useAuth } from "@/context/AuthContext";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "@/firebase/config";

function AuthContainer({ children }: { readonly children: React.ReactNode }) {
  const [bgIndex, setBgIndex] = useState(0);
  const { userData } = useAuth();

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

  return (
    <div
      style={{
        backgroundImage: `url(${images[bgIndex].image})`,
      }}
      className={`w-full bg-fixed bg-cover bg-center bg-no-repeat duration-300`}
    >
      <div className="w-full h-full bg-light10 fixed -z-0"></div>
      <div className="p-5 md:p-10 relative">
        <Navbar />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer;
