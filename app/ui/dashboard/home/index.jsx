"use client"
import { SectionCards } from "./cards-sections";
import { ChartPieSdlCtActive } from "./charts/sdl-hangar-active";
import { ChartLineAchats } from "./charts/sdl-hangar-achats";
import { LossChart } from "./charts/loss-chart";
import { StockSummaryCard } from "./stock-card";
import { KPIGrid } from "./kpi-stats";
import { UserContext } from "@/app/context/User_Context";
import React, { useContext } from "react";

function DashboardContainer() {
  const user = useContext(UserContext);
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 ">
          <SectionCards />

          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* Stock Card + Hangar Activity */}
            <div className="col-span-5 lg:col-span-3 flex flex-col gap-4">
              <StockSummaryCard />
            </div>
            <div className="col-span-5 lg:col-span-2 flex flex-col gap-4">
              <ChartPieSdlCtActive />
            </div>
          </div>

          <div className="px-4 lg:px-6 grid grid-cols-5 gap-4">
            {/* KPI Grid + Achats/Ventes Chart */}
            <div className="col-span-5 lg:col-span-1">
              <KPIGrid />
            </div>
            <div className="col-span-5 lg:col-span-4">
              <ChartLineAchats />
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <LossChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardContainer;
