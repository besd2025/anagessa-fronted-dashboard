import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grape, Calendar, Loader2 } from "lucide-react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchData } from '@/app/_utils/api';

export default function EditRendement({ data }) {
    const [open, setOpen] = React.useState(false);
    const [gradeOptions, setGradeOptions] = React.useState([]);
    const [idGrade, setIdGrade] = React.useState("");
    const [qteParche, setQteParche] = React.useState(data?.QteParche);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [dateSortie, setDateSortie] = React.useState(data?.date_production || new Date().toISOString().split("T")[0]);

    // Fetch grades options only when dialog is opened
    React.useEffect(() => {
        if (!open) return;
        const fetchGrades = async () => {
            try {
                const fetchedGrades = await fetchData("get", `cafe/grades/get_all_grades/`);
                const seen = new Set();
                const options = fetchedGrades
                    ?.map((item) => ({
                        value: item.grade_code,
                        label: item.grade_name,
                    }))
                    .filter((item) => {
                        if (!item.value) return false;
                        if (seen.has(item.value)) return false;
                        seen.add(item.value);
                        return true;
                    }) || [];
                setGradeOptions(options);
            } catch (err) {
                console.error("Error fetching grades:", err);
            }
        };
        fetchGrades();
    }, [open]);

    // Sync state with data prop when dialog opens
    React.useEffect(() => {
        if (open) {
            setIdGrade(data?.grade_code);
            setQteParche(data?.QteParche);
            setDateSortie(data?.date_production || new Date().toISOString().split("T")[0]);
            setError(null);
        }
    }, [open, data]);

    const handleModifier = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);

        const dataToSend = {
            grade_code: idGrade,
            quantite_cafe_parche: qteParche ? Number(qteParche) : 0,
            enregistrement_date: dateSortie,
            rendement_cerise_detail_code: data?.rendement_detail_code,
            rendement_code: data?.rendement_code
        };
        console.log("dataToSend", dataToSend)

        const promise = new Promise(async (resolve, reject) => {
            try {
                if (!data?.id) {
                    reject(new Error("ID du rendement manquant."));
                    return;
                }
                if (!idGrade || !qteParche || !dateSortie) {
                    reject(new Error("Veuillez remplir tous les champs obligatoires."));
                    return;
                }

                const result = await fetchData(
                    "patch",
                    `/cafe/detail_rendements/${data.id}/`,
                    { body: dataToSend }
                );

                if (result.status === 200 || result.status === 201) {
                    resolve(result.data);
                } else {
                    reject(new Error("Erreur lors de la modification."));
                }
            } catch (err) {
                reject(err);
            }
        });

        toast.promise(promise, {
            loading: "Modification en cours...",
            success: () => {
                setTimeout(() => setOpen(false), 1000);
                return "Le rendement a été modifié avec succès !";
            },
            error: (err) => err?.message || "Erreur lors de la modification !",
        });

        try {
            await promise;
        } catch (err) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="px-2 py-1.5 w-full flex justify-start">
                    Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[70%] max-h-[95vh] overflow-y-auto">
                <form onSubmit={handleModifier} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>Modifier le rendement</DialogTitle>
                    </DialogHeader>

                    {/* Quantité de parche */}


                    <div className=" flex flex-col   gap-3 text-sm">
                        <div className="flex flex-col gap-3 text-sm">
                            <Label className="text-muted-foreground">Lot</Label>
                            <Input
                                type="number"
                                value={qteParche || ""}
                                onChange={(e) => setQteParche(e.target.value)}
                                // className="w-[150px]"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-3 text-sm">
                            <Label className="text-muted-foreground">Quantité CA</Label>
                            <Input
                                type="number"
                                value={qteParche || ""}
                                onChange={(e) => setQteParche(e.target.value)}
                                // className="w-[150px]"
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-3 text-sm">
                            <Label className="text-muted-foreground">Quantité CB</Label>
                            <Input
                                type="number"
                                value={qteParche || ""}
                                onChange={(e) => setQteParche(e.target.value)}
                                // className="w-[150px]"
                                required
                            />
                        </div>

                    </div>


                    {error && (
                        <p className="text-sm text-destructive font-medium mt-2">
                            {error.message || "Une erreur est survenue."}
                        </p>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" variant="default" disabled={loading || !idGrade}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}