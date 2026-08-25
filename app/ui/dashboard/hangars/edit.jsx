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
export default function Edit({ id }) {
  // local state initialized from props
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [sdlName, setSdlName] = React.useState("");
  const [type, setType] = React.useState();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [telephone, setTelephone] = React.useState("");
  const [societtecode, setSocietteCode] = React.useState("");
  const [soc, setSoc] = React.useState("");
  const [province, setProvince] = React.useState("");
  const [commune, setCommune] = React.useState("");
  const [zone, setZone] = React.useState("");
  const [colline, setColline] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const [provinceOptions, setProvinceOptions] = React.useState([]);
  const [communeOptions, setCommuneOptions] = React.useState([]);
  const [zoneOptions, setZoneOptions] = React.useState([]);
  const [collineOptions, setCollineOptions] = React.useState([]);
  const [societeOptions, setSocieteOptions] = React.useState([]);

  React.useEffect(() => {
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
          value: s.id,
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

  React.useEffect(() => {
    const getSdls = async () => {
      try {
        const response = await fetchData("get", `cafe/hangars/${id}/`, {
          params: {},
          additionalHeaders: {},
          body: {},
        });
        setCode(response?.sdl_code || "");
        setSdlName(response?.sdl_nom || "");
        setSoc(response?.societe?.nom_societe || "");
        setSocietteCode(response?.societe?.id || "");
        setFirstName(response?.sdl_responsable?.user?.first_name || "");
        setLastName(response?.sdl_responsable?.user?.last_name || "");
        setTelephone(response?.sdl_responsable?.user?.phone || "");
        setProvince(
          response?.sdl_adress?.zone_code?.commune_code?.province_code
            ?.province_name || "",
        );
        const fetchedCommune = response?.sdl_adress?.zone_code?.commune_code?.commune_name || "";
        setCommune(fetchedCommune);
        const fetchedZone = response?.sdl_adress?.zone_code?.zone_name || "";
        setZone(fetchedZone);
        const fetchedColline = response?.sdl_adress?.id || "";
        setColline(fetchedColline);
        // Pre-fill options so they render correctly on initial load
        if (fetchedCommune) {
          setCommuneOptions([{ value: fetchedCommune, label: fetchedCommune }]);
        }
        if (fetchedZone) {
          setZoneOptions([{ value: fetchedZone, label: fetchedZone }]);
        }
        if (fetchedColline) {
          const collineName = response?.sdl_adress?.colline_name || fetchedColline;
          setCollineOptions([{ value: fetchedColline, label: collineName }]);
        }
      } catch (error) {
        console.error("Error fetching station data:", error);
      }
    };

    getSdls();
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      sdl_nom: sdlName,
      societe: parseInt(societtecode),
      sdl_adress: parseInt(colline),
    };
    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData(
          "patch",
          `/cafe/hangars/${id}/`,
          {
            params: {},
            additionalHeaders: {},
            body: formData,
          },
        );
        if (results.status == 200) {
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
        setTimeout(() => null, 1000);
        return `${data.code} a été modifié avec succès `;
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
                Code hangar
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
                Informations hangar
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Nom hangar</Label>
                  <Input
                    type="text"
                    value={sdlName}
                    onChange={(e) => setSdlName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Société</Label>
                  <select
                    value={societtecode}
                    onChange={(e) => setSocietteCode(e.target.value)}
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
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="text"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-7">
              <h5 className="mb-5 text-xl font-medium text-primary dark:text-white/90 lg:mb-6">
                Localite
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 space-y-2">
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
                <div className="col-span-2 lg:col-span-1 space-y-2">
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
                <div className="col-span-2 lg:col-span-1 space-y-2">
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
                <div className="col-span-2 lg:col-span-1 space-y-2">
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
