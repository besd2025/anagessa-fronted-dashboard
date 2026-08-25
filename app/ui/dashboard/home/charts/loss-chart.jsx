"use client";
import React, { useState, useEffect } from "react";
import { AreaChart, CartesianGrid, XAxis, Area } from "recharts";
import { TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  pertes: {
    label: "Pertes / GAP (kg)",
    color: "var(--destructive)",
  },
};

export function LossChart() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setIsLoading(true);
      try {
        const results = await fetchData(
          "get",
          "stock/details/pertes_par_intervalles/",
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        if (Array.isArray(results)) {
          const chartData = results.map((item) => {
            let label = item.period || "";
            try {
              if (label.includes("-")) {
                const date = new Date(label + "T00:00:00");
                if (!isNaN(date.getTime())) {
                  label = date.toLocaleDateString("fr-FR", {
                    month: "short",
                    day: "numeric",
                  });
                }
              }
            } catch (e) {
              label = item.period;
            }
            return {
              time: label,
              pertes: item.pertes || 0,
            };
          });
          setData(chartData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des pertes :", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return <ChartSkeleton className="h-[250px]" />;
  }

  return (
    <Card className="border-destructive/20 shadow-xs">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2 text-base">
          <TrendingDown className="h-5 w-5" /> Pertes / GAP par Période
        </CardTitle>
        <CardDescription>
          Évolution des pertes enregistrées dans les hangars
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 10,
              left: 10,
              right: 10,
            }}
          >
            <defs>
              <linearGradient id="fillpertes" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pertes)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pertes)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="pertes"
              type="natural"
              fill="url(#fillpertes)"
              stroke="var(--color-pertes)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-pertes)",
              }}
              activeDot={{
                r: 5,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Surveillance des écarts d'inventaire et pertes au stockage
      </CardFooter>
    </Card>
  );
}
