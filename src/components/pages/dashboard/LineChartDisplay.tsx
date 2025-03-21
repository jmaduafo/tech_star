"use client";
import React, { useState, useEffect } from "react";
import Header3 from "@/components/fontsize/Header3";
import Paragraph from "@/components/fontsize/Paragraph";
import TextButton from "@/components/ui/buttons/TextButton";
import SelectBar from "@/components/ui/input/SelectBar";
import { SelectItem } from "@/components/ui/select";
import LineData from "./LineData";
import { Chart, User } from "@/types/types";
import { getAllItems } from "@/firebase/actions";
import { HiCheckCircle } from "react-icons/hi2";

function LineChartDisplay({ user }: { readonly user: User | undefined}) {
  const [chartData, setChartData] = useState<Chart[] | undefined>();
  const [projectName, setProjectName] = useState("");
  const [range, setRange] = useState("");
  const [submit, setSubmit] = useState({
    name: "",
    dateRange: "",
  });

  async function showPayments() {
    const allPayments = await getAllItems("payments");

    const arr: Chart[] = [];
    allPayments?.forEach((paymentDoc, i) => {
      arr.push({
        id: paymentDoc?.id,
        project_name: paymentDoc?.project_name,
        date: paymentDoc?.date,
        amount: paymentDoc?.amount,
      });
    });

    setChartData(arr);
  }

  useEffect(() => {
    showPayments();
  }, []);

  return (
    <div className="h-full">
      {chartData?.length ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      <div className="flex gap-3 justify-between items-start">
        <div className="flex-1">
          <Header3 text="At a Glance" />
          <Paragraph
            className="opacity-80"
            text={`All payments made within the ${range ?? "..."}`}
          />
        </div>
        <div className="flex-[2]">
          <div className="flex gap-2 justify-end mt-2">
            <SelectBar
              valueChange={(val: string) => setProjectName(val)}
              className="w-[150px]"
              value={projectName}
              placeholder="Select a project"
              label="Project"
            >
              {chartData?.length
                ? chartData?.map((item) => {
                    return (
                      <SelectItem value={item.project_name} key={item.id}>
                        {item.project_name}
                      </SelectItem>
                    );
                  })
                : null}
            </SelectBar>
            <SelectBar
              valueChange={setRange}
              className="w-[150px]"
              value={range}
              placeholder="Select a range"
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
            <button
              onClick={() =>
                chartData?.length &&
                projectName.length &&
                range.length &&
                setSubmit({
                  name: projectName,
                  dateRange: range,
                })
              }
              disabled={
                !chartData?.length || !projectName.length || !range.length
              }
              className=""
            >
              <HiCheckCircle className="text-darkText w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
      <LineData
        data={chartData}
        projectName={submit.name}
        timeRange={submit.dateRange}
      />
    </div>
  );
}

export default LineChartDisplay;
