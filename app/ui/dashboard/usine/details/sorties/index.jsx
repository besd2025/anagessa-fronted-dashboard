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
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, truck, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PaginationControls from "@/components/ui/pagination-controls";

export default function Sorties({ data = [] }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Mock data
  const defaultData = React.useMemo(
    () => [
      {
        id: 1,
        date: "2024-05-20",
        proprietaire: "Coopérative KAWA",
        grade: "MaÃ¯s blanc",
        quantite: 5000,
        motif: "Vente",
        destination: "Client X (Belgique)",
      },
      {
        id: 2,
        date: "2024-05-21",
        proprietaire: "SOGESTAL",
        grade: "Brisures",
        quantite: 200,
        motif: "Rebut",
        destination: "Décharge",
      },
      {
        id: 3,
        date: "2024-05-22",
        proprietaire: "Coopérative KAWA",
        grade: "MaÃ¯s blanc",
        quantite: 12000, // Potential alert if this exceeds stock logic, but for now just data
        motif: "Transfert",
        destination: "", // Missing destination
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
        accessorKey: "grade",
        header: "Grade",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "quantite",
        header: "Quantité (kg)",
        cell: (info) => info.getValue().toLocaleString(),
      },
      {
        accessorKey: "motif",
        header: "Motif",
        cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
      },
      {
        accessorKey: "destination",
        header: "Destination",
        cell: (info) => (
          <span className={!info.getValue() ? "text-yellow-600 italic" : ""}>
            {info.getValue() || "Non spécifié"}
          </span>
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

  // Aggregations
  const totalSorti = tableData.reduce((acc, curr) => acc + curr.quantite, 0);

  const byMotif = tableData.reduce((acc, curr) => {
    acc[curr.motif] = (acc[curr.motif] || 0) + curr.quantite;
    return acc;
  }, {});

  const byDestination = tableData.reduce((acc, curr) => {
    const dest = curr.destination || "Sans Destination";
    acc[dest] = (acc[dest] || 0) + curr.quantite;
    return acc;
  }, {});

  const alertsNoDest = tableData.filter((s) => !s.destination).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sorti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSorti.toLocaleString()} kg
            </div>
            <p className="text-xs text-muted-foreground">Période actuelle</p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Motifs Principaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {Object.entries(byMotif)
                .slice(0, 2)
                .map(([motif, qty]) => (
                  <div key={motif} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{motif}</span>
                    <span className="font-semibold">
                      {qty.toLocaleString()} kg
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* <Card
          className={
            alertsNoDest > 0 ? "border-yellow-500/50 bg-yellow-50/10" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Sans Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  alertsNoDest > 0 ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <div className="text-2xl font-bold">{alertsNoDest}</div>
            </div>
            <p className="text-xs text-muted-foreground">Alertes logistiques</p>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                Object.keys(byDestination).filter(
                  (k) => k !== "Sans Destination"
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Clients/Mags distincts
            </p>
          </CardContent>
        </Card> */}
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
