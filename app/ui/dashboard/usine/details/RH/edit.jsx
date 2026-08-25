"use client";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen } from "lucide-react";
import { toast } from "sonner";

export default function Edit({
  cultivator = {},
  sdl_ct = "",
  society = "",
  localite = {},
  champs = 0,
}) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(cultivator.cultivator_code || "");
  const [firstName, setFirstName] = React.useState(cultivator.first_name || "");
  const [lastName, setLastName] = React.useState(cultivator.last_name || "");
  const [imageUrl, setImageUrl] = React.useState(cultivator.image_url || "");
  const [hangar, setSdl] = React.useState(sdl_ct || "");
  const [soc, setSoc] = React.useState(society || "");
  const [province, setProvince] = React.useState(localite?.province || "");
  const [commune, setCommune] = React.useState(localite?.commune || "");
  const [nbChamps, setNbChamps] = React.useState(champs || 0);

  React.useEffect(() => {
    // keep local state in sync if props change
    setCode(cultivator.cultivator_code || "");
    setFirstName(cultivator.first_name || "");
    setLastName(cultivator.last_name || "");
    setImageUrl(cultivator.image_url || "");
    setSdl(sdl_ct || "");
    setSoc(society || "");
    setProvince(localite?.province || "");
    setCommune(localite?.commune || "");
    setNbChamps(champs || 0);
  }, [cultivator, sdl_ct, society, localite, champs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      cultivator_code: code,
      first_name: firstName,
      last_name: lastName,
      image_url: imageUrl,
      sdl_ct: hangar,
      society: soc,
      localite: { province, commune },
      champs: nbChamps,
    };

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        // Mock API call
        console.log("Submitting cultivator update", payload);
        resolve({ code });
      }, 1000);
    });

    toast.promise(promise, {
      loading: "Modification...",
      success: (data) => {
        setTimeout(() => setOpen(false), 500);
        return `${data.code} a été modifié avec succès `;
      },
      error: "Donnée non modifiée",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full justify-start font-normal text-sm"
          >
            <SquarePen />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] bg-sidebar">
          <DialogHeader>
            <DialogTitle>Modification</DialogTitle>
            <DialogDescription>Modifier les informations</DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code cultivateur
              </h5>

              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled
              />
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations personnelles
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>CNI</Label>
                  <Input
                    type="text"
                    value={7865}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Date de naissance</Label>
                  <Input
                    type="text"
                    value={4612}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    value={45123}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Hangar</Label>
                  <Input
                    type="text"
                    value={hangar}
                    onChange={(e) => setSdl(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Société</Label>
                  <Input
                    type="text"
                    value={soc}
                    onChange={(e) => setSoc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localite
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Province</Label>
                  <Input
                    type="text"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Commune</Label>
                  <Input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations du champs
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nombre de champs</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nombre de pieds</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Superficie</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Information de paiement
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Mode de paiement</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom de Banque</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>No compte bancaire</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>No de Tel de paiement</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Proprietaire</Label>
                  <Input
                    type="number"
                    value={nbChamps}
                    onChange={(e) => setNbChamps(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
