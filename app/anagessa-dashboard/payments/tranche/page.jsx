import TrancheDetails from '@/app/ui/dashboard/payments/tranche'
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";
export default function TranchePage() {
    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR]}>
            <div className='p-4'>
                <TrancheDetails />
            </div>
        </ProtectedRoute>
    )
}
