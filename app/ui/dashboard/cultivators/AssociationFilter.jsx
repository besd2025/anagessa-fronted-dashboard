"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/app/_utils/api";

function AssociationFilter({ handleFilter }) {
  const [open, setOpen] = useState(false);
  const [province, setProvince] = useState([]);
  const [commune, setCommune] = useState([]);
  const [zones, setZones] = useState([]);
  const [colline, setColline] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedColline, setSelectedColline] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    async function getProvinces() {
      try {
        const response = await fetchData("get", `adress/province/`, {
          params: { offset: 0, limit: 100 },
        });
        const options = response?.results?.map((item) => ({
          value: item.province_name,
          label: item.province_name,
        }));
        setProvince(options || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    }
    getProvinces();
  }, []);

  const handleProvinceChange = async (e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedCommune("");
    setSelectedZone("");
    setSelectedColline("");
    if (!value) {
      setCommune([]);
      return;
    }
    try {
      const communes = await fetchData(
        "get",
        `adress/commune/get_communes_by_province`,
        {
          params: { province: value },
        },
      );
      setCommune(
        communes?.map((item) => ({
          value: item.commune_name,
          label: item.commune_name,
        })) || [],
      );
    } catch (error) {
      console.error("Error fetching communes:", error);
    }
  };

  const handleCommuneChange = async (e) => {
    const value = e.target.value;
    setSelectedCommune(value);
    setSelectedZone("");
    setSelectedColline("");
    if (!value) {
      setZones([]);
      return;
    }
    try {
      const response = await fetchData(
        "get",
        `adress/zone/get_zones_by_commune/`,
        {
          params: { commune: value },
        },
      );
      setZones(
        response?.map((item) => ({
          value: item.zone_name,
          label: item.zone_name,
        })) || [],
      );
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const handleZoneChange = async (e) => {
    const value = e.target.value;
    setSelectedZone(value);
    setSelectedColline("");
    if (!value) {
      setColline([]);
      return;
    }
    try {
      const response = await fetchData("get", `adress/colline/get_collines_by_zone/`, {
        params: { zone: value },
      });
      setColline(
        response?.map((item) => ({
          value: item.colline_name,
          label: item.colline_name,
        })) || [],
      );
    } catch (error) {
      console.error("Error fetching collines:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filterData = {
      province_name: selectedProvince,
      commune_name: selectedCommune,
      zone_name: selectedZone,
      colline_name: selectedColline,
      created_at_min: dateTo,
      created_at_max: dateFrom,
    };
    handleFilter(filterData);
    setOpen(false); // Close the dialog
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
        >
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
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
          Filtrer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-sidebar">
        <DialogHeader>
          <DialogTitle>Filtrage</DialogTitle>
        </DialogHeader>
        <div className="custom-scrollbar h-[60vh] lg:max-h-[500px] overflow-y-auto px-2 pb-3">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 mt-4">
            <div className="space-y-2">
              <Label>Province</Label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              >
                <option value="">Sélectionner province</option>
                {province.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Commune</Label>
              <select
                value={selectedCommune}
                onChange={handleCommuneChange}
                className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              >
                <option value="">Sélectionner commune</option>
                {commune.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Zone</Label>
              <select
                value={selectedZone}
                onChange={handleZoneChange}
                className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              >
                <option value="">Sélectionner zone</option>
                {zones.map((z) => (
                  <option key={z.value} value={z.value}>
                    {z.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Colline</Label>
              <select
                value={selectedColline}
                onChange={(e) => setSelectedColline(e.target.value)}
                className="bg-card h-11 w-full rounded-lg border border-gray-300 px-3 text-sm"
              >
                <option value="">Sélectionner colline</option>
                {colline.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date de début</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Filtrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssociationFilter;
