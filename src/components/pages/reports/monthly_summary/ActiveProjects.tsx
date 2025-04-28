"use client"
import React, { useState, useEffect } from "react";
import SummaryCard from "./SummaryCard";
import { User } from "@/types/types";
import { db } from "@/firebase/config";
import { query, collection, where } from "firebase/firestore";
import { getQueriedCount } from "@/firebase/actions";

function ActiveProjects({ user }: { readonly user: User | undefined }) {

  const [ totalProjects, setTotalProjects ] = useState<number | undefined>()
  
    const getProjects = async () => {
      try {
        if (!user) {
          return;
        }
  
        const q = query(
          collection(db, "projects"),
          where("team_id", "==", user?.team_id),
          where("is_completed", "!=", true),
        );
  
        const count = await getQueriedCount(q)
  
        setTotalProjects(count)
  
      } catch (err: any) {
        console.log(err.message)
      }
    }
  
    useEffect(() => {
      getProjects()
    }, [ user?.id ?? "guest"])
 
  return <SummaryCard title="Active Projects" content={totalProjects} />;
}

export default ActiveProjects;
