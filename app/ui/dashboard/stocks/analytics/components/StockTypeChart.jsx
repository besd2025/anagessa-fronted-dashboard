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
  LabelList,
} from "recharts";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";

const chartConfig = {
  amount: {
    label: "Quantité (T)",
  },
  gradeA1: {
    label: "MaÃ¯s blanc",
    color: "var(--chart-5)",
  },
  gradeA2: {
    label: " MaÃ¯s blanc",
    color: "var(--chart-4)",
  },
  gradeB1: {
    label: "MaÃ¯s jaune",
    color: "var(--chart-3)",
  },
  gradeB2: {
    label: "MaÃ¯s jaune",
    color: "var(--chart-2)",
  },
};

export function StockTypeChart() {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/detail_rendements/get_rendement_grains_total_group_by_grade/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const chatData = response?.map((item) => ({
          grade: item?.grade__grade_name,
          amount: item?.total_grains,
          fill:
            item?.grade === "A1"
              ? "var(--color-gradeA1)"
              : item?.grade === "A2"
              ? "var(--color-gradeA2)"
              : item?.grade === "B1"
              ? "var(--color-gradeB1)"
              : item?.grade === "B2"
              ? "var(--color-gradeB2)"
              : "var(--color-gradeA2)",
        }));
        setData(chatData);
        console.log("rendement par grade", chatData);
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
      <div className="lg:col-span-1">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Répartition par Grade</CardTitle>
        <CardDescription>Comparaison des grades de grainss</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="grade"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="amount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="amount"
              fill="url(#fillStock)"
              layout="vertical"
              radius={4}
              barSize={40}
            >
              <LabelList
                dataKey="grade"
                position="insideLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="amount"
                position="right"
                offset={8}
                className="fill-white"
                fontSize={12}
                formatter={(value) => `${value} T`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
