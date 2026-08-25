"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconUsers } from "@tabler/icons-react";

import UsineList from "./UsineListe";
import AddUsersUsineDialog from "./AddUsineUsersDialog";
export default function UsinesContent() {
    return (
        <div className="space-y-6">
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <IconUsers className="h-5 w-5 text-primary" />
                                Gestion des Usines
                            </CardTitle>
                            <CardDescription>
                                Consultez et gérez les usines de la plateforme.
                            </CardDescription>
                        </div>
                        <AddUsersUsineDialog />
                    </div>
                </CardHeader>
                <CardContent className="px-0 pt-4">
                    <UsineList />
                </CardContent>
            </Card>
        </div>
    );
}
