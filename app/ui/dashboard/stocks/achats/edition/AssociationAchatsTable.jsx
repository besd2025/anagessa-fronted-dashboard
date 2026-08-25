"use client";
import React, { useState, useEffect, useMemo, useContext } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArchiveX, ArrowUpDownIcon, Check, MoreHorizontal, Search, Users, UserX, X } from "lucide-react";

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
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Link from "next/link";
import EditAssociationAchats from "./EditAssociationAchats";
import PaginationContent from "@/components/ui/pagination-content";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
import { fetchData } from "@/app/_utils/api";
import AssociationAchatsFilter from "./AssociationAchatsFilter";
import { UserContext } from "@/app/context/User_Context";
export default function AssociationAchatsTableEdition({
  isCultivatorsPage,
  externalData,
  datapagination,
  externalTotalCount,
  externalLimit,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [searchvalue, setSearchValue] = useState("");

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // Mode contrôlé (hangar detail) : utiliser les données externes du parent
  useEffect(() => {
    if (!isCultivatorsPage && externalData !== undefined) {
      setData(externalData || []);
      setTotalCount(externalTotalCount || 0);
      setLoading(false);
    }
  }, [externalData, externalTotalCount, isCultivatorsPage]);

  // Synchronisation de l'affichage avec la limite externe (cas Hangar)
  useEffect(() => {
    if (!isCultivatorsPage && externalLimit) {
      setPagination((prev) => ({ ...prev, pageSize: externalLimit }));
    }
  }, [externalLimit, isCultivatorsPage]);

  // Mode autonome (page achats) : fetch propre
  useEffect(() => {
    if (!isCultivatorsPage) return;
    const getAchatsAssociation = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          "mais/achat_mais/get_achat_associations/",
          {
            params: {
              limit: limit,
              offset: pointer,
              ...filterData,
              search: searchvalue,
            },
          },
        );

        const formattedData = response?.results?.map((achat) => ({
          id: achat?.id,
          cultivator: {
            cultivator_code: achat?.cultivateur?.cultivator_code,
            image_url: achat?.cultivateur?.cultivator_photo,
            cultivator_assoc_name: achat?.cultivateur?.cultivator_assoc_name,
            cultivator_assoc_rep_name:
              achat?.cultivateur?.cultivator_assoc_rep_name,
            cultivator_type: "association",
          },
          sdl_ct: achat?.responsable?.sdl_ct?.hangar?.sdl_nom
            ? "hangar " + achat.responsable.sdl_ct.hangar.sdl_nom
            : "Hangar " + achat?.responsable?.sdl_ct?.Hangar?.ct_nom,
          society:
            achat?.responsable?.sdl_ct?.hangar?.societe?.nom_societe ||
            achat?.responsable?.sdl_ct?.Hangar?.hangar?.societe?.nom_societe,
          localite: {
            province:
              achat?.cultivateur?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name || "N/A",
            commune:
              achat?.cultivateur?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name || "N/A",
          },
          num_fiche: achat?.numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          num_page: achat?.numero_page,
          photo_fiche: achat?.photo_fiche,
          ca: achat?.quantite_grains_a || 0,
          cb: achat?.quantite_grains_b || 0,
          date: achat?.date_achat || "N/A",
        }));
        setData(formattedData || []);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error("Error fetching association achats:", error);
      } finally {
        setLoading(false);
      }
    };

    getAchatsAssociation();
  }, [limit, pointer, filterData, searchvalue, isCultivatorsPage]);



  const HandleDelete = async (id, name) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("delete", `/mais/achat_mais/${id}/`, {
          params: {},
          additionalHeaders: {},
        });
        if (results) {
          resolve({ name });
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "Suppression...",
      success: (data) => {
        setTimeout(() => setOpen(false), 500);
        return `L'achat de ${data.name} a été supprimé avec succès`;
      },
      error: "Erreur lors de la suppression",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "actions",
        enableHiding: false,
        header: "Actions",
        cell: ({ row }) => {
          const user = useContext(UserContext)
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
                {/* Profile link might need adjustment if associations have different profile pages */}
                <Link
                  href={`/anagessa-dashboard/cultivators/profile?id=${cultivator.cultivator.cultivator_id}`}
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                {/* {user?.session?.category === "Admin" ? (
                  <div>
                    <EditAssociationAchats
                      id={cultivator?.id}
                      cultivator={cultivator.cultivator}
                      num_fiche={cultivator.num_fiche}
                      num_recu={cultivator.num_recu}
                      ca={cultivator.ca}
                      cb={cultivator.cb}
                      date={cultivator.date}
                      photo_fiche={cultivator.photo_fiche}
                    />
                    <DropdownMenuItem
                      onSelect={() => HandleDelete(cultivator?.id, cultivator?.cultivator?.cultivator_code)}
                      className="text-destructive"
                    >
                      <ArchiveX className="text-destructive" /> Delete
                    </DropdownMenuItem>
                  </div>
                ) : (
                  " "
                )} */}
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Association / Coopérative
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => {
          const cultivators = row.original.cultivator;
          return (
            <div className="flex items-center gap-3">
              <ViewImageDialog
                imageUrl={cultivators?.image_url}
                alt={cultivators?.cultivator_assoc_name}
              />
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {cultivators?.cultivator_assoc_name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  Rep: {cultivators?.cultivator_assoc_rep_name}
                </span>
              </div>
            </div>
          );
        },
      },
      ...(isCultivatorsPage
        ? [
          {
            accessorKey: "sdl_ct",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Hangar
                  <ArrowUpDownIcon />
                </Button>
              );
            },
            cell: ({ row }) => <div>{row.getValue("sdl_ct")}</div>,
          },
          {
            accessorKey: "society",
            header: ({ column }) => {
              return (
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Société
                  <ArrowUpDownIcon />
                </Button>
              );
            },
            cell: ({ row }) => (
              <div className="font-medium">{row.getValue("society")}</div>
            ),
          },
        ]
        : []),
      {
        id: "localite",
        header: "Localité",
        cell: ({ row }) => {
          const localite = row.original.localite;
          return (
            <div className="text-sm">
              {localite?.commune}, {localite?.province}
            </div>
          );
        },
      },
      {
        accessorKey: "num_fiche",
        header: "No Fiche",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("num_fiche")}
          </div>
        ),
      },
      {
        accessorKey: "num_recu",
        header: "No Recus",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("num_recu")}
          </div>
        ),
      },
      {
        accessorKey: "ca",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CA
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center font-semibold">{row.getValue("ca")}</div>
        ),
      },
      {
        accessorKey: "cb",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              CB
              <ArrowUpDownIcon />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="text-center font-semibold">{row.getValue("cb")}</div>
        ),
      },
      {
        accessorKey: "photo_fiche",
        header: "Fiche",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            <ViewImageDialog
              imageUrl={row.getValue("photo_fiche")}
              alt={`photo_fiche`}
              profile={false}
            />
          </div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("date")}
          </div>
        ),
      },
      {
        accessorKey: "approuver",
        header: "Approuver",
        cell: ({ row }) => (
          <div className="text-center font-semibold flex items-center gap-2">
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-green-500/20">
              <Check className="text-green-500" size={20} />
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20">
              <X className="text-red-500" size={20} />
            </Button>
          </div>
        ),
      },
    ],
    [isCultivatorsPage],
  );

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

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
    setPagination((prev) => ({ ...prev, pageIndex: pageNumber - 1 }));
  };
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
    setPagination((prev) => ({ ...prev, pageSize: newLimit, pageIndex: 0 }));
  };

  const handleFilter = (filters) => {
    const formattedFilterData = {
      date_achat_min: filters.dateAchatFrom,
      date_achat_max: filters.dateAchatTo,
      enregistrement_min: filters.dateDebutEnregistre,
      enregistrement_max: filters.dateFinEnregistre,
      quantite_a_min: filters.qteMinCA,
      quantite_a_max: filters.qteMaxCA,
      quantite_b_min: filters.qteMinCB,
      quantite_b_max: filters.qteMaxCB,
      province: filters.province,
      commune: filters.commune,
      zone: filters.zone,
      colline: filters.colline,
    };
    setFilterData(formattedFilterData);
    setPointer(0);
    setCurrentPage(1);
  };



  return (
    <div className="w-full bg-sidebar rounded-lg p-2">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
          <Input
            placeholder="Rechercher..."
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <AssociationAchatsFilter handleFilter={handleFilter} />
          </div>

        </div>
      </div>
      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="sticky top-0 bg-background z-10 hover:bg-background"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={
                      header.column.id === "approuver"
                        ? "sticky right-0 bg-background z-20"
                        : ""
                    }
                  >
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
            {loading ? (
              <TableRowsSkeleton columns={columns.length} rows={limit} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "approuver"
                          ? "sticky right-0 bg-background"
                          : ""
                      }
                    >
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
        {/* Mode hangar : pagination du parent. Mode autonome : pagination interne */}
        {!isCultivatorsPage && datapagination ? (
          <PaginationContent
            datapaginationlimit={() => { }}
            currentPage={datapagination.currentPage}
            totalPages={datapagination.totalPages}
            onPageChange={datapagination.onPageChange}
            pointer={datapagination.pointer}
            totalCount={datapagination.totalCount}
            onLimitChange={datapagination.onLimitChange}
            limit={datapagination.limit}
          />
        ) : (
          <PaginationContent
            datapaginationlimit={(l) => {
              setLimit(l);
              setPointer(0);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalPages={Math.ceil(totalCount / limit)}
            onPageChange={onPageChange}
            pointer={pointer}
            totalCount={totalCount}
            onLimitChange={onLimitChange}
            limit={limit}
          />
        )}
      </div>
    </div>
  );
}
