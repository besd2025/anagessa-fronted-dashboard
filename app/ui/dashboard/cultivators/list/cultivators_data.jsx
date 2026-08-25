"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import CultivatorsListTable from "@/app/ui/dashboard/cultivators/list";
import CultivatorAnalytics from "../analytics";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { UserContext } from "@/app/context/User_Context";
function CultivatorData() {
  const user = React.useContext(UserContext);
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full h-10 lg:w-[50%]">
          <TabsTrigger value="list">
            <List />
            <span>Liste</span>
          </TabsTrigger>
          {user?.session?.category !== "Superviseur_Regional" && user?.session?.category !== "Anagessa_Chef_societe" && (
            <TabsTrigger value="details">
              <ChartColumn />
              <span>Details</span>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">Liste des cultivateurs</h1>
          <CultivatorsListTable isCultivatorsPage={true} />
        </TabsContent>
        <TabsContent value="details">
          <CultivatorAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CultivatorData;
