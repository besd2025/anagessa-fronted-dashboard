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
  ArchiveRestore,
  Package,
  UsersRound,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { StatsCardSkeleton } from "@/components/ui/skeletons";
import { UserContext } from "@/app/context/User_Context";
import { Separator } from "@/components/ui/separator";

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
  const [total_cultivators, setTotalCultivators] = React.useState(null);
  const [total_hangars, setTotalHangars] = React.useState(null);

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
          totalCultivatorsRes,
          totalHangarsRes,
        ] = await Promise.allSettled([
          fetchData("get", "stock_resume/"),
          fetchData("get", "sorties/somme_totale_sorties/"),
          fetchData("get", "achats/quantite_totale/"),
          fetchData("get", "stock/details/pertes_totales/"),
          fetchData("get", "admin/prices/get_prix_achat/"),
          fetchData("get", "stock_resume_initial/"),
          fetchData("get", "stock_resume_initial/?detail=true"),
          fetchData("get", "cultivators/total_cultivators/"),
          fetchData("get", "hangars/total/"),
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
        if (totalCultivatorsRes.status === "fulfilled") {
          const res = totalCultivatorsRes.value;
          const count =
            typeof res === "number"
              ? res
              : (res?.total_cultivators ?? res?.count ?? res?.total ?? 0);
          setTotalCultivators(count);
        }
        if (totalHangarsRes.status === "fulfilled") {
          const res = totalHangarsRes.value;
          const count =
            typeof res === "number"
              ? res
              : (res?.total_hangars ?? res?.count ?? res?.total ?? 0);
          setTotalHangars(count);
        }
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

  const cultivatorsCount =
    typeof total_cultivators === "number"
      ? total_cultivators
      : (total_cultivators?.total_cultivators ??
        total_cultivators?.count ??
        total_cultivators?.total ??
        0);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-12">
      {/* Carte 1: Quantité Collectée */}

      <Card className="@container/card col-span-12 @5xl/main:col-span-5 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <ArchiveRestore className="text-white size-5" />
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
            {/* {user?.session?.category === "Admin" && newQtyToday > 0 && (
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
            )} */}
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qté Collectée
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
                  <Squircle className="text-secondary size-3.5" /> Maïs Blanc
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
                  <Squircle className="text-primary size-3.5" /> Maïs Jaune
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
                  <Squircle className="text-secondary size-3.5" /> Maïs Blanc
                </span>
                <span className="text-lg font-bold text-secondary mt-0.5">
                  {qteVendueBlanc >= 1000
                    ? `${(qteVendueBlanc / 1000).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`
                    : `${qteVendueBlanc.toLocaleString("fr-FR")} Kg`}
                </span>
              </div>

              <div className="flex flex-col bg-amber-500/10 p-2 rounded-lg">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Squircle className="text-primary size-3.5" /> Maïs Jaune
                </span>
                <span className="text-lg font-bold text-primary mt-0.5">
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

      {/* Carte 4: Total caféiculteurs */}
      <Card className="@container/card col-span-12 @5xl/main:col-span-3 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-3 items-center">
            <div className="bg-primary p-2.5 rounded-xl shadow-xs text-white">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total caféiculteurs
              </CardDescription>
              <CardTitle className="text-2xl @[250px]/card:text-3xl font-bold tracking-tight tabular-nums">
                {Number(cultivatorsCount || 0).toLocaleString("fr-FR")}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-3 items-center">
            <div className="bg-primary p-2.5 rounded-xl shadow-xs text-white">
              <UsersRound className="h-5 w-5" />
            </div>
            <div>
              <CardDescription className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Hangars
              </CardDescription>
              <CardTitle className="text-2xl @[250px]/card:text-3xl font-bold tracking-tight tabular-nums">
                {Number(total_hangars || 0).toLocaleString("fr-FR")}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
