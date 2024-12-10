"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DateRange } from "react-day-picker";
import { getStatusReport } from "@/app/api/data/Message";
import { MessageReportSchema } from "@/utils/messageSchema";

export const description = "Total message count by date";
interface BarGraphProps {
  dateRange: DateRange | undefined;
}

const chartConfig = {
  views: {
    label: "Message Count",
  },
  SuccessCount: {
    label: "Success",
    color: "hsl(var(--chart-1))",
  },
  FailedCount: {
    label: "Failed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function BarGraph({ dateRange }: BarGraphProps) {
  const [chartData, setChartData] = useState<MessageReportSchema[]>([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getStatusReport(dateRange);
        setChartData(response);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [dateRange]);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("SuccessCount");

  const total = React.useMemo(
    () => ({
      SuccessCount: chartData.reduce((acc, curr) => acc + curr.SuccessCount, 0),
      FailedCount: chartData.reduce((acc, curr) => acc + curr.FailedCount, 0),
    }),
    [chartData]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Total message count </CardTitle>
          <CardDescription>
            {dateRange?.from?.toDateString()} - to{" "}
            {dateRange?.to?.toDateString()}
          </CardDescription>
        </div>
        <div className="flex">
          {["SuccessCount", "FailedCount"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
