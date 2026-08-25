"use client";
import React, { useContext } from "react";
import StatsCard from "./StatsCard";
import Edit from "../edit";
import DetailsCard from "./detailsCard";
import DetailsContent from "./details-content";
import { useSearchParams } from "next/navigation";
import { UserContext } from "@/app/context/User_Context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, LayoutGrid, Server } from "lucide-react";
function DetailsPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const user = useContext(UserContext)
  return (
    <div className=" space-y-6">
      {user?.session?.category === "Admin" ? (
        <div className="flex justify-end gap-2">
          <Edit id={id} />
        </div>) : ""}
      <div className="flex flex-col lg:flex-row gap-4">
        <DetailsCard id={id} />

        <div className="flex-1 space-y-6">
          <Tabs className="w-full" defaultValue="general">
            <TabsList className="gap-1 bg-background p-0 group-data-horizontal/tabs:h-7 gap-x-4">
              <TabsTrigger value="general"><LayoutGrid />Generale</TabsTrigger>
              <TabsTrigger value="operations"><Server />Enregisterments</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <section className="space-y-4">
                <StatsCard id={id} />
              </section>
            </TabsContent>
            <TabsContent value="operations"><DetailsContent id={id} /></TabsContent>
          </Tabs>



        </div>
      </div>
    </div>
  );
}

export default DetailsPage;