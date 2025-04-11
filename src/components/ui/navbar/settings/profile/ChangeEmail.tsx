"use client";
import React, { useState, useActionState, useEffect } from "react";
import Submit from "@/components/ui/buttons/Submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/types";
import { changeEmail, signInUser } from "@/zod/actions";

type Email = {
  readonly user: User | undefined;
};

function ChangeEmail({ user }: Email) {
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

  const [emailState, emailAction, emailLoading] = useActionState(changeEmail, {
    data: {
      email: "",
    },
    message: "",
    success: false,
  });

  const [signInOpen, setSignInOpen] = useState(false);
  const [newEmailOpen, setNewEmailOpen] = useState(false);

  useEffect(() => {
    if (!signInState?.success && signInState?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: signInState?.message,
      });

    } else if (signInState?.success) {
      setSignInOpen(false);
      setNewEmailOpen(true);

    } else if (!emailState?.success && emailState?.message?.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: emailState?.message,
      });

    } else if (emailState?.success) {
      setNewEmailOpen(false);

      toast({
        title: "Email was updated successfully!",
      });
    }
    
  }, [emailState]);

  return (
    <>
      <button
        onClick={() => {
          setSignInOpen(true);
        }}
        className={`w-full text-[14px] text-left outline-none border-b border-b-dark10 py-4 text-dark75 hover:text-darkText duration-300`}
      >
        Update email
      </button>
      {/* SHOW THIS DIALOG INITIALLY AND APPOINT FOR USER TO ENTER 
              THEIR CURRENT PASSWORD AND SIGN IN BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Log in to update email</DialogDescription>
          </DialogHeader>
          <form action={signInAction} className="duration-300">
            <Input htmlFor={"email"} label={"Email"} className="">
              <input
                className="form"
                id="email"
                name="email"
                type="text"
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
                id="password"
                name="password"
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
      <Dialog open={newEmailOpen} onOpenChange={setNewEmailOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Update email</DialogTitle>
            <DialogDescription>
              Insert a new email and update the changes
            </DialogDescription>
          </DialogHeader>
          <form action={emailAction} className="duration-300">
            <Input htmlFor={"email"} label={"Enter new email"} className="mt-3">
              <input
                className="form"
                id="email"
                name="email"
                defaultValue={emailState?.data?.email}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={emailLoading}
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

export default ChangeEmail;
