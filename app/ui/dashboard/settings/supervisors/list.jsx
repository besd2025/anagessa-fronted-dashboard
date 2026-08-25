import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { fetchData } from "@/app/_utils/api";

import React from "react";
export function UserList() {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const getUsers = async () => {
            setLoading(true);
            try {
                const response = await fetchData("get", `mais/superviseur_regional_registration/`, {
                    params: { limit: 40 },
                    additionalHeaders: {},
                    body: {},
                });
                const users = response.results.map((user) => {
                    return {
                        id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        identifiant: user.identifiant,
                        email: user.email,
                        category: user.category,
                        phone: user.phone,
                        status: user.status,
                        cni: user.cni,
                        province_name: user.province_name,
                    };
                });
                setUsers(users);

            } catch (error) {
                console.error("Error fetching users data:", error);
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, []);

    // --- Pagination côté client ---
    const pageSize = 10;
    const totalPages = Math.max(Math.ceil(users.length / pageSize), 1);
    const [currentPage, setCurrentPage] = React.useState(1);
    const startIndex = (currentPage - 1) * pageSize;
    const visibleUsers = users.slice(startIndex, startIndex + pageSize);

    return (
        <div className="rounded-md border bg-card/30 backdrop-blur-sm">
            <Table>
                <TableCaption>Liste des superviseurs provinciaux.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>CNI</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Téléphone</TableHead>
                        {/* <TableHead>Statut</TableHead> */}

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visibleUsers.map((user, i) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell>{startIndex + i + 1}</TableCell>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 dark:text-white/90">{user.first_name} {user.last_name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.identifiant}</TableCell>
                            <TableCell>{user.cni}</TableCell>
                            <TableCell>{user.province_name}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            {/* <TableCell>
                                <span className={`flex items-center gap-1.5 ${user.status === "Actif" ? "text-green-600" : "text-gray-400"}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Actif" ? "bg-green-600 animate-pulse" : "bg-gray-400"}`} />
                                    <span className="text-xs font-medium uppercase tracking-tight">{user.status}</span>
                                </span>
                            </TableCell> */}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* --- Contrôles de pagination --- */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
                    <span>
                        {users.length === 0
                            ? "Aucun élément"
                            : `Affichage ${startIndex + 1}–${Math.min(startIndex + pageSize, users.length)} sur ${users.length} superviseur(s)`}
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 rounded-md border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="Page précédente"
                        >‹</button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce((acc, p, idx, arr) => {
                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === "..." ? (
                                    <span key={`e-${idx}`} className="h-8 w-8 flex items-center justify-center text-gray-400">…</span>
                                ) : (
                                    <button
                                        key={item}
                                        onClick={() => setCurrentPage(item)}
                                        className={`h-8 w-8 rounded-md border text-sm flex items-center justify-center transition-colors ${item === currentPage
                                            ? "border-blue-500 bg-blue-500 text-white font-semibold"
                                            : "border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800"}`}
                                    >{item}</button>
                                )
                            )}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 rounded-md border border-gray-200 dark:border-zinc-700 flex items-center justify-center disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            aria-label="Page suivante"
                        >›</button>
                    </div>
                </div>
            )}
        </div>
    )
}
