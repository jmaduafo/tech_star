"use client";
import React, { useState } from "react";
import Header3 from "@/components/fontsize/Header3";
import Paragraph from "@/components/fontsize/Paragraph";
import TextButton from "@/components/ui/buttons/TextButton";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";

function LineChartDisplay() {
  const [projectName, setProjectName] = useState<string>("");
  const [range, setRange] = useState("last 7 days");
  return (
    <div>
      <div className="flex justify-end">
        <TextButton href="/charts" text="See more" iconDirection="right" />
      </div>
      <div className="flex gap-3 justify-between items-start">
        <div className="flex-1">
          <Header3 text="At a Glance" />
          <Paragraph
            className="opacity-80"
            text={`All payments made within the ${range}`}
          />
        </div>
        <div className="flex-[2]">
          <div className="flex gap-3 justify-end mt-2">
            <SelectBar
              valueChange={(val: string) => setProjectName(val)}
              className="w-[150px]"
              value="Select a project"
              label="Project"
            >
              {["ice", "cream"].map((item) => {
                return (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectBar>
            <SelectBar
              valueChange={(val: string) => setRange(val.toLowerCase())}
              className="w-[150px]"
              value="Select a range"
              label="Project"
            >
              {["Last 7 days", "Last 1 month", "Last 3 months"].map((item) => {
                return (
                  <SelectItem value={item} key={item}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectBar>
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}

export default LineChartDisplay;
