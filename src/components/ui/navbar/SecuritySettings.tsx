import React from "react";
import Header6 from "@/components/fontsize/Header6";
import { auth } from "@/firebase/config";
import { User } from "@/types/types";
import { signOut } from "firebase/auth";
import { redirect } from "next/navigation";

function SecuritySettings({ user }: { readonly user: User | undefined }) {
  function logout() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        redirect("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <section>
      <Header6 text="Security settings" className="text-darkText mb-4" />
      <div className="text-[14px] text-dark75 flex flex-col w-full">
        <SecurityButton text="Logout" btnClick={logout} />
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
};

function SecurityButton({ text, className, btnClick }: Button) {
  return (
    <button
      onClick={btnClick}
      className={`text-left outline-none border-b border-b-dark10 py-4 ${className}`}
    >
      {text}
    </button>
  );
}
