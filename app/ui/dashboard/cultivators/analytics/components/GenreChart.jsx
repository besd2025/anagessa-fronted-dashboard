"use client";
import React from "react";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
export const description = "A pie chart with a label list";
const chartConfig = {
  visitors: {
    label: "cultivateurs :",
  },
  hommes: {
    label: "Hommes",
    color: "var(--chart-1)",
  },
  femmes: {
    label: "Femmes",
    color: "var(--chart-5)",
  },
};

export function GenreChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `cultivators/stats_genre/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const total = (response?.hommes || 0) + (response?.femmes || 0);
        const chartData = [
          {
            browser: "hommes",
            visitors: response?.hommes || 0,
            percentage: total > 0 ? ((response?.hommes / total) * 100).toFixed(1) : 0,
            fill: "var(--color-hommes)",
          },
          {
            browser: "femmes",
            visitors: response?.femmes || 0,
            percentage: total > 0 ? ((response?.femmes / total) * 100).toFixed(1) : 0,
            fill: "var(--color-femmes)",
          },
        ];
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, []);

  if (loading)
    return (
      <div className="col-span-1 lg:col-span-2">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Répartition par Genre</CardTitle>
        <CardDescription>Hommes vs Femmes</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-black mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={data} dataKey="visitors">
              <LabelList
                // dataKey="browser"
                className="fill-black"
                stroke="none"
                fontSize={12}
                formatter={(value) => chartConfig[value]?.label}
              />
              <LabelList
                dataKey="percentage"
                position="inside"
                className="fill-white"
                stroke="none"
                fontSize={13}
                formatter={(value) => `${value}%`}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
