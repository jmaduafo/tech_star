"use client";
import { ChartConfig } from "@/components/ui/chart";
import { getAllItems } from "@/firebase/actions";
import LineChart from "../charts/LineChart";
import React, { useState, useEffect } from "react";
import NotAvailable from "@/components/ui/NotAvailable";

type Chart = {
  date: string;
  amount: string;
  project_name: string;
};
function LineData({
  timeRange,
  projectName,
}: {
  readonly timeRange: string;
  readonly projectName: string;
}) {
    
    // payment vs date
    
    const [chartData, setChartData] = useState<Chart[] | undefined>();
    const [filteredData, setFilteredData] = useState<Chart[] | undefined>();
    
    let chartConfig = {
      amount: {
        label: "Amount",
        color: "text-amber-400",
      },
    } satisfies ChartConfig;
  // [... { projectId: 45, }]

  async function showPayments() {
    const allPayments = await getAllItems("payments");

    const arr: Chart[] = [];
    allPayments?.forEach((paymentDoc, i) => {
      arr.push({
        project_name: paymentDoc?.project_name,
        date: paymentDoc?.date,
        amount: paymentDoc?.amount,
      });
    });

    setChartData(arr)
  }

  useEffect(() => {
    showPayments();
  }, []);

  function showFilter() {
      const projects = chartData?.filter(
        (item) => item?.project_name?.toLowerCase() === projectName?.toLowerCase()
      );
    
      if (projects?.length) {
        setFilteredData(projects?.filter((item) => {
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
        }))
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
