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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Workflow } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



export default function AddCollector({ code, type }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    cni: "",
    identifiant: "",
    password: "",
  });
  const [Hangar, setCt] = useState("");

  // Options states
  const [ctOptions, setCtOptions] = useState([]);
  const [sdlOptions, setSdlOptions] = useState([]);
  const [sdl_ct, setSdl_ct] = useState("");
  const [hangar, setSdl] = useState("");
  // Load initial data (provinces)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const provData = await fetchData("get", `adress/province/`, { params: { offset: 0, limit: 5 } });

        setProvinceOptions(provData?.results?.map(p => ({
          value: p.province_name,
          label: p.province_name
        })) || []);


      } catch (err) {
        console.error("Error loading initial data:", err);
      }
    }
    if (open) {
      loadInitialData();
    }
  }, [open]);

  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      adress_code: colline,
      sdl_or_ct_code: code,
      station_type: type
    };


    console.log("payload", payload)
    if (!formData.first_name || !formData.last_name || !colline) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);


    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("post", `/mais/responsable_registration/`, {
          body: payload,
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
      loading: "Ajout du collecteur...",
      success: () => {
        setTimeout(() => {
          setOpen(false);
          // window.location.reload(); 
        }, 1000);
        return `Le collecteur ${formData.first_name} ${formData.last_name} a été ajouté avec succès`;
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
        setError(error);
        console.error("Error loading provinces:", error);
      }
    }
    loadProvinces();
  }, []);

  // Handle province change
  const handleProvinceChange = async (value) => {
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
  const handleCommuneChange = async (value) => {
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
  const handleZoneChange = async (value) => {
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

  const handleCollineChange = (value) => {
    setColline(value);
  };



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-normal text-sm w-full bg-transparent border-none" variant="outline">
          <Workflow />
          <span>Affecter</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[600px] bg-sidebar"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >

        <DialogHeader>
          <DialogTitle>Ajouter</DialogTitle>
          <DialogDescription>
            Ajoutez les informations d'un nouveau collecteur.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="h-[60vh] overflow-y-auto max-h-[90vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Nom"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="identifiant">Identifiant</Label>
              <Input
                id="identifiant"
                name="identifiant"
                type="text"
                placeholder="Identifiant de connexion"
                value={formData.identifiant}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cni">CNI</Label>
              <Input
                id="cni"
                name="cni"
                type="text"
                placeholder="Numéro de CNI"
                value={formData.cni}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>




          </div>

          <div className="my-2">
            <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
              Localité
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Province</Label>
                <Select value={province} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une province" />
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
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Commune</Label>
                <Select
                  value={commune}
                  onValueChange={handleCommuneChange}
                  disabled={!province}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une commune" />
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
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Zone</Label>
                <Select
                  value={zone}
                  onValueChange={handleZoneChange}
                  disabled={!commune}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une zone" />
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
              <div className="col-span-2 lg:col-span-1 space-y-2">
                <Label>Colline</Label>
                <Select
                  value={colline}
                  onValueChange={handleCollineChange}
                  disabled={!zone}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Sélectionner une colline" />
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
        </form>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}