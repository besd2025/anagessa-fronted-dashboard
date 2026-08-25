"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const locationConfig = {
  count: {
    label: "Caféiculteurs",
    color: "var(--chart-4)",
  },
};

export function LocationChart() {
  const [locFilter, setLocFilter] = useState("province");
  const [data, setData] = useState({
    province: [],
    region: [],
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const getCtsProvince = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_count_cultivators_par_provinces/`,

          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const provinceData = response.map((item) => ({
          name: item?.province_name,
          count: item?.count_cultivators,
        }));

        const regionData = [
          { name: "Region X", count: 15 },
          { name: "Region Y", count: 12 },
          { name: "Region Z", count: 10 },
          { name: "Region W", count: 8 },
          { name: "Region V", count: 5 },
        ];
        setData({
          province: provinceData,
          region: regionData,
        });
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCtsProvince();
  }, []);

  if (loading)
    return (
      <div className="lg:col-span-1">
        <ChartSkeleton />
      </div>
    );

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-col gap-y-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Répartition Géographique</CardTitle>
          <CardDescription>Par Province</CardDescription>
        </div>
        <Tabs
          defaultValue="province"
          onValueChange={setLocFilter}
          className="w-full lg:w-[250px]"
        >
          <TabsList className="w-full hidden">
            {/* <TabsTrigger value="province">Province</TabsTrigger>
            <TabsTrigger value="region">Région</TabsTrigger> */}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={locationConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data[locFilter]}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="count"
              layout="vertical"
              fill="var(--color-count)"
              barSize={40}
              radius={4}
            >
              <LabelList
                dataKey={"name"}
                position="insideLeft"
                offset={8}
                className="fill-black dark:fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="insideRight"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
