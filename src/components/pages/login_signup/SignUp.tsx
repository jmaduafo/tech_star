"use client";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreateUserSchema } from "@/zod/validation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/config";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import IconInput from "@/components/ui/input/IconInput";
import { CiLock, CiMail } from "react-icons/ci";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import Submit from "@/components/ui/buttons/Submit";

function SignUp() {
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [isClicked, setIsClicked] = useState(false);
  const [viewPass, setViewPass] = useState(false);

  const { toast } = useToast();
  const route = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  async function handleSubmit(formData: FormData) {
    const data = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const userResult = CreateUserSchema.safeParse(data);

    if (!userResult.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong!",
        description: userResult.error.issues[0].message,
      });

      return;
    }

    const { first_name, last_name, email, password } = userResult.data;

    setIsClicked(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        const teamsRef = collection(db, "teams");

        async function create() {
          try {
            // Instantly create a new team after user is registered
            const newTeam = await addDoc(teamsRef, {
              team_name: first_name + "'s team",
            });

            // If new team is created, add new team id to the new user's document in "users" schema
            if (newTeam) {
              // newly authenticated user should relate to "users" collection with same id
              const newUserRef = doc(db, "users", user.uid);

              await setDoc(newUserRef, {
                id: user?.uid,
                first_name,
                last_name,
                email,
                team_id: newTeam?.id,
                is_admin: true,
                created_at: serverTimestamp(),
              });

              // Take user to dashboard
              route.push(`/team/${newTeam?.id}/dashboard`);
            }
          } catch (err: any) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong!",
              description: err.message,
            });
          } finally {
            setIsClicked(false);
          }
        }

        create();
        // ...
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong!",
          description: err.message,
        });
      })
      .finally(() => {
        setIsClicked(false);
      });
  }
  return (
    <div>
      <Header1 text="Join us today!" />
      <Header6
        className="mt-4"
        text="Create an account to streamline your workflow and manage projects with ease."
      />
      <form className="mt-10" action={handleSubmit}>
        <div className="flex gap-3">
          <div>
            <IconInput
              icon={<div className="w-6 h-6 flex justify-center items-center"><p>A</p></div>}
              input={
                <input
                  placeholder="First name"
                  type="text"
                  name="first_name"
                  value={userInfo.first_name}
                  onChange={handleChange}
                  className="placeholder-dark50"
                />
              }
            />
          </div>
          <div>
            <IconInput
              icon={<div className="w-6 h-6 flex justify-center items-center"><p>Z</p></div>}
              input={
                <input
                  placeholder="Last name"
                  type="text"
                  name="last_name"
                  value={userInfo.last_name}
                  onChange={handleChange}
                  className="placeholder-dark50"
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
                value={userInfo.email}
                onChange={handleChange}
                className="placeholder-dark50"
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
                className="placeholder-dark50"
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
          <Submit isClicked={isClicked} setIsClicked={setIsClicked} />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
