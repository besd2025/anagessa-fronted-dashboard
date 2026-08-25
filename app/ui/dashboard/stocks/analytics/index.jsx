"use client";

import React from "react";
import { StockSummaryCards } from "./components/StockSummaryCards";
import { GradeDistributionChart } from "./components/GradeDistributionChart";
import { StockTypeChart } from "./components/StockTypeChart";
import { StockEvolutionChart } from "./components/StockEvolutionChart";
import { RecentMovementsTable } from "./components/RecentMovementsTable";
import { StockListTable } from "./components/StockListTable";

export default function StockAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards: KPIs */}
      <StockSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Grade Distribution */}
        <GradeDistributionChart />

        {/* Area Chart: Stock Evolution */}
        <StockEvolutionChart />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Bar Chart: Stock Type Distribution */}
        <StockTypeChart />
        
        {/* Table: Stock List */}
        <StockListTable />
      </div>

      {/* Table: Recent Movements */}
      <RecentMovementsTable />
    </div>
  );
}
