"use client";
import React, { useState, useEffect } from "react";
import Header6 from "@/components/fontsize/Header6";
import Loading from "@/components/ui/Loading";
import { useAuth } from "@/hooks/useAuth";
import { auth, db } from "@/firebase/config";
import { optionalS } from "@/utils/optionalS";
import { query, collection, where, doc, getDoc } from "firebase/firestore";
import { getQueriedCount, getUserData } from "@/firebase/actions";
import { onAuthStateChanged } from "firebase/auth";
import TextButton from "@/components/ui/buttons/TextButton";

function ContractorCount() {
  // const { user, loading } = useAuth();
  const [count, setCount] = useState<number | undefined>();

  async function getUser() {
   const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user?.uid);

        async function getUser() {
          const userSnap = await getDoc(userRef);

          const q = query(
            collection(db, "contractors"),
            where("team_id", "==", userSnap?.data()?.team_id)
          );

          const contractorCount = await getQueriedCount(q);

          setCount(contractorCount as number);
          console.log(contractorCount);
        }

        getUser();
      }
    });

    return () => unsub()
  }

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
            {count}
          </p>
          <Header6
            text={`Total contractor${optionalS(count)}`}
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

export default ContractorCount;
