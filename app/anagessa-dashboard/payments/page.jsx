import PaymentsPage from "@/app/ui/dashboard/payments";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR]}>
      <div className="p-4">
        <PaymentsPage />
      </div>
    </ProtectedRoute>
  );
}
