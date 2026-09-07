"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
const ageData = [
  { range: "-18 ans", count: 50, fill: "var(--color-age1)" },
  { range: "18-25 ans", count: 320, fill: "var(--color-age2)" },
  { range: "26-35 ans", count: 650, fill: "var(--color-age3)" },
  { range: "36-45 ans", count: 580, fill: "var(--color-age4)" },
  { range: "46-60 ans", count: 420, fill: "var(--color-age5)" },
  { range: "60+ ans", count: 180, fill: "var(--color-age6)" },
  { range: "Inconnus", count: 30, fill: "var(--color-age7)" },
];

const ageConfig = {
  count: { label: "Caféiculteurs" },
  age1: { label: "-18 ans", color: "var(--chart-1)" },
  age2: { label: "18-25 ans", color: "var(--chart-2)" },
  age3: { label: "26-35 ans", color: "var(--chart-3)" },
  age4: { label: "36-45 ans", color: "var(--chart-4)" },
  age5: { label: "46-60 ans", color: "var(--chart-5)" },
  age6: { label: "60+ ans", color: "var(--chart-1)" },
  age7: { label: "Inconnus", color: "var(--background)" },
};

export function AgeChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `cultivators/repartition_par_age/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const chartData = response?.map((item) => ({
          range: item?.tranche_age,
          count: item?.nombre,
          fill:
            item?.tranche_age === "18-25 ans"
              ? "var(--color-age2)"
              : item?.tranche_age === "26-35 ans"
                ? "var(--color-age3)"
                : item?.tranche_age === "36-45 ans"
                  ? "var(--color-age4)"
                  : item?.tranche_age === "46-60 ans"
                    ? "var(--color-age5)"
                    : item?.tranche_age === "60+ ans"
                      ? "var(--color-age6)"
                      : item?.tranche_age === "Moins de 18 ans"
                        ? "var(--color-age1)"
                        : "var(--color-age1)",
        }));
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, []);

  if (loading) return <ChartSkeleton />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tranches d'âge</CardTitle>
        <CardDescription>Répartition démographique par âge</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={ageConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0 }}>
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="range"
              type="category"
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <XAxis type="number" hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" layout="vertical" radius={4}>
              {ageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="count"
                position="insideRight"
                offset={8}
                className="fill-black"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
