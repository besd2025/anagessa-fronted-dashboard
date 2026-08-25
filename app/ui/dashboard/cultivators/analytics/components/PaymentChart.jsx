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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, LabelList } from "recharts";
import { fetchData } from "@/app/_utils/api";
import { ChartSkeleton } from "@/components/ui/skeletons";
const paymentConfig = {
  visitors: { label: "Paiements" },
  mobile: { label: "Mobile Money", color: "var(--chart-2)" },
  bancaire: { label: "Bancaire", color: "var(--chart-1)" },
  sans_compte: { label: "Sans compte", color: "var(--chart-5)" },
};

export function PaymentChart() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/hangars/cultivateurs_par_moyen_paiement/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const chartData = response.map((item) => {
          const type = item?.cultivator_payment_type;
          let key = "sans_compte";
          if (type === "mobile_money") key = "mobile";
          else if (type === "bank_transfer") key = "bancaire";

          return {
            mode: key,
            visitors: item?.count,
            fill: `var(--color-${key})`,
          };
        });
        setData(chartData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, []);

  const total = React.useMemo(
    () => data.reduce((acc, item) => acc + (item.visitors ?? 0), 0),
    [data]
  );

  if (loading) return <ChartSkeleton />;

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Modes de Paiement</CardTitle>
        <CardDescription>Préférences de paiement des cultivateurs</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={paymentConfig}
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
                formatter={(value, entry) => {
                  const item = data.find((d) => d.mode === value);
                  const pct =
                    total > 0
                      ? Math.round(((item?.visitors ?? 0) / total) * 100)
                      : 0;
                  return `${paymentConfig[value]?.label ?? value} ${pct}%`;
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
