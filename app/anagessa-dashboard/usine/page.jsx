"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import UsineListTable from "@/app/ui/dashboard/usine/list";
import UsineAnalytics from "@/app/ui/dashboard/usine/analytics";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SUPERVISEUR]}>
      <div className="p-4">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full h-10 lg:w-[50%]">
            <TabsTrigger value="list">
              <List />
              <span>Liste</span>
            </TabsTrigger>
            <TabsTrigger value="details">
              <ChartColumn />
              <span>Details</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <h1 className="text-2xl font-semibold m-2">Liste des Usines</h1>
            <UsineListTable />
          </TabsContent>
          <TabsContent value="details">
            <UsineAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

export default page;
