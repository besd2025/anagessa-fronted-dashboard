"use client";

import React from "react";
import { UsineSummaryCards } from "./components/UsineSummaryCards";
import { UsineActiveChart } from "./components/UsineActiveChart";
import { UsineLocationChart } from "./components/UsineLocationChart";
import { UsineTypeChart } from "./components/UsineTypeChart";
import { TopFiveCards } from "./components/UsineTopFiveCards";
import ComingSoonOverlay from "@/app/ui/components/coming-soon-overlay";

export default function HangarAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen relative">
      {/* Top Cards */}
      <UsineSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Pie Chart: Active vs Non-Active */}
        <UsineActiveChart />

        {/* Pie Chart: Private vs Public */}
        <UsineTypeChart />

        <div className="col-span-1 lg:col-span-3">
          <UsineLocationChart />
        </div>
      </div>

      {/* Top 5 Cards */}
      <TopFiveCards />
      <ComingSoonOverlay
        title="Pas de données disponibles"
        message="Les données seront disponibles prochainement"
        transparent={true}
      />
    </div>
  );
}
