"use client";
import { ChartConfig } from "@/components/ui/chart";
import { getAllItems } from "@/firebase/actions";
import LineChart from "../charts/LineChart";
import React, { useState, useEffect } from "react";
import NotAvailable from "@/components/ui/NotAvailable";
import { Chart } from "@/types/types";

function LineData({
  timeRange,
  projectName,
  data,
}: {
  readonly timeRange: string;
  readonly projectName: string;
  readonly data: Chart[] | undefined;
}) {
  // payment vs date
  const [filteredData, setFilteredData] = useState<Chart[] | undefined>();

  let chartConfig = {
    amount: {
      label: "Amount",
      color: "text-amber-400",
    },
  } satisfies ChartConfig;

  function showFilter() {
    const projects = data?.filter(
      (item) => item?.project_name?.toLowerCase() === projectName?.toLowerCase()
    );

    if (projects?.length) {
      setFilteredData(
        projects?.filter((item) => {
          const date = new Date(item.date);
          const referenceDate = new Date();

          // For last 3 months
          let daysToSubtract = 90;

          if (timeRange === "Last 1 month".toLowerCase()) {
            daysToSubtract = 30;
          } else if (timeRange === "Last 7 days".toLowerCase()) {
            daysToSubtract = 7;
          }
          const startDate = new Date(referenceDate);
          startDate.setDate(startDate.getDate() - daysToSubtract);

          return date >= startDate;
        })
      );
    }
  }

  useEffect(() => {
    showFilter();
  }, [timeRange, projectName]);

  return (
    <div className="h-[80%]">
      {filteredData?.length ? (
        <div>
          <LineChart chartConfig={chartConfig} chartData={filteredData} />
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <NotAvailable text="No payments available for visual data" />
        </div>
      )}
    </div>
  );
}

export default LineData;
