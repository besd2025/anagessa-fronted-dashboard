import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grape, Layers2, MapPinHouse, ReceiptText, Spline } from "lucide-react";

export default function DetailsRendement() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0">
          <ReceiptText />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rendement journalier</DialogTitle>
          <div className="mt-2 flex flex-col gap-y-2">
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-primary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Grape size={20} /> Maïs blanc{" "}
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Maïs blanc</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Maïs blanc</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
              </div>
            </div>
            <div className="#CA border rounded p-2">
              <h1 className="flex gap-x-2 bg-secondary w-max items-center py-1 px-2 rounded-lg text-primary-foreground">
                <Grape size={20} /> Maïs jaune{" "}
              </h1>
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Maïs jaune</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
                <div className="flex items-center justify-between text-sm ">
                  <span className="text-muted-foreground">Maïs jaune</span>
                  <span className="font-medium">7.5 kg</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-lg ">
              <span className="text-muted-foreground">Qte total:</span>
              <span className="font-medium">7425.5 kg</span>
            </div>
            <div className="flex items-center justify-between text-sm ">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">7 jan 2025</span>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
