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
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { toast } from "sonner";

export default function EditAchats({
  cultivator = {},
  sdl_ct = "",
  society = "",
  localite = {},
  num_fiche = "",
  num_recu = "",
  ca = 0,
  cb = 0,
  date = "",
  photo_fiche = "",
}) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(cultivator.cultivator_code || "");
  const [firstName, setFirstName] = React.useState(cultivator.first_name || "");
  const [lastName, setLastName] = React.useState(cultivator.last_name || "");
  const [hangar, setSdl] = React.useState(sdl_ct || "");
  const [soc, setSoc] = React.useState(society || "");
  const [province, setProvince] = React.useState(localite?.province || "");
  const [commune, setCommune] = React.useState(localite?.commune || "");
  const [ficheNumber, setFicheNumber] = React.useState(num_fiche || "");
  const [recuNumber, setRecuNumber] = React.useState(num_recu || "");
  const [caValue, setCaValue] = React.useState(ca || 0);
  const [cbValue, setCbValue] = React.useState(cb || 0);
  const [purchaseDate, setPurchaseDate] = React.useState(date || "");
  const [photoFicheUrl, setPhotoFicheUrl] = React.useState(photo_fiche || "");
  const [photoRecu, setPhotoRecu] = React.useState(null);
  React.useEffect(() => {
    // keep local state in sync if props change
    setCode(cultivator.cultivator_code || "");
    setFirstName(cultivator.first_name || "");
    setLastName(cultivator.last_name || "");
    setSdl(sdl_ct || "");
    setSoc(society || "");
    setProvince(localite?.province || "");
    setCommune(localite?.commune || "");
    setFicheNumber(num_fiche || "");
    setRecuNumber(num_recu || "");
    setCaValue(ca || 0);
    setCbValue(cb || 0);
    setPurchaseDate(date || "");
    setPhotoFicheUrl(photo_fiche || "");
    setPhotoRecu(null);
  }, [
    cultivator,
    sdl_ct,
    society,
    localite,
    num_fiche,
    num_recu,
    ca,
    cb,
    date,
    photo_fiche,
    photoRecu,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      cultivator_code: code,
      first_name: firstName,
      last_name: lastName,
      sdl_ct: hangar,
      society: soc,
      localite: { province, commune },
      num_fiche: ficheNumber,
      num_recu: recuNumber,
      ca: caValue,
      cb: cbValue,
      date: purchaseDate,
      photo_fiche: photoFicheUrl,
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
                Informations de l'achat
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
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Quantités collectées
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>CA (kg)</Label>
                  <Input
                    type="number"
                    value={caValue}
                    onChange={(e) => setCaValue(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>CB (kg)</Label>
                  <Input
                    type="number"
                    value={cbValue}
                    onChange={(e) => setCbValue(Number(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Références d'achat
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Numéro de fiche</Label>
                  <Input
                    type="text"
                    value={ficheNumber}
                    onChange={(e) => setFicheNumber(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Numéro de reçu</Label>
                  <Input
                    type="text"
                    value={recuNumber}
                    onChange={(e) => setRecuNumber(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="text"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <Label>Photo fiche</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPhotoFicheUrl(file); // Stocke le fichier pour l'aperçu et l'envoi
                      }
                    }}
                  />
                  <div className="col-span-2 lg:col-span-1">
                    {photoFicheUrl ? (
                      <div className="mt-2 w-32 h-32 border border-gray-300 rounded overflow-hidden">
                        <img
                          src={
                            photoFicheUrl instanceof File
                              ? URL.createObjectURL(photoFicheUrl)
                              : photoFicheUrl // URL venant du backend
                          }
                          alt="Aperçu du reçu"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        Aucune image disponible
                      </div>
                    )}
                  </div>
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
