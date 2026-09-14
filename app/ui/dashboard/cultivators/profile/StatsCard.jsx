import React, { useEffect } from "react";
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
  CircleDollarSign,
  Grape,
  Landmark,
} from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
import { Separator } from "@/components/ui/separator";
import { UserContext } from "@/app/context/User_Context";

function StatsCard({ cult_id }) {
  const [data, setData] = React.useState({});
  const [values, setValues] = React.useState({});
  const [dataavance, setDataavance] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const user = React.useContext(UserContext);
  console.log(user?.session);
  useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData("get", `/cultivators/${cult_id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        setData(response);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, [cult_id]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
      </div>
    );
  }

  const total_grains = data?.total_quantite;
  const percentageA =
    total_grains > 0 ? (data?.total_blanc / total_grains) * 100 : 0;
  const percentageB =
    total_grains > 0 ? (data?.total_jaune / total_grains) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="@container/card col-span-1 lg:col-span-2 relative">
        <CardHeader className="flex flex-col">
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Archive className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums">
              {data?.total_quantite >= 1000 ? (
                <>
                  {(data?.total_quantite / 1000).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <span className="text-base">T</span>
                </>
              ) : (
                <>
                  {data?.total_quantite?.toLocaleString("fr-FR") || 0}{" "}
                  <span className="text-base">Kg</span>
                </>
              )}{" "}
            </CardTitle>
            {data?.total_quantite >= 1000 &&
            (user?.session?.category === "Anagessa_Chef_societe" ||
              user?.session?.category === "Superviseur_Regional") ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({data?.total_quantite?.toLocaleString("fr-FR")} kg)
              </span>
            ) : (
              <></>
            )}
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums  ">
            Qte Vendue (CA+CB)
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
                  {data?.total_blanc >= 1000 ? (
                    <>
                      {(data?.total_blanc / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_blanc?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}{" "}
                  {user?.session?.category === "Anagessa_Chef_societe" ||
                  user?.session?.category === "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.total_blanc?.toLocaleString("fr-FR")} kg)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageA.toFixed(1)}%)
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
                    Maïs jaune :
                  </CardTitle>
                </div>
                <CardDescription className="font-semibold text-accent-foreground text-lg">
                  {data?.total_jaune >= 1000 ? (
                    <>
                      {(data?.total_jaune / 1000).toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                      <span className="text-sm">T</span>
                    </>
                  ) : (
                    <>
                      {data?.total_jaune?.toLocaleString("fr-FR") || 0}{" "}
                      <span className="text-sm">Kg</span>
                    </>
                  )}{" "}
                  {user?.session?.category == "Anagessa_Chef_societe" ||
                  user?.session?.category == "Superviseur_Regional" ? (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({data?.total_jaune?.toLocaleString("fr-FR")} kg)
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground ml-2">
                      ({percentageB.toFixed(1)}%)
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <CircleDollarSign className="text-white" />
            </div>
            <CardTitle className="text-lg text-muted-foreground font-medium tabular-nums  ">
              Montant total
            </CardTitle>
          </div>
          <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
            {((data?.total_quantite || 0) * 1700 ?? 0)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
            <span className="text-base">FBU</span>
          </CardTitle>
          <Separator />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-x-4 items-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />

                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Payé
                </CardTitle>
              </div>
              <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                0 <span className="text-base">FBU</span>
              </CardTitle>
            </div>
            <Separator />
            {/* <div className="flex flex-row gap-x-4 items-center">
              <div className="flex flex-row gap-x-1 items-center">
                <Banknote className="text-secondary" />

                <CardTitle className="text-muted-foreground font-normal text-sm  ">
                  Avance
                </CardTitle>
              </div>
              <CardTitle className="text-md font-semibold tracking-tight tabular-nums">
                {dataavance?.montant_total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} <span className="text-base">FBU</span>
              </CardTitle>
            </div> */}
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-yellow-500 p-2 rounded-md">
              <Landmark className="text-white" />
            </div>
            <CardTitle className="text-lg font-medium tabular-nums">
              <div className="text-muted-foreground  font-normal text-sm  ">
                Mode de paiment
              </div>
              {data?.cultivator_payment_type === "momo"
                ? "Mobile Money"
                : "Banque"}
            </CardTitle>
          </div>
          {data?.cultivator_payment_type === "momo" ? (
            <>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {data?.cultivator_payment_type}
              </CardTitle>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col ">
                  <div className="text-muted-foreground font-medium tabular-nums  ">
                    No compte
                  </div>
                  <div className="text-lg font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_bank_account}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground font-medium tabular-nums  ">
                    Proprietaire
                  </div>
                  <div className=" font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_account_owner}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <CardTitle className="text-xl font-semibold tracking-tight tabular-nums">
                {data?.cultivator_bank_name}
                {/* {data?.cultivator_bank_opened} */}
              </CardTitle>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-col ">
                  <div className="text-muted-foreground font-medium tabular-nums  ">
                    No compte
                  </div>
                  <div className="text-lg font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_bank_account}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-muted-foreground font-medium tabular-nums  ">
                    Proprietaire
                  </div>
                  <div className=" font-semibold tracking-tight tabular-nums">
                    {data?.cultivator_account_owner}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}

export default StatsCard;
