"use client";
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  CircleDollarSign,
  Grape,
  ShoppingCart,
  TrendingDown,
  Warehouse,
  Coins,
  Squircle,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
import { UserContext } from "@/app/context/User_Context";

export function SectionCards() {
  const [data, setData] = React.useState({});
  const [sortiesData, setSortiesData] = React.useState({});
  const [montantAchat, setMontantAchat] = React.useState(null);
  const [gapData, setGapData] = React.useState({});
  const [prixAchat, setPrixAchat] = React.useState(null);
  const [stockInitialHZ, setStockInitialHZ] = React.useState({});
  const [stockInitialHDZ, setStockInitialHDZ] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const user = React.useContext(UserContext);

  React.useEffect(() => {
    const getDatas = async () => {
      setIsLoading(true);
      try {
        const [
          stockResume,
          sorties,
          montantTotalAchat,
          pertes,
          prix,
          stockInitHZ,
          stockInitHDZ,
        ] = await Promise.allSettled([
          fetchData("get", "stock_resume/"),
          fetchData("get", "sorties/somme_totale_sorties/"),
          fetchData("get", "achats/quantite_totale/"),
          fetchData("get", "stock/details/pertes_totales/"),
          fetchData("get", "admin/prices/get_prix_achat/"),
          fetchData("get", "stock_resume_initial/"),
          fetchData("get", "stock_resume_initial/?detail=true"),
        ]);

        if (stockResume.status === "fulfilled")
          setData(stockResume.value || {});
        if (sorties.status === "fulfilled") setSortiesData(sorties.value || {});
        if (montantTotalAchat.status === "fulfilled")
          setMontantAchat(montantTotalAchat.value || {});
        if (pertes.status === "fulfilled") setGapData(pertes.value || {});
        if (prix.status === "fulfilled") setPrixAchat(prix.value || {});
        if (stockInitHZ.status === "fulfilled")
          setStockInitialHZ(stockInitHZ.value || {});
        if (stockInitHDZ.status === "fulfilled")
          setStockInitialHDZ(stockInitHDZ.value || {});
      } catch (error) {
        console.error("Error fetching section cards data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-12">
        <div className="col-span-12 @5xl/main:col-span-4">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-12 @5xl/main:col-span-4">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-12 @5xl/main:col-span-4">
          <StatsCardSkeleton />
        </div>
      </div>
    );
  }

  const qteBlanc = data?.achats?.achats_blanc || 0;
  const qteJaune = data?.achats?.achats_jaune || 0;
  const totalCollecte = qteBlanc + qteJaune;
  const percentageA = totalCollecte > 0 ? (qteBlanc / totalCollecte) * 100 : 0;
  const percentageB = totalCollecte > 0 ? (qteJaune / totalCollecte) * 100 : 0;

  const qteVendueBlanc = data?.sorties?.sorties_blanc || 0;
  const qteVendueJaune = data?.sorties?.sorties_jaune || 0;
  const totalVendu = qteVendueBlanc + qteVendueJaune;

  const pertesKg = gapData?.pertes_totales || 0;
  const unitPrice = prixAchat?.prix_achat || 0;
  const gapPrix = pertesKg * unitPrice;

  const totalStockInit =
    (stockInitialHZ?.total || 0) + (stockInitialHDZ?.total || 0);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-12">
      {/* Carte 1: Quantité Collectée */}

      <Card className="@container/card col-span-12 @5xl/main:col-span-5 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {totalCollecte >= 1000 ? (
                <>
                  {(totalCollecte / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base font-normal">T</span>
                </>
              ) : (
                <>
                  {totalCollecte.toLocaleString("fr-FR")}{" "}
                  <span className="text-sm font-normal">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Admin" && newQtyToday > 0 && (
              <Badge
                variant="secondary"
                className="bg-green-100 dark:bg-green-600/60 text-green-700 dark:text-green-100 px-1 py-0 h-5 ml-4"
              >
                <IconTrendingUp size={12} className="mr-0.5" />+
                {newQtyToday >= 1000 ? (
                  <>
                    {(newQtyToday / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    T
                  </>
                ) : (
                  <>{newQtyToday.toLocaleString("fr-FR")} Kg</>
                )}
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qté Collectée (CAB)
          </CardTitle>

          <div className="mt-2 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground ">
                Rapport Mais Blanc / Mais jaune
              </span>
              {/* <span className="text-[10px] font-mono text-muted-foreground">
                Ratio: 65%
              </span> */}
            </div>
            {/* Barre de progression professionnelle */}
            {/* <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted hidden">
              <div
                className="bg-background/90"
                style={{ width: `${percentageA}%` }}
              />
              <div
                className="bg-primary/90"
                style={{ width: `${percentageB}%` }}
              />
            </div> */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col bg-secondary/10 p-2 rounded-lg">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Squircle className="text-secondary size-3.5" /> Blanc
                </span>
                <span className="text-lg font-bold text-secondary mt-0.5">
                  {qteBlanc >= 1000
                    ? `${(qteBlanc / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${qteBlanc.toLocaleString("fr-FR")} Kg`}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({percentageA.toFixed(1)}%)
                </span>
              </div>

              <div className="flex flex-col bg-amber-500/10 p-2 rounded-lg">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Squircle className="text-primary size-3.5" /> Jaune
                </span>
                <span className="text-lg font-bold text-primary mt-0.5">
                  {qteJaune >= 1000
                    ? `${(qteJaune / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${qteJaune.toLocaleString("fr-FR")} Kg`}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({percentageB.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-1 mt-2 ">
            <div className="flex flex-row gap-x-2 items-center">
              <div className="rounded-md">
                <CircleDollarSign className="text-yellow-500 size-4" />
              </div>
              <CardTitle className="text-sm text-muted-foreground font-medium tabular-nums">
                Montant total
              </CardTitle>
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {Math.round(montantAchat?.prix_achat || 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                FBU
              </span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      {/* Carte 2: Quantité Vendue & Revenus */}
      <Card className="@container/card col-span-12 @5xl/main:col-span-4 relative border-secondary/20">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-3 items-center">
            <div className="bg-emerald-600 p-2.5 rounded-xl shadow-xs text-white">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quantité Vendue
              </CardDescription>
              <CardTitle className="text-2xl @[250px]/card:text-3xl font-bold tracking-tight tabular-nums">
                {totalVendu >= 1000 ? (
                  <>
                    {(totalVendu / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base font-normal">T</span>
                  </>
                ) : (
                  <>
                    {totalVendu.toLocaleString("fr-FR")}{" "}
                    <span className="text-sm font-normal">Kg</span>
                  </>
                )}
              </CardTitle>
            </div>
          </div>

          <div className="mt-3 space-y-3 w-full">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col bg-secondary/10 p-2 rounded-lg">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Grape className="text-emerald-600 size-3.5" /> Maïs Blanc
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {qteVendueBlanc >= 1000
                    ? `${(qteVendueBlanc / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${qteVendueBlanc.toLocaleString("fr-FR")} Kg`}
                </span>
              </div>

              <div className="flex flex-col bg-amber-500/10 p-2 rounded-lg">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Grape className="text-primary size-3.5" /> Maïs Jaune
                </span>
                <span className="text-sm font-bold text-primary dark:text-amber-400 mt-0.5">
                  {qteVendueJaune >= 1000
                    ? `${(qteVendueJaune / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${qteVendueJaune.toLocaleString("fr-FR")} Kg`}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Coins className="size-3.5 text-emerald-600" /> Revenus Ventes
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(sortiesData?.somme_total_price || 0).toLocaleString(
                  "fr-FR",
                )}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  FBU
                </span>
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Carte 3: GAP & Stock Initial */}
      <Card className="@container/card col-span-12 @5xl/main:col-span-4 relative border-rose-500/20">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-3 items-center">
            <div className="bg-rose-500 p-2.5 rounded-xl shadow-xs text-white">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pertes / GAP
              </CardDescription>
              <CardTitle className="text-2xl @[250px]/card:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 tabular-nums">
                {pertesKg >= 1000 ? (
                  <>
                    {(pertesKg / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base font-normal">T</span>
                  </>
                ) : (
                  <>
                    {pertesKg.toLocaleString("fr-FR")}{" "}
                    <span className="text-sm font-normal">Kg</span>
                  </>
                )}
              </CardTitle>
            </div>
          </div>

          <div className="mt-3 space-y-2 w-full text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30">
              <span className="text-muted-foreground">
                Valeur financière GAP :
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                {Math.round(gapPrix).toLocaleString("fr-FR")} FBU
              </span>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-muted-foreground flex items-center gap-1">
                  <Warehouse className="size-3.5 text-blue-600" /> Stock Initial
                  (Avant Campagne)
                </span>
                <span className="font-bold">
                  {totalStockInit >= 1000
                    ? `${(totalStockInit / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${totalStockInit.toLocaleString("fr-FR")} Kg`}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                <span>
                  HZ (Zonal) :{" "}
                  {stockInitialHZ?.total?.toLocaleString("fr-FR") || 0} kg
                </span>
                <span>
                  HDZ (Désengorgement) :{" "}
                  {stockInitialHDZ?.total?.toLocaleString("fr-FR") || 0} kg
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
