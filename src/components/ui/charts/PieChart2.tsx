import { ChartData } from "@/types/types";
import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { COLORS } from "@/utils/dataTools";

function PieChart2({ data }: { readonly data: ChartData[] }) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index + 1}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip itemStyle={{ fontSize: "13px"}}/>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChart2;
