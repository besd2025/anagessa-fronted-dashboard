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
import Filter from "../filter";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Link from "next/link";
import PaginationControls from "@/components/ui/pagination-controls";
import { fetchData } from "@/app/_utils/api";
import { Check } from "lucide-react";
import { UserContext } from "@/app/context/User_Context";
const RHData = [
  {
    id: "cultivator_001",
    cultivator: {
      cultivator_code: "2530-522-7545",
      first_name: "CultiNom",
      last_name: "CultiPrenom",
      image_url: "/images/logo_1.jpg",
    },
    cni: "74/565",
    ca: 78,
    ca_price: 7855,
    cb: 785,
    cb_price: 4544,
    qte_total: 555,
    total_price: 457,
  },
];
import { toast } from "sonner";
export default function Rejected() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterData, setFilterData] = React.useState({});
  const user = React.useContext(UserContext)
  const [data, setData] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search value
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const fetchDatas = React.useCallback(async () => {
    try {
      const response = await fetchData("get", `mais/mais_payments`, {
        params: {
          validation_state: "REJECTED",
          search: debouncedSearch,
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
          ...filterData
        }
      });
      const mappedData = response?.results?.map((item) => {
        const cultivateur = item?.achat?.cultivateur;
        const isPersonne = cultivateur?.cultivator_entity_type === "personne";
        return {
          id: item?.id,
          cultivator: {
            cultivator_id: cultivateur?.id,
            cultivator_code: cultivateur?.code,
            first_name: isPersonne
              ? cultivateur?.cultivator_first_name
              : cultivateur?.cultivator_assoc_name,
            last_name: isPersonne
              ? cultivateur?.cultivator_last_name
              : (cultivateur?.cultivator_assoc_rep_name ? `(Rep: ${cultivateur.cultivator_assoc_rep_name})` : ""),
            image_url: cultivateur?.cultivator_photo,
            nom_banque: cultivateur?.cultivator_bank_name,
            Numero_compte: cultivateur?.cultivator_bank_account,
          },
          cni: isPersonne ? cultivateur?.cultivator_cni : cultivateur?.cultivator_assoc_nif,
          ca: item?.achat?.quantite_grains_a,
          ca_price: (item?.achat?.quantite_grains_a || 0) * 2800,
          cb: item?.achat?.quantite_grains_b,
          cb_price: (item?.achat?.quantite_grains_b || 0) * 1400,
          qte_total: (item?.achat?.quantite_grains_a || 0) + (item?.achat?.quantite_grains_b || 0),
          total_price: (item?.achat?.quantite_grains_a || 0) * 2800 + (item?.achat?.quantite_grains_b || 0) * 1400,
        };
      });
      setData(mappedData);
      setTotalCount(response?.count || 0);
    } catch (err) {
      console.log(err);
    }
  }, [debouncedSearch, pagination.pageIndex, pagination.pageSize, filterData]);

  const handleFilter = (data) => {
    setFilterData(data);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const HandleValidate = async (id, cultivator_code) => {
    const promise = new Promise(async (resolve, reject) => {
      try {

        const response = await fetchData("patch", `/mais/mais_payments/${id}/`, {
          body: { validation_state: "VALIDATED" },
        });

        if (response.status === 200 || response.status === 201) {
          resolve({ id });
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "VALIDATION...",
      success: (datass) => {
        return `${cultivator_code} a été validé avec succès `;
      },
      error: "Donnée non validée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchDatas();
  }, [fetchDatas]);

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
              <Link href={`/anagessa-dashboard/cultivators/profile?id=${cultivator?.cultivator?.cultivator_id}`}>
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
              {(user?.session?.category === "Admin" || user?.session?.category === "Superviseur") && (
                <DropdownMenuItem>
                  <Button onClick={() => HandleValidate(cultivator?.id, cultivator.cultivator.cultivator_code)} variant="secondary" className="w-full  hover:text-secondary">
                    Valider
                  </Button>
                </DropdownMenuItem>
              )}
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
            cultivateur
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
      accessorKey: "nom_banque",
      header: "Nom de la banque",
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.original.cultivator.nom_banque}</div>
      ),
    },
    {
      accessorKey: "Numero_compte",
      header: "Numero_compte",
      cell: ({ row }) => (
        <div className="text-center font-semibold">{row.original.cultivator.Numero_compte}</div>
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
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full bg-sidebar rounded-lg">
      <div className="flex flex-col items-start justify-between gap-4 mb-4">
        <h1 className="text-xl font-semibold">
          Liste de paiement rejetté
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 w-full">
          <div className="relative w-full sm:w-[300px] lg:w-[380px]">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
            <Input
              placeholder="Rechercher..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              className="pl-10 shadow-none w-full rounded-lg bg-background border-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter handleFilter={handleFilter} />
            <ExportButton />
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
          <TableBody className="overflow-hidden">
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
        </div>
        <PaginationControls
          page={pagination.pageIndex + 1}
          pageSize={pagination.pageSize}
          totalItems={totalCount}
          totalPages={Math.ceil(totalCount / pagination.pageSize)}
          onPageChange={(pageNumber) => setPagination((prev) => ({ ...prev, pageIndex: pageNumber - 1 }))}
          onPageSizeChange={(size) => setPagination((prev) => ({ ...prev, pageSize: size, pageIndex: 0 }))}
          hasNextPage={pagination.pageIndex < Math.ceil(totalCount / pagination.pageSize) - 1}
          hasPreviousPage={pagination.pageIndex > 0}
        />
      </div>
    </div>
  );
}