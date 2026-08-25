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
import { Plus } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
export default function AddSociety() {
    const [open, setOpen] = React.useState(false);
    const [nomSociete, setNomSociete] = React.useState("");
    const [codeSociete, setCodeSociete] = React.useState("");
    const [photoLicence, setPhotoLicence] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nomSociete || !codeSociete) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("nom_societe", nomSociete);
            formData.append("code_societe", codeSociete);
            formData.append("niveau_licence", "-");

            if (photoLicence) {
                formData.append("photo_licence", photoLicence);
            } else {
                // Image par défaut si aucune n'est sélectionnée
                try {
                    const response = await fetch("/images/logo.png");
                    const blob = await response.blob();
                    const file = new File([blob], "logo.png", { type: blob.type });
                    formData.append("photo_licence", file);
                } catch (err) {
                    console.error("Erreur lors de la récupération de l'image par défaut:", err);
                }
            }

            const promise = new Promise(async (resolve, reject) => {
                try {
                    // fetchData gère automatiquement le FormData
                    const results = await fetchData("post", `/mais/societes/`, {
                        body: formData,
                    });

                    if (results.status === 200 || results.status === 201) {
                        resolve(results);
                    } else {
                        reject(new Error("Erreur de l'ajout"));
                    }
                } catch (err) {
                    reject(err);
                }
            });

            toast.promise(promise, {
                loading: "Ajout de la société...",
                success: () => {
                    setTimeout(() => {
                        setOpen(false);

                    }, 1000);
                    return `${nomSociete} a été ajouté avec succès`;
                },
                error: "Donnée non ajoutée",
            });

            await promise;
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="font-normal text-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une société
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-sidebar">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ajouter une société</DialogTitle>
                        <DialogDescription>
                            Entrez les détails de la nouvelle société
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom de la société</Label>
                            <Input
                                id="nom"
                                type="text"
                                value={nomSociete}
                                onChange={(e) => setNomSociete(e.target.value)}
                                placeholder="Entrer le nom de la société"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Code de la société</Label>
                            <Input
                                id="code"
                                type="text"
                                value={codeSociete}
                                onChange={(e) => setCodeSociete(e.target.value)}
                                placeholder="Entrer le code de la société"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="photo">Photo licence (optionnel)</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhotoLicence(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
