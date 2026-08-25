"use client";

import { useState } from "react";
import { FileText, BarChart3, ClipboardPlus, Eye, HandCoins } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import PaymentStats from "./payment-stats";
import Link from "next/link";
import ComingSoonOverlay from "../../components/coming-soon-overlay";

const recentFiles = [
  {
    name: "1ere Tranche collecte 2026",
    date: "30/04/2026",
    intervalle: "01 Janvier - 30 Avril 2026",
    icon: FileText,
  },
  // {
  //   name: "2eme Tranche collecte 2026",
  //   date: "12/06/2026",
  //   intervalle: "01 Juil - 30 Aout 2026",
  //   icon: FileText,
  // },
];

const Listes = [
  {
    name: "1ere tranche collecte 2024",
    nbre_cultivateurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
  {
    name: "1ere tranche collecte 2024",
    nbre_cultivateurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
  {
    name: "1ere tranche collecte 2024",
    nbre_cultivateurs: "7844",
    intervalle: "01 Jan - 31 Mar 2024",
    date: "Apr 14, 2024",
  },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isStoragePanelOpen, setIsStoragePanelOpen] = useState(false);

  return (
    <div className="bg-sidebar flex rounded-lg relative">
      {/* <ComingSoonOverlay transparent={true} /> */}
      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="border-border flex h-16 items-center justify-between border-b px-4 lg:px-6">
          <div className="flex items-center gap-2 lg:gap-4">
            <Sheet
              open={isStoragePanelOpen}
              onOpenChange={setIsStoragePanelOpen}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <SheetHeader className="sr-only">
                  <SheetTitle>Statut des paiements</SheetTitle>
                  <SheetDescription>
                    Statistiques et répartition des paiements des cultivateurs.
                  </SheetDescription>
                </SheetHeader>
                <PaymentStats />
              </SheetContent>
            </Sheet>
            <Link href="/anagessa-dashboard/payments/export-payment">
              <Button className="bg-primary " size="sm">
                <ClipboardPlus className="h-4 w-4 lg:mr-2" />
                <span className="hidden sm:inline">Exporter une liste</span>
              </Button>
            </Link>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 overflow-auto p-4 lg:p-6">
            {/* All files header */}
            <div className="mb-6">
              <h1 className="mb-1 text-xl font-semibold lg:text-2xl">
                Paiement des cultivateurs
              </h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Generation des listes de paiement des cultivateurs par periode
                de collecte.
              </p>
            </div>

            {/* Recently modified */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-medium lg:text-lg">
                  Liste des paiements recents
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-8">
                {recentFiles.map((file, index) => (
                  <Card key={index} className="p-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex p-2 items-center justify-center rounded-lg">
                        <HandCoins className="text-secondary/80 h-12 w-12" />
                      </div>
                      <div className="min-w-0 flex-1 ml-2">
                        <p className="truncate text-lg font-medium">
                          {file.name}
                        </p>
                        <div className="flex flex-row items-center text-sm text-accent-foreground">
                          <span className="block">du {file.intervalle}</span>
                        </div>
                        <div className="text-muted-foreground text-xs flex flex-row items-center justify-between">

                          <span className="block">Exportee le : {file.date}</span>
                          <Link href="/anagessa-dashboard/payments/tranche">
                            <Button variant="secondary" className=" p-0 m-0 mr-1 ">
                              <Eye />
                              Consulter
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="border-border bg-card hidden w-96 border-l p-6 xl:block">
            <PaymentStats />
          </div> */}
        </div>
      </div>
    </div>
  );
}
