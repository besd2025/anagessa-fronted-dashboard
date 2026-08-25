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
import { SquarePen, Loader2 } from "lucide-react";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import { toast } from "sonner";

export default function EditTransfers({
  from_sdl = "",
  to_depulpeur_name = "",
  society = "",
  localite = {},
  qte_tranferer = {},
  photo_fiche = "",
}) {
  const [open, setOpen] = React.useState(false);
  const [fromSdl, setFromSdl] = React.useState(from_sdl || "");
  const [toDepulpeur, setToDepulpeur] = React.useState(to_depulpeur_name || "");
  const [soc, setSoc] = React.useState(society || "");
  const [province, setProvince] = React.useState(localite?.province || "");
  const [commune, setCommune] = React.useState(localite?.commune || "");
  const [caValue, setCaValue] = React.useState(qte_tranferer?.ca || 0);
  const [cbValue, setCbValue] = React.useState(qte_tranferer?.cb || 0);
  const [photoFicheUrl, setPhotoFicheUrl] = React.useState(photo_fiche || "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setFromSdl(from_sdl || "");
    setToDepulpeur(to_depulpeur_name || "");
    setSoc(society || "");
    setProvince(localite?.province || "");
    setCommune(localite?.commune || "");
    setCaValue(qte_tranferer?.ca || 0);
    setCbValue(qte_tranferer?.cb || 0);
    setPhotoFicheUrl(photo_fiche || "");
  }, [
    from_sdl,
    to_depulpeur_name,
    society,
    localite,
    qte_tranferer,
    photo_fiche,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      from_sdl: fromSdl,
      to_depulpeur_name: toDepulpeur,
      society: soc,
      localite: { province, commune },
      qte_tranferer: { ca: caValue, cb: cbValue },
      photo_fiche: photoFicheUrl,
    };

    const promise = new Promise((resolve) => {
      setTimeout(() => {
        console.log("Submitting cultivator update", payload);
        resolve({ code: "Transfert" });
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

    try {
      // await promise
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations de transfert
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>hangar d'origine</Label>
                  <Input
                    type="text"
                    value={fromSdl}
                    onChange={(e) => setFromSdl(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Dépulpeur</Label>
                  <Input
                    type="text"
                    value={toDepulpeur}
                    onChange={(e) => setToDepulpeur(e.target.value)}
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
                Localisation
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
                Quantités transférées
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

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
