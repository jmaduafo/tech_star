import { ChartData } from "@/types/types";
import React from "react";
import {
  BarChart as BarContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function BarChart({ data }: { readonly data: ChartData[] }) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarContainer data={data}>
        <XAxis dataKey="name" stroke="#ececec"/>
        <YAxis stroke="#ececec" hide />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            borderRadius: "5px",
            padding: "6px 12px",
            border: "none",
          }}
          labelStyle={{ color: "#ececec", fontSize: "15px" }}
          itemStyle={{ color: "#ececec90", fontSize: "14px", marginTop: "-4px" }}
        />
        <Bar
          dataKey="value"
          activeBar={false}
          fill="#ececec"
          radius={[4, 4, 0, 0]}
        />
      </BarContainer>
    </ResponsiveContainer>
  );
}

export default BarChart;
