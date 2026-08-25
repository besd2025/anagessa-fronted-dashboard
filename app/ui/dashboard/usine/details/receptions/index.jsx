"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationControls from "@/components/ui/pagination-controls";

export default function Receptions({ data = [] }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Mock data handling
  const defaultData = React.useMemo(
    () => [
      {
        id: 1,
        date: "2024-05-15",
        proprietaire: "Coopérative KAWA",
        categorie: "grains MaÃ¯s blanc",
        quantite: 5000,
        lot: "LOT-24-001",
        statut: "Validé",
      },
      {
        id: 2,
        date: "2024-05-16",
        proprietaire: "SOGESTAL",
        categorie: "grains MaÃ¯s jaune",
        quantite: 3200,
        lot: "LOT-24-002",
        statut: "En attente",
      },
      {
        id: 3,
        date: "2024-05-18",
        proprietaire: "Coopérative KAWA",
        categorie: "Parche",
        quantite: 1500,
        lot: "LOT-24-003",
        statut: "Validé",
      },
    ],
    [],
  );

  const tableData = data.length > 0 ? data : defaultData;

  // Columns definition
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "proprietaire",
        header: "Propriétaire",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "categorie",
        header: "Catégorie",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "quantite",
        header: "Quantité (kg)",
        cell: (info) => info.getValue().toLocaleString(),
      },
      {
        accessorKey: "lot",
        header: "Lot",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: (info) => (
          <Badge
            variant={info.getValue() === "Validé" ? "success" : "secondary"}
          >
            {info.getValue()}
          </Badge>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // Calculations for Totals (using full dataset)
  const totalByCategorie = React.useMemo(() => {
    return tableData.reduce((acc, curr) => {
      acc[curr.categorie] = (acc[curr.categorie] || 0) + curr.quantite;
      return acc;
    }, {});
  }, [tableData]);

  const totalByProprietaire = React.useMemo(() => {
    return tableData.reduce((acc, curr) => {
      acc[curr.proprietaire] = (acc[curr.proprietaire] || 0) + curr.quantite;
      return acc;
    }, {});
  }, [tableData]);

  const totalPeriode = React.useMemo(() => {
    return tableData.reduce((acc, curr) => acc + curr.quantite, 0);
  }, [tableData]);

  return (
    <div className="space-y-6">
      {/* Totals Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-none">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium">Total Période</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPeriode.toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">
              Toutes catégories confondues
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="">
            <CardTitle className="text-sm font-medium">Par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(totalByCategorie).map(([cat, qty]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{cat}:</span>
                  <span className="font-semibold">
                    {qty.toLocaleString()} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Par Propriétaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(totalByProprietaire).map(([prop, qty]) => (
                <div key={prop} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{prop}:</span>
                  <span className="font-semibold">
                    {qty.toLocaleString()} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
            <Input
              placeholder="Rechercher par propriétaire..."
              value={table.getColumn("proprietaire")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table
                  .getColumn("proprietaire")
                  ?.setFilterValue(event.target.value)
              }
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>
        </div>

        <div className="grid w-full [&>div]:border [&>div]:rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="sticky top-0 bg-background z-10 hover:bg-background"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Pas de donneés
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <PaginationControls
            page={table.getState().pagination.pageIndex + 1}
            pageSize={table.getState().pagination.pageSize}
            totalItems={table.getFilteredRowModel().rows.length}
            totalPages={table.getPageCount()}
            onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
            hasNextPage={table.getCanNextPage()}
            hasPreviousPage={table.getCanPreviousPage()}
          />
        </div>
      </div>
    </div>
  );
}
