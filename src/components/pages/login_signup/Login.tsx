"use client";
import React, { useActionState, useEffect, useState } from "react";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import IconInput from "@/components/ui/input/IconInput";
import { CiMail, CiLock } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInUser } from "@/zod/actions";

function Login() {
  const [state, action, isLoading] = useActionState(signInUser, {
    data: {
      email: "",
      password: "",
    },
    message: "",
    success: false,
  });
  const [viewPass, setViewPass] = useState(false);
  const route = useRouter();

  useEffect(() => {
    if (!state?.success && state?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });

    } else if (state?.success) {
      route.push("/dashboard");
    }
    
  }, [state]);

  return (
    <div>
      <Header1 text="Welcome back!" className="text-darkText"/>
      <Header6
        className="mt-4 text-darkText"
        text="Sign in to access your account and stay on top of  your company finances effortlessly."
      />
      <form className="mt-10" action={action}>
        <div>
          <IconInput
            icon={<CiMail className="w-5 h-5 sm:w-6 sm:h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                defaultValue={state?.data?.email}
                className="placeholder-dark50"
              />
            }
          />
        </div>
        <div className="mt-4">
          <IconInput
            icon={<CiLock className="w-5 h-5 sm:w-6 sm:h-6" />}
            input={
              <input
                placeholder="Password"
                // CHANGE THE TYPE BASED ON BUTTON CLICK
                type={viewPass ? "text" : "password"}
                name="password"
                defaultValue={state?.data?.password}
                className="placeholder-dark50"
              />
            }
            // BUTTON TO HIDE OR VIEW PASSWORD TEXT
            otherLogic={
              <button
                type="button"
                className="text-darkText pr-3 cursor-pointer"
                onClick={() => setViewPass((prev) => !prev)}
              >
                {viewPass ? (
                  <HiEye className="w-5 h-5" />
                ) : (
                  <HiEyeSlash className="w-5 h-5" />
                )}
              </button>
            }
          />
        </div>
        <div className="mt-[6em] flex justify-center">
          <Submit loading={isLoading} />
        </div>
      </form>
    </div>
  );
}

export default Login;
