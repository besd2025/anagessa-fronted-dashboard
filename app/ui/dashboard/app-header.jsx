"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
// import { Logo } from "@/components/logo";
import { Grape, Search } from "lucide-react";
import { ModeToggle } from "../toggle-theme-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserContext } from "@/app/context/User_Context";

import {
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconSettings,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import CampaigneAnnee from "./home/campaigne-annee";
import Image from "next/image";
import Link from "next/link";
const menuItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
      keyword: "dashboard",
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
      keyword: "analytics",
    },
  ],
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
};
const deconnecter = () => {
  localStorage.removeItem("Access_Token");
  window.location.href = "/";
};

export function AppHeader() {
  const user = React.useContext(UserContext);
  console.log(user);
  const initials = `${user?.session?.first_name?.[0] || ""}${
    user?.session?.last_name?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="">
      <nav className=" inset-x-4 h-16  border-b  dark:border-slate-700/70   bg-linear-to-r from-white dark:from-black  via-white dark:via-gray-900 to-primary dark:to-primary border-gray-200 dark:bg-gray-900">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2 md:gap-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-xl font-bold flex gap-x-1 items-center">
              {/* <Image
                src="/images/ANAGESSA LOGO.jpg"
                alt="Logo"
                width={30}
                height={30}
              /> */}
              ANAGESSA
            </h1>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            {/* <Logo className="shrink-0" /> */}
            {user?.session?.category === "Anagessa_Chef_societe" && (
              <span className="text-sm font-medium flex gap-x-1 items-center">
                {" "}
                Société:{" "}
                <span className="text-secondary text-lg font-bold">
                  {user?.session?.societe}
                </span>
              </span>
            )}
            <div className="relative hidden md:blo/ck">
              <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
              <Input
                className="pl-10 flex-1  border-none shadow-none w-[380px] rounded-lg bg-background"
                placeholder="Rechercher"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block">
              <CampaigneAnnee />
            </div>
            <Button
              size="icon"
              className="bg-muted text-foreground hover:bg-accent shadow-none rounded-full hidden md:hidden"
            >
              <Search className="h-5! w-5!" />
            </Button>
            <ModeToggle className="bg-transparent text-white border-none shadow-none" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 border-2 border-white rounded-full grayscale">
                    <AvatarFallback className="rounded-lg text-primary dark:text-foreground">
                      {user?.session?.first_name?.charAt(0).toUpperCase()}
                      {user?.session?.last_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={menuItems.user.avatar}
                        alt={menuItems.user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {" "}
                        {user?.session?.first_name?.charAt(0).toUpperCase()}
                        {user?.session?.last_name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user?.session?.first_name} {user?.session?.last_name}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.session?.identifiant}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/anagessa-dashboard/settings">
                    <DropdownMenuItem>
                      <IconUserCircle />
                      Account
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuItem>
                    <IconNotification />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={deconnecter}>
                  <IconLogout />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </div>
  );
}
