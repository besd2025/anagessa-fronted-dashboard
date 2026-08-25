"use client";

import { LineChart, Line, CartesianGrid, LabelList } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

const chartData = [
  { date: "Jan", stock: 1200 },
  { date: "Fév", stock: 1350 },
  { date: "Mar", stock: 1100 },
  { date: "Avr", stock: 1600 },
  { date: "Mai", stock: 1450 },
  { date: "Juin", stock: 1700 },
];

const chartConfig = {
  stock: {
    label: "Stock (kg)",
    color: "var(--chart-5)",
  },
};

export function StockChart() {
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle>Évolution du Stock</CardTitle>
        <CardDescription>Quantité totale de café vert (kg)</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[220px] w-full">
          <LineChart data={chartData} margin={{ top: 30, left: 20, right: 20 }}>
            <CartesianGrid vertical={false} />

            <Line
              type="monotone"
              dataKey="stock"
              stroke="var(--chart-5)"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            >
              <LabelList
                dataKey="stock"
                position="top"
                offset={10}
                className="fill-foreground"
                fontSize={12}
                formatter={(value) => `${value} kg`}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
