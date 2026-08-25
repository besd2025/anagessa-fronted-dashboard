"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, Warehouse, MoreHorizontal } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { fetchData } from "@/app/_utils/api";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";

function TopListCard({ title, icon, data }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* <ViewImageDialog imageUrl={item.image} /> */}
                <span className="text-sm font-medium leading-none">
                  {item.name}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.value.toLocaleString()}{" "}
                <span className="text-xs">{item.sub}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <Link href={`/anagessa-dashboard/hangars/profile/?id=${456}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopFiveCards() {
  const [datatopMembers, setDataTopMembers] = React.useState([]);
  const [datatopAchats, setDataTopAchats] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const getHangars = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_top_5_sdl_with_more_cultivators_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topMembers = response.map((item) => ({
          image: "/images/logo_1.jpg",
          name: item?.collector__responsable_sdl__sdl__sdl_nom,
          value: item?.count,
          sub: "cultivateurs",
        }));
        setDataTopMembers(topMembers);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopAchats = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_top_5_sdl_with_more_quantity_grains_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topAchats = response.map((item) => ({
          name: item?.responsable__responsable_ct__ct__ct_nom,
          value: item?.total_grains,
          sub: "Kg",
        }));
        setDataTopAchats(topAchats);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await Promise.all([getTopAchats(), getHangars()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
        <SimpleCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TopListCard
        title="Top 5 - Quantité Transferée"
        icon={<Scale className="h-4 w-4" />}
        data={datatopAchats}
      />
      {/* <TopListCard
        title="Top 5 - Nombre de cultivateurs"
        icon={<Users className="h-4 w-4" />}
        data={datatopMembers}
      /> */}
    </div>
  );
}
