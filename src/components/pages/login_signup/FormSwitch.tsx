import Header5 from "@/components/fontsize/Header5";
import React from "react";

function FormSwitch({
  isLogin,
  setIsLogin,
}: {
  readonly isLogin: boolean;
  readonly setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full bg-lightText relative rounded-full h-[60px] z-[0]">
      <div
        className={`${
          isLogin ? "translate-x-0" : "translate-x-[100%]"
        } duration-300 absolute h-full w-1/2 bg-darkText rounded-full`}
      ></div>
      <div className="flex h-full">
        <div
          onClick={() => setIsLogin(true)}
          className={`${
            isLogin ? "text-lightText" : "text-darkText"
          } duration-300 flex-1 flex justify-center items-center z-[1] cursor-pointer`}
        >
          <Header5 text="Login"/>
        </div>
        <div
          onClick={() => setIsLogin(false)}
          className={`${
            !isLogin ? "text-lightText" : "text-darkText"
          } duration-300 flex-1 flex justify-center items-center z-[1] cursor-pointer`}
        >
          <Header5 text="Sign Up"/>
        </div>
      </div>
    </div>
  );
}

export default FormSwitch;
