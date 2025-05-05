"use client";
import React, { useState, useEffect } from "react";
import Card from "@/components/ui/cards/MyCard";
import { ChartData, Contract, Stage } from "@/types/types";
import { chartFormat, getUniqueObjects } from "@/utils/chartHelpers";
import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import PieChart2 from "@/components/ui/charts/PieChart2";

function StageChart({
  contracts,
  stages
}: {
  readonly contracts: Contract[] | undefined;
  readonly stages: Stage[] | undefined;
}) {
  const [chartData, setChartData] = useState<ChartData[]>();

  const getChart = () => {
    if (!contracts || !stages) {
      return
    }

    // GET HOW MANY CONTRACTORS FOR EACH STAGE

    // First get a unique array of contractors with no duplicates
    const contractors = getUniqueObjects(contracts, "contractor_id");
    // Then retrieve the number of contractors that are contained in each stage
    const stageData = chartFormat(contractors, "stage_id");

    const newStages: ChartData[] = [];

    stageData.forEach((item) => {
      const findStage = stages.find((el) => el?.id === item.name);

      findStage && newStages.push({ name: findStage?.name, value: item.value });
    });

    setChartData(newStages);
  };

  useEffect(() => {
    getChart()
  }, [contracts, stages])

  // STAGES VS CONTRACTORS (PIE CHART); HOW MANY CONTRACTORS ARE CONTAINED IN EACH STAGE
  return !chartData ? (
    <CardSkeleton className="h-full">
      <></>
    </CardSkeleton>
  ) : (
    <Card className="h-full">
      <PieChart2 data={chartData} />
    </Card>
  );
}

export default StageChart;
