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
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
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
  const [viewPass, setViewPass] = useState(false);

  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const route = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  async function checkUniqueUser(email: string): Promise<boolean> {
    const usersRef = collection(db, "users");
    const findEmail = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(findEmail);
  
    return !snapshot.empty; // true if email exists
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

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

      setLoading(false);

      return;
    }

    const { first_name, last_name, email, password } = userResult.data;

    const isEmailTaken = await checkUniqueUser(email);
    if (isEmailTaken) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong!",
        description: "This email address is already in use.",
      });
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
  
      const newTeam = await addDoc(collection(db, "teams"), {
        name: `${first_name}'s team`,
        organization_name: null,
      });
  
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`,
        email,
        team_id: newTeam.id,
        is_owner: true,
        is_online: true,
        bg_image_index: 0,
        job_title: null,
        hire_type: "independent",
        role: "admin",
        location: null,
        created_at: serverTimestamp(),
        updated_at: null,
      });
  
      route.push("/dashboard");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong!",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Header1 text="Join us today!" />
      <Header6
        className="mt-4"
        text="Create an account to streamline your workflow and manage projects with ease."
      />
      <form className="mt-10" onSubmit={handleSubmit}>
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
                  value={userInfo.first_name}
                  onChange={handleChange}
                  className="placeholder-dark50"
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
          <Submit loading={loading} />
        </div>
      </form>
    </div>
  );
}

export default SignUp;
