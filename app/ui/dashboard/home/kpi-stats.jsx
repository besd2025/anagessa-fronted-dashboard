"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale, Tag, Wallet } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
export function KPIGrid() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const [prixAchatRes, prixVenteRes] = await Promise.allSettled([
          fetchData("get", "admin/prices/get_prix_achat/"),
          fetchData("get", "admin/prices/get_prix_vente/"),
        ]);

        const prixAchat = prixAchatRes.status === "fulfilled" ? (prixAchatRes.value?.prix_achat || 0) : 0;
        const prixVente = prixVenteRes.status === "fulfilled" ? (prixVenteRes.value?.prix_vente || prixVenteRes.value?.prix || 0) : 0;

        const kpiData = [
          {
            title: "Prix d'Achat Référence",
            value: prixAchat || 0,
            trendUp: true,
            icon: Tag,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            title: "Prix de Vente Référence",
            value: prixVente || 0,
            trendUp: true,
            icon: Tag,
            color: "text-emerald-600",
            bgColor: "bg-emerald-500/10",
          },
        ];

        setData(kpiData);
      } catch (error) {
        console.error("Error fetching price data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-rows-2 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-rows-2 gap-4">
      {data.map((kpi, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className=" flex flex-col justify-between h-full gap-2">
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-md ${kpi.bgColor}`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tabular-nums">
                {kpi.value} <span className="text-base">FBU/Kg</span>{" "}
              </div>
              <div className="text-muted-foreground font-medium mt-1">
                {kpi.title}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
