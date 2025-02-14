"use client";
import React, { useState, useEffect } from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import { getQueriedCount, getUserData } from "@/firebase/actions";
import Loading from "@/components/ui/Loading";
import { optionalS } from "@/utils/optionalS";
import { db, auth } from "@/firebase/config";
import { query, collection, where, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { onAuthStateChanged } from "firebase/auth";

function ProjectCount() {
  const { user, loading } = useAuth();
  const [count, setCount] = useState<number | undefined>();

  async function getUser() {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user?.uid);

        async function getUser() {
          const userSnap = await getDoc(userRef);

          const q = query(
            collection(db, "projects"),
            where("team_id", "==", userSnap?.data()?.team_id)
          );

          const projectCount = await getQueriedCount(q);

          setCount(projectCount as number);
          console.log(projectCount);
        }

        getUser();
      }
    });

    return () => unsub();
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          {count > 0 ? (
            <div className="flex justify-end">
              <TextButton
                href="/projects"
                text="View all"
                iconDirection="right"
              />
            </div>
          ) : null}
          <div className="mt-auto mb-3">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count ?? 0}
            </p>
            <Header6
              text={`Total project${optionalS(count)}`}
              className="text-center mt-3"
            />
          </div>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <Loading />
        </div>
      )}
    </>
  );
}

export default ProjectCount;
