"use client";
import React from "react";
import { Pie, PieChart, Legend } from "recharts";
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
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";

const chartConfig = {
  value: {
    label: "Quantité (T)",
  },
  blanc: {
    label: "Maïs blanc",
    color: "var(--chart-5)",
  },
  jaune: {
    label: "Maïs jaune",
    color: "var(--chart-1)",
  },
};

export function GradeDistributionChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/achat_mais/get_total_achat/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const chatData = [
          {
            name: "Maïs blanc",
            value: (response?.total_grains_a_achat || 0) >= 1000 ? (response?.total_grains_a_achat / 1000) : (response?.total_grains_a_achat || 0),
            fill: "var(--chart-5)",
          },
          {
            name: "Maïs jaune",
            value: (response?.total_grains_b_achat || 0) >= 1000 ? (response?.total_grains_b_achat / 1000) : (response?.total_grains_b_achat || 0),
            fill: "var(--chart-1)",
          },
        ];
        setData(chatData);
      } catch (error) {
        console.error("Error fetching stock distribution data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (loading)
    return (
      <div className="col-span-1 lg:col-span-3">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Répartition Maïs Blanc / Jaune</CardTitle>
        <CardDescription>Distribution du stock par type de maïs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            ></Pie>
            <Legend />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

