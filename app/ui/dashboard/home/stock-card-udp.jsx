"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign, TrendingUp } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StockCardSkeleton } from "@/components/ui/skeletons";

export function StockSummaryCardUDP() {
  const [data, setData] = React.useState({
    fw: 0,
    washed: 0,
    honey: 0,
    natural_15: 0,
    natural_16: 0,
    total: 0,
    total_value: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        // Mock data for Green Coffee Types
        // TODO: Replace with actual API call when available
        // Endpoint: /mais/usine_deparchage/get_stock_mais_vert_by_type/

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        const mockData = {
          fw: 0, // Fully Washed
          washed: 0, // Washed
          honey: 0, // Honey
          natural_15: 0, // Natural 15+
          natural_16: 0, // Natural 16+
          total_value: 0, // Estimated value in FBU
        };

        const total =
          mockData.fw +
          mockData.washed +
          mockData.honey +
          mockData.natural_15 +
          mockData.natural_16;

        setData({
          ...mockData,
          total,
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <StockCardSkeleton />;
  }

  const formatValue = (val) => {
    if (val >= 1000) {
      return (
        <>
          {(val / 1000).toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          <span className="text-sm ml-1">T</span>
        </>
      );
    }
    return (
      <>
        {val.toLocaleString("fr-FR")}
        <span className="text-sm ml-1">Kg</span>
      </>
    );
  };

  const types = [
    { label: "Fully Washed (FW)", value: data.fw, color: "text-emerald-600" },
    { label: "Washed", value: data.washed, color: "text-blue-600" },
    { label: "Honey", value: data.honey, color: "text-amber-500" },
    { label: "Natural 15+", value: data.natural_15, color: "text-orange-600" },
    { label: "Natural 16+", value: data.natural_16, color: "text-orange-700" },
  ];

  return (
    <Card className="@container/stock h-full">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="bg-secondary p-2 rounded-md">
            <Package className="text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">
            Types de Café Vert
          </CardTitle>
        </div>
        <CardDescription>Stock actuel par type de traitement</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 bg-secondary/10 rounded-lg col-span-2">
            <span className="font-medium text-muted-foreground">
              Total Café Vert
            </span>
            <span className="text-2xl font-bold text-secondary">
              {formatValue(data.total)}
            </span>
            <span className="text-sm font-medium">
              {Math.round(data.total_value ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              FBU
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-2">
          {types.map((type, index) => (
            <div
              key={index}
              className="flex flex-col border-l-2 pl-3 py-1 border-l-secondary"
            >
              <span className="text-sm text-muted-foreground">
                {type.label}
              </span>
              <span className={`text-md font-semibold`}>
                {formatValue(type.value)}
              </span>
            </div>
          ))}
        </div>
        {/* <div className="flex items-center gap-2 justify-between p-0 md:p-3 border/5 rounded-lg mt-2">
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-1.5 rounded-full dark:bg-green-900">
              <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Montant</span>
              <span className="text-xs text-muted-foreground">Estimée</span>
            </div>
          </div>
          <span className="text-xl font-bold tabular-nums">
            {" "}
            {(data?.total_montant_achat ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            FBU
          </span>
        </div> */}
      </CardContent>
    </Card>
  );
}
