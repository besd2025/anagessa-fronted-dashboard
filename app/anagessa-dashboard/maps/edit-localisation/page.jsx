"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";

import DecoupageEditionPage from "@/app/ui/dashboard/maps/decoupage/edit-decoupage";

export default function LocalityEditionPage() {


    return (
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
            <DecoupageEditionPage />
        </ProtectedRoute>
    );
}
