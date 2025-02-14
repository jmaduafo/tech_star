import TextButton from "@/components/ui/buttons/TextButton";
import React from "react";
import { getAllItems, getQueriedCount } from "@/firebase/actions";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ChartConfig } from "@/components/ui/chart";
import NotAvailable from "@/components/ui/NotAvailable";
import Loading from "@/components/ui/Loading";
import PieChart from "../charts/PieChart";

type Chart = {
  project_id: string;
  project_name: string;
  contractors: number | undefined;
  fill: string;
};

async function PieChartDisplay() {
  const chartData: Chart[] = [];

  let chartConfig = {
    contractors: {
      label: "Contractors",
    },
  } satisfies ChartConfig;

  const allProjects = await getAllItems("projects");

  if (!allProjects) {
    return <Loading />;
  }

  allProjects?.forEach((projectDoc, i) => {
    const contractorQuery = query(
      collection(db, "contractors"),
      where("project_id", "==", projectDoc?.id)
    );

    async function count() {
      const contractorsCount = await getQueriedCount(contractorQuery);

      chartData.push({
        project_id: projectDoc?.id,
        project_name: projectDoc?.name,
        contractors: contractorsCount,
        fill: `var(--color-${projectDoc?.name?.toLowerCase()})`,
      });
    }

    count();

    let info = {
      label: projectDoc?.name,
      color: `amber-${50 * (i + 1)}`,
    };

    // Adds an object to chartConfig object
    // Ex: { ... chrome: { label: "Chrome", color: "hsl(var(--chart-1))"}}
    Object.defineProperty(chartConfig, projectDoc?.name?.toLowerCase(), {
      value: info,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  });

  return (
    <div className="h-full">
      {chartData?.length ? (
        <div className="flex justify-end">
          <TextButton href="/charts" text="See more" iconDirection="right" />
        </div>
      ) : null}
      {chartData.length ? (
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
