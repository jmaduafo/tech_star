import React from "react";
import Navbar from "../ui/navbar/Navbar";

function AuthContainer({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="relative w-full bg-fixed bg-[url(/images/background1.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="w-full h-full fixed backdrop-blur-lg bg-light20 z-[0]"></div>
      <div className="p-10 backdrop-blur-0">
        <Navbar />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer;
