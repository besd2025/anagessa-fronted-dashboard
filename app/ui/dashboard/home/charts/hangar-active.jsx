"use client";

import React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartContainer } from "@/components/ui/chart";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
import { UserContext } from "@/app/context/User_Context";

const chartConfig = {
  active: {
    label: "Actifs",
    color: "var(--chart-5)",
  },
};

export function ChartHangarActive() {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const user = React.useContext(UserContext);

  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);

      try {
        const response = await fetchData("get", "hangar_with_stats/", {
          params: {},
          additionalHeaders: {},
          body: {},
        });

        const total = Number(response?.total_hangars || 0);
        const active = Number(response?.hangars_avec_collecteur || 0);

        const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

        setData([
          {
            name: "Hangars",
            active: percentage,
            total,
            activeCount: active,
          },
        ]);
      } catch (error) {
        console.error("Error fetching hangar stats data:", error);

        setData([
          {
            name: "Hangars",
            active: 0,
            total: 0,
            activeCount: 0,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  const activePercentage = data[0]?.active || 0;
  const activeCount = data[0]?.activeCount || 0;
  const total = data[0]?.total || 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Hangars actifs</CardTitle>

        <CardDescription>Hangars avec collecteur</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={data}
            startAngle={90}
            endAngle={90 - (360 * activePercentage) / 100}
            innerRadius={75}
            outerRadius={110}
            barSize={20}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />

            <RadialBar
              dataKey="active"
              background
              cornerRadius={10}
              fill="var(--color-active)"
            />

            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
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
                          y={(viewBox.cy || 0) - 10}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activePercentage}%
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="fill-muted-foreground text-sm"
                        >
                          {activeCount} / {total}
                        </tspan>
                      </text>
                    );
                  }

                  return null;
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>

      <div className="pb-6 text-center text-sm text-muted-foreground">
        {activeCount} hangars actifs sur {total}
      </div>
    </Card>
  );
}
