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
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";

function Login() {
  const [loading, setLoading] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { toast } = useToast();
  const route = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const userResult = LoginUserSchema.safeParse(data);

    if (!userResult.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong!",
        description: userResult.error.issues[0].message,
      });

      setLoading(false)

      return;
    }

    const { email, password } = userResult.data;

    setLoading(true)

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        async function login() {
          try {
            // Make reference to an already existing user in "users" collection
            const oldUserRef = doc(db, "users", user?.uid);

            const oldUser = await getDoc(oldUserRef);

            // Set their team_id to route
            route.push(`/team/${oldUser?.data()?.team_id}/dashboard`);
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

        login();
      })
      .catch((err) => {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong!",
          description: "You are not a registered user. Please sign up instead. (" + err.message + ")" ,
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
          <Submit isClicked={loading} setIsClicked={setLoading} />
        </div>
      </form>
    </div>
  );
}

export default Login;
