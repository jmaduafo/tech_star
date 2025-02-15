"use client";

import React, { useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

function CheckAuth({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const route = useRouter();

  // const team_id = pathname.split('/')[1]

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        route.push("/");
      }

      if (user) {
        if (pathname === "/") {
          route.push(`/dashboard`);
        }
      }
    });
  }, []);

  return <main>{children}</main>;
}

export default CheckAuth;
