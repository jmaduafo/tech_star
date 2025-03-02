import React from "react";
import Navbar from "../ui/navbar/Navbar";
import { images } from "@/utils/dataTools";

function AuthContainer({ children }: { readonly children: React.ReactNode }) {

  

  return (
    <div style={{ backgroundImage: `url(${images[5].image})`}} className={`w-full bg-fixed bg-cover bg-center bg-no-repeat`}>
      <div className="w-full h-full bg-light10 fixed -z-0"></div>
      <div className="p-5 md:p-10 relative">
        <Navbar />
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export default AuthContainer;
