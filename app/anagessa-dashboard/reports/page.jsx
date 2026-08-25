import React from 'react'
import Reports from '@/app/ui/dashboard/reports'
import ProtectedRoute from '@/app/ui/protection/ProtectedRoute'
import { ROLES } from '@/lib/permissions'
export default function page() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA]}>
            <Reports />
        </ProtectedRoute>
    )
}
