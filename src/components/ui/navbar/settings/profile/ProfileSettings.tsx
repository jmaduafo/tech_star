"use client";
import React, { useEffect, useState } from "react";
import Header6 from "@/components/fontsize/Header6";
import ChangeNames from "./ChangeNames";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";
import { User } from "@/types/types";

function ProfileSettings({ user }: { readonly user: User | undefined }) {
  const [names, setNames] = useState({
    first_name: "",
    last_name: "",
  });
  const [userEmail, setUserEmail] = useState("");

  function setData() {
    setNames({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    });

    setUserEmail(user?.email ?? "");
  }

  useEffect(() => {
    setData();
  }, []);

  return (
    <section className="mb-6">
      <Header6 text="Profile settings" className="text-darkText mb-4" />
      {/* UPDATE NAME, EMAIL, OR USERNAME */}
      <ChangeNames names={names} setNames={setNames} user={user} />
      <ChangeEmail
        userEmail={userEmail}
        setUserEmail={setUserEmail}
        user={user}
      />
      <ChangePassword user={user} />
    </section>
  );
}

export default ProfileSettings;
