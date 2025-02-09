"use client";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import React from "react";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

function MainPage() {
  const route = useRouter();

  function logout() {
    signOut(auth)
      .then(() => {
        route.push("/");
      })
      .catch((err) => {
        // An error happened.
        console.log(err.message);
      });
  }

  return (
    <div>
      <button onClick={logout} className="text-darkText">
        <CiLogout className="w-6 h-6" />
      </button>
    </div>
  );
}

export default MainPage;
