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
import { toast } from "sonner";
import { fetchData } from "@/app/_utils/api";

export default function EditAssociationAchats({
  id,
  cultivator = {},
  num_fiche = "",
  num_recu = "",
  ca = 0,
  cb = 0,
  date = "",
  photo_fiche = "",
}) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState(cultivator.cultivator_code || "");
  const [assocName, setAssocName] = React.useState(
    cultivator.cultivator_assoc_name || "",
  );
  const [repName, setRepName] = React.useState(
    cultivator.cultivator_assoc_rep_name || "",
  );
  const [ficheNumber, setFicheNumber] = React.useState(num_fiche || "");
  const [recuNumber, setRecuNumber] = React.useState(num_recu || "");
  const [caValue, setCaValue] = React.useState(ca || 0);
  const [cbValue, setCbValue] = React.useState(cb || 0);
  const [purchaseDate, setPurchaseDate] = React.useState(date || "");
  const [photoFicheUrl, setPhotoFicheUrl] = React.useState(photo_fiche || "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setCode(cultivator.cultivator_code || "");
    setAssocName(cultivator.cultivator_assoc_name || "");
    setRepName(cultivator.cultivator_assoc_rep_name || "");
    setFicheNumber(num_fiche || "");
    setRecuNumber(num_recu || "");
    setCaValue(ca || 0);
    setCbValue(cb || 0);
    setPurchaseDate(date || "");
    setPhotoFicheUrl(photo_fiche || "");
  }, [cultivator, num_fiche, num_recu, ca, cb, date, photo_fiche]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bodyToSend = new FormData();
    bodyToSend.append("num_fiche", ficheNumber);
    bodyToSend.append("num_recu", recuNumber);
    bodyToSend.append("quantite_grains_a", caValue);
    bodyToSend.append("quantite_grains_b", cbValue);
    bodyToSend.append("date_achat", purchaseDate);

    if (photoFicheUrl instanceof File) {
      bodyToSend.append("photo_fiche", photoFicheUrl);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("patch", `/mais/achat_mais/${id}/`, {
          body: bodyToSend,
        });

        if (results) {
          resolve({ code });
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Modification...",
      success: (data) => {
        setTimeout(() => setOpen(false), 500);
        return `L'achat de ${data.code} a été modifié avec succès`;
      },
      error: "Erreur lors de la modification",
    });

    try {
      await promise;
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
          <Button variant="secondary">
            <SquarePen className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[700px] bg-sidebar">
          <DialogHeader>
            <DialogTitle>Modification Achat Association</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'achat
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
            <div className="space-y-6">
              <div>
                <Label>Code cultivateur</Label>
                <Input type="text" value={code} disabled className="mt-1" />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom de l'association</Label>
                  <Input type="text" value={assocName} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Nom du représentant</Label>
                  <Input type="text" value={repName} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>CA (kg)</Label>
                  <Input
                    type="number"
                    value={caValue}
                    onChange={(e) => setCaValue(Number(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CB (kg)</Label>
                  <Input
                    type="number"
                    value={cbValue}
                    onChange={(e) => setCbValue(Number(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Numéro de fiche</Label>
                  <Input
                    type="text"
                    value={ficheNumber}
                    onChange={(e) => setFicheNumber(e.target.value)}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label>Numéro de reçu</Label>
                  <Input
                    type="text"
                    value={recuNumber}
                    onChange={(e) => setRecuNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date d'achat</Label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photo fiche</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setPhotoFicheUrl(file);
                  }}
                />
                {photoFicheUrl && (
                  <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                    <img
                      src={
                        photoFicheUrl instanceof File
                          ? URL.createObjectURL(photoFicheUrl)
                          : photoFicheUrl
                      }
                      alt="Aperçu fiche"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={loading} onClick={handleSubmit}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
