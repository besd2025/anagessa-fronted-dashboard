import React from "react";
import { Check, Eye, Home, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Protection() {
  return (
    <div className="flex w-full h-screen items-center justify-center px-6 ">
      <div className="flex h-[80vh] w-[80vh]  flex-col items-center justify-center rounded-xl  bg-card px-6 pt-8 pb-10 text-center">
        <div className="flex size-24 items-center justify-center rounded-full border border-destructive/12 bg-destructive/10">
          <ShieldX className="size-16 text-destructive" />
        </div>
        <p className="mt-5 font-semibold text-2xl">Accès non autorisé</p>
        <p className="mt-2 text-muted-foreground text-sm ">
          Vous n'avez pas accès à cette page. Veuillez contacter
          l'administrateur pour obtenir les autorisations nécessaires.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-2">
          <Link href="/anagessa-dashboard/home">
            <Button className="grow cursor-pointer" variant="outline">
              <Home /> Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
