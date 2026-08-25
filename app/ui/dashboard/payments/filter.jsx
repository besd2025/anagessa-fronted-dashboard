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
import { fetchData } from "@/app/_utils/api";
import { Checkbox } from "@/components/ui/checkbox";

function Filter({ handleFilter }) {
  const [open, setOpen] = React.useState(false);

  // Address states
  const [province, setProvince] = React.useState([]);
  const [commune, setCommune] = React.useState([]);
  const [zones, setZones] = React.useState([]);
  const [colline, setColline] = React.useState([]);

  // Entity states
  const [societe, setSociete] = React.useState([]);
  const [hangar, setSdl] = React.useState([]);
  const [Hangar, setCt] = React.useState([]);

  // Filter values
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCommune, setSelectedCommune] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState("");
  const [selectedColline, setSelectedColline] = React.useState("");
  const [selectedSociete, setSelectedSociete] = React.useState("");
  const [selectedSdl, setSelectedSdl] = React.useState("");
  const [selectedCt, setSelectedCt] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [quantiteMin, setQuantiteMin] = React.useState("");
  const [grainsAGtB, setgrainsAGtB] = React.useState(false);
  const [grainsBGtA, setgrainsBGtA] = React.useState(false);

  // Fetch provinces and entities on mount
  React.useEffect(() => {
    async function getData() {
      try {
        const [provincesRes, societesRes, HangarsRes, ctsRes] = await Promise.all([
          fetchData("get", `adress/province/`, { params: { limit: 100 } }),
          fetchData("get", `mais/societes/`, { params: { limit: 100 } }),
          fetchData("get", `mais/hangars/`, { params: { limit: 100 } }),
          fetchData("get", `mais/centres_transite/`, { params: { limit: 100 } }),
        ]);

        setProvince(provincesRes?.results?.map((p) => ({ value: p.province_name, label: p.province_name, id: p.id })) || []);
        setSociete(societesRes?.results?.map((s) => ({ value: s.nom_societe, label: s.nom_societe, id: s.id })) || []);
        setSdl(HangarsRes?.results?.map((s) => ({ value: s.sdl_nom, label: s.sdl_nom, id: s.id })) || []);
        setCt(ctsRes?.results?.map((c) => ({ value: c.ct_nom, label: c.ct_nom, id: c.id })) || []);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    }
    getData();
  }, []);

  React.useEffect(() => {
    async function fetchSdlAndCt() {
      try {
        let params = { limit: 100 };
        const socId = societe.find(s => s.value === selectedSociete)?.id;
        if (socId) params.societe_id = socId;
        if (selectedColline) params.colline_name = selectedColline;

        const [HangarsRes, ctsRes] = await Promise.all([
          fetchData("get", `mais/hangars/`, { params }),
          fetchData("get", `mais/centres_transite/`, { params }),
        ]);

        setSdl(HangarsRes?.results?.map((s) => ({ value: s.sdl_nom, label: s.sdl_nom, id: s.id })) || []);
        setCt(ctsRes?.results?.map((c) => ({ value: c.ct_nom, label: c.ct_nom, id: c.id })) || []);
      } catch (error) {
        console.error("Error fetching Hangar:", error);
      }
    }

    if (selectedSociete || selectedColline) {
      fetchSdlAndCt();
    }
  }, [selectedSociete, selectedColline]);

  const handleSelectProvinceChange = async (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedCommune("");
    setSelectedZone("");
    setSelectedColline("");
    if (!value) {
      setCommune([]);
      return;
    }
    const communes = await fetchData("get", `adress/commune/get_communes_by_province`, { params: { province: value } });
    setCommune(communes?.map((c) => ({ value: c.commune_name, label: c.commune_name, id: c.id })) || []);
  };

  const handleSelectCommuneChange = async (e) => {
    const value = e.target.value;
    setSelectedCommune(value);
    setSelectedZone("");
    setSelectedColline("");
    if (!value) {
      setZones([]);
      return;
    }
    const zonesRes = await fetchData("get", `adress/zone/get_zones_by_commune/`, { params: { commune: value } });
    setZones(zonesRes?.map((z) => ({ value: z.zone_name, label: z.zone_name, id: z.id })) || []);
  };

  const handleSelectZoneChange = async (e) => {
    const value = e.target.value;
    setSelectedZone(value);
    setSelectedColline("");
    if (!value) {
      setColline([]);
      return;
    }
    const collinesRes = await fetchData("get", `adress/colline/get_collines_by_zone/`, { params: { zone: value } });
    setColline(collinesRes?.map((c) => ({ value: c.colline_name, label: c.colline_name, id: c.id })) || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const getID = (array, val) => array.find((item) => item.value === val)?.id || "";

    const payload = {
      province: getID(province, selectedProvince),
      commune: getID(commune, selectedCommune),
      zone: getID(zones, selectedZone),
      colline: getID(colline, selectedColline),
      societe: getID(societe, selectedSociete),
      hangar: getID(hangar, selectedSdl),
      Hangar: getID(Hangar, selectedCt),
      start_date_from: dateFrom,
      achat_date_to: dateTo,
      quantite_min: quantiteMin,
      grains_a_gt_b: grainsAGtB,
      grains_b_gt_a: grainsBGtA,
    };
    handleFilter(payload);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.29004 5.90393H17.7067"
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.7075 14.0961H2.29085"
              stroke=""
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
              fill=""
              stroke=""
              strokeWidth="1.5"
            />
            <path
              d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
              fill=""
              stroke=""
              strokeWidth="1.5"
            />
          </svg>
          Filtrage
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Filtrage Avancé</DialogTitle>
          <DialogDescription>
            Affinez les résultats de paiement en utilisant les critères ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="custom-scrollbar h-[60vh] overflow-y-auto px-2 pb-3 mt-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            {/* Location */}
            <div className="space-y-2">
              <Label>Province</Label>
              <select
                value={selectedProvince}
                onChange={handleSelectProvinceChange}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
              >
                <option value="">Sélectionner Province</option>
                {province.map((p) => (
                  <option key={p.id} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Commune</Label>
              <select
                value={selectedCommune}
                onChange={handleSelectCommuneChange}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
              >
                <option value="">Sélectionner Commune</option>
                {commune.map((c) => (
                  <option key={c.id} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Zone</Label>
              <select
                value={selectedZone}
                onChange={handleSelectZoneChange}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
              >
                <option value="">Sélectionner Zone</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.value}>{z.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Colline</Label>
              <select
                value={selectedColline}
                onChange={(e) => setSelectedColline(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
              >
                <option value="">Sélectionner Colline</option>
                {colline.map((c) => (
                  <option key={c.id} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Entities */}
            <div className="space-y-2">
              <Label>Société</Label>
              <select
                value={selectedSociete}
                onChange={(e) => setSelectedSociete(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
              >
                <option value="">Sélectionner Société</option>
                {societe.map((s) => (
                  <option key={s.id} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>hangar / Hangar</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedSdl}
                  onChange={(e) => setSelectedSdl(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
                >
                  <option value="">hangar</option>
                  {hangar.map((s) => (
                    <option key={s.id} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <select
                  value={selectedCt}
                  onChange={(e) => setSelectedCt(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-background px-2 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-ring dark:border-gray-700"
                >
                  <option value="">Hangar</option>
                  {Hangar.map((c) => (
                    <option key={c.id} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-2">
              <Label>Achetée Depuis</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-11 dark:border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Achetée Jusqu'à</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-11 dark:border-gray-700"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantité Totale Min (Kg)</Label>
              <Input
                type="number"
                placeholder="Ex: 100"
                value={quantiteMin}
                onChange={(e) => setQuantiteMin(e.target.value)}
                className="h-11 dark:border-gray-700"
              />
            </div>

            <div className="flex flex-col justify-center space-y-4 pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="grains_a_gt_b"
                  checked={grainsAGtB}
                  onCheckedChange={setgrainsAGtB}
                />
                <Label htmlFor="grains_a_gt_b" className="cursor-pointer">Variété A {">"} B</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="grains_b_gt_a"
                  checked={grainsBGtA}
                  onCheckedChange={setgrainsBGtA}
                />
                <Label htmlFor="grains_b_gt_a" className="cursor-pointer">Variété B {">"} A</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Appliquer Filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Filter;
