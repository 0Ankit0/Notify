"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
import { getProviderBasedReport } from "@/app/api/data/Message";
import { MessageProviderReportSchema } from "@/utils/messageSchema";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
// const chartData = [
//   { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
//   { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
//   { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
//   { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
//   { browser: 'other', visitors: 190, fill: 'var(--color-other)' }
// ];
interface PieChartProps {
  dateRange: DateRange | undefined;
}
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// } satisfies ChartConfig;

export function PieGraph({ dateRange }: PieChartProps) {
  const [chartData, setChartData] = useState<MessageProviderReportSchema[]>([]);
  const [chartConfig, setChartConfig] = useState<{
    [key: string]: { label: string; color: string };
  }>({});

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await getProviderBasedReport(dateRange);
        const config: { [key: string]: { label: string; color: string } } = {};
        const processedData = response.map((item: any) => {
          const color = getRandomColor();
          config[item.Provider] = { label: item.Provider, color };
          return {
            ...item,
            fill: color, // Assign random color
          };
        });
        setChartData(processedData);
        setChartConfig(config);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchChartData();
  }, [dateRange]);
  const totalMessages = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.TotalMessages, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Provider based Report</CardTitle>
        <CardDescription>
          {dateRange?.from?.toDateString()}- {dateRange?.to?.toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="TotalMessages"
              nameKey="Provider"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMessages.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Messages
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {Object.keys(chartConfig).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: chartConfig[key].color }}
            ></div>
            <span>{chartConfig[key].label}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
