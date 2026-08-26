import React from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Archive,
  Banknote,
  ChartColumn,
  CircleDollarSign,
  Grape,
  Landmark,
  Mars,
  TruckElectric,
  Users,
  Venus,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/app/context/User_Context";
function StatsCard({ id }) {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const user = React.useContext(UserContext);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        // Logique identique à anagessa_dashboard/cards_overview.jsx
        const [qte_achete, qte_vendu, transfers, stock_initial, cultivateurs, qte_recues] =
          await Promise.allSettled([
            fetchData("get", `hangars/${id}/get_total_achat_par_hangar`, {}),
            fetchData("get", `hangars/${id}/get_total_vent_par_hangar`, {}),
            fetchData("get", `hangars/${id}/get_quantity_transferer`, {}),
            fetchData("get", `hangars/${id}/get_inital_stock_per_hangar`, {}),
            fetchData("get", `hangars/${id}/get_cultivator_number_per_hangar`, {}),
            fetchData("get", `hangars/${id}/get_quantity_transferer_received`, {}),
          ]);

        const achats = qte_achete.status === "fulfilled" ? qte_achete.value : {};
        const ventes = qte_vendu.status === "fulfilled" ? qte_vendu.value : {};
        const transfert = transfers.status === "fulfilled" ? transfers.value : {};
        const stockInit = stock_initial.status === "fulfilled" ? stock_initial.value : {};
        const cultivs = cultivateurs.status === "fulfilled" ? cultivateurs.value : {};
        const recues = qte_recues.status === "fulfilled" ? qte_recues.value : {};

        const qte_blanc_restante =
          (achats?.total_blanc || 0) + (recues?.total_blanc || 0) -
          ((ventes?.total_blanc || 0) + (transfert?.total_blanc || 0));
        const qte_jaune_restante =
          (achats?.total_jaune || 0) + (recues?.total_jaune || 0) -
          ((ventes?.total_jaune || 0) + (transfert?.total_jaune || 0));

        setData({ achats, ventes, transfert, stockInit, cultivs, recues, qte_blanc_restante, qte_jaune_restante });
      } catch (error) {
        console.error("Error fetching hangars stats data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, [id]);

  const total = (data?.achats?.total_blanc || 0) + (data?.achats?.total_jaune || 0);
  const percentageA = total > 0 ? ((data?.achats?.total_blanc || 0) / total) * 100 : 0;
  const percentageB = total > 0 ? ((data?.achats?.total_jaune || 0) / total) * 100 : 0;

  const [avance, setAvance] = React.useState(false);
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
      <Card className="@container/card col-span-1 lg:col-span-6 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {(data?.achats?.total_blanc + data?.achats?.total_jaune) >= 1000 ? (
                <>
                  {((data?.achats?.total_blanc + data?.achats?.total_jaune) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.achats?.total_blanc + data?.achats?.total_jaune)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {/* Badge rôles ANAGESSA */}
            <></>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qté collectée (Maïs)
          </CardTitle>

          <div className="mt-2 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground ">
                Rapport Maïs Blanc / Jaune
              </span>
            </div>
            {/* Barre de progression */}
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="bg-primary/90" style={{ width: `${percentageA}%` }} />
              <div className="bg-secondary/90" style={{ width: `${percentageB}%` }} />
            </div>
            <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
              <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
                <span className="text-primary flex items-center gap-1">●</span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-primary size-5" />
                  <CardTitle className="text-md font-semibold text-primary">MB :</CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {(data?.achats?.total_blanc || 0) >= 1000 ? (
                    <>
                      {((data?.achats?.total_blanc || 0) / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2, maximumFractionDigits: 2,
                      })}{" "}<span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {(data?.achats?.total_blanc || 0).toLocaleString("fr-FR")}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({percentageA.toFixed(1)}%)
                  </span>
                </CardDescription>
              </div>
              <span className="w-0.5 h-8 bg-black/20 hidden lg:block"></span>
              <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
                <span className="text-secondary flex items-center gap-1">●</span>
                <div className="flex flex-row gap-x-1 items-center">
                  <Grape className="text-secondary size-5" />
                  <CardTitle className="text-md font-semibold text-secondary">MJ :</CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {(data?.achats?.total_jaune || 0) >= 1000 ? (
                    <>
                      {((data?.achats?.total_jaune || 0) / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2, maximumFractionDigits: 2,
                      })}<span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {(data?.achats?.total_jaune || 0).toLocaleString("fr-FR")}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({percentageB.toFixed(1)}%)
                  </span>
                </CardDescription>
              </div>
            </div>
          </div>

        </CardHeader>
      </Card>
      <Card className="@container/card lg:col-span-3">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <CircleDollarSign className="text-white" />
            </div>
            <CardTitle className="text-md text-muted-foreground font-medium tabular-nums  ">
              Montant
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tracking-tight tabular-nums">
            {(
              (data?.achats?.total_blanc || 0) + (data?.achats?.total_jaune || 0)
            ).toLocaleString("fr-FR")}{" "}
            <span className="text-base">Kg</span>
          </CardTitle>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-x-2 items-center justify-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />
                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 1
                </CardTitle>
              </div>
              <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                0 <span className="text-xs">FBU</span>
              </CardTitle>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-x-2 items-center justify-center">
              <div className="flex flex-row gap-x-0.5 items-center">
                <Banknote className="text-secondary" />
                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Tranche 2
                </CardTitle>
              </div>
              <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                0 <span className="text-xs">FBU</span>
              </CardTitle>
            </div>
            {avance && (
              <>
                <Separator />
                <div className="flex flex-wrap gap-x-2 items-center justify-center">
                  <div className="flex flex-row gap-x-1 items-center">
                    <Banknote className="text-secondary" />
                    <CardTitle className="text-muted-foreground font-normal text-sm  ">
                      Avance
                    </CardTitle>
                  </div>
                  <CardTitle className="text-base font-semibold tracking-tight tabular-nums">
                    0 <span className="text-xs">FBU</span>
                  </CardTitle>
                </div>
              </>
            )}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-1 lg:col-span-3 p-2 h-max">
        <CardHeader className="p-2">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-full">
              <Users className="text-white" />
            </div>
            <CardTitle className="font-normal flex flex-col   ">
              <span className="text-muted-foreground text-sm">
                Cafeiculteurs
              </span>
              <span className="text-lg font-semibold tracking-tight ">
                {(data?.nombre_cultivateurs?.hommes ?? 0) +
                  (data?.nombre_cultivateurs?.femmes ?? 0)}
              </span>
            </CardTitle>
          </div>
          <div className="flex flex-col gap-y-2 mt-4">
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-0.5">
                <span className="bg-backgrou/nd rounded">
                  <Mars />
                </span>
                Homme :
              </div>
              <div className="font-medium  ml-2">
                {data?.nombre_cultivateurs?.hommes}
              </div>
            </div>
            <div className="flex flex-row ">
              <div className="text-muted-foreground flex gap-x-0.5 ">
                <span className="">
                  <Venus />
                </span>
                Femme :
              </div>
              <div className="font-medium  ml-2">
                {data?.nombre_cultivateurs?.femmes || 0}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card col-span-1 lg:col-span-4 hidden">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <TruckElectric className="text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                <>
                  {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>
          <CardTitle className="text-sm font-semibold tabular-nums text-muted-foreground ">
            Qte Reçue (CT)
          </CardTitle>
          <Separator />
          <div className="flex flex-col h-full gap-y-1 justify-between text-xs font-medium">
            <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg w-max">
              <span className="text-primary flex items-center gap-1">●</span>
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-primary size-5" />
                <CardTitle className="text-md font-semibold text-primary">
                  CA :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.qte_achete?.cerise_a >= 1000 ? (
                  <>
                    {(data?.qte_achete?.cerise_a / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}{" "}
                    <span className="text-sm">T</span>
                  </>
                ) : (
                  <>
                    {data?.qte_achete?.cerise_a?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}

                {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                  ""
                ) : (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({data?.qte_achete?.cerise_a?.toLocaleString("fr-FR")} kg)
                  </span>
                )}

              </CardDescription>
            </div>
            <div className="flex flex-row gap-x-2 items-center py-1 px-2 rounded-lg">
              <span className="text-secondary flex items-center gap-1">
                ●
              </span>
              <div className="flex flex-row gap-x-1 items-center">
                <Grape className="text-secondary size-5" />
                <CardTitle className="text-md font-semibold text-secondary">
                  CB :
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                {data?.qte_achete?.cerise_b >= 1000 ? (
                  <>
                    {(data?.qte_achete?.cerise_b / 1000).toLocaleString(
                      "fr-FR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                    <span className="text-sm">T</span>
                  </>
                ) : (
                  <>
                    {data?.qte_achete?.cerise_b?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
                {user?.session?.category !== "Cafe_Chef_societe" && user?.session?.category !== "Superviseur_Regional" ? (
                  ""
                ) : (
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({data?.qte_achete?.cerise_b?.toLocaleString("fr-FR")} kg)
                  </span>
                )}

              </CardDescription>
            </div>
          </div>
          <div>
            <Separator />
            <CardTitle className="text-xs font-semibold tabular-nums text-muted-foreground my-2">
              CT source:
            </CardTitle>
            <div className="text-sm font-normal flex flex-col"><span>CT Gatwe</span><span>CT Gatwe</span></div>
          </div>
        </CardHeader>

      </Card>
      <Card className="@container/card col-span-1 lg:col-span-4 hidden">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-secondary p-2 rounded-md">
              <ChartColumn className="text-white" />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
              {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) >= 1000 ? (
                <>
                  {((data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b) / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-sm">Kg</span>
                </>
              )}
            </CardTitle>
            {user?.session?.category === "Cafe_Chef_societe" || user?.session?.category === "Superviseur_Regional" ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({(data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b)?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>
          <CardTitle className="text-sm font-semibold tabular-nums text-muted-foreground ">
            Rapport C
          </CardTitle>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-xs font-medium w-full">
            <div className="flex flex-col gap-2 items-center py-1 px-4 rounded-lg border">
              <div className="flex flex-row gap-x-1 items-center">
                <CardTitle className="text-base font-semibold text-primary">
                  FW
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                <div className="text-xs flex flex-col">
                  <span>A1: 123</span>
                  <span>B2: 123</span>
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-center py-1 px-4 rounded-lg border">
              <div className="flex flex-row gap-x-1 items-center">
                <CardTitle className="text-base font-semibold text-primary">
                  NATUREL
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                <div className="text-xs flex flex-col">
                  <span>A1: 123</span>
                  <span>B2: 123</span>
                </div>

              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 items-center py-1 px-4 rounded-lg border">
              <div className="flex flex-row gap-x-1 items-center">
                <CardTitle className="text-base font-semibold text-primary">
                  MIEL
                </CardTitle>
              </div>
              <CardDescription className="font-semibold text-accent-foreground text-lg">
                <div className="text-xs flex flex-col">
                  <span>A1: 123</span>
                  <span>B2: 123</span>
                </div>

              </CardDescription>
            </div>
          </div>
        </CardHeader>

      </Card>
    </div>
  );
}

export default StatsCard;
