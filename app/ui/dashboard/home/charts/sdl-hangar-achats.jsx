"use client";
import React, { useState } from "react";
import { AreaChart, CartesianGrid, XAxis, Area, LabelList, LineChart } from "recharts";
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";

const chartConfig = {
  achats: { label: "Achats (kg)", color: "var(--primary)" },
  ventes: { label: "Ventes (kg)", color: "var(--secondary)" },
};

export function ChartLineAchats() {
  const [period, setPeriod] = useState("mois");
  const [dataByPeriod, setDataByPeriod] = useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const handleTimePeriodChange = (value) => {
    setPeriod(value);
  };

  React.useEffect(() => {
    async function getData() {
      setIsLoading(true);
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
          `achat_vente?period=${periodParam}`,
          { params: {}, additionalHeaders: {}, body: {} },
        );
        if (!Array.isArray(results)) return;

        const chartData = results.map((item) => {
          let label = item.period || "";
          try {
            if (label.includes("-")) {
              const date = new Date(label + "T00:00:00");
              if (!isNaN(date.getTime())) {
                label = date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: period === "jour" || period === "semaine" ? "numeric" : undefined,
                  year: period === "annee" ? "numeric" : undefined,
                });
              }
            }
          } catch (e) {
            label = item.period;
          }
          return {
            time: label,
            achats: item.purchases || item.achats || 0,
            ventes: item.sales || item.ventes || 0,
          };
        });

        setDataByPeriod((prev) => ({
          ...prev,
          [period]: chartData,
        }));
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, [period]);

  if (isLoading && !dataByPeriod[period]) {
    return (
      <div className=" w-full">
        <ChartSkeleton className="h-[500px]" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achats du maïs</CardTitle>
        <CardDescription>Filtrer par période</CardDescription>

        <Tabs
          value={period}
          onValueChange={handleTimePeriodChange}
          className="w-full max-w-sm mt-4"
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
            data={dataByPeriod[period] || []}
            margin={{
              top: 24,
              left: 12,
              right: 20,
            }}
          >
            <defs>
              <linearGradient id="fillachats" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-achats)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-achats)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillventes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ventes)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ventes)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="achats"
              type="natural"
              fill="url(#fillachats)"
              stroke="var(--color-achats)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-achats)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={11}
              />
            </Area>
            <Area
              dataKey="ventes"
              type="natural"
              fill="url(#fillventes)"
              stroke="var(--color-ventes)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-ventes)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground font-medium"
                fontSize={11}
              />
            </Area>
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Évolution des Achats & Ventes par {period} <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
