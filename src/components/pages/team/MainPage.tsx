"use client";
import React, { useState, useEffect, useActionState } from "react";
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
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import Input from "@/components/ui/input/Input";
import SelectBar from "@/components/ui/input/SelectBar";
import { country_list, job_titles } from "@/utils/dataTools";
import { SelectItem } from "@/components/ui/select";
import Submit from "@/components/ui/buttons/Submit";
import { toast } from "@/hooks/use-toast";
import { createUser } from "@/zod/actions";
import { getDocumentItem } from "@/firebase/actions";

function MainPage() {
  const [state, action, isLoading] = useActionState(createUser, {
    data: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm: "",
      location: "",
      job_title: "",
      role: "",
      hire_type: "",
    },
    message: "",
    success: false,
  });
  const [teamData, setTeamData] = useState<User[] | undefined>();
  const [teamName, setTeamName] = useState<string | undefined>();

  const [open, setOpen] = useState(false);

  const { userData } = useAuth();

  // GETS ALL THE MEMBERS /USERS UNDER A TEAM
  async function getAllMembers() {
    try {
      if (!userData) {
        return;
      }

      const teamSnap = await getDocumentItem("teams", userData?.team_id);

      setTeamName(teamSnap ? teamSnap?.name : "");

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

  useEffect(() => {
    getAllMembers();
  }, [userData?.team_id]);

  useEffect(() => {
    if (!state?.success && state?.message.length) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: state?.message,
      });
    } else if (state?.success) {
      toast({
        title:
          "Team member was added successfully! New user can now sign in to view team dashboard.",
      });

      setOpen(false);
    }
  }, [state]);

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
          <AddButton
            title={"member"}
            desc={"Create a new team member"}
            setOpen={setOpen}
            open={open}
          >
            <form action={action}>
              {/* FIRST NAME */}
              <Input htmlFor={"first_name"} label={"First name *"}>
                <input
                  type="text"
                  className="form"
                  name="first_name"
                  id="first_name"
                  defaultValue={state?.data?.first_name}
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
                  defaultValue={state?.data?.last_name}
                />
              </Input>
              {/* EMAIL */}
              <Input htmlFor={"email"} label={"Email *"} className="mt-3">
                <input
                  type="text"
                  className="form"
                  name="email"
                  id="email"
                  defaultValue={state?.data?.email}
                />
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
                    defaultValue={state?.data?.password}
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
                    name="confirm"
                    id="confirm_password"
                    defaultValue={state?.data?.confirm}
                  />
                </Input>
              </div>
              {/* LOCATION */}
              <SelectBar
                defaultValue={state?.data?.location}
                name="location"
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
                defaultValue={state?.data?.job_title}
                name="job_title"
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
                defaultValue={state?.data?.role}
                name="role"
                placeholder={"Select a role *"}
                label={"Roles"}
                className="mt-5"
              >
                {["Viewer", "Editor", "Admin"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              {/* HIRE TYPE */}
              <SelectBar
                defaultValue={state?.data?.hire_type}
                name="hire_type"
                placeholder={"Select a hire type *"}
                label={"Hire type"}
                className="mt-5"
              >
                {["Employee", "Contractor", "Independent"].map((item) => {
                  return (
                    <SelectItem value={item} key={item} className="capitalize">
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectBar>
              {/* SUBMIT BUTTON */}
              <div className="flex justify-center mt-6 scale-75">
                <Submit loading={isLoading} />
              </div>
            </form>
          </AddButton>
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
