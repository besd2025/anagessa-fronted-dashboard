"use client";

import React from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RBSdl() {
  const [selectedMonth, setSelectedMonth] = useState("mai2025");
  const [selectedWeek, setSelectedWeek] = useState("week1");

  const monthsData = {
    mai2025: {
      label: "Mai 2025",
      weeks: {
        week1: {
          range: "Du 12/05 au 18/05/2025",
          rows: [
            {
              day: "Lundi",
              date: "12/05/2025",
              lot: "101",
              receipts: "001-045",
              CA: "2,300",
              CB: "14,800",
            },
            {
              day: "Mardi",
              date: "13/05/2025",
              lot: "102",
              receipts: "046-090",
              CA: "1,850",
              CB: "16,650",
            },
            {
              day: "Mercredi",
              date: "14/05/2025",
              lot: "103",
              receipts: "091-125",
              CA: "2,100",
              CB: "18,750",
            },
            {
              day: "Jeudi",
              date: "15/05/2025",
              lot: "104",
              receipts: "126-160",
              CA: "1,950",
              CB: "20,700",
            },
            {
              day: "Vendredi",
              date: "16/05/2025",
              lot: "105",
              receipts: "161-195",
              CA: "2,400",
              CB: "23,100",
            },
            {
              day: "Samedi",
              date: "17/05/2025",
              lot: "106",
              receipts: "196-210",
              CA: "900",
              CB: "24,000",
            },
            {
              day: "Dimanche",
              date: "18/05/2025",
              lot: "-",
              receipts: "-",
              CA: "-",
              CB: "-24,000",
            },
          ],
          totalSemaine: { CA: "11,500", CB: "24,000" },
          totalGeneral: { CA: "11,500", CB: "24,000" },
        },
        week2: {
          range: "Du 19/05 au 25/05/2025",
          rows: [
            {
              day: "Lundi",
              date: "19/05/2025",
              lot: "107",
              receipts: "211-250",
              CA: "2,500",
              CB: "15,000",
            },
            {
              day: "Mardi",
              date: "20/05/2025",
              lot: "108",
              receipts: "251-290",
              CA: "1,900",
              CB: "17,000",
            },
            {
              day: "Mercredi",
              date: "21/05/2025",
              lot: "109",
              receipts: "291-325",
              CA: "2,200",
              CB: "19,000",
            },
            {
              day: "Jeudi",
              date: "22/05/2025",
              lot: "110",
              receipts: "326-360",
              CA: "2,000",
              CB: "21,000",
            },
            {
              day: "Vendredi",
              date: "23/05/2025",
              lot: "111",
              receipts: "361-395",
              CA: "2,500",
              CB: "23,500",
            },
            {
              day: "Samedi",
              date: "24/05/2025",
              lot: "112",
              receipts: "396-410",
              CA: "1,000",
              CB: "25,000",
            },
            {
              day: "Dimanche",
              date: "25/05/2025",
              lot: "-",
              receipts: "-",
              CA: "-",
              CB: "25,000",
            },
          ],
          totalSemaine: { CA: "12,100", CB: "25,000" },
          totalGeneral: { CA: "23,600", CB: "49,000" },
        },
      },
    },
    juin2025: {
      label: "Juin 2025",
      weeks: {
        week1: {
          range: "Du 02/06 au 08/06/2025",
          rows: [
            {
              day: "Lundi",
              date: "02/06/2025",
              lot: "113",
              receipts: "411-450",
              CA: "3,000",
              CB: "16,000",
            },
            {
              day: "Mardi",
              date: "03/06/2025",
              lot: "114",
              receipts: "451-490",
              CA: "2,100",
              CB: "18,000",
            },
            {
              day: "Mercredi",
              date: "04/06/2025",
              lot: "115",
              receipts: "491-525",
              CA: "2,300",
              CB: "20,000",
            },
            {
              day: "Jeudi",
              date: "05/06/2025",
              lot: "116",
              receipts: "526-560",
              CA: "2,200",
              CB: "22,000",
            },
            {
              day: "Vendredi",
              date: "06/06/2025",
              lot: "117",
              receipts: "561-595",
              CA: "2,700",
              CB: "24,500",
            },
            {
              day: "Samedi",
              date: "07/06/2025",
              lot: "118",
              receipts: "596-610",
              CA: "1,200",
              CB: "26,000",
            },
            {
              day: "Dimanche",
              date: "08/06/2025",
              lot: "-",
              receipts: "-",
              CA: "-",
              CB: "26,000",
            },
          ],
          totalSemaine: { CA: "13,500", CB: "26,000" },
          totalGeneral: { CA: "37,100", CB: "75,000" },
        },
      },
    },
  };

  const currentMonth = monthsData[selectedMonth];
  const currentData =
    currentMonth?.weeks[selectedWeek] ||
    Object.values(currentMonth?.weeks || {})[0];

  // Helper to safely switch weeks when changing months
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    const firstWeekOfMonth = Object.keys(monthsData[value].weeks)[0];
    setSelectedWeek(firstWeekOfMonth);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">
          Rapport B – Achats Cerises
        </CardTitle>
        <div className="flex gap-2">
          {/* SÉLECTEUR DE MOIS */}
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Choisir un mois" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(monthsData).map((key) => (
                <SelectItem key={key} value={key}>
                  {monthsData[key].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* SÉLECTEUR DE SEMAINE */}
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Choisir une semaine" />
            </SelectTrigger>
            <SelectContent>
              {currentMonth &&
                Object.keys(currentMonth.weeks).map((key) => (
                  <SelectItem key={key} value={key}>
                    {currentMonth.weeks[key].range}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="font-semibold">Jour & date</TableHead>
                <TableHead className="font-semibold">Lot n°</TableHead>
                <TableHead className="font-semibold">
                  N° reçus / Achats
                </TableHead>
                <TableHead className="text-center font-semibold" colSpan={2}>
                  Poids (Kg)
                </TableHead>
              </TableRow>

              <TableRow className="bg-muted/30 border-b">
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="text-center font-medium">CA</TableHead>
                <TableHead className="text-center font-medium">CB</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData?.rows.map((row, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="font-medium">
                    {row.day}{" "}
                    {row.date && (
                      <span className="text-muted-foreground ml-1">
                        ({row.date})
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.lot}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.receipts}
                  </TableCell>
                  <TableCell className="text-center">
                    {row.CA} <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {row.CB} <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                </TableRow>
              ))}

              {/* TOTAL SEMAINE */}
              {currentData && (
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>Total semaine</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">
                    {currentData.totalSemaine.CA}{" "}
                    <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {currentData.totalSemaine.CB}{" "}
                    <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                </TableRow>
              )}

              {/* TOTAL GENERAL */}
              {currentData && (
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total général</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center">
                    {currentData.totalGeneral.CA}{" "}
                    <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {currentData.totalGeneral.CB}{" "}
                    <span className="text-xs normal-case">Kg/T</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
