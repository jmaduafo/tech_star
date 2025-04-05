"use client";
import React, { useState, useEffect } from "react";
import AuthContainer from "../AuthContainer";
import ContentContainer from "../ContentContainer";
import Header1 from "@/components/fontsize/Header1";
import Header6 from "@/components/fontsize/Header6";
import { optionalS } from "@/utils/optionalS";
import AddButton from "@/components/ui/buttons/AddButton";
import DataTable from "@/components/ui/tables/DataTable";
import { teamColumns } from "@/components/ui/tables/columns";
import { User } from "@/types/types";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/components/ui/Loading";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, job_titles } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { CreateMemberSchema } from "@/zod/validation";
import { toast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";

function MainPage() {
  const [teamData, setTeamData] = useState<User[] | undefined>();
  const [teamName, setTeamName] = useState<string | undefined>();

  const [userLocation, setUserLocation] = useState("");
  const [userHireType, setUserHireType] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userJobTitle, setUserJobTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { userData } = useAuth();

  // GETS ALL THE MEMBERS /USERS UNDER A TEAM
  async function getAllMembers() {
    try {
      if (!userData) {
        return;
      }

      const teamSnap = await getDoc(doc(db, "teams", userData?.team_id));

      teamSnap?.exists()
        ? setTeamName(teamSnap?.data()?.name)
        : setTeamName(undefined);

      const membersq = query(
        collection(db, "users"),
        where("team_id", "==", userData?.team_id),
        orderBy("created_at", "asc")
      );

      const unsub = onSnapshot(membersq, (snap) => {
        const allMembers: User[] = [];

        snap.forEach((doc) => {
          allMembers.push({ ...(doc?.data() as User), id: doc?.id });
        });

        setTeamData(allMembers);

        return () => unsub();
      });
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async function addMember(formData: FormData) {
    const firstName = formData.get("first_name");
    const lastName = formData.get("last_name");
    const userEmail = formData.get("email");
    const userPassword = formData.get("password");
    const userConfirm = formData.get("confirm_password");

    const values = {
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      password: userPassword,
      confirm: userConfirm,
      location: userLocation,
      job_title: userJobTitle,
      role: userRole,
      hire_type: userHireType,
    };

    if (values.confirm !== values.password) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description:
          "The password does not match the confirm password field. Please try again.",
      });

      return;
    }

    const result = CreateMemberSchema.safeParse(values);

    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: result.error.issues[0].message,
      });

      return;
    }

    const {
      first_name,
      last_name,
      email,
      password,
      job_title,
      role,
      hire_type,
      location,
    } = result.data;

    try {
      setLoading(true);

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;

          async function create() {
            try {
              await setDoc(doc(db, "users", user?.uid), {
                first_name,
                last_name,
                full_name: first_name + " " + last_name,
                email,
                team_id: userData?.team_id,
                job_title,
                role: role.toLowerCase(),
                hire_type: hire_type.toLowerCase(),
                id: user?.uid,
                location,
                is_owner: false,
                bg_image_index: 0,
                created_at: serverTimestamp(),
                updated_at: null,
                is_online: false,
              });

              setOpen(false);

              toast({
                title: "Member was successfully added!",
                description:
                  "The new member can now log in on their device and are allowed access to the team's data",
              });

            } catch (err: any) {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong",
                description: err.message,
              });
            }
          }

          create();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          toast({
            variant: "destructive",
            title: `Error code: ${errorCode}`,
            description: errorMessage,
          });
        });
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

  useEffect(() => {
    getAllMembers();
  }, [userData?.team_id]);

  return (
    <AuthContainer>
      <ContentContainer>
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-5 mb-8 text-lightText">
            {teamName ? (
              <Header1 text={`${teamName}`} className="capitalize" />
            ) : null}
            {teamData ? (
              <Header6
                text={`${teamData?.length} member${optionalS(
                  teamData?.length
                )}`}
              />
            ) : null}
          </div>
          {userData?.is_owner ? (
            <AddButton
              title={"member"}
              desc={"Create a new team member"}
              setOpen={setOpen}
              open={open}
            >
              <form action={addMember}>
                {/* FIRST NAME */}
                <Input htmlFor={"first_name"} label={"First name *"}>
                  <input
                    type="text"
                    className="form"
                    name="first_name"
                    id="first_name"
                  />
                </Input>
                {/* LAST NAME */}
                <Input
                  htmlFor={"last_name"}
                  label={"Last name *"}
                  className="mt-3"
                >
                  <input
                    type="text"
                    className="form"
                    name="last_name"
                    id="last_name"
                  />
                </Input>
                {/* EMAIL */}
                <Input htmlFor={"email"} label={"Email *"} className="mt-3">
                  <input type="text" className="form" name="email" id="email" />
                </Input>
                <div className="flex gap-4 items-start">
                  {/* PASSWORD */}
                  <Input
                    htmlFor={"password"}
                    label={"Password *"}
                    className="mt-3 flex-1"
                  >
                    <input
                      type="password"
                      className="form"
                      name="password"
                      id="password"
                    />
                  </Input>
                  {/* CONFIRM PASSWORD */}
                  <Input
                    htmlFor={"confirm_password"}
                    label={"Confirm password *"}
                    className="mt-3 flex-1"
                  >
                    <input
                      type="password"
                      className="form"
                      name="confirm_password"
                      id="confirm_password"
                    />
                  </Input>
                </div>
                {/* LOCATION */}
                <SelectBar
                  value={userLocation}
                  valueChange={setUserLocation}
                  placeholder={"Select member's location *"}
                  label={"Countries"}
                  className="mt-5"
                >
                  {country_list.map((item) => {
                    return (
                      <SelectItem value={item.name} key={item.code}>
                        {item.name}
                      </SelectItem>
                    );
                  })}
                </SelectBar>
                {/* JOB TITLE */}
                <SelectBar
                  value={userJobTitle}
                  valueChange={setUserJobTitle}
                  placeholder={"Select a job title *"}
                  label={"Job title"}
                  className="mt-5"
                >
                  {job_titles.map((item) => {
                    return (
                      <SelectItem value={item} key={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectBar>
                {/* ROLES */}
                <SelectBar
                  value={userRole}
                  valueChange={setUserRole}
                  placeholder={"Select a role *"}
                  label={"Roles"}
                  className="mt-5"
                >
                  {["Viewer", "Editor", "Admin"].map((item) => {
                    return (
                      <SelectItem
                        value={item}
                        key={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectBar>
                {/* HIRE TYPE */}
                <SelectBar
                  value={userHireType}
                  valueChange={setUserHireType}
                  placeholder={"Select a hire type *"}
                  label={"Hire type"}
                  className="mt-5"
                >
                  {["Employee", "Contractor", "Independent"].map((item) => {
                    return (
                      <SelectItem
                        value={item}
                        key={item}
                        className="capitalize"
                      >
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectBar>
                {/* SUBMIT BUTTON */}
                <div className="flex justify-center mt-6 scale-75">
                  <Submit loading={loading} />
                </div>
              </form>
            </AddButton>
          ) : null}
        </div>
        <div>
          {!teamData ? (
            <div className="py-8 flex justify-center">
              <Loading className="w-10 h-10" />
            </div>
          ) : (
            <DataTable
              columns={teamColumns}
              data={teamData}
              is_payment={false}
              team_name={"Janah"}
              advanced
            />
          )}
        </div>
      </ContentContainer>
    </AuthContainer>
  );
}

export default MainPage;
