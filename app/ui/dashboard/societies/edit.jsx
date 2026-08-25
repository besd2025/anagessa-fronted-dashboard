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

export default function EditSociety({ id }) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const getSociety = async () => {
      try {
        const response = await fetchData("get", `mais/societes/${id}/`, {});
        setCode(response?.code_societe || "");
        setName(response?.nom_societe || "");
        setFirstName(response?.responsable?.user?.first_name || "");
        setLastName(response?.responsable?.user?.last_name || "");
        setTelephone(response?.responsable?.user?.phone || "");
        setProvince(
          response?.adresse?.zone_code?.commune_code?.province_code
            ?.province_name || "",
        );
        setCommune(
          response?.adresse?.zone_code?.commune_code?.commune_name || "",
        );

        console.log("data: ", response)
      } catch (error) {
        console.error("Error fetching society data:", error);
      }
    };

    if (open) {
      getSociety();
    }
  }, [id, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      nom_societe: name,
      // Add other editable fields if API supports them
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("patch", `/mais/societes/${id}/`, {
          body: formData,
        });

        if (results.status === 200 || results.status == 201) {
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
        return `${name} a été modifié avec succès`;
      },
      error: "Donnée non modifiée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="w-full">
            <SquarePen className="h-4 w-4 mr-2" />
            Modifier
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-sidebar">
          <DialogHeader>
            <DialogTitle>Modification</DialogTitle>
            <DialogDescription>
              Modifier les informations de la société
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-max overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code Société
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
                Informations Société
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom Société</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
