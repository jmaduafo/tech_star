"use client"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart as LineContainer, Line, CartesianGrid, XAxis } from 'recharts'
import React from 'react'

type Chart = {
    amount: string;
    date: string;
}

function LineChart({ chartConfig, chartData }: { readonly chartConfig: ChartConfig, readonly chartData: Chart[]}) {
  return (
    <ChartContainer config={chartConfig}>
          <LineContainer
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineContainer>
        </ChartContainer>
  )
}

export default LineChart