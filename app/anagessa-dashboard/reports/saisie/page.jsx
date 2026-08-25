import React from 'react'
import Saisie from '@/app/ui/dashboard/reports/saisie'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export default function page() {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL]}>
      <Saisie />
    </ProtectedRoute>
  )
}
