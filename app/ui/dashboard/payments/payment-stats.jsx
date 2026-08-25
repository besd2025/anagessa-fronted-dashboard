import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { Label, LabelList, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function PaymentStats() {
  const chartData = [
    {
      browser: "chrome",
      type: "Pas encore payé",
      cultivateurs: 275,
      fill: "var(--chart-1)",
    },
    {
      browser: "firefox",
      type: "Payé en moyenne",
      cultivateurs: 287,
      fill: "var(--chart-3)",
    },
    {
      browser: "other",
      type: "Payé en totalité",
      cultivateurs: 190,
      fill: "var(--chart-5)",
    },
  ];
  const chartConfig = {
    cultivateurs: {
      label: "cultivateurs",
    },
    chrome: {
      label: "Pas encore paye:",
      color: "var(--chart-1)",
    },
    firefox: {
      label: "Paye en moyenne:",
      color: "var(--chart-3)",
    },
    other: {
      label: "Paye en totalite:",
      color: "var(--chart-5)",
    },
  };

  const totalcultivateurs = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.cultivateurs, 0);
  }, []);
  return (
    <>
      {/* Storage usage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Statut des paiements</CardTitle>
          <CardDescription>cultivateurs ayant vendus</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="cultivateurs"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
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
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalcultivateurs.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Caféiculteurs
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                <LabelList
                  dataKey="browser"
                  className="fill-sidebar-foreground"
                  stroke="none"
                  fontSize={15}
                  formatter={(value) => {
                    const item = chartData.find((d) => d.browser === value);
                    const pct =
                      totalcultivateurs > 0
                        ? Math.round(
                            ((item?.cultivateurs ?? 0) / totalcultivateurs) *
                              100,
                          )
                        : 0;
                    return `${pct}%`;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
                  <Users className="text-muted-foreground h-4 w-4" />
                </div>
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm font-semibold">
                      {totalcultivateurs > 0
                        ? Math.round(
                            (item.cultivateurs / totalcultivateurs) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {item.cultivateurs} Caféiculteurs
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
