"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchData } from "@/app/_utils/api";
import {
  Bean,
  Warehouse,
  Building2,
  Store,
  Archive,
  Grape,
  CircleDollarSign,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function StatsCard({ id }) {
  const [data, setData] = React.useState({
    total_ca: 0,
    total_cb: 0,
    total_green_coffee: 0,
    total_Hangars: 0,
    total_cts: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          `mais/societes/${id}/get_total_achat_par_societe/`,
          {},
        );
        const sdlCount = response?.total_Hangars ?? 0;
        const ctCount = response?.total_cts ?? 0;

        setData({
          total_grains_achat: response?.total_grains_achat || 0,
          total_grains_a_achat: response?.total_grains_a_achat || 0,
          total_grains_b_achat: response?.total_grains_b_achat || 0,
          total_montant_achat: response?.total_montant_achat || 0,
          total_ca: response?.total_ca || 0,
          total_cb: response?.total_cb || 0,
          total_green_coffee: response?.total_green_coffee || 0,
          total_Hangars: sdlCount,
          total_cts: ctCount,
        });
      } catch (error) {
        console.error("Error fetching society data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getStats();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  const total = data?.total_grains_achat || 0;
  const percentageA =
    total > 0 ? ((data?.total_grains_a_achat || 0) / total) * 100 : 0;
  const percentageB =
    total > 0 ? ((data?.total_grains_b_achat || 0) / total) * 100 : 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Combined CA/CB Card */}
      <Card className="@container/card col-span-2 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
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
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte collectee (CAB)
          </CardTitle>

          <div className="mt-2 space-y-3 w-full">
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground ">
                Rapport grains A / B
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
                        },
                      )}{" "}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_grains_a_achat?.toLocaleString("fr-FR") || 0}{" "}
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
                <span className="text-secondary flex items-center gap-1">
                  ●
                </span>
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
                        },
                      )}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_grains_b_achat?.toLocaleString("fr-FR") || 0}{" "}
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
              {Math.round(data?.total_montant_achat ?? 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                FBU
              </span>
            </CardTitle>
          </div>
        </CardHeader>
      </Card>
      <Card className="p-4 flex space-x-4 bg-white dark:bg-sidebar border-none shadow-sm rounded-xl col-span-2 h-max">
        <div className="flex flex-row gap-x-8 w-full">
          <div className="flex flex-row gap-x-4 items-center  py-2 px-4 rounded-lg  ">
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
              <p className="text-sm text-muted-foreground">Hangars</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">{data.total_Hangars}</h3>
            </div>
          </div>
          <div className="flex flex-row gap-x-4 items-center  py-2 px-4 rounded-lg  ">
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-muted-foreground"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
              <p className="text-sm text-muted-foreground">CTs</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">{data.total_cts}</h3>
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-row gap-x-2 items-center">
          <div className="">
            <Users className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">cultivateurs</p>
            <h3 className="text-xl font-bold">
              {data.total_green_coffee.toLocaleString()}{" "}
            </h3>
          </div>
        </div>
        <div className="flex flex-row gap-x-2 items-center">
          <div className="">
            <Grape className="size-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Café Vert Produit</p>
            <h3 className="text-xl font-bold">
              {data.total_green_coffee.toLocaleString()}{" "}
              <span className="text-sm text-muted-foreground font-normal">
                kg
              </span>
            </h3>
          </div>
        </div>
      </Card>

      {/* Green Coffee Card */}
      <Card className="hidden p-4 fle/x items-center space-x-4 bg-white dark:bg-sidebar border-none shadow-sm rounded-xl h-max">
        <div className="p-3 bg-secondary/20 rounded-lg">
          <Grape className="size-6 text-secondary dark:text-secondary-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Café Vert Produit</p>
          <h3 className="text-xl font-bold">
            {data.total_green_coffee.toLocaleString()}{" "}
            <span className="text-sm text-muted-foreground font-normal">
              kg
            </span>
          </h3>
        </div>
      </Card>
    </div>
  );
}
