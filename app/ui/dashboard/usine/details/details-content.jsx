"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import EditHistory from "./edit-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartNoAxesCombined,
  History,
  MapPinHouse,
  MoreHorizontal,
  ScrollText,
  ShoppingCart,
  Spline,
  Users,
  ArrowDownToLine,
  Factory,
  Leaf,
  Truck,
  Package,
} from "lucide-react";
import CultivatorsListTable from "../../cultivators/list";
import Achats from "./achats/achats";
import RedementC from "./rendement";
import RHlist from "./RH";
import { Button } from "@/components/ui/button";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";

// New Components
import Receptions from "./receptions";
import Usinage from "./usinage";
import Production from "./production";
import Sorties from "./sorties";
import Stocks from "./stocks";
import StatsCard from "./StatsCard";

function DetailsContent({ id }) {
  // Existing data mocks (kept for now if needed for legacy tabs, or removed if unused)
  const cultivatorsData = [
    {
      id: "cultivator_001",
      cultivator: {
        cultivator_code: "2530-522-7545",
        first_name: "CultiNom",
        last_name: "CultiPrenom",
        image_url: "/images/logo_1.jpg",
      },
      sdl_ct: "NGome",
      society: "ANAGESSA",
      localite: {
        province: "Buja",
        commune: "Ntahangwa",
      },
      champs: 4,
    },
    // ... (rest of mock data can be assumed to be fetched or removed if not needed)
  ];

  // Minimal mock data setup for legacy components to prevent crash if tabs are clicked
  const transferData = [];
  const RHData = [];

  const [tab, setTab] = useState("details");

  const [data, setData] = React.useState([]);
  const [dataAchat, setAchatDate] = React.useState([]);

  React.useEffect(() => {
    // Existing fetch logic kept for "cultivators" and "achats" if they are still relevant
    // ...
    // For now, focusing on the new Usine modules
  }, [id]);

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedPosition(place?.coordinates);
  };

  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs value={tab} className="space-y-6 w-full" onValueChange={setTab}>
        {/* TABS LIST */}
        <TabsList className="overflow-x-auto flex-nowrap gap-2 w-full justify-start">
          <TabsTrigger value="details" className="shrink-0">
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Details
          </TabsTrigger>
          <TabsTrigger value="receptions" className="shrink-0">
            <ArrowDownToLine className="w-4 h-4 mr-2" /> Réceptions
          </TabsTrigger>

          <TabsTrigger value="usinage" className="shrink-0">
            <Factory className="w-4 h-4 mr-2" /> Usinage
          </TabsTrigger>

          <TabsTrigger value="production" className="shrink-0">
            <Leaf className="w-4 h-4 mr-2" /> Production
          </TabsTrigger>

          <TabsTrigger value="sorties" className="shrink-0">
            <Truck className="w-4 h-4 mr-2" /> Sorties
          </TabsTrigger>

          <TabsTrigger value="stocks" className="shrink-0">
            <Package className="w-4 h-4 mr-2" /> Stocks
          </TabsTrigger>

          <TabsTrigger value="maps" className="shrink-0">
            <MapPinHouse className="w-4 h-4 mr-2" /> Map
          </TabsTrigger>

          {/* MOBILE DROPDOWN */}
          <div className="block lg:hidden ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTab("rh")}>
                  <ScrollText className="w-4 h-4 mr-2" /> RH
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setTab("maps")}>
                  <MapPinHouse className="w-4 h-4 mr-2" /> Map
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsList>

        <TabsContent value="details">
          <StatsCard id={id} />
        </TabsContent>
        <TabsContent value="receptions">
          <Receptions />
        </TabsContent>

        <TabsContent value="usinage">
          <Usinage />
        </TabsContent>

        <TabsContent value="production">
          <Production />
        </TabsContent>

        <TabsContent value="sorties">
          <Sorties />
        </TabsContent>

        <TabsContent value="stocks">
          <Stocks />
        </TabsContent>

        <TabsContent value="maps">
          <SharedGeoLocalisation
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            onCloseDetails={() => setSelectedPlace(null)}
            flyToPosition={selectedPosition}
            mainMap={false}
            data={[
              {
                name: "UDP",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-10 text-yellow-500 drop-shadow-xl"
                  >
                    <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
                    <path
                      fillRule="evenodd"
                      d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                      clipRule="evenodd"
                    />
                    <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
                  </svg>
                ),
                mapIcon: (
                  <div className="relative size-16 flex items-center justify-center">
                    {/* PIN */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="absolute inset-0 size-full text-yellow-500/50 drop-shadow-xl z-0"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                    {/* ICON CENTER */}
                    <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-white drop-shadow-md"
                      >
                        <path
                          d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832
                        1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z"
                        />
                        <path
                          fillRule="evenodd"
                          d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z"
                          clipRule="evenodd"
                        />
                        <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
                      </svg>
                    </div>
                  </div>
                ),
                places: [
                  {
                    name: "UDP CAFO",
                    coordinates: [-3.3896077, 29.90005829],
                    type: "UDP",
                    address: "Zone Cafo, Commune Gitega",
                    stockmaisVert: 25000,
                  },
                  {
                    name: "UDP KAWA",
                    coordinates: [-3.3896077, 29.9995829],
                    type: "UDP",
                    address: "Zone Kawa, Commune Ngozi",
                    stockmaisVert: 18000,
                  },
                ],
              },
            ]}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
