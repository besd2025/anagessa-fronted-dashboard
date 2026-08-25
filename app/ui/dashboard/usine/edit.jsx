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
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function EditUsine({ id }) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [usineName, setUsineName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [soc, setSoc] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getUsine = async () => {
      try {
        // Fetching Usine data
        const response = await fetchData("get", `mais/usines/${id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        setCode(response?.usine_code || "");
        setUsineName(response?.usine_nom || "");
        // Keeping Societe if applicable, though typically for filtering/grouping
        setSoc(response?.societe?.nom_societe || "");

        setFirstName(response?.usine_responsable?.user?.first_name || "");
        setLastName(response?.usine_responsable?.user?.last_name || "");
        setTelephone(response?.usine_responsable?.user?.phone || "");

        setProvince(
          response?.usine_adress?.zone_code?.commune_code?.province_code
            ?.province_name || "",
        );
        setCommune(
          response?.usine_adress?.zone_code?.commune_code?.commune_name || "",
        );
      } catch (error) {
        console.error("Error fetching usine data:", error);
      }
    };

    if (open) {
      getUsine();
    }
  }, [id, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      usine_nom: usineName,
      // Add other fields here if the API supports patching them
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("patch", `/mais/usines/${id}/`, {
          params: {},
          additionalHeaders: {},
          body: formData,
        });

        if (results.status == 200 || results.id) {
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
        setTimeout(() => window.location.reload(), 1000);
        return `${data.code} a été modifié avec succès `;
      },
      error: "Donnée non modifiée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
      // setError(error); // Error already handled by toast
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
            <DialogTitle>Modification Usine</DialogTitle>
            <DialogDescription>
              Modifier les informations de l'usine
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code Usine
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
                Informations Usine
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom Usine</Label>
                  <Input
                    type="text"
                    value={usineName}
                    onChange={(e) => setUsineName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Société</Label>
                  <Input
                    type="text"
                    value={soc}
                    disabled // Typically Societe linkage is not changed here easily
                    onChange={(e) => setSoc(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations Responsable
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={lastName}
                    disabled
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    disabled
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="text"
                    value={telephone}
                    disabled
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localité
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Province</Label>
                  <Input
                    type="text"
                    value={province}
                    disabled
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Commune</Label>
                  <Input
                    type="text"
                    value={commune}
                    disabled
                    onChange={(e) => setCommune(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
