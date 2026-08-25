"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "Janvier", production: 18000, expedition: 12000 },
  { month: "Février", production: 22000, expedition: 15000 },
  { month: "Mars", production: 20000, expedition: 18000 },
  { month: "Avril", production: 25000, expedition: 22000 },
  { month: "Mai", production: 28000, expedition: 24000 },
  { month: "Juin", production: 30000, expedition: 28000 },
];

const chartConfig = {
  production: {
    label: "Production",
    color: "hsl(var(--chart-1))",
  },
  expedition: {
    label: "Expédition",
    color: "hsl(var(--chart-2))",
  },
};

export function UsineProductionChart() {
  return (
    <Card className="flex flex-col border shadow-sm h-full">
      <CardHeader>
        <CardTitle>Production vs Expéditions</CardTitle>
        <CardDescription>Comparaison Mensuelle - 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="max-h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.5}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                cursor={{ fill: "transparent" }}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="production"
                fill="var(--color-production)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="expedition"
                fill="var(--color-expedition)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Production en hausse de 5.2% ce mois{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Les expéditions suivent la tendance de production.
        </div>
      </CardFooter>
    </Card>
  );
}
