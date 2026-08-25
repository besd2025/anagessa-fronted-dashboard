"use client";
import React, { useState, useEffect } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HandCoins, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AvancePayment({
    cultivator,
    champs = 0,
}) {
    // Dialog state
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Personal information state
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Association info state
    const [type, setType] = useState(""); // "hangar" or "Hangar"
    const [sdlId, setSdlId] = useState(""); // Stores selected name for display
    const [responsibleId, setResponsibleId] = useState(""); // Stores ID for submission

    // Location state
    const [province, setProvince] = useState("");
    const [commune, setCommune] = useState("");
    const [zone, setZone] = useState("");
    const [colline, setColline] = useState("");
    const [amount, setAmount] = useState("");
    // Location options state
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [communeOptions, setCommuneOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [collineOptions, setCollineOptions] = useState([]);
    const [sdlOptions, setSdlOptions] = useState([]);
    const [ctOptions, setCtOptions] = useState([]);

    // Field information state
    const [nbChamps, setNbChamps] = useState(0);

    // Load initial provinces
    useEffect(() => {
        async function loadProvinces() {
            try {
                const data = await fetchData("get", `adress/province/`, {
                    params: { offset: 0, limit: 100 },
                });
                const options = data?.results?.map((item) => ({
                    value: item.province_name,
                    label: item.province_name,
                })) || [];
                setProvinceOptions(options);
            } catch (error) {
                console.error("Error loading provinces:", error);
            }
        }
        if (open) loadProvinces();
    }, [open]);

    // Handle province change
    const handleProvinceChange = async (value) => {
        setProvince(value);
        setCommuneOptions([]);
        setCommune("");
        setZoneOptions([]);
        setZone("");
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setCtOptions([]);
        setSdlId("");
        setResponsibleId("");

        if (!value) return;

        try {
            const data = await fetchData(
                "get",
                `adress/commune/get_communes_by_province`,
                { params: { province: value } }
            );
            const options = data?.map((item) => ({
                value: item.commune_name,
                label: item.commune_name,
            })) || [];
            setCommuneOptions(options);
        } catch (error) {
            console.error("Error loading communes:", error);
        }
    };

    // Handle commune change
    const handleCommuneChange = async (value) => {
        setCommune(value);
        setZoneOptions([]);
        setZone("");
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setCtOptions([]);
        setSdlId("");
        setResponsibleId("");

        if (!value) return;

        try {
            const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
                params: { commune: value },
            });
            const options = data?.map((item) => ({
                value: item.zone_name,
                label: item.zone_name,
            })) || [];
            setZoneOptions(options);
        } catch (error) {
            console.error("Error loading zones:", error);
        }
    };

    // Handle zone change
    const handleZoneChange = async (value) => {
        setZone(value);
        setCollineOptions([]);
        setColline("");
        setSdlOptions([]);
        setCtOptions([]);
        setSdlId("");
        setResponsibleId("");

        if (!value) return;

        try {
            const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
                params: { zone: value },
            });
            const options = data?.map((item) => ({
                value: item.colline_name,
                label: item.colline_name,
            })) || [];
            setCollineOptions(options);
        } catch (error) {
            console.error("Error loading collines:", error);
        }
    };

    // Handle colline change -> selection les Hangar par colline
    const handleCollineChange = async (value) => {
        setColline(value);
        setSdlOptions([]);
        setCtOptions([]);
        setSdlId("");
        setResponsibleId("");

        if (!value || !type) return;

        try {
            if (type === "hangar") {
                const response = await fetchData("get", `mais/hangars/`, {
                    params: { colline_name: value }
                });
                const options = response?.results?.map((item) => ({
                    value: item.sdl_nom,
                    label: item.sdl_nom,
                    id: item?.sdl_responsable?.id?.toString() || ""
                })) || [];
                setSdlOptions(options);
            } else if (type === "Hangar") {
                const response = await fetchData("get", `mais/centres_transite/`, {
                    params: { colline_name: value }
                });
                const options = response?.results?.map((item) => ({
                    value: item.ct_nom,
                    label: item.ct_nom,
                    id: item?.ct_responsable?.id?.toString() || ""
                })) || [];
                setCtOptions(options);
            }
        } catch (error) {
            console.error("Error loading options:", error);
        }
    };

    // Handle type change
    const handleTypeChange = async (value) => {
        setType(value);
        setSdlId("");
        setResponsibleId("");
        setSdlOptions([]);
        setCtOptions([]);

        if (colline && value) {
            try {
                if (value === "hangar") {
                    const response = await fetchData("get", `mais/hangars/`, {
                        params: { colline_name: colline }
                    });
                    const options = response?.results?.map((item) => ({
                        value: item.sdl_nom,
                        label: item.sdl_nom,
                        id: item?.sdl_responsable?.id?.toString() || ""
                    })) || [];
                    setSdlOptions(options);
                } else if (value === "Hangar") {
                    const response = await fetchData("get", `mais/centres_transite/`, {
                        params: { colline_name: colline }
                    });
                    const options = response?.results?.map((item) => ({
                        value: item.ct_nom,
                        label: item.ct_nom,
                        id: item?.ct_responsable?.id?.toString() || ""
                    })) || [];
                    setCtOptions(options);
                }
            } catch (error) {
                console.error("Error loading options on type change:", error);
            }
        }
    };

    // Handle station/centre change
    const handleStationChange = (value) => {
        setSdlId(value);
        const options = type === "hangar" ? sdlOptions : ctOptions;
        const selected = options.find(opt => opt.value === value);
        if (selected) {
            setResponsibleId(selected.id);
        } else {
            setResponsibleId("");
        }
    };

    // Load cultivator data
    useEffect(() => {
        async function loadCultivatorData() {
            if (!cultivator) return;
            try {
                const response = await fetchData("get", `/cultivators/${cultivator}/`);
                setCode(response.cultivator_code || "");
                setFirstName(response?.cultivator_first_name || "");
                setLastName(response?.cultivator_last_name || "");
                setNbChamps(champs || 0);
            } catch (error) {
                console.error("Error loading cultivator data:", error);
            }
        }
        if (open) loadCultivatorData();
    }, [open, cultivator, champs]);

    const handleSubmit = async (e) => {
        const formData = {
            responsable: responsibleId,
            cultivateur: cultivator,
            montant: amount,
            is_paid: true
        }
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetchData("post", `/mais/payment_advances/`, { body: formData });
            if (response.status === 201 || response.status === 200) {
                toast.success("Avance payée avec succès");
                setOpen(false);
                setAmount("");
                setSdlId("");
            } else {
                toast.error("Erreur lors du paiement de l'avance");
            }
        } catch (error) {
            console.error("Error paying advance:", error);
            toast.error("Erreur lors du paiement de l'avance");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-start font-normal text-sm"
                >
                    <HandCoins className="mr-2 h-4 w-4" />
                    Avance
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-sidebar">
                <DialogHeader>
                    <DialogTitle>Payer une Avance</DialogTitle>
                    <DialogDescription>
                        Saisissez le montant de l'avance et sélectionnez la Hangar.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4 max-h-[70vh] overflow-y-auto px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Code Caféiculteur</Label>
                            <Input value={code} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label>Nom & Prénom</Label>
                            <Input value={`${lastName} ${firstName}`} disabled />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Localité</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Province</Label>
                                <Select value={province} onValueChange={handleProvinceChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Province" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provinceOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Commune</Label>
                                <Select value={commune} onValueChange={handleCommuneChange} disabled={!province}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Commune" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {communeOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Zone</Label>
                                <Select value={zone} onValueChange={handleZoneChange} disabled={!commune}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {zoneOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Colline</Label>
                                <Select value={colline} onValueChange={handleCollineChange} disabled={!zone}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Colline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {collineOptions.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Type & Destination</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type de destination</Label>
                                <Select value={type} onValueChange={handleTypeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hangar">Hangar (hangar)</SelectItem>
                                        <SelectItem value="Hangar">Centre de Traitement (Hangar)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {type === "hangar" && (
                                <div className="space-y-2">
                                    <Label>Sélectionner la hangar</Label>
                                    <Select value={sdlId} onValueChange={handleStationChange} disabled={!colline}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={colline ? "Sélectionner une hangar" : "Veuillez d'abord choisir une colline"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sdlOptions.map((item) => (
                                                <SelectItem key={item.id} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {type === "Hangar" && (
                                <div className="space-y-2">
                                    <Label>Sélectionner le Hangar</Label>
                                    <Select value={sdlId} onValueChange={handleStationChange} disabled={!colline}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={colline ? "Sélectionner un Hangar" : "Veuillez d'abord choisir une colline"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ctOptions.map((item) => (
                                                <SelectItem key={item.id} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-lg font-medium text-primary">Montant de l'avance</h5>
                        <div className="space-y-2">
                            <Label>Montant (FBU)</Label>
                            <Input type="number" placeholder="Entrez le montant" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-48" />
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Valider le paiement
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
