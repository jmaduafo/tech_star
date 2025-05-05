import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import Card from "@/components/ui/cards/MyCard";
import BarChart from "@/components/ui/charts/BarChart";
import NotAvailable from "@/components/ui/NotAvailable";
import { ChartData, Contractor, Payment } from "@/types/types";
import { chartFormat } from "@/utils/chartHelpers";
import React, { useEffect, useState } from "react";

function ContractorChart({
  contractors,
  payments,
}: {
  readonly contractors: Contractor[] | undefined;
  readonly payments: Payment[] | undefined;
}) {
  // CONTRACTORS VS NUMBER OF PAYMENTS (BAR CHART)

  const [chartData, setChartData] = useState<ChartData[]>();

  const getChart = () => {
    if (!contractors || !payments) {
      return;
    }

    // GET HOW MANY CONTRACTORS FOR EACH STAGE

    // Retrieve the number of payments per contractor
    const contractorData = chartFormat(payments, "contractor_id");

    const newData: ChartData[] = [];

    contractorData.forEach((item) => {
      const findContractor = contractors.find((el) => el?.id === item.name);

      findContractor && newData.push({ name: findContractor?.name, value: item.value });
    });

    setChartData(newData);
  };

  useEffect(() => {
    getChart();
  }, [contractors, payments]);

  return !chartData ? (
    <CardSkeleton className="h-full">
      <></>
    </CardSkeleton>
  ) : (
    <Card className="h-full">
      {chartData.length ? (
        <BarChart data={chartData} />
      ) : (
        <NotAvailable text="No data available for visual graph" />
      )}
    </Card>
  );
}

export default ContractorChart;
