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
  where,
} from "firebase/firestore";
import { db } from "@/firebase/config";

function MainPage() {
  const [teamData, setTeamData] = useState<User[] | undefined>();
  const [teamName, setTeamName] = useState<string | undefined>();

  const { userData } = useAuth();

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
          <AddButton title={"member"} desc={"Create a new team member"}>
            <div></div>
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
