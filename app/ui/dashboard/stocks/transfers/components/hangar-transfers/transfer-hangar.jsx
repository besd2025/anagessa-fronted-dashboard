"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDownIcon,
  MoreHorizontal,
  Search,
  ReceiptText,
  CheckCircle2,
  Clock,
  Building2,
  Factory,
} from "lucide-react";
import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import ViewImageDialog from "@/components/ui/view-image-dialog";
import PaginationContent from "@/components/ui/pagination-content";
import DetailsTransfer from "./details-transfer";
import { UserContext } from "@/app/context/User_Context";
import { toast } from "sonner";

export default function TransferSdlDep({
  data = [],
  datapagination,
  search: externalSearchHandler,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchValue, setSearchValue] = useState("");
  const user = React.useContext(UserContext);

  // Details Modal state
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Local pagination fallback
  const [currentPage, setCurrentPage] = useState(1);
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(10);

  const totalCount = datapagination?.totalCount ?? data.length;
  const resolvedTotalPages =
    datapagination?.totalPages ?? Math.ceil(totalCount / limit);
  const resolvedCurrentPage = datapagination?.currentPage ?? currentPage;
  const resolvedPointer = datapagination?.pointer ?? pointer;
  const resolvedLimit = datapagination?.limit ?? limit;

  const onPageChange = (page) => {
    if (datapagination?.onPageChange) {
      datapagination.onPageChange(page);
    } else {
      setCurrentPage(page);
      setPointer((page - 1) * limit);
    }
  };

  const onLimitChange = (newLimit) => {
    if (datapagination?.onLimitChange) {
      datapagination.onLimitChange(newLimit);
    } else {
      setLimit(newLimit);
      setPointer(0);
      setCurrentPage(1);
    }
  };

  const paginatedData = data;

  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Action",
      cell: ({ row }) => {
        const transfer = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTransfer(transfer);
                  setDetailsOpen(true);
                }}
                className="cursor-pointer gap-2 font-medium"
              >
                <span>Détails</span>
              </DropdownMenuItem>
              {/* Add more actions if needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "sdl_source",
      accessorFn: (row) => row.from_sdl || row.hangar?.sdl_nom || "-",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

        >
          hangar Source
          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-foreground">
          {row.getValue("sdl_source")}
        </div>
      ),
    },
    {
      id: "usine_deparchage",
      accessorFn: (row) =>
        row.usine_deparchage?.usine_name ||
        row.usine_deparchage ||
        row.usine?.name ||
        row.usine ||
        "-",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

        >
          Usine de Déparchage
          <ArrowUpDownIcon className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          {row.getValue("usine_deparchage")}
        </div>
      ),
    },
    {
      id: "transfer_date",
      accessorFn: (row) =>
        row.transfer_date || row.date_transfert || row.date || "-",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

          >
            Date Transfert
            <ArrowUpDownIcon className="ml-1 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center font-medium text-foreground text-sm">
          {row.getValue("transfer_date")}
        </div>
      ),
    },
    {
      id: "enregitrement_date",
      accessorFn: (row) =>
        row.enregitrement_date ||
        row.date_enregistrement ||
        row.enregistrement_date ||
        row.created_at ||
        "-",
      header: ({ column }) => (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}

          >
            Date d'Enregistrement
            <ArrowUpDownIcon className="ml-1 h-3 w-3" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center text-xs text-muted-foreground font-medium">
          {row.getValue("enregitrement_date")}
        </div>
      ),
    },
    {
      id: "photo_bordereau",
      header: () => <div >Photo Bordereau</div>,
      cell: ({ row }) => {
        const photo =
          row.original.photo_bordereau || row.original.photo_fiche || null;
        return (
          <div className="flex justify-center items-center">
            {photo ? (
              <ViewImageDialog
                imageUrl={photo}
                alt="Photo bordereau"
                profile={false}
                className="h-8 w-8 rounded-md border shadow-xs hover:opacity-85 transition-opacity"
              />
            ) : (
              <span className="text-xs text-muted-foreground italic">-</span>
            )}
          </div>
        );
      },
    },
    {
      id: "status",
      header: () => <div >Statut</div>,
      cell: ({ row }) => {
        const isConfirmed =
          row.original.est_confirme === true ||
          row.original.status === true ||
          row.original.status === "CONFIRME" ||
          row.original.status === "CONFIRMEE" ||
          row.original.comfirmation_status === "CONFIRMEE";

        return (
          <div className="flex justify-center">
            {isConfirmed ? (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Confirmé
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Non confirmé
              </Badge>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: paginatedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    manualPagination: true,
  });

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    if (typeof externalSearchHandler === "function") {
      externalSearchHandler(val);
    } else {
      table.getColumn("sdl_source")?.setFilterValue(val);
    }
  };

  return (
    <div className="w-full bg-sidebar rounded-lg space-y-4">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full md:w-auto">
          <Search className="h-4 w-4 absolute inset-y-0 my-auto left-3 text-muted-foreground" />
          <Input
            placeholder="Rechercher par hangar, usine..."
            value={searchValue}
            onChange={handleSearchInputChange}
            className="pl-9 w-full md:w-[320px] lg:w-[380px] bg-background shadow-xs rounded-lg border-border"
          />
        </div>
      </div>

      {/* Table */}
      <div className="grid w-full [&>div]:border [&>div]:rounded-lg [&>div]:overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 bg-background z-10 hover:bg-background/80"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground text-sm font-medium"
                >
                  Aucun transfert trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pt-2">
        <PaginationContent
          datapaginationlimit={onLimitChange}
          currentPage={resolvedCurrentPage}
          totalPages={resolvedTotalPages}
          onPageChange={onPageChange}
          pointer={resolvedPointer}
          totalCount={totalCount}
          onLimitChange={onLimitChange}
          limit={resolvedLimit}
        />
      </div>

      {/* Details Dialog Component */}
      <DetailsTransfer
        transfer={selectedTransfer}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}
