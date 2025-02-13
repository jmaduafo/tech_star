"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React from "react";
import { PieChart as PieContainer, Pie, Legend } from "recharts";

type Chart = {
  project_id: string;
  project_name: string;
  contractors: number | undefined;
  fill: string;
};

function PieChart({
  data,
  chartConfig,
  dataKey,
  nameKey,
}: {
  readonly data: Chart[];
  readonly chartConfig: ChartConfig;
  readonly nameKey: string;
  readonly dataKey: string;
}) {
  return (
    // <ResponsiveContainer width="100%" height="100%">
    //     <PieContainer width={400} height={400}>
    //       <Pie
    //         dataKey="value"
    //         isAnimationActive={false}
    //         data={data}
    //         cx="50%"
    //         cy="50%"
    //         outerRadius={80}
    //         fill="#8884d8"
    //         label
    //       />
    //       <Legend layout="vertical" align="right" verticalAlign="middle" />
    //       <Tooltip />
    //     </PieContainer>
    //   </ResponsiveContainer>
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieContainer>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} stroke="0" />
      </PieContainer>
    </ChartContainer>
  );
}

export default PieChart;
