import React from "react";
import Header6 from "@/components/fontsize/Header6";
import TextButton from "@/components/ui/buttons/TextButton";
import { HiArrowUpRight } from "react-icons/hi2";

function ProjectCount() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end">
        <TextButton text="View all" icon={<HiArrowUpRight className="w-4 h-4"/>} iconDirection="right"/>
      </div>
      <div className="mt-auto mb-6">
        <p className="text-center font-semibold text-[4vw] leading-[1]">3</p>
        <Header6 text="Total Projects" className="text-center mt-3" />
      </div>
    </div>
  );
}

export default ProjectCount;
