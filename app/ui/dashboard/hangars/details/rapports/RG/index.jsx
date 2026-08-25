"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RG() {
  const [selectedMonth, setSelectedMonth] = useState("mai2025");
  const [selectedWeek, setSelectedWeek] = useState("week1");

  // Columns based on User Request
  // "numero", "nom_prenom", "jours_ordinaires", "salaire_jour", "heures_supplementaires",
  // "salaire_heure_supplementaire", "jours_feries", "salaire_jour_ferie", "net_a_payer", "signature"

  const COLUMNS_DEF = [
    { key: "numero", label: "N°", align: "center" },
    { key: "nom_prenom", label: "Nom et Prénom", align: "left" },
    {
      key: "jours_ordinaires",
      label: "Jours Ordinaires",
      align: "center",
      isNumeric: true,
    },
    {
      key: "salaire_jour",
      label: "Salaire Journalier",
      align: "right",
      isNumeric: true,
    },
    {
      key: "heures_supplementaires",
      label: "Heures Suppl.",
      align: "center",
      isNumeric: true,
    },
    {
      key: "salaire_heure_supplementaire",
      label: "Taux H. Supp.",
      align: "right",
      isNumeric: true,
    },
    {
      key: "jours_feries",
      label: "Jours Fériés",
      align: "center",
      isNumeric: true,
    },
    {
      key: "salaire_jour_ferie",
      label: "Salaire J. Férié",
      align: "right",
      isNumeric: true,
    },
    {
      key: "net_a_payer",
      label: "Net à Payer",
      align: "right",
      isBold: true,
      isNumeric: true,
    },
    { key: "signature", label: "Signature", align: "center" },
  ];

  const monthsData = {
    mai2025: {
      label: "Mai 2025",
      weeks: {
        week1: {
          range: "Du 12/05 au 18/05/2025",
          data: [
            {
              numero: 1,
              nom_prenom: "Jean Paul",
              jours_ordinaires: 6,
              salaire_jour: 5000,
              heures_supplementaires: 2,
              salaire_heure_supplementaire: 1000,
              jours_feries: 0,
              salaire_jour_ferie: 0,
              // Net = (6*5000) + (2*1000) + 0 = 30000 + 2000 = 32000
              net_a_payer: 32000,
              signature: "",
            },
            {
              numero: 2,
              nom_prenom: "Pierre Marie",
              jours_ordinaires: 5,
              salaire_jour: 5000,
              heures_supplementaires: 0,
              salaire_heure_supplementaire: 1000,
              jours_feries: 1,
              salaire_jour_ferie: 7500, // Majoration
              // Net = (5*5000) + 0 + 7500 = 25000 + 7500 = 32500
              net_a_payer: 32500,
              signature: "",
            },
            {
              numero: 3,
              nom_prenom: "Alice Ndayishimiye",
              jours_ordinaires: 6,
              salaire_jour: 4500,
              heures_supplementaires: 5,
              salaire_heure_supplementaire: 900,
              jours_feries: 0,
              salaire_jour_ferie: 0,
              // Net = (6*4500) + (5*900) = 27000 + 4500 = 31500
              net_a_payer: 31500,
              signature: "",
            },
          ],
        },
        week2: {
          range: "Du 19/05 au 25/05/2025",
          data: [
            {
              numero: 1,
              nom_prenom: "Jean Paul",
              jours_ordinaires: 6,
              salaire_jour: 5000,
              heures_supplementaires: 0,
              salaire_heure_supplementaire: 1000,
              jours_feries: 0,
              salaire_jour_ferie: 0,
              net_a_payer: 30000,
              signature: "",
            },
            {
              numero: 2,
              nom_prenom: "Pierre Marie",
              jours_ordinaires: 6,
              salaire_jour: 5000,
              heures_supplementaires: 4,
              salaire_heure_supplementaire: 1000,
              jours_feries: 0,
              salaire_jour_ferie: 0,
              net_a_payer: 34000,
              signature: "",
            },
          ],
        },
      },
    },
    juin2025: {
      label: "Juin 2025",
      weeks: {
        week1: {
          range: "Du 02/06 au 08/06/2025",
          data: [
            {
              numero: 1,
              nom_prenom: "Jean Paul",
              jours_ordinaires: 5,
              salaire_jour: 5000,
              heures_supplementaires: 0,
              salaire_heure_supplementaire: 1000,
              jours_feries: 0,
              salaire_jour_ferie: 0,
              net_a_payer: 25000,
              signature: "",
            },
          ],
        },
      },
    },
  };

  const currentMonth = monthsData[selectedMonth];
  const currentWeekKey =
    selectedWeek in (currentMonth?.weeks || {})
      ? selectedWeek
      : Object.keys(currentMonth?.weeks || {})[0];

  const currentRows = currentMonth?.weeks[currentWeekKey]?.data || [];

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    const firstWeek = Object.keys(monthsData[value].weeks)[0];
    setSelectedWeek(firstWeek);
  };

  // Calculations for Totals
  const getTotal = (key) => {
    return currentRows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-[180px]">
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

        <Select value={currentWeekKey} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-[240px]">
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

      {/* RAPPORT G TABLE */}
      <Card className="rounded-2xl border shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Rapport G</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto  grid w-full [&>div]:border [&>div]:rounded-md">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  {COLUMNS_DEF.map((col) => (
                    <TableHead
                      key={col.key}
                      className={`font-semibold text-${col.align} whitespace-nowrap`}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.length > 0 ? (
                  currentRows.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {COLUMNS_DEF.map((col) => (
                        <TableCell
                          key={col.key}
                          className={`text-${col.align} ${
                            col.isBold ? "font-bold" : ""
                          } ${
                            col.key === "signature"
                              ? "italic text-muted-foreground"
                              : ""
                          }`}
                        >
                          {col.key === "net_a_payer" ||
                          col.key === "salaire_jour" ||
                          col.key === "salaire_heure_supplementaire" ||
                          col.key === "salaire_jour_ferie"
                            ? (row[col.key] || 0).toLocaleString()
                            : row[col.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS_DEF.length}
                      className="text-center py-4"
                    >
                      Aucune donnée disponible pour cette période.
                    </TableCell>
                  </TableRow>
                )}

                {/* TOTAL ROW */}
                <TableRow className="bg-muted/50 font-bold border-t-2">
                  <TableCell colSpan={2} className="text-right">
                    Total
                  </TableCell>
                  {COLUMNS_DEF.slice(2).map((col) => {
                    // Skip # and Name
                    if (col.key === "signature")
                      return <TableCell key={col.key}></TableCell>;

                    // We only sum specific numeric columns usually, but let's sum all numeric ones for typical report style
                    if (col.isNumeric) {
                      return (
                        <TableCell
                          key={col.key}
                          className={`text-${col.align} text-primary`}
                        >
                          {getTotal(col.key).toLocaleString()}
                        </TableCell>
                      );
                    }
                    return <TableCell key={col.key}></TableCell>;
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
