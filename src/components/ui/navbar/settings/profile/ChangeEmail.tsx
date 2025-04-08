"use client";
import Submit from "@/components/ui/buttons/Submit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import { auth } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types/types";
import {
  EmailValidation,
  LoginUserSchema
} from "@/zod/validation";
import {
  signInWithEmailAndPassword,
  updateEmail
} from "firebase/auth";
import React, { useState } from "react";

type Email = {
  readonly user: User | undefined;
};

function ChangeEmail({ user }: Email) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [currentLoading, setCurrentLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);

  const [signInOpen, setSignInOpen] = useState(false);
  const [newEmailOpen, setNewEmailOpen] = useState(false);

  async function signInUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentLoading(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      email: formData.get("user_email"),
      password: formData.get("user_password"),
    };

    const result = LoginUserSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      setCurrentLoading(false);

      return;
    }

    const { email, password } = result.data;

    try {
      if (!user) {
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        setUserEmail("");
        setUserPassword("");
        setSignInOpen(false);
        setNewEmailOpen(true);
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setCurrentLoading(false);
    }
  }

  async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewLoading(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      email: formData.get("user_email"),
    };

    const result = EmailValidation.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      setNewLoading(false);

      return;
    }

    const { email } = result.data;

    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      await updateEmail(user, email);

      toast({
        title: "Email was updated successfull!",
      });

      setNewEmail("");
      setNewEmailOpen(false);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setNewLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => {
          setSignInOpen(true);
        }}
        className={`w-full text-[14px] text-dark75 text-left outline-none border-b border-b-dark10 py-4`}
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
          <form onSubmit={signInUser} className="duration-300">
            <Input htmlFor={"user_email"} label={"Email"} className="">
              <input
                className="form"
                id="user_email"
                name="user_email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
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
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={currentLoading}
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
          <form onSubmit={changeEmail} className="duration-300">
            <Input
              htmlFor={"user_email"}
              label={"Enter new email"}
              className="mt-3"
            >
              <input
                className="form"
                id="user_email"
                name="user_email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={newLoading}
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
