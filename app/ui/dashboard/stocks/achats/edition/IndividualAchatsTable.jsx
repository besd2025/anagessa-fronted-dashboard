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
import { ArchiveX, ArrowUpDownIcon, Check, MoreHorizontal, Search, User, UserX, X } from "lucide-react";

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
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Link from "next/link";
import EditIndividualAchats from "./EditIndividualAchats";
import PaginationContent from "@/components/ui/pagination-content";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
import { fetchData } from "@/app/_utils/api";
import IndividualAchatsFilter from "./IndividualAchatsFilter";
import UserContent from "@/app/context/User_Context";
import { UserContext } from "@/app/context/User_Context";
import { toast } from "sonner";
export default function IndividualAchatsTableEdition({
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
  const [open, setOpen] = useState(false);
  const [processedIds, setProcessedIds] = useState(new Set());
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: limit,
  });
  const user = useContext(UserContext)
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
    const getAchats = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "mais/achat_modification/", {
          params: {
            limit: limit,
            offset: pointer,
            ...filterData,
            search: searchvalue,
          },
        });
        const formattedData = response?.results?.map((achat) => ({
          id: achat?.id,
          achat_id: achat?.achat?.id,
          in_payment: achat?.achat?.in_payment,
          responsable_id: achat?.achat?.responsable?.unique_code,
          cultivator: {
            cultivator_id: achat?.achat?.cultivateur?.id,
            cultivator_code: achat?.achat?.cultivateur?.cultivator_code,
            first_name: achat?.achat?.cultivateur?.cultivator_first_name,
            last_name: achat?.achat?.cultivateur?.cultivator_last_name,
            image_url: achat?.achat?.cultivateur?.cultivator_photo,
            cultivator_type: "personel",
          },
          sdl_ct: achat?.achat?.responsable?.sdl_ct?.hangar?.sdl_nom
            ? "hangar " + achat.achat?.responsable.sdl_ct.hangar.sdl_nom
            : "Hangar " + achat?.achat?.responsable?.sdl_ct?.Hangar?.ct_nom,
          society:
            achat?.achat?.responsable?.sdl_ct?.hangar?.societe?.nom_societe ||
            achat?.achat?.responsable?.sdl_ct?.Hangar?.hangar?.societe?.nom_societe,
          localite: {
            province:
              achat?.achat?.cultivateur?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name || "N/A",
            commune:
              achat?.achat?.cultivateur?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name || "N/A",
          },
          num_fiche: achat?.achat?.cultivateur?.cultivator_assoc_numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          photo_fiche: achat?.achat?.photo_fiche,
          num_page: achat?.numero_page,
          ca: achat?.quantite_grains_a || 0,
          cb: achat?.quantite_grains_b || 0,
          date: achat?.achat?.date_achat || "N/A",
        }));

        setData(formattedData || []);
        setTotalCount(response?.count || 0);
      } catch (error) {
        console.error("Error fetching individual achats:", error);
      } finally {
        setLoading(false);
      }
    };

    getAchats();
  }, [limit, pointer, filterData, searchvalue, isCultivatorsPage]);


  const HandleDelete = async (id, code) => {

    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchData(
          "delete",
          `/mais/achat_mais/${id}/`,
          {
            params: {},
            additionalHeaders: {},

          },
        );
        resolve({ code: code || 'Le cultivateur' });
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "SUPPRESSION...",
      success: (data) => {
        setTimeout(() => window.location.reload(), 1000);
        return `${data.code} a été supprimé avec succès `;
      },
      error: "Donnée non supprimée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const HandleApprove = async (id, achat_id, num_recu, num_page, ca, cb, responsable_id, cultivator_code) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const formdata = {
          id: id,
          numero_page: num_page,
          numero_recu: num_recu,
          quantite_grains_a: ca,
          quantite_grains_b: cb,
          responsable_code: responsable_id,
          cultivateur_code: cultivator_code
        }
        const results = await fetchData("patch", `/mais/achat_mais/${achat_id}/`, {
          body: formdata,
        });

        if (results.status === 200 || results.status === 201) {
          const response = await fetchData("patch", `/mais/achat_modification/${id}/`, {
            body: { status: "VALIDATED" },
          });

          if (response.status === 200 || response.status === 201) {
            resolve({ cultivator_code });
          } else {
            reject(new Error("Erreur"));
          }
        } else {
          reject(new Error("Erreur"));
        }
      } catch (error) {
        reject(error);
      }
    });

    toast.promise(promise, {
      loading: "MODIFICATION...",
      success: (data) => {
        setProcessedIds((prev) => new Set(prev).add(id));
        setTimeout(() => setOpen(false), 1000);
        return `${cultivator_code} a été modifié avec succès `;
      },
      error: "Donnée non modifiée",
    });

    try {
      await promise;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const HandleReject = async (id, cultivator_code) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetchData("patch", `/mais/achat_modification/${id}/`, {
          body: { status: "REJECTED" },
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
      loading: "REJET ...",
      success: (data) => {
        setProcessedIds((prev) => new Set(prev).add(id));
        setTimeout(() => setOpen(false), 1000);
        return `${cultivator_code} a été rejeté avec succès `;
      },
      error: "Donnée non rejetée",
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
                <Link
                  href={`/anagessa-dashboard/cultivators/profile?id=${cultivator.cultivator.cultivator_id}`}
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                {/* {user?.session?.category === "Admin" ? (
                  <div>
                    <EditIndividualAchats
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
              cultivateur
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
                alt={`${cultivators?.last_name ?? ""} ${cultivators?.first_name ?? ""}`}
              />
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {`${cultivators?.last_name ?? ""} ${cultivators?.first_name ?? ""}`}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {cultivators?.cultivator_code}
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
            {processedIds.has(row.original.id) ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
                <Check size={12} /> Traité
              </span>
            ) : (
              row.original?.in_payment ? (
                <Button onClick={() => HandleReject(row.original.id, row.original.cultivator.cultivator_code)} variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20">
                  <X className="text-red-500" size={20} />
                </Button>
              ) : (
                <>
                  <Button onClick={() => HandleApprove(row.original.id, row.original.achat_id, row.original.num_recu, row.original?.num_page, row.original?.ca, row.original?.cb, row?.original?.responsable_id, row?.original?.cultivator?.cultivator_code)} variant="ghost" className="h-8 w-8 p-0 hover:bg-green-500/20">
                    <Check className="text-green-500" size={20} />
                  </Button>
                  <Button onClick={() => HandleReject(row.original.id, row.original.cultivator.cultivator_code)} variant="ghost" className="h-8 w-8 p-0 hover:bg-red-500/20">
                    <X className="text-red-500" size={20} />
                  </Button>
                </>
              ))}
          </div>
        ),
      },
    ],
    [isCultivatorsPage, processedIds],
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
            <IndividualAchatsFilter handleFilter={handleFilter} />
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
