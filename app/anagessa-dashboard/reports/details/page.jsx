import React from 'react'
import DetailsReports from '@/app/ui/dashboard/reports/history/details'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export const dynamic = "force-dynamic";
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL]}>
            <DetailsReports />
        </ProtectedRoute>
    )
}
