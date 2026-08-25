"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus, Loader2 } from "lucide-react";
import { fetchData } from "@/app/_utils/api";

export default function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    identifiant: "",
    cni: "",
    telephone: "",
    password: "",
    societe_code: "",
    addresse: ""
  });

  const [province, setProvince] = useState("");
  const [commune, setCommune] = useState("");
  const [zone, setZone] = useState("");
  const [colline, setColline] = useState("");

  const [provinceOptions, setProvinceOptions] = useState([]);
  const [communeOptions, setCommuneOptions] = useState([]);
  const [zoneOptions, setZoneOptions] = useState([]);
  const [collineOptions, setCollineOptions] = useState([]);
  const [societeOptions, setSocieteOptions] = useState([]);

  // Load initial data (provinces and societies)
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [provData, socData] = await Promise.all([
          fetchData("get", `adress/province/`, { params: { offset: 0, limit: 18 } }),
          fetchData("get", `mais/societes/`, { params: { offset: 0, limit: 150 } })
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
        value: c.id,
        label: c.colline_name
      })) || []);
    } catch (err) {
      console.error("Error fetching collines:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // const payload = {
    //   ...formData,
    //   adresse: colline, // Mapping colline to adresse
    //   category: "Anagessa_Chef_societe" // Ensuring category is set for Chef de Société
    // };
    const FormData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      addresse: colline,
      cni: formData.cni,
      identifiant: formData.identifiant,
      password: formData.password,
      phone: formData.telephone,
      societe_code: formData.societe_code
    }
    try {
      const response = await fetchData("post", `mais/chef_societe_registration/`, {
        body: FormData,
      });
      if (response.status === 201 || response.status === 200) {
        setOpen(false);
        toast.success("Utilisateur ajouté avec succès");
        // Reset states
        setFormData({
          first_name: "",
          last_name: "",
          identifiant: "",
          cni: "",
          telephone: "",
          password: "",
          societe_code: ""
        });
        setProvince("");
        setCommune("");
        setZone("");
        setColline("");

        setTimeout(() => setOpen(false), 1000);
      } else {
        toast.error("Erreur lors de l'ajout de l'utilisateur");
      }
    } catch (error) {
      console.error("Error submitting user data:", error);
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 font-normal text-sm">
          <UserPlus className="h-4 w-4" />
          Nouveau chef de société
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Ajouter un chef de société</DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer un nouveau chef de société.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3 mt-4 space-y-6">
            {/* Identity section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="last_name">Nom</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Entrer le nom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_name">Prénom</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Entrer le prénom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="identifiant">Identifiant (Email/Username)</Label>
                <Input
                  id="identifiant"
                  name="identifiant"
                  value={formData.identifiant}
                  onChange={handleChange}
                  placeholder="john.doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cni">CNI</Label>
                <Input
                  id="cni"
                  name="cni"
                  value={formData.cni}
                  onChange={handleChange}
                  placeholder="Numéro de pièce d'identité"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="+257 ..."
                />
              </div>
            </div>

            {/* Locality section */}
            <div className="space-y-4">
              <h5 className="text-lg font-medium text-primary">Localité</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Province</Label>
                  <select
                    value={province}
                    onChange={handleProvinceChange}
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir une province</option>
                    {provinceOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>{opt.label}</option>
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
                      <option key={`${opt.value}-${index}`} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
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
                      <option key={`${opt.value}-${index}`} value={opt.value}>{opt.label}</option>
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
                      <option key={`${opt.value}-${index}`} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* affiliation section */}
            <div className="space-y-4">
              <h5 className="text-lg font-medium text-primary">Société</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Société</Label>
                  <select
                    name="societe_code"
                    value={formData.societe_code}
                    onChange={handleChange}
                    required
                    className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Sélectionner une société</option>
                    {societeOptions.map((opt, index) => (
                      <option key={`${opt.value}-${index}`} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 lg:flex-none"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 lg:flex-none"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer l'utilisateur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
