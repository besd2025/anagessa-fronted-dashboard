"use client";
import { LabelList, Pie, PieChart } from "recharts";
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
import React from "react";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
const chartConfig = {
  count: {
    label: "Usines de deparchage ",
  },
  actif: {
    label: "Actif",
    color: "var(--chart-2)",
  },
  inactif: {
    label: "Non Actif",
    color: "var(--chart-5)",
  },
};

export function UsineActiveChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          `mais/usine_deparchage/get_usine_active_non_active/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const chartData = [
          {
            status: "Actif",
            count: response?.active,
            fill: "var(--color-actif)",
          },
          {
            status: "Non Actif",
            count: response?.non_active,
            fill: "var(--color-inactif)",
          },
        ];
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (loading)
    return (
      <div className="col-span-1 md:col-span-2 lg:col-span-2">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-2">
      <CardHeader>
        <CardTitle>Statut des USINEs</CardTitle>
        <CardDescription>Actif vs Non Actif</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={data} dataKey="count">
              <LabelList
                dataKey="status"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value) =>
                  chartConfig[value.toLowerCase().replace(" ", "")]?.label ||
                  value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
