"use client";
import React, { useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import IconInput from "@/components/ui/input/IconInput";
import { CiMail, CiLock } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { LoginUserSchema } from "@/zod/validation";
import { useToast } from "@/hooks/use-toast";

function Login() {
  const [isClicked, setIsClicked] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [ userInfo, setUserInfo ] = useState({
    email: "",
    password: "",
  })

  const { toast } = useToast();
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target
    
        setUserInfo({
          ...userInfo,
          [name]: value
        })
      }
    

  async function handleSubmit(formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    const userResult = LoginUserSchema.safeParse(data);

    if (!userResult.success) {
        toast({
            variant: "destructive",
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
          })
    }




    
  }

  return (
    <div>
      <Header1 text="Welcome back!" />
      <Header6
        className="mt-4"
        text="Sign in to access your account and stay on top of  your company finances effortlessly."
      />
      <form className="mt-10" action={handleSubmit}>
        <div>
          <IconInput
            icon={<CiMail className="w-6 h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                value={userInfo.email}
                onChange={handleChange}
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
                type={viewPass ? "text" : "password"}
                name="password"
                value={userInfo.password}
                onChange={handleChange}
                className="p-2 placeholder-dark50 text-darkText w-full h-full rounded-full bg-transparent outline-none border-none"
              />
            }
            otherLogic={
              <div
                className="text-darkText pr-3 cursor-pointer"
                onClick={() => setViewPass((prev) => !prev)}
              >
                {viewPass ? (
                  <HiEye className="w-5 h-5" />
                ) : (
                  <HiEyeSlash className="w-5 h-5" />
                )}
              </div>
            }
          />
        </div>
        <div className="mt-[6em] flex justify-center">
          <Submit isClicked={isClicked} setIsClicked={setIsClicked} />
        </div>
      </form>
    </div>
  );
}

export default Login;
