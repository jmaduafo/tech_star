"use client";
import React, { useActionState, useEffect, useState } from "react";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/types";
import { changePassword, signInUser } from "@/zod/actions";

function ChangePassword({ user }: { readonly user: User | undefined }) {
  const [signInState, signInAction, signInLoading] = useActionState(
    signInUser,
    {
      data: {
        email: "",
        password: "",
      },
      message: "",
      success: false,
    }
  );

  const [passwordState, passwordAction, passwordLoading] = useActionState(
    changePassword,
    {
      data: {
        password: "",
      },
      message: "",
      success: false,
    }
  );

  const [signInOpen, setSignInOpen] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);

  useEffect(() => {
    if (!signInState?.success && signInState?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: signInState?.message,
      });

    } else if (signInState?.success) {
      setSignInOpen(false);
      setNewPasswordOpen(true);

    } else if (!passwordState?.success && passwordState?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: passwordState?.message,
      });

    } else if (passwordState?.success) {
      setNewPasswordOpen(false);

      toast({
        title: "Password was updated successfully!",
      });
    }
    
  }, [passwordState, signInState]);

  return (
    <>
      <button
        onClick={() => {
          setSignInOpen(true);
        }}
        className={`w-full text-[14px] text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
      >
        Update password
      </button>
      {/* SHOW THIS DIALOG INITIALLY AND APPOINT FOR USER TO ENTER 
            THEIR CURRENT PASSWORD AND SIGN IN BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Log in to update password</DialogDescription>
          </DialogHeader>
          <form action={signInAction} className="duration-300">
            <Input htmlFor={"user_email"} label={"Email"} className="">
              <input
                className="form"
                id="user_email"
                name="user_email"
                defaultValue={signInState?.data?.email}
              />
            </Input>
            <Input
              htmlFor={"user_password"}
              label={"Password"}
              className="mt-3"
            >
              <input
                className="form"
                id="user_password"
                name="user_password"
                type="password"
                defaultValue={signInState?.data?.password}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={signInLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={newPasswordOpen} onOpenChange={setNewPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>New password</DialogTitle>
            <DialogDescription>
              Insert a new password and update the changes
            </DialogDescription>
          </DialogHeader>
          <form action={passwordAction} className="duration-300">
            <Input
              htmlFor={"password"}
              label={"Enter new password"}
              className="mt-3"
            >
              <input
                className="form"
                id="password"
                name="password"
                type="password"
                defaultValue={passwordState?.data?.password}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={passwordLoading}
                width_height="w-[85px] h-[40px]"
                width="w-[40px]"
                arrow_width_height="w-6 h-6"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ChangePassword;
