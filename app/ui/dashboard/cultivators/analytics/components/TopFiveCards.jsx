"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, Trees, Scale, MoreHorizontal, Users } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function TopListCard({ title, icon, data }) {
  console.log("data in TopListCard:", data);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {data.map((item, i) => (
            <div key={i} className="grid grid-cols-3">
              <div className="flex items-center gap-2 col-span-1">
                {item.image && <ViewImageDialog imageUrl={item.image} />}
                <span className="text-sm font-medium leading-none">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center justify-center col-span-1">
                <div className="text-sm text-muted-foreground">
                  {item.value.toLocaleString()}{" "}
                  <span className="text-xs">{item.sub}</span>
                </div>
              </div>
              <div className="col-span-1 flex justify-end ">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <Link
                      href={`/anagessa-dashboard/cultivators/profile/?id=${item.id}`}
                    >
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TopFiveCards() {
  const [loading, setLoading] = React.useState(true);
  const [datatopChamps, setDataTopChamps] = React.useState([]);
  const [datatopPieds, setDataTopPieds] = React.useState([]);
  const [datatopQtes, setDataTopQtes] = React.useState([]);
  const [datatopSocieties, setDataTopSocieties] = React.useState([
    {
      id: 1,
      name: "SOGESTAL KAYANZA",
      value: 12450,
      sub: "maisic...",
      image: null,
    },
    {
      id: 2,
      name: "SOGESTAL NGOZI",
      value: 10800,
      sub: "maisic...",
      image: null,
    },
    {
      id: 3,
      name: "GREENCO",
      value: 8500,
      sub: "maisic...",
      image: null,
    },
    {
      id: 4,
      name: "HORAMAMA COFFEE",
      value: 7200,
      sub: "maisic...",
      image: null,
    },
    {
      id: 5,
      name: "BUGESTAL",
      value: 5400,
      sub: "maisic...",
      image: null,
    },
  ]);
  React.useEffect(() => {
    const getChamps = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_top_5_clutivateurs_avec_beaucoup_de_champs_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topChamps = response.map((item) => ({
          id: item?.cultivateur_champ__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cultivateur_champ__cultivator_photo,
          name:
            item?.cultivateur_champ__cultivator_first_name +
            " " +
            item?.cultivateur_champ__cultivator_last_name,
          value: item?.champs,
          sub: "Champs",
        }));
        setDataTopChamps(topChamps);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopPieds = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_top_5_clutivateurs_avec_beaucoup_de_pieds_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        const topPieds = response.map((item) => ({
          id: item?.cultivateur_champ__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cultivateur_champ__cultivator_photo,
          name:
            item?.cultivateur_champ__cultivator_first_name +
            " " +
            item?.cultivateur_champ__cultivator_last_name,
          value: item?.pieds,
          sub: "Pieds",
        }));

        setDataTopPieds(topPieds);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const getTopQtes = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/hangars/get_top_5_clutivateurs_avec_beaucoup_de_quantite_by_count/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          }
        );
        console.log("ggggg", response);
        const topQtes = response.map((item) => ({
          id: item?.cultivateur__id,
          image:
            process.env.NEXT_PUBLIC_IMAGE_URL +
            item?.cultivateur__cultivator_photo,
          name:
            item?.cultivateur__cultivator_last_name +
            " " +
            item?.cultivateur__cultivator_first_name,
          value: item?.total_grains,
          sub: "KG",
        }));
        setDataTopQtes(topQtes);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([getChamps(), getTopPieds(), getTopQtes()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* <TopListCard
        title="Top 5 - Nombre de Champs"
        icon={<Sprout className="h-4 w-4" />}
        data={datatopChamps}
      />
      <TopListCard
        title="Top 5 - Nombre de Pieds"
        icon={<Trees className="h-4 w-4" />}
        data={datatopPieds}
      /> */}
      <TopListCard
        title="Top 5 - Quantité personne Physique"
        icon={<Scale className="h-4 w-4" />}
        data={datatopQtes}
      />
      {/* <TopListCard
        title="Top 5 - Quantité personne Morale"
        icon={<Scale className="h-4 w-4" />}
        data={datatopQtes}
      />
      <TopListCard
        title="Top 5 - Societe avec cultivateurs enregistrée"
        icon={<Users className="h-4 w-4" />}
        data={datatopSocieties}
      /> */}
    </div>
  );
}
