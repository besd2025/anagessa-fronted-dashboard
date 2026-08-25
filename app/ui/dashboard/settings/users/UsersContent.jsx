"use client";

import React from "react";
import AddUserDialog from "./AddUserDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconUsers } from "@tabler/icons-react";

import { UserList } from "./list";

export default function UsersContent() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <IconUsers className="h-5 w-5 text-primary" />
                Gestion des Utilisateurs
              </CardTitle>
              <CardDescription>
                Consultez et gérez les comptes utilisateurs de la plateforme.
              </CardDescription>
            </div>
            <AddUserDialog />
          </div>
        </CardHeader>
        <CardContent className="px-0 pt-4">
          <UserList />
        </CardContent>
      </Card>
    </div>
  );
}
