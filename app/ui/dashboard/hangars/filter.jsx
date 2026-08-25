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
function Filter({ handleFilter }) {
  const [open, setOpen] = React.useState(false);
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCommune, setSelectedCommune] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState("");
  const [selectedColline, setSelectedColline] = React.useState("");
  const [selectedSociete, setSelectedSociete] = React.useState("");
  const [QteMin, setQteMin] = React.useState("");
  const [QteMax, setQteMax] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [province, setProvince] = React.useState([]);
  const [commune, setCommune] = React.useState([]);
  const [zones, setZones] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [collines, setColline] = React.useState([]);
  const [societes, setSocietes] = React.useState([]);

  const handleSelectProvinceChange = async (e) => {
    const value = e.target.value;
    if (!value) {
      setCommune([]);
      return;
    }
    const communes = await fetchData(
      "get",
      `adress/commune/get_communes_by_province`,
      {
        params: { province: value },
        additionalHeaders: {},
        body: {},
      },
    );
    const options = communes?.map((item) => ({
      value: item.commune_name,
      label: item.commune_name,
    }));
    setCommune(options);
    setSelectedProvince(value);
  };
  const handleSelectCommuneChange = async (e) => {
    const value = e.target.value;
    if (!value) {
      setCommune([]);
      return;
    }
    const zones = await fetchData("get", `adress/zone/get_zones_by_commune/`, {
      params: { commune: value },
      additionalHeaders: {},
      body: {},
    });
    const options = zones?.map((item) => ({
      value: item.zone_name,
      label: item.zone_name,
    }));
    setZones(options);
    setSelectedCommune(value);
  };
  const handleSelectZoneChange = async (e) => {
    const value = e.target.value;
    if (!value) {
      setCommune([]);
      return;
    }
    const collines = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
      params: { zone: value },
      additionalHeaders: {},
      body: {},
    });
    const options = collines?.map((item) => ({
      value: item.colline_name,
      label: item.colline_name,
    }));
    setColline(options);
    setSelectedZone(value);
  };
  const handleSelectCollineChange = (e) => {
    const value = e.target.value;
    setSelectedColline(value);
  };
  React.useEffect(() => {
    async function getData() {
      try {
        const provinces = await fetchData("get", `adress/province/`, {
          params: {
            offset: 0,
            limit: 18,
          },
          additionalHeaders: {},
          body: {},
        });
        const societes = await fetchData("get", `cafe/societes/`, {
          params: {
            offset: 0,
            limit: 18,
          },
          additionalHeaders: {},
          body: {},
        });

        const options = provinces?.results?.map((item) => ({
          value: item.province_name,
          label: item.province_name,
        }));
        const societesOptions = societes?.results?.map((item) => ({
          value: item.id,
          label: item.nom_societe,
        }));
        setSocietes(societesOptions);
        setProvince(options);
        //setZones(zones);
      } catch (error) {
        setError(error);
        console.error(error);
      }
    }
    getData();
  }, []);
  const handleFilters = (e) => {
    e.preventDefault();
    const filterData = {
      province_name: selectedProvince,
      commune_name: selectedCommune,
      zone_name: selectedZone,
      colline_name: selectedColline,
      societe_nom: selectedSociete,
      created_after: dateTo,
      created_before: dateFrom,
    };
    handleFilter(filterData);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            //   onClick={() => openModalFilter()}
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
            <DialogTitle>Filtrage</DialogTitle>
          </DialogHeader>
          <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
            <div className="mt-7">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>Province</Label>
                    <div className="relative">
                      <select
                        value={selectedProvince}
                        onChange={handleSelectProvinceChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner province</option>
                        {province.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>Commune</Label>
                    <div className="relative">
                      <select
                        value={selectedCommune}
                        onChange={handleSelectCommuneChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner Commune</option>
                        {commune.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>Zone</Label>
                    <div className="relative">
                      <select
                        value={selectedZone}
                        onChange={handleSelectZoneChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner zone</option>
                        {zones.map((z) => (
                          <option key={z.value} value={z.value}>
                            {z.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>Colline</Label>
                    <div className="relative">
                      <select
                        value={selectedColline}
                        onChange={handleSelectCollineChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner Colline</option>
                        {collines.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>Societe</Label>
                    <div className="relative">
                      <select
                        value={selectedSociete}
                        onChange={(e) => setSelectedSociete(e.target.value)}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner societe</option>
                        {societes.map((c) => (
                          <option key={c.value} value={c.label}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1 z-9999">
                  <div className="space-y-2">
                    <div className="mt-6">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Depuis
                      </label>
                      <div className="relative">
                        <input
                          id="event-start-date"
                          type="date"
                          value={dateFrom || ""}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 lg:col-span-1 z-9999">
                  <div className="space-y-2">
                    <div className="mt-6">
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Jusqu'à
                      </label>
                      <div className="relative">
                        <input
                          id="event-start-date"
                          type="date"
                          value={dateTo || ""}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" onClick={handleFilters}>
              Filtrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default Filter;
