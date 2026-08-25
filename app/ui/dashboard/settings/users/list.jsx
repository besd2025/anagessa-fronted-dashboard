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
                const response = await fetchData("get", `mais/mais_registration/`, {
                    params: { limit: 40 },
                    additionalHeaders: {},
                    body: {},
                });
                console.log("response: ",response)
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
    return (
        <div className="rounded-md border bg-card/30 backdrop-blur-sm">
            <Table>
                <TableCaption>Liste des utilisateurs de la plateforme.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Téléphone</TableHead>
                        {/* <TableHead>Statut</TableHead> */}

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="font-bold text-gray-800 dark:text-white/90">{user.first_name} {user.last_name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{user.identifiant}</TableCell>
                            <TableCell>{user.category}</TableCell>
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
        </div>
    )
}
