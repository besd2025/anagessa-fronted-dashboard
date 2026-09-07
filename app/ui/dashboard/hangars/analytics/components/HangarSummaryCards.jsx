"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle2, XCircle } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
export function HangarSummaryCards() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [hangarEnActivite, setHangarEnActivite] = React.useState([]);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const hangar_en_activit = await fetchData("get", "hangar_with_stats/", {
          params: {},
          additionalHeaders: {},
          body: {},
        });


        setHangarEnActivite(hangar_en_activit);


      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SimpleCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-row gap-x-2 items-center">
            <div className="bg-primary p-2 rounded-md">
              <Building2 className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              {hangarEnActivite?.total_hangars}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Effectif Total des hangars
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Actifs</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hangarEnActivite?.hangars_avec_collecteur}
          </div>
          <p className="text-xs text-muted-foreground">
            {((hangarEnActivite?.hangars_avec_collecteur / hangarEnActivite?.total_hangars) * 100)?.toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Inactifs</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hangarEnActivite?.total_hangars - hangarEnActivite?.hangars_avec_collecteur}
          </div>
          <p className="text-xs text-muted-foreground">
            {((hangarEnActivite?.total_hangars - hangarEnActivite?.hangars_avec_collecteur) / hangarEnActivite?.total_hangars * 100)?.toFixed(1)}% du total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
