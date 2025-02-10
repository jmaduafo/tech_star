"use client"
import React from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

function Logout() {
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

  return <button onClick={logout} className="text-darkText"><CiLogout/></button>;
}

export default Logout;
