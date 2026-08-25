"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, CloudSunRain, Combine } from "lucide-react";
import { useState } from "react";

const workspaces = [
  {
    id: 1,
    name: "Campagne",
    interval: "2026",
  },
  // {
  //   id: 2,
  //   name: "Campagne recente",
  //   interval: "2024",
  // },
  // {
  //   id: 3,
  //   name: "Campagne ancienne",
  //   interval: "2023",
  // },
];

export default function CampaigneAnnee() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(workspaces[0]);

  return (
    <div className="px-4 lg:px-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 bg-accent py-2 px-2.5 rounded border border-primary/30">
          <Avatar className="rounded-lg h-8 w-8">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              <Combine />
            </AvatarFallback>
          </Avatar>
          <div className="text-start flex flex-col gap-1 leading-none">
            <span className="hidden lg:block text-sm leading-none font-medium truncate max-w-[17ch]">
              {selectedWorkspace.name}
            </span>
            <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
              {selectedWorkspace.interval}
            </span>
          </div>
          <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="start">
          <DropdownMenuLabel>Campagnes</DropdownMenuLabel>
          {workspaces.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => setSelectedWorkspace(workspace)}
            >
              <div className="flex items-center gap-2">
                {/* <Avatar className="rounded-md h-8 w-8">
                  <AvatarFallback className="rounded-md bg-primary/10 text-foreground">
                    {workspace.name[0]}
                  </AvatarFallback>
                </Avatar> */}
                <div className="flex flex-col">
                  {/* <span>{workspace.name}</span> */}
                  <span className="text-xs text-muted-foreground">
                    {workspace.interval}
                  </span>
                </div>
              </div>
              {selectedWorkspace.id === workspace.id && (
                <Check className="ml-auto" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
