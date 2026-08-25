import Settings from "@/app/ui/dashboard/settings";
import React from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <div className="p-4"> <Settings /></div>
    </ProtectedRoute>
  )
}
