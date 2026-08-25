"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List } from "lucide-react";
import HangarsListTable from "@/app/ui/dashboard/hangars/list";
import HangarAnalytics from "@/app/ui/dashboard/hangars/analytics";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { UserContext } from "@/app/context/User_Context";
function page() {
  const user = React.useContext(UserContext);
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
      <div className="p-4">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full h-10 lg:w-[50%]">
            <TabsTrigger value="list">
              <List />
              <span>Liste</span>
            </TabsTrigger>
            {user?.session?.category !== "Superviseur_Regional" && user?.session?.category !== "Cafe_Chef_societe" && (
              <TabsTrigger value="details">
                <ChartColumn />
                <span>Details</span>
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="list">
            <h1 className="text-2xl font-semibold m-2">
              Liste des Hangar
            </h1>
            <HangarsListTable />
          </TabsContent>
          <TabsContent value="details">
            <HangarAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

export default page;
