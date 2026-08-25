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
import { AlertTriangle, TrendingDown, TrendingUp, Search } from "lucide-react";
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

export default function Usinage({ data = [] }) {
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
        lot: "LOT-24-001",
        entree: 5000,
        sortie: 4200,
        pertes: 800,
        rendement: 84,
        statut: "Terminé",
      },
      {
        id: 2,
        lot: "LOT-24-002",
        entree: 3200,
        sortie: 2500,
        pertes: 700,
        rendement: 78,
        statut: "En cours",
      },
      {
        id: 3,
        lot: "LOT-24-003",
        entree: 1000,
        sortie: 850,
        pertes: 150,
        rendement: 85,
        statut: "Terminé",
      },
    ],
    [],
  );

  const tableData = data.length > 0 ? data : defaultData;

  // Columns definition
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "lot",
        header: "Lot",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "entree",
        header: "Entrée (kg)",
        cell: (info) => info.getValue().toLocaleString(),
      },
      {
        accessorKey: "sortie",
        header: "Sortie (kg)",
        cell: (info) => info.getValue().toLocaleString(),
      },
      {
        accessorKey: "pertes",
        header: "Pertes (kg)",
        cell: (info) => (
          <span className="text-red-500">
            {info.getValue().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "rendement",
        header: "Rendement",
        cell: (info) => (
          <span
            className={
              info.getValue() < 80
                ? "text-red-500 font-bold"
                : "text-green-600 font-bold"
            }
          >
            {info.getValue()}%
          </span>
        ),
      },
      {
        accessorKey: "statut",
        header: "Statut",
        cell: (info) => (
          <Badge
            variant={info.getValue() === "Terminé" ? "success" : "warning"}
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

  // Calculations
  const completedOps = tableData.filter((op) => op.statut === "Terminé");
  const avgRendement =
    completedOps.reduce((acc, curr) => acc + curr.rendement, 0) /
    (completedOps.length || 1);
  const avgPertes =
    completedOps.reduce((acc, curr) => acc + curr.pertes, 0) /
    (completedOps.length || 1);

  const lowRendementOps = tableData.filter((op) => op.rendement < 80);
  const activeOps = tableData.filter((op) => op.statut !== "Terminé");

  return (
    <div className="space-y-6">
      {/* Averages and Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rendement Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-2xl font-bold">
                {avgRendement.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Sur les lots terminés
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pertes Moyennes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-2xl font-bold">
                {avgPertes.toFixed(0)} kg
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Par lot terminé</p>
          </CardContent>
        </Card>

        {/* <Card
          className={
            lowRendementOps.length > 0 ? "border-red-500/50 bg-red-50/10" : ""
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Rendement Anormal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  lowRendementOps.length > 0 ? "text-red-500" : "text-gray-400"
                }`}
              />
              <div className="text-2xl font-bold">{lowRendementOps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              Lots &lt; 80% rendement
            </p>
          </CardContent>
        </Card> */}

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Lots Non Clôturés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{activeOps.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">
              En cours de traitement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List Section */}
      <div className="w-full bg-sidebar p-2 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
            <Input
              placeholder="Rechercher par lot..."
              value={table.getColumn("lot")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("lot")?.setFilterValue(event.target.value)
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
