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
import { Skeleton } from "@/components/ui/skeleton";
import { SocietyListDialog } from "../../../home/components/SocietyListDialog";

function TopListCard({ title, icon, data, itemIcon }) {
  // Main card only shows the top 5
  const topFive = data.slice(0, 5);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 mt-2 flex-1">
          {topFive.map((item, i) => (
            <div key={i} className="grid grid-cols-3">
              <div className="flex items-center gap-2 col-span-1">
                <span className="text-sm text-muted-foreground">{itemIcon}</span> <p className="text-sm font-medium leading-none">
                  {item.name}
                </p>
              </div>
              <div className="col-span-1 flex  justify-center">
                <div className="text-sm text-muted-foreground">
                  {item.value.toLocaleString()}{" "}
                  <span className="text-xs">{item.sub}</span>
                </div>
              </div>
              <p className="text-sm col-span-1 flex justify-end items-center text-secondary font-medium">
                50%
                <span className="text-xs font-normal ml-1">du Total</span>
              </p>
              {/* <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <Link href={`/odeca-dashboard/hangars/details/?id=${item?.id}`}>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div> */}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <SocietyListDialog title={title} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}

export function HangarTopFiveCards() {
  const [loading, setLoading] = React.useState(true);
  const [datatopMembers, setDataTopMembers] = React.useState([]);
  const [datatopAchats, setDataTopAchats] = React.useState([]);
  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const response = await fetchData(
          "get",
          `cafe/hangars/get_top_5_sdl_with_more_cultivators_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topMembers = response.map((item) => ({
          id: item?.collector__responsable_sdl__sdl__id,
          image: "/images/logo_1.jpg",
          name: item?.collector__responsable_sdl__sdl__sdl_nom,
          value: item?.count,
          sub: "Cafeiculteurs",
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
          `cafe/hangars/get_top_5_sdl_with_more_quantity_cerise_ordered_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topAchats = response.map((item) => ({
          name: item?.responsable__responsable_sdl__sdl__sdl_nom,
          value: item?.total_cerise,
          sub: "Kg",
        }));


        setDataTopAchats(topAchats);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([getTopAchats(), getSdls()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TopListCard
        title="Top 5 -hangar les plus de quantitees"
        itemIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
        </svg>
        }
        icon={<Scale className="h-4 w-4" />}
        data={datatopAchats}
      />
      <TopListCard
        title="Top 5 -hangar les plus de cafeiculteurs"
        itemIcon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
        </svg>}
        icon={<Users className="h-4 w-4" />}
        data={datatopMembers}
      />
    </div>
  );
}
