import React from "react";
import LoginSignup from "./LoginSignup";

function MainPage() {
  return (
    <main className="h-screen w-full bg-lightText bg-fixed bg-[url(/images/background1.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="flex h-full">
        <div className="flex-1 flex justify-center items-center">
          <p>23:45</p>
        </div>
        <div className="flex-1 bg-light35 backdrop-blur-lg rounded-tl-customLg rounded-bl-customLg">
          <div className="w-[60%] mx-auto mt-16">
            <LoginSignup />
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
