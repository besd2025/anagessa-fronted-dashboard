"use client";

import React, { useState } from "react";
import { AreaChart, CartesianGrid, Area, XAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
import config from "@/postcss.config.mjs";
const stockDataByPeriod = {
  mois: [
    { date: "Jan", amount: 40, ca: 120, cb: 20 },
    { date: "Feb", amount: 42, ca: 135, cb: 25 },
    { date: "Mar", amount: 46, ca: 150, cb: 28 },
    { date: "Apr", amount: 49, ca: 160, cb: 30 },
    { date: "May", amount: 53, ca: 175, cb: 32 },
    { date: "Jun", amount: 58, ca: 190, cb: 35 },
  ],

  annee: [
    { date: "2020", amount: 120, ca: 450, cb: 80 },
    { date: "2021", amount: 140, ca: 480, cb: 85 },
    { date: "2022", amount: 165, ca: 510, cb: 90 },
    { date: "2023", amount: 190, ca: 540, cb: 95 },
    { date: "2024", amount: 220, ca: 580, cb: 100 },
  ],
};

const chartConfig = {
  amount: {
    label: "Stock (T)",
    color: "var(--destructive)",
  },
  ca: {
    label: "Maïs blanc (T)",
    color: "var(--primary)",
  },
  cb: {
    label: "Maïs jaune (T)",
    color: "var(--secondary)",
  },
};

export function StockEvolutionChart() {
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
          `/stock_evolution/?period=${periodParam}`,
          { params: {}, additionalHeaders: {}, body: {} }
        );
        console.log("Fetching data for period:", results);

        if (!Array.isArray(results)) return;

        const chartData = results.map((item) => ({
          date: item.period,
          amount: item.stock || 0,
          blanc: item.blanc || 0,
          jaune: item.jaune || 0,
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
      <div className="lg:col-span-4">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="lg:col-span-4">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Évolution du Stock</CardTitle>
          <CardDescription>Tendance du volume stocké</CardDescription>
        </div>
        <Tabs
          defaultValue="mois"
          value={period}
          onValueChange={handleTimePeriodChange}
          className="w-full lg:w-[200px]"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jour">Jour</TabsTrigger>
            <TabsTrigger value="semaine">Semaine</TabsTrigger>
            <TabsTrigger value="mois">Mois</TabsTrigger>
            <TabsTrigger value="annee">Année</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={dataByPeriod[period]}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillStock" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillStockCA" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ca)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ca)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillStockCB" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cb)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cb)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillStock)"
              fillOpacity={0.4}
              stroke="var(--color-amount)"
            />
            <Area
              dataKey="blanc"
              type="natural"
              fill="url(#fillStockCA)"
              fillOpacity={0.4}
              stroke="var(--color-ca)"
            />
            <Area
              dataKey="jaune"
              type="natural"
              fill="url(#fillStockCB)"
              fillOpacity={0.4}
              stroke="var(--color-cb)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
