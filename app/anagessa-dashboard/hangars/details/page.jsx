import DetailsPage from "@/app/ui/dashboard/hangars/details/detailsPage";
import React from "react";
export const dynamic = "force-dynamic";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
      <div className="p-4 relative">
        <h1 className="text-xl lg:text-2xl font-semibold mx-2 mb-4">
          Hangar(hangar)
        </h1>
        <DetailsPage />
      </div>
    </ProtectedRoute>
  );
}
