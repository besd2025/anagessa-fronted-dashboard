"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchatsListTable from "./achats-list-table";
import { ChartColumn, Edit, List } from "lucide-react";
import AchatsListTableEdition from "./edition/achats-list-table";
import { Badge } from "@/components/ui/badge";
import { fetchData } from "@/app/_utils/api";
import { UserContext } from "@/app/context/User_Context";
function AchatsData() {
  const [totalCount, setTotalCount] = React.useState(0)
  React.useEffect(() => {
    const getAchats = async () => {
      try {
        const response = await fetchData("get", "mais/achat_modification/", {
          params: {},
          additionalHeaders: {}
        });
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error("Error fetching individual achats:", error);
      } finally {

      }
    };

    getAchats();
  }, []);
  const user = React.useContext(UserContext)
  return (
    <div className="p-4">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="w-full h-10 lg:w-[50%]">
          <TabsTrigger value="list">
            <List />
            <span>Liste</span>
          </TabsTrigger>
          {(user?.session?.category === "Admin" || user?.session?.category === "Superviseur") && (
            <TabsTrigger value="details">
              <Edit />
              <span>
                Edition <Badge className="min-w-5.5 px-1 ml-2">{totalCount || 0}</Badge>
              </span>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="list">
          <h1 className="text-2xl font-semibold m-2">Liste des achats</h1>
          <AchatsListTable isCultivatorsPage={true} />
        </TabsContent>
        <TabsContent value="details">
          <h1 className="text-2xl font-semibold m-2">Demandes de modification des achats</h1>
          <AchatsListTableEdition isCultivatorsPage={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AchatsData;