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

function Filter({ handleFilter }) {
  const [open, setOpen] = React.useState(false);
  // Example options for the selects
  const provinceOptions = [
    { value: "buja", label: "Buja" },
    { value: "kigali", label: "Kigali" },
    { value: "rwanda_north", label: "Rwanda North" },
  ];

  const communeOptions = [
    { value: "ntahangwa", label: "Ntahangwa" },
    { value: "gasabo", label: "Gasabo" },
    { value: "gicumbi", label: "Gicumbi" },
  ];

  const zoneOptions = [
    { value: "zone_a", label: "Zone A" },
    { value: "zone_b", label: "Zone B" },
  ];

  const collineOptions = [
    { value: "colline_1", label: "Colline 1" },
    { value: "colline_2", label: "Colline 2" },
  ];

  // Local state and handlers for the example selects/inputs
  const [selectedProvince, setSelectedProvince] = React.useState("");
  const [selectedCommune, setSelectedCommune] = React.useState("");
  const [selectedZone, setSelectedZone] = React.useState("");
  const [selectedColline, setSelectedColline] = React.useState("");
  const [ageMin, setAgeMin] = React.useState("");
  const [ageMax, setAgeMax] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const handleSelectProvinceChange = (e) => setSelectedProvince(e.target.value);
  const handleSelectCommuneChange = (e) => setSelectedCommune(e.target.value);
  const handleSelectZoneChange = (e) => setSelectedZone(e.target.value);
  const handleSelectCollineChange = (e) => setSelectedColline(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleFilter) {
      handleFilter({
        selectedProvince,
        selectedCommune,
        selectedZone,
        selectedColline,
        ageMin,
        ageMax,
        dateFrom,
        dateTo,
      });
    }
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
                        {provinceOptions.map((p, index) => (
                          <option key={`${p.value}-${index}`} value={p.value}>
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
                        {communeOptions.map((c, index) => (
                          <option key={`${c.value}-${index}`} value={c.value}>
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
                        {zoneOptions.map((z, index) => (
                          <option key={`${z.value}-${index}`} value={z.value}>
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
                        {collineOptions.map((c, index) => (
                          <option key={`${c.value}-${index}`} value={c.value}>
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
                        value={selectedColline}
                        onChange={handleSelectCollineChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner societe</option>
                        {collineOptions.map((c, index) => (
                          <option key={`${c.value}-${index}`} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>hangar ou CT</Label>
                    <div className="relative">
                      <select
                        value={selectedColline}
                        onChange={handleSelectCollineChange}
                        className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
                      >
                        <option value="">Selectionner Colline</option>
                        {collineOptions.map((c, index) => (
                          <option key={`${c.value}-${index}`} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>AGE MIN</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Entrer l'age minimum"
                        value={ageMin}
                        onChange={(e) => setAgeMin(e.target.value)}
                        className="dark:bg-dark-900"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="space-y-2">
                    <Label>AGE MAX</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Entrer l'age minimum"
                        value={ageMax}
                        onChange={(e) => setAgeMax(e.target.value)}
                        className="dark:bg-dark-900"
                      />
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
            <Button type="submit" onClick={handleSubmit}>
              Filtrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default Filter;
