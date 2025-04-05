"use client";
import React, { useState } from "react";
import Header6 from "@/components/fontsize/Header6";
import { auth } from "@/firebase/config";
import { User } from "@/types/types";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation"
import Loading from "../../../Loading";

function SecuritySettings({ user }: { readonly user: User | undefined }) {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const router = useRouter();

  function logout() {
    setLogoutLoading(true);

    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }

  return (
    <section>
      <Header6 text="Security settings" className="text-darkText mb-4" />
      <div className="text-[14px] text-dark75 flex flex-col w-full">
        <SecurityButton
          text="Logout"
          btnClick={logout}
          loading={logoutLoading}
        />
        <SecurityButton text="Delete account" className="text-red-500" />
      </div>
    </section>
  );
}

export default SecuritySettings;

type Button = {
  readonly text: string;
  readonly className?: string;
  readonly btnClick?: () => void;
  readonly loading?: boolean;
};

function SecurityButton({ text, className, btnClick, loading }: Button) {
  return (
    <button
      onClick={btnClick}
      className={`text-left outline-none border-b border-b-dark10 py-4 ${className}`}
    >
      {loading ? <Loading className="w-5 h-5" /> : text}
    </button>
  );
}
