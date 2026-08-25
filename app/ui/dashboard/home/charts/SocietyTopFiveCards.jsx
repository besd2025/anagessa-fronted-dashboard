"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Users, MoreHorizontal, Building2 } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { SimpleCardSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { SocietyListDialog } from "../components/SocietyListDialog";
import { HangarTopFiveCards } from "../../hangars/analytics/components/HangarTopFiveCards";

function TopListCard({ title, icon, data, itemIcon }) {
  // Main card only shows the top 5
  const topFive = data.slice(0, 5);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 mt-2 flex-1">
          {topFive.map((item, i) => (
            <div key={i} className="grid grid-cols-3">
              <div className="flex items-center gap-2 col-span-1 ">
                <span className="text-sm text-muted-foreground">{itemIcon}</span>
                <span className="text-sm font-medium leading-none">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <div className="text-sm text-muted-foreground ">
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
                    <Link href={`/anagessa-dashboard/hangarss/details?id=${item.id}`}>
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

export function SocietyTopFiveCards() {
  const [datatopMembers, setDataTopMembers] = React.useState([
    { id: 1, name: "ANAGESSA", value: 1250, sub: "cultivateurs" },
    { id: 2, name: "SOGESTAL", value: 1100, sub: "cultivateurs" },
    { id: 3, name: "BUGESTAL", value: 950, sub: "cultivateurs" },
    { id: 4, name: "COCOCA", value: 800, sub: "cultivateurs" },
    { id: 5, name: "SUCCAM", value: 750, sub: "cultivateurs" },
    { id: 6, name: "SOGESTAL Kayanza", value: 650, sub: "cultivateurs" },
    { id: 7, name: "SOGESTAL Ngozi", value: 600, sub: "cultivateurs" },
    { id: 8, name: "SOGESTAL Kirundo", value: 550, sub: "cultivateurs" },
    { id: 9, name: "SOGESTAL Muyinga", value: 500, sub: "cultivateurs" },
    { id: 10, name: "SOGESTAL Karuzi", value: 450, sub: "cultivateurs" },
  ]);
  const [datatopAchats, setDataTopAchats] = React.useState([
    { id: 1, name: "ANAGESSA", value: 450000, sub: "Kg" },
    { id: 2, name: "SOGESTAL", value: 380000, sub: "Kg" },
    { id: 3, name: "BUGESTAL", value: 310000, sub: "Kg" },
    { id: 4, name: "COCOCA", value: 275000, sub: "Kg" },
    { id: 5, name: "SUCCAM", value: 240000, sub: "Kg" },
    { id: 6, name: "SOGESTAL Kayanza", value: 210000, sub: "Kg" },
    { id: 7, name: "SOGESTAL Ngozi", value: 180000, sub: "Kg" },
    { id: 8, name: "SOGESTAL Kirundo", value: 150000, sub: "Kg" },
    { id: 9, name: "SOGESTAL Muyinga", value: 120000, sub: "Kg" },
    { id: 10, name: "SOGESTAL Karuzi", value: 90000, sub: "Kg" },
  ]);
  const [loading, setLoading] = React.useState(false);

  if (loading)
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 2 }).map((_, idx) => (
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
  return (
    <div className="">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <TopListCard
          title="Top 5 - Societes les plus de quantitees"
          itemIcon={<Building2 className="h-4 w-4" />}
          icon={<Scale className="h-4 w-4" />}
          data={datatopAchats}
        />
        <TopListCard
          title="Top 5 - Societes les plus de cultivateurs"
          itemIcon={<Building2 className="h-4 w-4" />}
          icon={<Users className="h-4 w-4" />}
          data={datatopMembers}
        />
      </div>
      <div className="mt-6">
        <HangarTopFiveCards />
      </div>
    </div>

  );
}
