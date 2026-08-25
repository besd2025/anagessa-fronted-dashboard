import ListView from "@/app/ui/dashboard/payments/list-view";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
       <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL,ROLES.ANAGESSA,ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL]}>
      <div className="w-[95%] m-4 lg:m-0 relative">
        <ListView />
      </div>
    </ProtectedRoute>
  );
}
