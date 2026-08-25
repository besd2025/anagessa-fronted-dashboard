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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SquarePen, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
export default function EditAssociation({
    cultivator,
    sdl_ct = "",
    society = "",
    localite = {},
    champs = 0,
}) {
    // Dialog state
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Personal information state
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [date_naissance, setDateNaissance] = useState("");
    const [phone, setPhone] = useState("");
    const [cni, setCni] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    // Association info state
    const [hangar, setSdl] = useState("");
    const [soc, setSoc] = useState("");
    const [numFiche, setNumFiche] = useState("");

    // Location state
    const [province, setProvince] = useState("");
    const [commune, setCommune] = useState("");
    const [zone, setZone] = useState("");
    const [colline, setColline] = useState("");
    const [address_code, setAdressCode] = useState("");
    // Location options state
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [communeOptions, setCommuneOptions] = useState([]);
    const [zoneOptions, setZoneOptions] = useState([]);
    const [collineOptions, setCollineOptions] = useState([]);

    // Field information state
    const [nbChamps, setNbChamps] = useState(0);

    // Payment information state
    const [payment_mode, setPaymentMode] = useState("");
    const [bank_name, setBankName] = useState("");
    const [bank_account, setBankAccount] = useState("");
    const [payment_phone, setPaymentPhone] = useState("");
    const [proprietaire, setProprietaire] = useState("");
    const [collector_code, setCollectorCode] = useState("");
    const [ouvert_a_pai, setOuvertAPai] = useState("");
    const [institution_financieres, setInstitutionFinancieres] = useState([]);
    const [nomAssociation, setNomAssociation] = useState("");
    const [nif, setNif] = useState("");
    const [representantname, setRepresentantname] = useState("");
    // Load initial data
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchData("get", `adress/province/`, {
                    params: { offset: 0, limit: 100 },
                });
                const institution_financieres = await fetchData("get", `mais/institution_financiers/`, {
                    params: { offset: 0, limit: 100 },
                });
                const institution_financieres_options = institution_financieres?.results?.map((item) => ({
                    value: item.institution_financier_name,
                    label: item.institution_financier_name,
                })) || [];
                const options = data?.results?.map((item) => ({
                    value: item.province_name,
                    label: item.province_name,
                })) || [];
                setProvinceOptions(options);
                setInstitutionFinancieres(institution_financieres_options)
                const response = await fetchData("get", `/cultivators/${cultivator}/`, {
                    params: {},
                    additionalHeaders: {},
                    body: {},
                });
                setCode(response.cultivator_code || "");
                setFirstName(response?.cultivator_first_name || "");
                setNif(response?.cultivator_assoc_nif || "");
                setNomAssociation(response?.cultivator_assoc_name || "");
                setRepresentantname(response?.cultivator_assoc_rep_name || "");
                setLastName(response?.cultivator_last_name || "");
                setImageUrl(response?.cultivator_photo || "");
                setDateNaissance(response?.date_naissance || "");
                setPhone(response?.cultivator_assoc_rep_phone || "");
                setCni(response?.cultivator_cni || "");
                setSdl(sdl_ct || "");
                setSoc(society || "");
                setNumFiche(response?.cultivator_assoc_numero_fiche || "");
                setProvince(localite?.province || "");
                setCommune(localite?.commune || "");
                setZone(localite?.zone || "");
                setColline(localite?.colline || "");
                setNbChamps(champs || 0);
                setPaymentMode(response?.cultivator_payment_type || "");
                setBankName(response?.cultivator_bank_name || "");
                setBankAccount(response?.cultivator_bank_account || "");
                setPaymentPhone(response?.cultivator_mobile_payment_account || "");
                setProprietaire(response?.cultivator_account_owner || "");
                setCollectorCode(response?.collector?.unique_code || "");
                setColline(response?.cultivator_adress?.colline_code || "");
                setAdressCode(response?.cultivator_adress?.code || "");
                setOuvertAPai(response?.cultivator_bank_opened)
                setBankName(response?.cultivator_bank_name)
            } catch (error) {
                console.error("Error loading cultivator data:", error);
            }
        }
        loadData();
    }, [cultivator]);

    // Handle province change
    const handleProvinceChange = async (e) => {
        const value = e.target.value;
        setProvince(value);

        if (!value) {
            setCommuneOptions([]);
            setCommune("");
            setZoneOptions([]);
            setZone("");
            setCollineOptions([]);
            setColline("");
            return;
        }

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
            setCommune("");
            setZoneOptions([]);
            setZone("");
            setCollineOptions([]);
            setColline("");
        } catch (error) {
            console.error("Error loading communes:", error);
        }
    };

    // Handle commune change
    const handleCommuneChange = async (e) => {
        const value = e.target.value;
        setCommune(value);

        if (!value) {
            setZoneOptions([]);
            setZone("");
            setCollineOptions([]);
            setColline("");
            return;
        }

        try {
            const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
                params: { commune: value },
            });
            const options = data?.map((item) => ({
                value: item.zone_name,
                label: item.zone_name,
            })) || [];
            setZoneOptions(options);
            setZone("");
            setCollineOptions([]);
            setColline("");
        } catch (error) {
            console.error("Error loading zones:", error);
        }
    };

    // Handle zone change
    const handleZoneChange = async (e) => {
        const value = e.target.value;
        setZone(value);

        if (!value) {
            setCollineOptions([]);
            setColline("");
            return;
        }

        try {
            const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
                params: { zone: value },
            });
            const options = data?.map((item) => ({
                value: item.colline_code,
                label: item.colline_name,
            })) || [];
            setCollineOptions(options);
            setColline("");
        } catch (error) {
            console.error("Error loading collines:", error);
        }
    };

    // Handle colline change
    const handleCollineChange = (e) => {
        setColline(e.target.value);
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            cultivator_code: code,
            cultivator_assoc_name: nomAssociation,
            cultivator_assoc_nif: nif,
            cultivator_assoc_representant: representantname,
            cultivator_assoc_representant_phone: phone,
            date_naissance: date_naissance,
            cultivator_assoc_numero_fiche: numFiche,
            cultivator_payment_type: payment_mode,
            cultivator_bank_name: bank_name,
            cultivator_bank_account: bank_account,
            cultivator_bank_opened: ouvert_a_pai,
            cultivator_mobile_payment_account: payment_phone,
            cultivator_account_owner: proprietaire,
            cultivator_adress_code: colline,
            collector_code: collector_code,


        };
        console.log("form data ", formData)
        setLoading(true);

        const promise = new Promise(async (resolve, reject) => {
            try {
                const results = await fetchData(
                    "patch",
                    `/cultivators/${cultivator}/`,
                    {
                        params: {},
                        additionalHeaders: {},
                        body: formData,
                    }
                );
                if (results.status === 200 || results.id) {

                    resolve({ code });
                } else {
                    reject(new Error("Erreur lors de la modification"));
                }
            } catch (error) {
                reject(error);
            }
        });

        toast.promise(promise, {
            loading: "Modification en cours...",
            success: (data) => {
                setCode("");
                setFirstName("");
                setLastName("");
                setImageUrl("");
                setDateNaissance("");
                setPhone("");
                setCni("");
                setSdl("");
                setSoc("");
                setNumFiche("");
                setProvince("");
                setCommune("");
                setZone("");
                setColline("");
                setNbChamps(0);
                setPaymentMode("");
                setBankName("");
                setBankAccount("");
                setPaymentPhone("");
                setProprietaire("");
                setCollectorCode("");
                setColline("");
                setAdressCode("");
                setOuvertAPai("")
                setOpen(false);
                setTimeout(() => setOpen(false), 1000);
                return `${data.code} a été modifié avec succès`;
            },
            error: "Donnée non modifiée",
        });

        try {
            await promise;
        } catch (error) {
            console.error(error);
            setError(error.message || "Une erreur est survenue");
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
                                    <Label>Nom Association</Label>
                                    <Input
                                        type="text"
                                        value={nomAssociation}
                                        onChange={(e) => setNomAssociation(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>NIF Association</Label>
                                    <Input
                                        type="text"
                                        value={nif}
                                        onChange={(e) => setNif(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Nom representant</Label>
                                    <Input
                                        type="text"
                                        value={representantname}
                                        onChange={(e) => setRepresentantname(e.target.value)}
                                    />
                                </div>

                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Date de naissance(representant)</Label>
                                    <Input
                                        type="text"
                                        value={date_naissance}
                                        onChange={(e) => setDateNaissance(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Telephone du representant</Label>
                                    <Input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
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
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Numero de la Fiche</Label>
                                    <Input
                                        type="text"
                                        value={numFiche}
                                        onChange={(e) => setNumFiche(e.target.value)}
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
                                    <select
                                        value={province}
                                        onChange={handleProvinceChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner une province</option>
                                        {provinceOptions.map((item, index) => (
                                            <option key={`${item.value}-${index}`} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Commune</Label>
                                    <select
                                        value={commune}
                                        onChange={handleCommuneChange}
                                        disabled={!province}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner une commune</option>
                                        {communeOptions.map((item, index) => (
                                            <option key={`${item.value}-${index}`} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Zone</Label>
                                    <select
                                        value={zone}
                                        onChange={handleZoneChange}
                                        disabled={!commune}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner une zone</option>
                                        {zoneOptions.map((item, index) => (
                                            <option key={`${item.value}-${index}`} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Colline</Label>
                                    <select
                                        value={colline}
                                        onChange={handleCollineChange}
                                        disabled={!zone}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Sélectionner une colline</option>
                                        {collineOptions.map((item, index) => (
                                            <option key={`${item.value}-${index}`} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
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
                                        type="text"
                                        value={payment_mode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Nom de Banque</Label>
                                    <Input
                                        type="text"
                                        value={bank_name}
                                        onChange={(e) => setBankName(e.target.value)}
                                    />
                                    {/* <select
                    value={bank_name}
                    onChange={(e) => setBankName(e.target.value)}
                    disabled={!commune}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Sélectionner une zone</option>
                    {institution_financieres.map((item, index) => (
                      <option key={`${item.value}-${index}`} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select> */}
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>No compte bancaire</Label>
                                    <Input
                                        type="text"
                                        value={bank_account}
                                        onChange={(e) => setBankAccount(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Ouvert à </Label>
                                    <Input
                                        type="text"
                                        value={ouvert_a_pai}
                                        onChange={(e) => setOuvertAPai(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>No de Tel de paiement</Label>
                                    <Input
                                        type="text"
                                        value={payment_phone}
                                        onChange={(e) => setPaymentPhone(e.target.value)}
                                    />
                                </div>
                                <div className="col-span-2 lg:col-span-1 space-y-2">
                                    <Label>Proprietaire</Label>
                                    <Input
                                        type="text"
                                        value={proprietaire}
                                        onChange={(e) => setProprietaire(e.target.value)}
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
