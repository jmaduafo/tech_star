import React from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import { getCount } from "@/firebase/actions";
import Loading from "@/components/ui/Loading";
import { optionalS } from "@/utils/optionalS";

async function ProjectCount() {
  const count = await getCount("projects");

  return (
    <>
      {typeof count === "number" ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-end">
            <TextButton
              href="/projects"
              text="View all"
              iconDirection="right"
            />
          </div>
          <div className="mt-auto mb-3">
            <p className="text-center font-semibold text-[4vw] leading-[1]">
              {count ?? 0}
            </p>
            <Header6 text={`Total project${optionalS(count)}`} className="text-center mt-3" />
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
