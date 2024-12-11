"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MessageReportSchema } from "@/utils/messageSchema";
import { DateRange } from "react-day-picker";

interface AreaGraphProps {
  chartData: MessageReportSchema[];
  dateRange: DateRange | undefined;
}

const chartConfig = {
  FailedCount: {
    label: "Failed",
    color: "hsl(var(--chart-1))",
  },
  SuccessCount: {
    label: "Success",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function AreaGraph({ chartData, dateRange }: AreaGraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
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
              interval={0}
              minTickGap={12}
              padding={{ left: 20, right: 20 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
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
            <Area
              dataKey="SuccessCount"
              type="natural"
              fill="var(--color-SuccessCount)"
              fillOpacity={0.4}
              stroke="var(--color-SuccessCount)"
              stackId="a"
            />
            <Area
              dataKey="FailedCount"
              type="natural"
              fill="var(--color-FailedCount)"
              fillOpacity={0.4}
              stroke="var(--color-FailedCount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRange?.from?.toDateString()} - to{" "}
              {dateRange?.to?.toDateString()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
