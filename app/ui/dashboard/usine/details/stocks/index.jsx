"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Package } from "lucide-react";
import { StockChart } from "./stock-chart";

export default function Stocks({ data = [] }) {
  // Mock data representing current stock state
  // In a real app, this might be snapshot data or derived from ins/outs
  const stocks = [
    {
      grade: "MaÃ¯s blanc",
      proprietaire: "Coopérative KAWA",
      stock: 15400,
      bloque: 0,
    },
    {
      grade: "MaÃ¯s blanc",
      proprietaire: "SOGESTAL",
      stock: 8200,
      bloque: 500, // e.g., quality control hold
    },
    {
      grade: "Brisures",
      proprietaire: "Coopérative KAWA",
      stock: 300,
      bloque: 0,
    },
  ];

  // Aggregations
  const totalStock = stocks.reduce((acc, curr) => acc + curr.stock, 0);
  const totalBlocked = stocks.reduce((acc, curr) => acc + curr.bloque, 0);

  const byGrade = stocks.reduce((acc, curr) => {
    acc[curr.grade] = (acc[curr.grade] || 0) + curr.stock;
    return acc;
  }, {});

  const byOwner = stocks.reduce((acc, curr) => {
    acc[curr.proprietaire] = (acc[curr.proprietaire] || 0) + curr.stock;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Total Usine
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalStock.toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Café vert disponible
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock par Grade */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Stock par Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byGrade).map(([grade, qty]) => (
              <div
                key={grade}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium">{grade}</span>
                <span className="font-bold">{qty.toLocaleString()} kg</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stock par Propriétaire */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Stock par Propriétaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byOwner).map(([owner, qty]) => (
              <div
                key={owner}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium">{owner}</span>
                <span className="font-bold">{qty.toLocaleString()} kg</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Future: Historique / Evolution Chart can go here */}
      <Card className="shadow-none">
        <StockChart />
      </Card>
    </div>
  );
}
