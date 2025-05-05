import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { User } from "@/types/types";
import { collection, doc, getDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { getQueriedItems } from "@/firebase/actions";
import { mostFrequent } from "@/utils/chartHelpers";
import { pastMonth } from "@/utils/dateAndTime";

function TopContractor({ user }: { readonly user: User | undefined }) {
  const [topContractor, setTopContractor] = useState<string | undefined>();

  const getTopContractor = async () => {
    try {
      if (!user) {
        return;
      }

      const monthq = query(
        collection(db, "payments"),
        where("team_id", "==", user?.team_id),
        where("date", ">=", pastMonth().startTime),
        where("date", "<=", pastMonth().endTime)
      );

      const regularq = query(
        collection(db, "payments"),
        where("team_id", "==", user?.team_id)
      );

      const [monthSnap, regularSnap] = await Promise.all([
        getQueriedItems(monthq),
        getQueriedItems(regularq),
      ]);

      const newArray = monthSnap.length ? monthSnap.map((item) => item.contractor_id) : regularSnap.map((item) => item.contractor_id)

      if (!newArray.length || !newArray) {
        setTopContractor("--");
        return;
      }

      const topContractorId = mostFrequent(newArray);

      if (!topContractorId) {
        setTopContractor("--");
        return;
      }

      const getContractor = await getDoc(
        doc(db, "contractors", topContractorId)
      );

      setTopContractor(getContractor?.data()?.name);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getTopContractor();
  }, [user?.id ?? "guest"]);

  return <SummaryCard title="Top Contractor" content={topContractor} />;
}

export default TopContractor;
