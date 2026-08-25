import React from "react";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Ventes from "./ventes";
import EditHistory from "./edit-history";
import CultivatorMap from "./cultivator-map";
import { History, MapPinHouse, ShoppingCart } from "lucide-react";

function ActivityList({ cult_id }) {
  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs defaultValue="ventes" className="space-y-6 w-full">
        <TabsList className="overflow-x-auto w-full ">
          <TabsTrigger value="ventes">
            <ShoppingCart /> Ventes effectues
          </TabsTrigger>
          <TabsTrigger value="maps">
            <MapPinHouse /> Map
          </TabsTrigger>
          <TabsTrigger value="edits">
            <History /> Historique des modifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ventes">
          <Ventes cult_id={cult_id} />
        </TabsContent>
        <TabsContent value="edits">
          <EditHistory cult_id={cult_id} />
        </TabsContent>
        <TabsContent value="maps">
          <CultivatorMap cult_id={cult_id} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default ActivityList;
