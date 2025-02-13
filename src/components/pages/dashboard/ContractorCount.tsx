import Header6 from "@/components/fontsize/Header6";
import Loading from "@/components/ui/Loading";
import { getCount } from "@/firebase/actions";
import { optionalS } from "@/utils/optionalS";
import React from "react";

async function ContractorCount() {
  const count = await getCount("contractors");

  return (
    <>
      {typeof count === "number" ? (
        <div className="flex h-full justify-center items-end">
          <div className="mb-3">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count}
            </p>
            <Header6 text={`Total Contractor${optionalS(count)}`} className="text-center mt-3" />
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
