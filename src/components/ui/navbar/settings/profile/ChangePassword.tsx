"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Submit from "@/components/ui/buttons/Submit";
import Input from "@/components/ui/input/Input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PasswordValidation } from "@/zod/validation";
import { toast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { User } from "@/types/types";

function ChangePassword({ user }: { readonly user: User | undefined }) {
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [currentLoading, setCurrentLoading] = useState(false);
  const [newLoading, setNewLoading] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);

  async function signInUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCurrentLoading(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      password: formData.get("user_password"),
    };

    const result = PasswordValidation.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      return;
    }

    const { password } = result.data;

    try {
      if (!user) {
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        user.email,
        password
      );

      if (userCredential.user) {
        setUserPassword("")
        setNewPasswordOpen(true);
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

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewLoading(true);

    const formData = new FormData(e.currentTarget);

    const values = {
      password: formData.get("user_password"),
    };

    const result = PasswordValidation.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      return;
    }

    const { password } = result.data;

    try {
      const user = auth.currentUser;

      if (!user) {
        return;
      }

      await updatePassword(user, password);

      toast({
        title: "Password was updated successfull!",
      });

      setNewPasswordOpen(false);
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
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Change password</AccordionTrigger>
          <AccordionContent>
            {/* SHOW THIS INITIALLY AND APPOINT FOR USER TO ENTER THEIR CURRENT PASSWORD AND SIGN IN
            BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD */}
            <form onSubmit={signInUser} className="duration-300">
              <Input
                htmlFor={"user_password"}
                label={"Enter current password"}
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog open={newPasswordOpen} onOpenChange={setNewPasswordOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>New password</DialogTitle>
            <DialogDescription>
              Insert a new password and update the changes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={changePassword} className="duration-300">
            <Input
              htmlFor={"user_password"}
              label={"Enter new password"}
              className="mt-3"
            >
              <input
                className="form"
                id="user_password"
                name="user_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

export default ChangePassword;
