"use client";

import React, { useContext } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserContext } from '@/app/context/User_Context';

export default function Profile() {
    const { session } = useContext(UserContext);

    // Helper to get initials
    const initials = `${session?.first_name?.[0] || ""}${session?.last_name?.[0] || ""}`.toUpperCase();

    return (
        <div>
            <Card className="w-full max-w-xl shadow-none border-none">
                <CardContent className="flex flex-col md:flex-row gap-4 items-center text-center">
                    {/* Avatar */}
                    <div className='flex flex-col items-center text-center w-max'>
                        <Avatar className="w-24 h-24 mb-4 border-2 border-secondary p-0.5">
                            <AvatarImage src="/avatar.png" alt="User" />
                            <AvatarFallback className="bg-secondary/20 font-bold text-xl text-primary">
                                {initials || "JD"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name */}
                        <h2 className="text-xl font-semibold w-max">
                            {session?.first_name} {session?.last_name}
                        </h2>
                        <p className="text-sm text-primary w-max font-medium">
                            {session?.category || "Utilisateur"}
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="w-full border-t md:border-r md:h-[200px] md:w-0 my-4" />

                    {/* Personal Info */}
                    <div className="w-full text-left space-y-2 text-sm">
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-muted-foreground">Email / ID</span>
                            <span className="font-medium">{session?.identifiant || "Non défini"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-muted-foreground">Téléphone</span>
                            <span className="font-medium">{session?.telephone || session?.phone || "Non défini"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-muted-foreground">Rôle</span>
                            <span className="font-medium italic">{session?.category || "Non défini"}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <span className="text-muted-foreground">Statut</span>
                            <span className="text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-[10px] uppercase">Actif</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
