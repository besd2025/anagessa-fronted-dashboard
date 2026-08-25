"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
import { UserContext } from "@/app/context/User_Context";

const chartConfig = {
  active: {
    label: "Actif",
    color: "var(--chart-5)",
  },
  inactive: {
    label: "Inactif",
    color: "var(--chart-1)",
  },
};

export function ChartPieSdlCtActive() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const user = React.useContext(UserContext)
  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(
          "get",
          "hangar_with_stats/",
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const total = response?.total_hangars || 0;
        const active = response?.hangars_avec_collecteur || 0;
        const inactive = Math.max(0, total - active);

        const chartData = [
          {
            entity: "Hangars",
            active: active,
            inactive: inactive,
          },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching hangar stats data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparaison d'Activité</CardTitle>
        <CardDescription>Actifs vs Inactifs par Entité</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="entity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="active"
              stackId="a"
              fill="var(--color-active)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="inactive"
              stackId="a"
              fill="var(--color-inactive)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
