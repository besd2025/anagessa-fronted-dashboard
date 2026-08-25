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
import { Plus, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";

export default function AddSdl() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [code, setCode] = useState("");
  const [sdlName, setSdlName] = useState("");
  const [soc, setSoc] = useState(""); // code_societe
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");

  // Options states
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [societeOptions, setSocieteOptions] = useState([]);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [provData, socData] = await Promise.all([
          fetchData("get", `adress/province/`, { params: { offset: 0, limit: 100 } }),
          fetchData("get", `cafe/societes/`, { params: { offset: 0, limit: 150 } })
        ]);

        setProvinceOptions(provData?.results?.map(p => ({
          value: p.province_name,
          label: p.province_name
        })) || []);

        setSocieteOptions(socData?.results?.map(s => ({
          value: s.code_societe,
          label: s.nom_societe
        })) || []);
      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    if (open) {
      loadInitialData();
    }
  }, [open]);

  // Handlers for cascading address selects
  const handleProvinceChange = async (e) => {
    const value = e.target.value;
    setProvince(value);
    setCommune("");
    setZone("");
    setColline("");
    setCommuneOptions([]);
    setZoneOptions([]);
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/commune/get_communes_by_province`, {
        params: { province: value }
      });
      setCommuneOptions(data?.map(c => ({
        value: c.commune_name,
        label: c.commune_name
      })) || []);
    } catch (err) {
      console.error("Error fetching communes:", err);
    }
  };

  const handleCommuneChange = async (e) => {
    const value = e.target.value;
    setCommune(value);
    setZone("");
    setColline("");
    setZoneOptions([]);
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
        params: { commune: value }
      });
      setZoneOptions(data?.map(z => ({
        value: z.zone_name,
        label: z.zone_name
      })) || []);
    } catch (err) {
      console.error("Error fetching zones:", err);
    }
  };

  const handleZoneChange = async (e) => {
    const value = e.target.value;
    setZone(value);
    setColline("");
    setCollineOptions([]);

    if (!value) return;

    try {
      const data = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
        params: { zone: value }
      });
      setCollineOptions(data?.map(c => ({
        value: c.colline_code,
        label: c.colline_name
      })) || []);
    } catch (err) {
      console.error("Error fetching collines:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields (adjusted to prioritize visible fields)
    if (!code || !sdlName || !soc || !colline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    const formData = {
      sdl_code: code,
      sdl_nom: sdlName,
      societe_code: soc,
      sdl_adress_code: colline,
    };
    console.log("formData", formData);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("post", `/cafe/hangars/`, {
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
      loading: "Ajout de la hangar...",
      success: () => {
        setTimeout(() => {
          setOpen(false);
          setProvince("");
          setCommune("");
          setZone("");
          setColline("");
          setCode("");
          setSdlName("");
          setSoc("");
          setLastName("");
          setFirstName("");
          setTelephone("");
        }, 1000);
        return `hangar ${sdlName} a été ajouté avec succès`;;
      },
      error: (err) => err.message || "Donnée non ajoutée",
    });

    try {
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
        <Button className="font-normal text-sm w-full sm:w-max">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter hangar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Ajouter une Hangar (hangar)</DialogTitle>
            <DialogDescription>
              Veuillez renseigner les informations de la nouvelle hangar.
            </DialogDescription>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3 mt-4">
            {/* Code Section */}
            <div>
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Code hangar
              </h5>
              <Input
                type="text"
                placeholder="Ex: SDL_XXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            {/* hangar Info Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations hangar
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom hangar</Label>
                  <Input
                    type="text"
                    value={sdlName}
                    onChange={(e) => setSdlName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Société</Label>
                  <select
                    value={soc}
                    onChange={(e) => setSoc(e.target.value)}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une société</option>
                    {societeOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Responsable Info Section (Commented out as per user request) */}
            {/* <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Informations Responsable
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div> */}

            {/* Locality Section */}
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localité
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="space-y-2">
                  <Label>Province</Label>
                  <select
                    value={province}
                    onChange={handleProvinceChange}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une province</option>
                    {provinceOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Commune</Label>
                  <select
                    value={commune}
                    onChange={handleCommuneChange}
                    disabled={!province}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une commune</option>
                    {communeOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-5">
                <div className="space-y-2">
                  <Label>Zone</Label>
                  <select
                    value={zone}
                    onChange={handleZoneChange}
                    disabled={!commune}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une zone</option>
                    {zoneOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Colline</Label>
                  <select
                    value={colline}
                    onChange={(e) => setColline(e.target.value)}
                    disabled={!zone}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                  >
                    <option value="">Choisir une colline</option>
                    {collineOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4">
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
