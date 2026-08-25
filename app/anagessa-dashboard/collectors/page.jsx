import CollectorsList from "@/app/ui/dashboard/collectors";
import { Edit } from "@/app/ui/dashboard/collectors/edit";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartColumn, List, Workflow } from "lucide-react";
import NoAffectedEntity from "@/app/ui/dashboard/collectors/no-affected";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="p-4">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full h-10 lg:w-[50%]">
            <TabsTrigger value="list">
              <List />
              <span>Liste</span>
            </TabsTrigger>
            <TabsTrigger value="details">
              <Workflow />
              <span>Non Affectés</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list">
            <h1 className="text-2xl font-semibold m-2">Liste des collecteurs</h1>
            <CollectorsList />
          </TabsContent>
          <TabsContent value="details">
            <h1 className="text-2xl font-semibold m-2 mb-2.5">Hangars non affectés</h1>
            <NoAffectedEntity />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
