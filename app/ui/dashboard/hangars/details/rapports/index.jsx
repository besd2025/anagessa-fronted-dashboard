import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RHlist from "./RH";
import { FileSpreadsheet } from "lucide-react";
import RBSdl from "./RB";
import RedementC from "../rendement";
import RA from "./RA";
import RG from "./RG";
import ComingSoonOverlay from "@/app/ui/components/coming-soon-overlay";
const RHData = [
  {
    id: "cultivator_001",
    cultivator: {
      cultivator_code: "2530-522-7545",
      first_name: "CultiNom",
      last_name: "CultiPrenom",
      image_url: "/images/logo_1.jpg",
    },
    cni: "74/565",
    ca: 78,
    ca_price: 7855,
    cb: 785,
    cb_price: 4544,
    qte_total: 555,
    total_price: 457,
  },
];
export default function Rapports({ id }) {
  const [rapports, setRapports] = useState("rapportC");
  return (
    <div className="w-full relative">
      <Tabs
        value={rapports}
        className="space-y-6 w-full"
        onValueChange={setRapports}
      >
        {/* TABS LIST */}
        <TabsList className="overflow-x-auto flex-nowrap gap-2 w-full">
          {/* <TabsTrigger value="rapportA" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport A
          </TabsTrigger>
          <TabsTrigger value="rapportB" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport B
          </TabsTrigger> */}
          <TabsTrigger value="rapportC" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport C
          </TabsTrigger>
          {/* <TabsTrigger value="rapportG" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport G
          </TabsTrigger> */}
          <TabsTrigger value="rapportH" className="shrink-0">
            <FileSpreadsheet className="w-4 h-4" /> Rapport H
          </TabsTrigger>
        </TabsList>
        {/* <TabsContent value="rapportA">
          <RA />
        </TabsContent>
        <TabsContent value="rapportB">
          <RBSdl />
        </TabsContent> */}
        <TabsContent value="rapportC" className="relative">
          {/* <ComingSoonOverlay transparent={true} /> */}
          <RedementC id={id} />
        </TabsContent>
        {/* <TabsContent value="rapportG">
          <RG />
        </TabsContent> */}
        <TabsContent value="rapportH">
          <h1 className="text-xl font-semibold m-2">Rapport H</h1>
          <RHlist data={RHData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
