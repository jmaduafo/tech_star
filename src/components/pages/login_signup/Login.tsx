"use client"
import React, { useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import IconInput from "@/components/ui/input/IconInput";
import { CiMail, CiLock } from "react-icons/ci";
import Submit from "@/components/ui/buttons/Submit";

function Login() {
    const [ isClicked, setIsClicked ] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
    }

  return (
    <div>
      <Header1 text="Welcome back!" />
      <Header6
        className="mt-4"
        text="Sign in to access your account and stay on top of  your company finances effortlessly."
      />
      <form className="mt-10" onSubmit={handleSubmit}>
        <div>
          <IconInput
            icon={<CiMail className="w-6 h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                className="p-2 placeholder-dark50 text-darkText w-full h-full rounded-full bg-transparent outline-none border-none"
              />
            }
          />
        </div>
        <div className="mt-4">
          <IconInput
            icon={<CiLock className="w-6 h-6" />}
            input={
              <input
                placeholder="Password"
                type="password"
                name="password"
                className="p-2 placeholder-dark50 text-darkText w-full h-full rounded-full bg-transparent outline-none border-none"
              />
            }
          />
        </div>
        <div className="mt-[6em] flex justify-center">
            <Submit isClicked={isClicked} setIsClicked={setIsClicked}/>
        </div>
      </form>
    </div>
  );
}

export default Login;
