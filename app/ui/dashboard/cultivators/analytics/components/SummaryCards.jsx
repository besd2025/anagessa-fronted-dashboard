"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, User, Grape } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
export function SummaryCards() {
  const [data, setData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [resultsData, setResultsData] = React.useState({});
  React.useEffect(() => {
    const getCultivators = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/hangars/get_total_cultivators/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const response2 = await fetchData(
          "get",
          `/cultivators/get_mais_cultivateurs_par_entite_type/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        setData(response);
        setResultsData(response2);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
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
              <Users className="text-white" />
            </div>
            <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tracking-tight tabular-nums ml-2">
              {data.total_cultivators}
            </CardTitle>
          </div>
          <CardTitle className="text-lg font-semibold tabular-nums ml-2">
            Total cultivateurs
          </CardTitle>
          {/* <CardAction>
            <Badge variant="secondary">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
        </CardHeader>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Hommes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.hommes}</div>
          <p className="text-xs text-muted-foreground">
            {((data?.hommes / data?.total_cultivators) * 100).toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">Femmes</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.femmes}</div>
          <p className="text-xs text-muted-foreground">
            {((data?.femmes / data?.total_cultivators) * 100).toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card> */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Physiques</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resultsData?.personne}</div>
          <p className="text-xs text-muted-foreground">
            {((resultsData?.personne / data?.total_cultivators) * 100).toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className="font-medium">
            Associations/Cooperatives
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resultsData?.association}</div>
          <p className="text-xs text-muted-foreground">
            {((resultsData?.association / data?.total_cultivators) * 100).toFixed(1)}% du
            total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
