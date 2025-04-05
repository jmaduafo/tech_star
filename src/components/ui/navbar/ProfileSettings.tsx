"use client";
import React, { useEffect, useState } from "react";
import Header6 from "@/components/fontsize/Header6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Input from "../input/Input";
import Submit from "../buttons/Submit";
import { User } from "@/types/types";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { toast } from "@/hooks/use-toast";

function ProfileSettings({ user }: { readonly user: User | undefined }) {
  const [names, setNames] = useState({
    first_name: "",
    last_name: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nextSlide, setNextSlide] = useState(false);

  function setData() {
    setNames({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
    });

    setUserEmail(user?.email ?? "");
  }

  async function changeNames() {}

  async function changeEmail() {}

  async function signInUser() {
    setPasswordLoading(true);

    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then((userCredential) => {
        // Signed in

        setNextSlide(true);
        // ...
      })
      .catch((error) => {
        let errorMessage = error.message;

        toast({
          variant: "destructive",
          title: `Uh oh! Something went wrong`,
          description: `Password was incorrect: ${errorMessage}`,
        });
      })
      .finally(() => {
        setPasswordLoading(false);
      });
  }

  async function changePassword() {
    setPasswordLoading(true);

    const user = auth.currentUser;

    if (!user) {
      return;
    }

    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
        toast({
          title: `Password was updated successfully!`,
        });
      })
      .catch((error) => {
        let errorMessage = error.message;

        toast({
          variant: "destructive",
          title: `Uh oh! Something went wrong`,
          description: `${errorMessage}`,
        });
      })
      .finally(() => {
        setPasswordLoading(false);
      });
  }

  useEffect(() => {
    setData();
  }, []);

  return (
    <section className="mb-6">
      <Header6 text="Profile settings" className="text-darkText mb-4" />
      {/* UPDATE NAME, EMAIL, OR USERNAME */}
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Update names</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input htmlFor={"first_name"} label={"First name"}>
                  <input
                    className="form"
                    id="first_name"
                    name="first_name"
                    value={names.first_name}
                    onChange={(e) =>
                      setNames({ ...names, first_name: e.target.value })
                    }
                  />
                </Input>
                <Input
                  htmlFor={"last_name"}
                  label={"Last name"}
                  className="mt-3"
                >
                  <input
                    className="form"
                    id="last_name"
                    name="last_name"
                    value={names.last_name}
                    onChange={(e) =>
                      setNames({ ...names, last_name: e.target.value })
                    }
                  />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={
                      user?.first_name === names.first_name &&
                      user?.last_name === names.last_name
                    }
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Update email</AccordionTrigger>
            <AccordionContent>
              <form>
                <Input htmlFor={"user_email"} label={"Email"} className="mt-3">
                  <input
                    className="form"
                    id="user_email"
                    name="user_email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </Input>
                <div className="flex justify-end mt-4">
                  <Submit
                    loading={false}
                    width_height="w-[85px] h-[40px]"
                    width="w-[40px]"
                    arrow_width_height="w-6 h-6"
                    disabledLogic={user?.email === userEmail}
                  />
                </div>
              </form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Change password</AccordionTrigger>
            <AccordionContent>
              {nextSlide ? (
                // IF USER IS SIGNED IN SUCCESSFULLY, THEY ARE ALLOWED TO CHANGE THEIR OLD
                // PASSWORD TO A NEW ONE
                <form action={changePassword} className="duration-300">
                  <Input
                    htmlFor={"user_password"}
                    label={"Enter new password"}
                    className="mt-3"
                  >
                    <input
                      className="form"
                      id="new_password"
                      name="new_password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
              ) : (
                // SHOW THIS INITIALLY AND APPOINT FOR USER TO ENTER THEIR CURRENT PASSWORD AND SIGN IN
                // BEFORE BEING ALLOWED TO UPDATE THEIR PASSWORD
                <form action={signInUser} className="duration-300">
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
                      loading={passwordLoading}
                      width_height="w-[85px] h-[40px]"
                      width="w-[40px]"
                      arrow_width_height="w-6 h-6"
                    />
                  </div>
                </form>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

export default ProfileSettings;
