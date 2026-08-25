"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StockCardSkeleton } from "@/components/ui/skeletons";

export function StockSummaryCard() {
  const [data, setData] = React.useState({});
  const [prixAchat, setPrixAchat] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        const [stockRes, prixRes] = await Promise.allSettled([
          fetchData("get", "stock_resume/"),
          fetchData("get", "admin/prices/get_prix_achat/"),
        ]);
        if (stockRes.status === "fulfilled") setData(stockRes.value || {});
        if (prixRes.status === "fulfilled") setPrixAchat(prixRes.value || {});
      } catch (error) {
        console.error("Error fetching stock summary data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return <StockCardSkeleton />;
  }

  const stockBlanc = data?.total_stock?.total_blanc || 0;
  const stockJaune = data?.total_stock?.total_jaune || 0;
  const totalStock = stockBlanc + stockJaune;
  const unitPrice = prixAchat?.prix_achat || 0;
  const montantEstime = totalStock * unitPrice;

  return (
    <Card className="@container/stock h-full shadow-xs">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="bg-primary p-2 rounded-lg text-white">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">
              Stock Actuel Hangars
            </CardTitle>
            <CardDescription className="text-xs">
              État des stocks en temps réel dans les hangars
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3 bg-primary/10 rounded-lg">
            <span className="font-medium text-xs text-muted-foreground">Maïs blanc</span>
            <span className="text-2xl font-bold text-primary">
              {stockBlanc >= 1000 ? (
                <>
                  {(stockBlanc / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-sm font-normal"> T</span>
                </>
              ) : (
                <>
                  {stockBlanc.toLocaleString("fr-FR")}
                  <span className="text-sm font-normal"> Kg</span>
                </>
              )}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {(stockBlanc * unitPrice).toLocaleString("fr-FR")} FBU
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 bg-amber-500/10 rounded-lg">
            <span className="font-medium text-xs text-muted-foreground">Maïs jaune</span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stockJaune >= 1000 ? (
                <>
                  {(stockJaune / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-sm font-normal"> T</span>
                </>
              ) : (
                <>
                  {stockJaune.toLocaleString("fr-FR")}
                  <span className="text-sm font-normal"> Kg</span>
                </>
              )}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {(stockJaune * unitPrice).toLocaleString("fr-FR")} FBU
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between p-3 border rounded-lg bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1.5 rounded-full dark:bg-emerald-900/50">
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Valeur Estimée Stock</span>
              <span className="text-[10px] text-muted-foreground">Au prix d'achat actuel ({unitPrice} FBU/kg)</span>
            </div>
          </div>
          <span className="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {Math.round(montantEstime).toLocaleString("fr-FR")} FBU
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

