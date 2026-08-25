"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ExportButton from "@/components/ui/export_button";
import Filter from "./filter";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Link from "next/link";
import PaginationControls from "@/components/ui/pagination-controls";

export default function RHlist({ data }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const cultivator = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-muted-foreground font-normal">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    cultivator.cultivator.cultivator_code,
                  )
                }
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/odeca-dashboard/cultivators/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "cultivator",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cafeiculteur
            <ArrowUpDownIcon />
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const cultivator = row.original.cultivator;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return (
          cultivator.first_name.toLowerCase().includes(search) ||
          cultivator.last_name.toLowerCase().includes(search) ||
          cultivator.cultivator_code.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => {
        const cultivators = row.original.cultivator;
        return (
          <div className="flex items-center gap-3">
            <ViewImageDialog
              imageUrl={cultivators.image_url}
              alt={`${cultivators.last_name} ${cultivators.first_name}`}
            />
            <div>
              <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                {cultivators.last_name} {cultivators.first_name}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {cultivators.cultivator_code}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "cni",
      header: "CNI",
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue("cni")}</div>
      ),
    },
    {
      accessorKey: "ca",
      header: "CA",
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue("ca")} Kg</div>
      ),
    },
    {
      accessorKey: "ca_price",
      header: "Prix CA",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("ca_price")} Fbu
        </div>
      ),
    },
    {
      accessorKey: "cb",
      header: "CB",
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.getValue("cb")} Kg</div>
      ),
    },
    {
      accessorKey: "cb_price",
      header: "Prix CB",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("cb_price")} Fbu
        </div>
      ),
    },
    {
      accessorKey: "qte_total",
      header: "Qte TOTAL",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("qte_total")} Kg
        </div>
      ),
    },
    {
      accessorKey: "total_price",
      header: "Prix TOTAL",
      cell: ({ row }) => (
        <div className="text-center font-semibold">
          {row.getValue("total_price")} Fbu
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={table.getColumn("cultivator")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("cultivator")?.setFilterValue(event.target.value)
            }
            className="pl-10 flex-1  shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <Filter />
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <ExportButton
            //   onClickExportButton={exportCultivatorsToExcel}
            //   onClickDownloadButton={DownloadCultivatorsToExcel}
            //   loading={loadingEportBtn}
            //   activedownloadBtn={activedownloadBtn}
            />
          </div>
        </div>
      </div>
      <div className="grid w-full [&>div]:border [&>div]:rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className=" sticky top-0 bg-background z-10 hover:bg-background"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
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
          {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected. */}
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
  );
}
