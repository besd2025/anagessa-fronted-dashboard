"use client";

import React from "react";
import { SummaryCards } from "./components/SummaryCards";
import { GenreChart } from "./components/GenreChart";
import { RegistrationChart } from "./components/RegistrationChart";
import { LocationChart } from "./components/LocationChart";
import { AgeChart } from "./components/AgeChart";
import { TopFiveCards } from "./components/TopFiveCards";
import { PaymentChart } from "./components/PaymentChart";
import { UserContext } from "@/app/context/User_Context";
export default function CultivatorAnalytics() {
  const user = React.useContext(UserContext);
  return (
    <div className="lg:p-4 space-y-6 bg-muted/10 min-h-screen">
      {/* Top Cards */}
      <SummaryCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        {/* Radial Chart: Genre */}
        <GenreChart />

        {/* Line Chart: Enregistrements */}
        <RegistrationChart />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {user?.session?.category !== "Superviseur_Regional" && (
          <>
            {/* Bar Chart: Location */}
            <LocationChart />
          </>
        )}
        {/* Bar Chart: Age Pyramid */}
        <AgeChart />
      </div>

      {/* Top 5 Cards */}
      <TopFiveCards />

      {/* Radial Chart: Payment Mode */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PaymentChart />
      </div>
    </div>
  );
}
