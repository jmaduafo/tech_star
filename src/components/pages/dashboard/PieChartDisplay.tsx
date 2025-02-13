import TextButton from "@/components/ui/buttons/TextButton";
import React from "react";
import {
  getAllItems,
  getQueriedCount,
} from "@/firebase/actions";
import { collection, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import NotAvailable from "@/components/ui/NotAvailable";

type Chart = {
    project_id: string;
    project_name: string;
    contractors: number | undefined;
    fill: string;
}
async function PieChartDisplay() {
  const chartData: Chart[] = [];

  let chartConfig = {
    contractors: {
        label: "Contractors"
    }
  } satisfies ChartConfig

  // [... { projectId: 45, }]

  const allProjects = await getAllItems("projects");

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

    count()

    let info = {
        label: projectDoc?.name,
        color: `amber-${50 * (i + 1)}`
    }

    // Adds an object to chartConfig
    // Ex: { ... chrome: { label: "Chrome", color: "hsl(var(--chart-1))"}}
    Object.defineProperty(chartConfig, projectDoc?.name?.toLowerCase(), {
        value: info,
        writable: true,
        enumerable: true,
        configurable: true
    });

  });


  return (
    <div>
      <div className="flex justify-end">
        <TextButton href="/charts" text="See more" iconDirection="right" />
      </div>
      {
        chartData.length ?
        <div className="mt-1">
      <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
          >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              />
            <Pie data={chartData} dataKey="contractors" nameKey="project_name" />
          </PieChart>
        </ChartContainer>
      </div>
      :
      <div>
        <NotAvailable text="No projects available"/>
      </div>
            }
    </div>
  );
}

export default PieChartDisplay;
