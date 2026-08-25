"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

// Externalized to avoid redefining on every render
function DecodeToJwt(token) {
    try {
        if (!token) return null;
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Échec du décodage du token", error);
        return null;
    }
}

export default function ProtectedRoute({ children, allowedRoles }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Mémoriser la chaîne des rôles pour le tableau de dépendances
    // Cela évite les boucles de rendu si le tableau parent change de référence.
    const allowedRolesStr = Array.isArray(allowedRoles) ? allowedRoles.join(",") : "";

    useEffect(() => {
        const verifyAuth = () => {
            // Lecture du localStorage uniquement côté client (dans le useEffect)
            const accessToken = localStorage.getItem("Access_Token");

            if (!accessToken) {
                setIsAuthorized(false);
                // Éviter la boucle infinie si on est déjà sur la page /
                if (pathname !== "/") {
                    router.push("/");
                }
                return;
            }

            const user = DecodeToJwt(accessToken);
            
            // Reconstruire les rôles à partir de la chaîne
            const roles = allowedRolesStr ? allowedRolesStr.split(",") : [];

            if (!user || (roles.length > 0 && !roles.includes(String(user?.category)))) {
                setIsAuthorized(false);
                // Éviter la boucle infinie si on est déjà sur /unauthorized ou /
                if (pathname !== "/unauthorized" && pathname !== "/") {
                    router.push("/unauthorized");
                }
                return;
            }

            setIsAuthorized(true);
        };

        verifyAuth();
    }, [pathname, router, allowedRolesStr]);

    // ⏳ Pendant vérification
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // 🚫 Non autorisé
    if (!isAuthorized) {
        return null;
    }

    // ✅ Autorisé
    return children;
}