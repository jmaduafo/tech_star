import React from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import { db } from "@/firebase/config";
import { collection } from "firebase/firestore";
import { getAllItems } from "@/queryMutations/mutations";
import { useFirestoreQuery } from "@react-query-firebase/firestore";

function ProjectCount() {
  // const projectRef = collection(db, "projects")

  // // Provide the query to the hook
  // const query = useFirestoreQuery(["projects"], projectRef, {
  //   subscribe: true
  // });


  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end">
        <TextButton href="/projects" text="View all" iconDirection="right"/>
      </div>
      <div className="mt-auto mb-3">
        <p className="text-center font-semibold text-[4vw] leading-[1]">3</p>
        <Header6 text="Total projects" className="text-center mt-3" />
      </div>
    </div>
  );
}

export default ProjectCount;
