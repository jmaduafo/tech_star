"use client";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import React, { useActionState, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import IconInput from "@/components/ui/input/IconInput";
import { CiLock, CiMail } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";
import { createAdmin } from "@/zod/actions";

function SignUp() {
  // createAdmin => the action function
  const [state, action, loading] = useActionState(createAdmin, {
    data: {
      first_name: "",
      last_name: "",
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
      <Header1 text="Join us today!" />
      <Header6
        className="mt-4"
        text="Create an account to streamline your workflow and manage projects with ease."
      />
      <form className="mt-10" action={action}>
        <div className="flex gap-3">
          <div>
            <IconInput
              icon={
                <div className="w-6 h-6 flex justify-center items-center">
                  <p>A</p>
                </div>
              }
              input={
                <input
                  placeholder="First name"
                  type="text"
                  name="first_name"
                  className="placeholder-dark50"
                  defaultValue={state?.data?.first_name}
                />
              }
            />
          </div>
          <div>
            <IconInput
              icon={
                <div className="w-6 h-6 flex justify-center items-center">
                  <p>Z</p>
                </div>
              }
              input={
                <input
                  placeholder="Last name"
                  type="text"
                  name="last_name"
                  className="placeholder-dark50"
                  defaultValue={state?.data?.last_name}
                />
              }
            />
          </div>
        </div>
        <div className="mt-4">
          <IconInput
            icon={<CiMail className="w-6 h-6" />}
            input={
              <input
                placeholder="Email"
                type="text"
                name="email"
                className="placeholder-dark50"
                defaultValue={state?.data?.email}
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
                className="placeholder-dark50"
                defaultValue={state?.data?.password}
              />
            }
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
          <Submit loading={loading} />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
