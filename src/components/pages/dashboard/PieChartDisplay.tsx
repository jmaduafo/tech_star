"use client";
import TextButton from "@/components/ui/buttons/TextButton";
import React, { useEffect, useState } from "react";
import {
  getQueriedCount,
  getQueriedItems,
} from "@/firebase/actions";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ChartConfig } from "@/components/ui/chart";
import NotAvailable from "@/components/ui/NotAvailable";
import Loading from "@/components/ui/Loading";
import PieChart from "../charts/PieChart";
import { User } from "@/types/types";

type Chart = {
  project_id: string;
  project_name: string;
  contractors: number | undefined;
  fill: string;
};

function PieChartDisplay({ user }: { readonly user: User | undefined }) {
  const [ chartData, setChartData ] = useState<Chart[] | undefined>([])

  let chartConfig = {
    contractors: {
      label: "Contractors",
    },
  } satisfies ChartConfig;

  async function getChartData() {
    if (!user) {
      return;
    }
    
    const projectq = query(
      collection(db, "projects"),
      where("team_id", "==", user?.team_id)
    );
    
    const allProjects = await getQueriedItems(projectq);
    
    if (!allProjects) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Loading />;
        </div>
      );
    }
    
    const chart: Chart[] = [];

    allProjects?.forEach(async (project, i) => {
      const contractorq = query(
        collection(db, "contractors"),
        where("project_id", "==", project?.id)
      );

      const contractorsCount = await getQueriedCount(contractorq);

      chart.push({
        project_id: project?.id,
        project_name: project?.name,
        contractors: contractorsCount,
        fill: `var(--color-${project?.name?.toLowerCase()})`,
      });

        let info = {
        label: project?.name,
        color: `amber-${50 * (i + 1)}`,
      };

        Object.defineProperty(chartConfig, project?.name?.toLowerCase(), {
        value: info,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    setChartData(chart)
  }

  useEffect(() => {
   getChartData()
  }, [user?.id ?? "guest"]);

  return (
    <div className="h-full">
      {chartData?.length ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      {chartData?.length ? (
        <div className="mt-1">
          <PieChart
            chartConfig={chartConfig}
            data={chartData}
            nameKey="project_name"
            dataKey="contractors"
          />
        </div>
      ) : (
        <div
          className={`${
            chartData?.length ? "h-[90%]" : "h-full"
          } flex items-center justify-center`}
        >
          <NotAvailable text="No projects available" />
        </div>
      )}
    </div>
  );
}

export default PieChartDisplay;
