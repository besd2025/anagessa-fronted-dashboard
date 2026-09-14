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
import { Progress } from "@/components/ui/progress";
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

export default function Production({ data = [] }) {
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
        grade: "Maïs blanc",
        proprietaire: "Coopérative KAWA",
        lot: "LOT-24-001",
        quantite: 2500,
      },
      {
        id: 2,
        grade: "Maïs blanc",
        proprietaire: "Coopérative KAWA",
        lot: "LOT-24-001",
        quantite: 1500,
      },
      {
        id: 3,
        grade: "Maïs jaune",
        proprietaire: "Coopérative KAWA",
        lot: "LOT-24-001",
        quantite: 500,
      },
      {
        id: 4,
        grade: "Maïs blanc",
        proprietaire: "SOGESTAL",
        lot: "LOT-24-002",
        quantite: 1200,
      },
      {
        id: 5,
        grade: "Brisures",
        proprietaire: "SOGESTAL",
        lot: "LOT-24-002",
        quantite: 300,
      },
    ],
    [],
  );

  const tableData = data.length > 0 ? data : defaultData;

  // Columns definition
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "proprietaire",
        header: "Propriétaire",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      },
      {
        accessorKey: "lot",
        header: "Lot",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "grade",
        header: "Grade",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "quantite",
        header: "Quantité (kg)",
        cell: (info) => (
          <div className="text-right font-mono">
            {info.getValue().toLocaleString()}
          </div>
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

  // Aggregations (using full dataset)
  const totalProduction = tableData.reduce(
    (acc, curr) => acc + curr.quantite,
    0,
  );

  const byGrade = tableData.reduce((acc, curr) => {
    acc[curr.grade] = (acc[curr.grade] || 0) + curr.quantite;
    return acc;
  }, {});

  const byLot = tableData.reduce((acc, curr) => {
    acc[curr.lot] = (acc[curr.lot] || 0) + curr.quantite;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Total Production */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="col-span-1 lg:col-span-4 bg-secondary/10 border-none">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-medium">Total Production Usine</h3>
              <p className="text-muted-foreground">Café vert produit</p>
            </div>
            <div className="text-4xl font-bold text-primary">
              {totalProduction.toLocaleString()}{" "}
              <span className="text-lg text-muted-foreground">kg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production par Grade */}
        <Card>
          <CardHeader>
            <CardTitle>Production par Grade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byGrade).map(([grade, qty]) => {
              const percentage = (qty / totalProduction) * 100;
              return (
                <div key={grade} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{grade}</span>
                    <span className="text-muted-foreground">
                      {qty.toLocaleString()} kg ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Production par Lot */}
        <Card>
          <CardHeader>
            <CardTitle>Production par Lot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(byLot).map(([lot, qty]) => (
              <div
                key={lot}
                className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
              >
                <span className="font-medium">{lot}</span>
                <span className="font-bold">{qty.toLocaleString()} kg</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed List */}
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
