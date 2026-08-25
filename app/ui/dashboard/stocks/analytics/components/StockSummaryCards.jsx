"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, DollarSign, Layers, Grape } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
export function StockSummaryCards() {
  const [data, setData] = React.useState({});
  const [rendement, setRendement] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/achat_mais/get_total_achat/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );

        const rendement = await fetchData(
          "get",
          `/mais/rendements/get_rendement_lot/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        setData(response);
        setRendement(rendement);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SimpleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-destructive p-2 rounded-md text-white">
              <Package className="h-4 w-4" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              {data?.total_grains_achat >= 1000 ? (
                <>
                  {(data?.total_grains_achat / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_grains_achat?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Quantité Total
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-1">
        <CardContent className="text-sm h-full">
          <div className=" flex flex-col justify-between gap-y-2 h-full">
            <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-full h-1/2">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-primary size-5" />
                <CardTitle className="text-md font-semibold text-primary">
                  Maïs blanc :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.total_grains_a_achat >= 1000 ? (
                  <>
                    {(data?.total_grains_a_achat / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {data?.total_grains_a_achat?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </CardDescription>
            </div>
            <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg w-full h-1/2">
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-secondary size-5" />
                <CardTitle className="text-md font-semibold text-secondary">
                  Maïs jaune :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.total_grains_b_achat >= 1000 ? (
                  <>
                    {(data?.total_grains_b_achat / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {data?.total_grains_b_achat?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur Estimée</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {" "}
            {Math.round(data?.total_montant_achat ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            FBU
          </div>
          <p className="text-xs text-muted-foreground">
            Basé sur les prix actuels du marché
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nombre de Lots</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rendement?.nombre_lot}</div>
          {/* <p className="text-xs text-muted-foreground">
            nouveaux lots cette semaine
          </p> */}
        </CardContent>
      </Card>
    </div>
  );
}
