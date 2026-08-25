"use client";

import React, { useState, useEffect } from "react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function DecoupageEditionPage() {
    const [provinces, setProvinces] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [zones, setZones] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCommune, setSelectedCommune] = useState("");
    const [selectedZone, setSelectedZone] = useState("");

    // Collines are now objects with id (null for new ones), name, and code
    const [collines, setCollines] = useState([{ id: null, name: "", code: "" }]);

    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCommunes, setLoadingCommunes] = useState(false);
    const [loadingZones, setLoadingZones] = useState(false);
    const [loadingCollines, setLoadingCollines] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch provinces on mount
    useEffect(() => {
        const getProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const response = await fetchData("get", "adress/province/", {
                    params: { offset: 0, limit: 100 },
                });
                const options = response?.results?.map((item) => ({
                    value: item.province_name,
                    label: item.province_name,
                })) || [];
                setProvinces(options);
            } catch (error) {
                console.error("Error fetching provinces:", error);
                toast.error("Erreur lors de la récupération des provinces");
            } finally {
                setLoadingProvinces(false);
            }
        };
        getProvinces();
    }, []); const handleProvinceChange = async (value) => {
        setSelectedProvince(value);
        if (!value) {
            setCommunes([]);
            setSelectedCommune("");
            setZones([]);
            setSelectedZone("");
            setCollines([{ id: null, name: "", code: "" }]);
            return;
        }

        setLoadingCommunes(true);
        try {
            const response = await fetchData(
                "get",
                `adress/commune/get_communes_by_province`,
                { params: { province: value } }
            );
            const options = response?.map((item) => ({
                value: item.commune_name,
                label: item.commune_name,
            })) || [];
            setCommunes(options);
            setSelectedCommune("");
            setZones([]);
            setSelectedZone("");
            setCollines([{ id: null, name: "", code: "" }]);
        } catch (error) {
            console.error("Error fetching communes:", error);
            toast.error("Erreur lors de la récupération des communes");
        } finally {
            setLoadingCommunes(false);
        }
    };

    const handleCommuneChange = async (value) => {
        setSelectedCommune(value);
        if (!value) {
            setZones([]);
            setSelectedZone("");
            setCollines([{ id: null, name: "", code: "" }]);
            return;
        }

        setLoadingZones(true);
        try {
            const response = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
                params: { commune: value },
            });
            const options = response?.map((item) => ({
                value: item.zone_name,
                label: item.zone_name,
                code: item.zone_code,
                id: item?.id
            })) || [];
            setZones(options);
            setSelectedZone("");
            setCollines([{ id: null, name: "", code: "" }]);
        } catch (error) {
            console.error("Error fetching zones:", error);
            toast.error("Erreur lors de la récupération des zones");
        } finally {
            setLoadingZones(false);
        }
    };

    const handleZoneChange = async (value) => {
        const selected = zones.find((z) => z.value === value);
        if (!selected) {
            setSelectedZone("");
            setCollines([{ id: null, name: "", code: "" }]);
            return;
        }
        const newSelectedZone = {
            name: selected.value,
            code: selected.code,
            id: selected.id
        };
        setSelectedZone(newSelectedZone);

        setLoadingCollines(true);
        setCollines([{ id: null, name: "", code: "" }]);
        try {
            const response = await fetchData("get", "adress/colline/get_collines_by_zone", {
                params: { zone: newSelectedZone.name },
            });
            const existingCollines = response?.map((item) => ({
                id: item.id,
                name: item.colline_name,
                code: item.colline_code || "",
            })) || [];

            if (existingCollines.length > 0) {
                setCollines(existingCollines);
            } else {
                setCollines([{ id: null, name: "", code: "" }]);
            }
        } catch (error) {
            console.error("Error fetching collines:", error);
            toast.error("Erreur lors de la récupération des collines");
        } finally {
            setLoadingCollines(false);
        }
    };


    const handleAddColline = () => {
        setCollines([...collines, { id: null, name: "", code: "" }]);
    };

    const handleRemoveColline = async (index) => {
        const collineToRemove = collines[index];

        if (collineToRemove.id) {
            // If it exists on backend, we might want to delete it or just remove from UI
            // For now, I'll just remove from UI, but I could add deletion logic if requested.
            // But the user said "modify if necessary", so removal might mean deletion.
            if (!confirm(`Voulez-vous vraiment supprimer la colline "${collineToRemove.name}" ?`)) {
                return;
            }

            try {
                await fetchData("delete", `adress/colline/${collineToRemove.id}/`);
                toast.success(`Colline "${collineToRemove.name}" supprimée`);
            } catch (error) {
                toast.error("Erreur lors de la suppression");
                return;
            }
        }

        const newCollines = collines.filter((_, i) => i !== index);
        if (newCollines.length === 0) {
            setCollines([{ id: null, name: "", code: "" }]);
        } else {
            setCollines(newCollines);
        }
    };

    const handleCollineChange = (index, field, value) => {
        const newCollines = [...collines];
        newCollines[index][field] = value;
        setCollines(newCollines);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProvince || !selectedCommune || !selectedZone) {
            toast.error("Veuillez sélectionner une province, une commune et une zone");
            return;
        }

        const validCollines = collines.filter(c => c.name.trim() !== "");
        if (validCollines.length === 0) {
            toast.error("Veuillez ajouter au moins une colline");
            return;
        }

        setIsSubmitting(true);

        try {
            const promises = validCollines.map(colline => {
                if (colline.id) {

                    return fetchData("patch", `adress/colline/${colline.id}/`, {
                        body: { colline_name: colline.name }
                    });
                } else {
                    return fetchData("post", "adress/colline/", {
                        body: {
                            colline_name: colline.name,
                            colline_code: colline.code,
                            zone_name: selectedZone.name,
                            zone_code: selectedZone.id
                        }
                    });
                }
            });

            await Promise.all(promises);

            toast.success("Modifications enregistrées avec succès");

            // Refresh collines to get IDs for new ones
            const response = await fetchData("get", "adress/colline/get_collines_by_zone/", {
                params: { zone: selectedZone.name },
            });
            const updated = response?.map(item => ({
                id: item.id,
                name: item.colline_name,
                code: item.colline_code || "",
            })) || [];
            setCollines(updated);

        } catch (error) {
            console.error("Error saving collines:", error);
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (

        <div className="container  p-4 ">
            <Card className="border-none shadow-lg bg-card backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Édition des Localités</CardTitle>

                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Province Select */}
                            <div className="space-y-2">
                                <Label htmlFor="province">Province</Label>
                                <Select
                                    value={selectedProvince}
                                    onValueChange={handleProvinceChange}
                                    disabled={loadingProvinces}
                                >
                                    <SelectTrigger id="province" className="w-full">
                                        <SelectValue placeholder={loadingProvinces ? "Chargement..." : "Sélectionner province"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinces.map((p) => (
                                            <SelectItem key={p.value} value={p.value}>
                                                {p.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Commune Select */}
                            <div className="space-y-2">
                                <Label htmlFor="commune">Commune</Label>
                                <Select
                                    value={selectedCommune}
                                    onValueChange={handleCommuneChange}
                                    disabled={!selectedProvince || loadingCommunes}
                                >
                                    <SelectTrigger id="commune" className="w-full">
                                        <SelectValue placeholder={loadingCommunes ? "Chargement..." : "Sélectionner commune"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {communes.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>
                                                {c.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Zone Select */}
                            <div className="space-y-2">
                                <Label htmlFor="zone">Zone</Label>
                                <Select
                                    value={selectedZone?.name || ""}
                                    onValueChange={handleZoneChange}
                                    disabled={!selectedCommune || loadingZones}
                                >
                                    <SelectTrigger id="zone" className="w-full">
                                        <SelectValue placeholder={loadingZones ? "Chargement..." : "Sélectionner zone"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zones.map((z) => (
                                            <SelectItem key={z.value} value={z.value}>
                                                {z.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Label className="text-lg font-medium">Collines</Label>
                                    {loadingCollines && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddColline}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter une colline
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {collines.map((colline, index) => (
                                    <div key={index} className="flex gap-2 items-center">
                                        <Input
                                            value={colline.name}
                                            onChange={(e) => handleCollineChange(index, "name", e.target.value)}
                                            placeholder={colline.id ? "Modifier le nom" : "Nom de la colline"}
                                            className="flex-1"
                                        />
                                        <Input
                                            value={colline.code}
                                            onChange={(e) => handleCollineChange(index, "code", e.target.value)}
                                            placeholder="Code de la colline"
                                            className="w-1/3"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveColline(index)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full md:w-auto flex items-center gap-2"
                                disabled={isSubmitting || !selectedZone}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Enregistrer les modifications
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    );
}
