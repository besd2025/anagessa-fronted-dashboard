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
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const user = React.useContext(UserContext)
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const qte_achete = await fetchData(
          "get",
          `cafe/hangars/${id}/get_total_achat_par_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const nombre_cultivateurs = await fetchData(
          "get",
          `cafe/hangars/${id}/get_total_cultivators_sdl/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );

        const response = { qte_achete, nombre_cultivateurs };
        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, [id]);

  const total = data?.qte_achete?.cerise_a + data?.qte_achete?.cerise_b || 0;
  const percentageA =
    total > 0 ? ((data?.qte_achete?.cerise_a || 0) / total) * 100 : 0;
  const percentageB =
    total > 0 ? ((data?.qte_achete?.cerise_b || 0) / total) * 100 : 0;

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
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte collectee (CAB)
          </CardTitle>

          <div className="mt-2 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground ">
                Rapport Cerise A / B
              </span>
              {/* <span className="text-[10px] font-mono text-muted-foreground">
                      Ratio: 65%
                    </span> */}
            </div>
            {/* Barre de progression professionnelle */}
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="bg-primary/90"
                style={{ width: `${percentageA}%` }}
              />
              <div
                className="bg-secondary/90"
                style={{ width: `${percentageB}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-y-2 justify-between text-xs font-medium">
              <div className="flex flex-row gap-x-2 items-center bg-primary/10 py-1 px-2 rounded-lg w-max">
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
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageA.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.qte_achete?.cerise_a?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

                </CardDescription>
              </div>
              <span className="w-0.5 h-8 bg-black/20 hidden lg:block"></span>
              <div className="flex flex-row gap-x-2 items-center bg-secondary/10 py-1 px-2 rounded-lg">
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
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageB.toFixed(1)}%)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.qte_achete?.cerise_b?.toLocaleString("fr-FR")} kg)
                    </span>
                  )}

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
              data?.qte_achete?.montant_cerise_a +
              data?.qte_achete?.montant_cerise_b ?? 0
            )
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            <span className="text-base">FBU</span>
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
