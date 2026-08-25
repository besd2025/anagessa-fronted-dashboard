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

export default function RA() {
  const [selectedMonth, setSelectedMonth] = useState("mai2025");
  const [selectedWeek, setSelectedWeek] = useState("week1");

  const COLUMNS = [
    "Canal G",
    "Select",
    "Admi",
    "Depulp",
    "Lavag",
    "Presech",
    "Sech",
    "Triag",
    "Magasin",
    "Entret",
    "Senti",
  ];

  /* 
    Structure des données :
    - Pour "Personnel" : 7 entrées (Lundi...Dimanche). Chaque entrée a un tableau "values" correspondant aux COLUMNS.
    - Pour "Lubrifiants" : 3 articles fixes (Mazout, Huile moteur, Graisse).
  */

  const LUBRIFIANTS_ITEMS = ["Mazout", "Huile moteur", "Graisse"];

  const monthsData = {
    mai2025: {
      label: "Mai 2025",
      weeks: {
        week1: {
          range: "Du 12/05 au 18/05/2025",
          personnel: [
            { day: "Lundi", values: [5, 2, 1, 4, 3, 2, 5, 6, 2, 1, 1] },
            { day: "Mardi", values: [6, 2, 1, 4, 3, 2, 5, 7, 2, 1, 1] },
            { day: "Mercredi", values: [5, 3, 1, 5, 3, 3, 6, 6, 2, 1, 1] },
            { day: "Jeudi", values: [6, 3, 2, 5, 4, 3, 6, 7, 2, 1, 1] },
            { day: "Vendredi", values: [7, 4, 2, 6, 4, 4, 7, 8, 3, 2, 1] },
            { day: "Samedi", values: [4, 1, 1, 3, 2, 1, 4, 5, 1, 1, 1] },
            { day: "Dimanche", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] }, // Gardiennage seulement par ex.
          ],
          lubrifiants: [
            { article: "Mazout", prev: 200, in: 50, out: 20, final: 230 },
            { article: "Huile moteur", prev: 50, in: 10, out: 5, final: 55 },
            { article: "Graisse", prev: 20, in: 5, out: 2, final: 23 },
          ],
        },
        week2: {
          range: "Du 19/05 au 25/05/2025",
          personnel: [
            { day: "Lundi", values: [6, 3, 2, 5, 4, 3, 6, 7, 2, 1, 1] },
            { day: "Mardi", values: [6, 3, 2, 5, 4, 3, 6, 7, 2, 1, 1] },
            { day: "Mercredi", values: [7, 4, 2, 6, 4, 4, 7, 8, 3, 2, 1] },
            { day: "Jeudi", values: [7, 4, 2, 6, 5, 4, 7, 8, 3, 2, 1] },
            { day: "Vendredi", values: [8, 5, 3, 7, 5, 5, 8, 9, 4, 2, 1] },
            { day: "Samedi", values: [5, 2, 1, 4, 3, 2, 5, 6, 2, 1, 1] },
            { day: "Dimanche", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
          ],
          lubrifiants: [
            { article: "Mazout", prev: 230, in: 0, out: 40, final: 190 },
            { article: "Huile moteur", prev: 55, in: 0, out: 5, final: 50 },
            { article: "Graisse", prev: 23, in: 0, out: 1, final: 22 },
          ],
        },
      },
    },
    juin2025: {
      label: "Juin 2025",
      weeks: {
        week1: {
          range: "Du 02/06 au 08/06/2025",
          personnel: [
            { day: "Lundi", values: [5, 2, 1, 4, 3, 2, 5, 6, 2, 1, 1] },
            { day: "Mardi", values: [5, 2, 1, 4, 3, 2, 5, 6, 2, 1, 1] },
            { day: "Mercredi", values: [6, 3, 2, 5, 4, 3, 6, 7, 2, 1, 1] },
            { day: "Jeudi", values: [6, 3, 2, 5, 4, 3, 6, 7, 2, 1, 1] },
            { day: "Vendredi", values: [7, 4, 2, 6, 5, 4, 7, 8, 3, 2, 1] },
            { day: "Samedi", values: [4, 1, 1, 3, 2, 1, 4, 5, 1, 1, 1] },
            { day: "Dimanche", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1] },
          ],
          lubrifiants: [
            { article: "Mazout", prev: 190, in: 100, out: 30, final: 260 },
            { article: "Huile moteur", prev: 50, in: 20, out: 5, final: 65 },
            { article: "Graisse", prev: 22, in: 5, out: 2, final: 25 },
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

  const currentData = currentMonth?.weeks[currentWeekKey];

  // Logic to handle month change
  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    const firstWeek = Object.keys(monthsData[value].weeks)[0];
    setSelectedWeek(firstWeek);
  };

  // --- CALCULATIONS FOR PERSONNEL ---

  // 1. Total per day (sum of the row's values)
  const getRowTotal = (values) => values.reduce((acc, curr) => acc + curr, 0);

  // 2. Total per column (sum of "Canal G" for the whole week, etc.)
  const getColumnTotal = (colIndex) => {
    if (!currentData) return 0;
    return currentData.personnel.reduce(
      (acc, day) => acc + (day.values[colIndex] || 0),
      0,
    );
  };

  // 3. Total General (sum of all columns' totals)
  const getGrandTotal = () => {
    if (!currentData) return 0;
    return COLUMNS.reduce((acc, _, i) => acc + getColumnTotal(i), 0);
  };

  // --- CALCULATIONS FOR LUBRIFIANTS (Totals) ---
  const getLubrifiantTotal = (key) => {
    if (!currentData) return 0;
    return currentData.lubrifiants.reduce((acc, item) => acc + item[key], 0);
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

      {/* CARD I. PERSONNEL */}
      <Card className="rounded-2xl border shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">I. Personnel</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              {/* MAIN HEADER */}
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold min-w-[130px]">
                    H/J – Date
                  </TableHead>

                  {COLUMNS.map((col, i) => (
                    <TableHead key={i} className="text-center font-semibold">
                      {col}
                    </TableHead>
                  ))}

                  <TableHead className="text-center font-bold">Total</TableHead>
                </TableRow>

                {/* SUBHEADER */}
                <TableRow className="bg-muted/30 border-b">
                  <TableHead></TableHead>
                  {COLUMNS.map((_, i) => (
                    <TableHead
                      key={i}
                      className="text-center text-sm text-muted-foreground"
                    >
                      H/J
                    </TableHead>
                  ))}
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>

              {/* BODY */}
              <TableBody>
                {currentData &&
                  currentData.personnel.map((row, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-medium">{row.day}</TableCell>

                      {row.values.map((val, j) => (
                        <TableCell
                          key={j}
                          className="text-center text-muted-foreground"
                        >
                          {val}
                        </TableCell>
                      ))}

                      {/* TOTAL PER DAY */}
                      <TableCell className="text-center font-semibold">
                        {getRowTotal(row.values)}
                      </TableCell>
                    </TableRow>
                  ))}

                {/* TOTAL SEMAINE */}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>Tot. Semaine</TableCell>
                  {COLUMNS.map((_, i) => (
                    <TableCell key={i} className="text-center">
                      {getColumnTotal(i)}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-primary font-bold">
                    {getGrandTotal()}
                  </TableCell>
                </TableRow>

                {/* TOTAL GENERAL (Same as Semaine here for simplicity, or could handle cumulative logic if needed) 
                    For now, leaving it as 'Tot. Général' row but using same data or specific field if we had previous weeks data.
                    Let's assume for this view it matches the week or represents monthly accumulation. 
                    Given no backend data for cumulative, I will display placeholders or same sum for visual consistency.
                */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Tot. Général</TableCell>
                  {COLUMNS.map((_, i) => (
                    <TableCell key={i} className="text-center text-primary">
                      {/* For demo purposes, let's just multiply by 2 or leave as is to show different row */}
                      {getColumnTotal(i)}
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-primary text-lg">
                    {getGrandTotal()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CARD II. LUBRIFIANTS */}
      <Card className="rounded-2xl border shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            II. Les lubrifiants en litres
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto grid w-full [&>div]:border [&>div]:rounded-md">
            <Table>
              {/* Header */}
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead className="font-semibold">Article</TableHead>
                  <TableHead className="text-center font-semibold">
                    Stocks précédents
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Entrée
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Sortie
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Stock final
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {currentData &&
                  currentData.lubrifiants.map((row, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-medium">
                        {row.article}
                      </TableCell>

                      <TableCell className="text-center text-muted-foreground">
                        {row.prev}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {row.in}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {row.out}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {row.final}
                      </TableCell>
                    </TableRow>
                  ))}

                {/* Total row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-center">
                    {getLubrifiantTotal("prev")}
                  </TableCell>
                  <TableCell className="text-center">
                    {getLubrifiantTotal("in")}
                  </TableCell>
                  <TableCell className="text-center">
                    {getLubrifiantTotal("out")}
                  </TableCell>
                  <TableCell className="text-center">
                    {getLubrifiantTotal("final")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
