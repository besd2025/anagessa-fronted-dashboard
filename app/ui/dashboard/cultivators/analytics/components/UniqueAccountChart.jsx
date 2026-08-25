"use client";


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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, LabelList } from "recharts";

const uniqueAccountConfig = {
  visitors: { label: "Caféiculteurs" },
  proprietaire: { label: "Propriétaire", color: "var(--chart-1)" },
  non_proprietaire: { label: "Non propriétaire", color: "var(--chart-3)" },
};

// Mock data — à remplacer par un appel API réel
const MOCK_DATA = [
  { mode: "proprietaire", visitors: 320, fill: "var(--color-proprietaire)" },
  { mode: "non_proprietaire", visitors: 180, fill: "var(--color-non_proprietaire)" },
];

export function UniqueAccountChart() {
  const data = MOCK_DATA;

  const total = data.reduce((acc, item) => acc + (item.visitors ?? 0), 0);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Compte Unique</CardTitle>
        <CardDescription>
          Caféiculteurs propriétaires ou non de leur compte unique
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={uniqueAccountConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="visitors"
              nameKey="mode"
              innerRadius={40}
              strokeWidth={5}
            >
              <LabelList
                dataKey="mode"
                className="fill-sidebar-foreground"
                stroke="none"
                fontSize={12}
                formatter={(value) => {
                  const item = data.find((d) => d.mode === value);
                  const pct =
                    total > 0
                      ? Math.round(((item?.visitors ?? 0) / total) * 100)
                      : 0;
                  return `${uniqueAccountConfig[value]?.label ?? value} ${pct}%`;
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="mode" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
