import SocietiesList from "@/app/ui/dashboard/societies";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SUPERVISEUR]}>
      <SocietiesList />
    </ProtectedRoute>

  )
}
