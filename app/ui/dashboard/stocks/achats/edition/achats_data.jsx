"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchatsListTable from "./achats-list-table";
import { ChartColumn, Edit, List } from "lucide-react";

function AchatsDataEdition() {
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full h-10 lg:w-[50%]">
          <TabsTrigger value="list">
            <List />
            <span>Liste</span>
          </TabsTrigger>
          <TabsTrigger value="details">
            <Edit />
            <span>Edition</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">Liste des achats</h1>

          <AchatsListTable isCultivatorsPage={true} />
        </TabsContent>
        <TabsContent value="details">
          <h1 className="text-2xl font-semibold m-2">Demandes de modification des achats</h1>
          <div className="p-4 border rounded-lg bg-background text-center">
            Demandes de modification des achats
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AchatsDataEdition;
