"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input/Input";
import Submit from "@/components/ui/buttons/Submit";
import { LoginUserSchema } from "@/zod/validation";
import { toast } from "@/hooks/use-toast";
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { deleteItem } from "@/firebase/actions";
import { useRouter } from "next/navigation";

function DeleteAccount() {
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  const router = useRouter();

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    const userPassword = formData.get("password");
    const userEmail = formData.get("email");

    const values = {
      email: userEmail,
      password: userPassword,
    };

    const result = LoginUserSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      setLoading(false);

      return;
    }

    const { email, password } = result.data;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        // ONCE USER IS SIGNED IN, THEN DELETE USER FROM THE AUTH DATABASE
        deleteUser(user)
          .then(() => {
            const del = async () => {
              try {
                // THEN ALSO DELETE USER FROM FIRESTORE
                await deleteItem("users", user?.uid);
              } catch (err: any) {
                console.log(err.message);
              }
            };

            del();

            //  ONCE DELETED, NAVIGATE TO THE ROOT PAGE
            router.push("/");
            router.refresh();
          })
          .catch((error) => {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong",
              description: error.message,
            });
          });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <button
        onClick={() => {
          setAlertOpen(true);
          setSignInOpen(false);
        }}
        className={`text-left outline-none border-b border-b-dark10 py-4 text-[#dc2626c4] hover:text-[#dc2626] duration-300 `}
      >
        Delete account
      </button>
      {/* ALERTS USER IF THEY WANT TO PROCEED IN CASE THEY ACCIDENTLY PRESSED DELETE */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setAlertOpen(false);
                setSignInOpen(true);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* POPUP THAT ALLOWS USER TO SIGN IN TO THEIR ACCOUNT IN ORDER FOR THEIR ACCOUNT TO BE DELETED */}
      <Dialog open={signInOpen} onOpenChange={setSignInOpen}>
        <DialogContent className="sm:max-w-[425px] backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              We are sorry to see you go. Please enter your email and password
              to delete your account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDelete}>
            <Input htmlFor={"email"} label={"Email"}>
              <input className="form" id="email" name="email" />
            </Input>
            <Input htmlFor={"password"} label={"Password"} className="mt-3">
              <input
                className="form"
                type="password"
                id="password"
                name="password"
              />
            </Input>
            <div className="flex justify-end mt-4">
              <Submit
                loading={loading}
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

export default DeleteAccount;
