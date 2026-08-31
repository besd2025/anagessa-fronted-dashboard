"use client";
import { useState } from "react";
import { User, Users } from "lucide-react";
import * as React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IndividualCultivatorsTable from "./IndividualCultivatorsTable";
import AssociationCultivatorsTable from "./AssociationCultivatorsTable";

export default function CultivatorsListTable({
  isCultivatorsPage,
  individualData,
  associationData,
  datapagination,
  fetchCultivatorsByType,
  limit,
  totalCount,
  onExportIndividualToExcel,
  onExportAssociationToExcel,
}) {
  const [tabValue, setTabValue] = useState("individual");

  const handleChange = (value) => {
    setTabValue(value);
    // Si on est dans la page hangar (mode contrôlé), on notifie le parent pour fetcher le bon type
    if (!isCultivatorsPage && fetchCultivatorsByType) {
      fetchCultivatorsByType(
        value === "individual"
          ? "cultivator_individual"
          : "cultivator_association",
      );
    }
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={handleChange}
      defaultValue="individual"
      className="w-full mt-4"
    >
      <TabsList className="p-0 h-auto bg-background gap-1">
        <TabsTrigger
          value="individual"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <User />
          Physiques
        </TabsTrigger>
        <TabsTrigger
          value="association"
          className="data-[state=active]:shadow-[0_0_8px_1px_rgba(0,0,0,0.1)] dark:data-[state=active]:shadow-[0_0_8px_1px_rgba(255,255,255,0.2)]"
        >
          <Users />
          Associations / Coopératives
        </TabsTrigger>
      </TabsList>

      <TabsContent value="individual" className="mt-4">
        <IndividualCultivatorsTable
          isCultivatorsPage={isCultivatorsPage}
          externalData={individualData}
          datapagination={datapagination}
          externalTotalCount={totalCount}
          externalLimit={limit}
          externalExportFn={onExportIndividualToExcel}
        />
      </TabsContent>
      <TabsContent value="association" className="mt-4">
        <AssociationCultivatorsTable
          isCultivatorsPage={isCultivatorsPage}
          externalData={associationData}
          datapagination={datapagination}
          externalTotalCount={totalCount}
          externalLimit={limit}
          externalExportFn={onExportAssociationToExcel}
        />
      </TabsContent>
    </Tabs>
  );
}
