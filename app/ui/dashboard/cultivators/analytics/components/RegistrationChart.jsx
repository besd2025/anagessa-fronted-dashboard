"use client";

import React, { useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";
import { TrendingUp } from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description = "A multiple line chart";

const chartConfig = {
  count: {
    label: "Enregistrements:",
    color: "var(--secondary)",
  },
};
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
export function RegistrationChart() {
  const [period, setPeriod] = useState("mois");
  const [dataByPeriod, setDataByPeriod] = useState({}); // ← nouveau nom
  const [loading, setLoading] = useState(true);

  const handleTimePeriodChange = (value) => {
    setPeriod(value);
  };

  React.useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const periodParam =
          period === "jour"
            ? "day"
            : period === "semaine"
              ? "week"
              : period === "annee"
                ? "year"
                : "month";
        const results = await fetchData(
          "get",
          `/mais/hangars/cultivateurs_statistiques_par_temps?period=${periodParam}`,
          { params: {}, additionalHeaders: {}, body: {} }
        );

        if (!Array.isArray(results)) return;

        const chartData = results.map((item) => ({
          time: item.period,
          day: item.period,
          month: item.period,
          year: item.period,
          count: item.nombre || 0,
        }));

        setDataByPeriod((prev) => ({
          ...prev,
          [period]: chartData,
        }));
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [period]);

  if (loading)
    return (
      <div className="lg:col-span-5">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="lg:col-span-5">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Enregistrements</CardTitle>
          <CardDescription>Nouveaux cultivateurs inscrits</CardDescription>
        </div>

        <Tabs
          defaultValue="mois"
          value={period}
          onValueChange={handleTimePeriodChange}
          className="w-full lg:w-[250px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={dataByPeriod[period] || []}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={
                period === "jour"
                  ? "time"
                  : period === "semaine"
                    ? "day"
                    : period === "mois"
                      ? "month"
                      : "year"
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (
                  period === "jour" ||
                  period === "semaine" ||
                  period === "annee"
                ) {
                  return value;
                }
                return value.slice(0, 4);
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-count)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
