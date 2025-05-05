import CardSkeleton from "@/components/ui/cards/CardSkeleton";
import Card from "@/components/ui/cards/MyCard";
import LineChart2 from "@/components/ui/charts/LineChart2";
import NotAvailable from "@/components/ui/NotAvailable";
import { ChartData, Payment } from "@/types/types";
import { filterByDateRange } from "@/utils/dateAndTime";
import React, { useEffect, useState } from "react";

function PaymentChart({
  payments,
}: {
  readonly payments: Payment[] | undefined;
}) {
  const [chartData, setChartData] = useState<ChartData[]>();

  const getChart = () => {
    if (!payments) {
      return;
    }

    if (!payments?.length) {
      setChartData([]);
    }

    // GET HOW MANY PAYMENT OVER THE COURSE OF THE LAST MONTH
    setChartData(filterByDateRange(payments, "Last 1 month"));
  };

  useEffect(() => {
    getChart();
  }, [payments]);

  // STAGES VS CONTRACTORS (PIE CHART); HOW MANY CONTRACTORS ARE CONTAINED IN EACH STAGE
  return !chartData ? (
    <CardSkeleton className="h-full">
      <></>
    </CardSkeleton>
  ) : (
    <Card className="h-full">
      {chartData.length ? (
        <LineChart2 data={chartData} />
      ) : (
        <NotAvailable text="No data available for visual graph" />
      )}
    </Card>
  );
}

export default PaymentChart;
