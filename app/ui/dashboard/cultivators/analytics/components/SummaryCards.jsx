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

        const count_cultivateurs = await fetchData(
          "get",
          `cultivators/total_cultivators/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        console.log("count_cultivateurs", count_cultivateurs);
        setData(count_cultivateurs);
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
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
          <CardTitle className=" font-medium">Physiques</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.total_cultivators}</div>
          <p className="text-xs text-muted-foreground">
            {((data?.total_cultivators / data?.total_cultivators) * 100).toFixed(1)}% du
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
          <div className="text-2xl font-bold">{resultsData?.association || 0}</div>
          <p className="text-xs text-muted-foreground">
            {((resultsData?.association || 0 / data?.total_cultivators) * 100).toFixed(1) || 0}% du
            total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
