"use client";

import React from "react";
import { HangarSummaryCards } from "./components/HangarSummaryCards";
import { HangarActiveChart } from "./components/HangarActiveChart";
import { HangarLocationChart } from "./components/HangarLocationChart";
import { HangarTypeChart } from "./components/HangarTypeChart";
import { HangarTopFiveCards } from "./components/HangarTopFiveCards";

export default function HangarAnalytics() {
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards */}
      <HangarSummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-6">
          <HangarLocationChart />
        </div>
      </div>

      {/* Top 5 Cards */}
      <HangarTopFiveCards />
    </div>
  );
}
