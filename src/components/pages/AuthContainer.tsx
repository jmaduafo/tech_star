import React from "react";
import Navbar from "../ui/navbar/Navbar";

function AuthContainer({ children }: { readonly children: React.ReactNode }) {
  return (
    <div>
      <div className="w-full h-full fixed bg-light10 -z-0"></div>
      <div className="p-5 md:p-10 relative">
        <Navbar />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer;
