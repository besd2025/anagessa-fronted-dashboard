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
import { ArchiveX, ArrowUpDownIcon, MoreHorizontal, Search, User, UserX } from "lucide-react";

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
export default function IndividualAchatsTable({
  isCultivatorsPage,
  externalData,
  datapagination,
  externalTotalCount,
  externalLimit,
  externalExportFn,
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
        const params = {
          limit: limit,
          offset: pointer,
          search: searchvalue,
        };
        if (filterData) {
          if (filterData.province) params.province = filterData.province;
          if (filterData.commune) params.commune = filterData.commune;
          if (filterData.zone) params.zone = filterData.zone;
          if (filterData.QtMin) params.quantite_min = filterData.QtMin;
          if (filterData.QtMax) params.quantite_max = filterData.QtMax;
          if (filterData.dateSortie) params.date_achat = filterData.dateSortie;
          if (filterData.dateFrom) params.date_achat_min = filterData.dateFrom;
          if (filterData.dateTo) params.date_achat_max = filterData.dateTo;
        }
        const response = await fetchData("get", "/achats/", {
          params,
        });
        const formattedData = response?.results?.map((achat) => ({
          id: achat?.id,
          responsable_id: achat?.collector?.unique_code || achat?.responsable?.unique_code,
          cultivator: {
            cultivator_id: achat?.cultivator?.id || achat?.cultivateur?.id,
            cultivator_code: achat?.cultivator?.cultivator_code || achat?.cultivateur?.cultivator_code,
            first_name: achat?.cultivator?.cultivator_first_name || achat?.cultivateur?.first_name,
            last_name: achat?.cultivator?.cultivator_last_name || achat?.cultivateur?.last_name,
            image_url: achat?.cultivator?.photo || achat?.cultivateur?.photo,
            cultivator_type: "personel",
          },
          sdl_ct: achat?.collector?.hangar?.hangar_name || achat?.hangar_name || "Hangar",
          localite: {
            province: achat?.collector?.hangar?.province || achat?.province || "N/A",
            commune: achat?.collector?.hangar?.commune || achat?.commune || "N/A",
            zone: achat?.collector?.hangar?.zone || achat?.zone || "N/A",
          },
          in_payment: achat?.in_payment,
          num_fiche: achat?.numero_fiche || "0",
          num_recu: achat?.numero_recu || "N/A",
          num_page: achat?.numero_page || "N/A",
          photo_fiche: achat?.photo_fiche,
          ca: achat?.quantity_blanc || achat?.quantite_blanc || 0,
          cb: achat?.quantity_jaune || achat?.quantite_jaune || 0,
          date: achat?.date_achat || "N/A",
          date_creation: achat?.created_at
            ? new Date(achat.created_at).toLocaleString('fr-FR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            : null
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

  const [reportId, setReportId] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const exportCultivatorsToExcel = async () => {
    setLoadingEportBtn(true);
    try {
      let allData = [];
      let pointer = 0;
      const batchLimit = 100;
      let hasMore = true;

      while (hasMore) {
        const response = await fetchData("get", "/achats/", {
          params: {
            offset: pointer,
            limit: batchLimit,
            search: searchvalue,
            ...filterData,
          },
        });
        const currentData = response?.results || [];
        if (currentData.length === 0) break;
        allData = [...allData, ...currentData];
        pointer += batchLimit;
        if (pointer >= (response?.count || 0)) {
          hasMore = false;
        }
      }

      if (allData.length === 0) {
        setLoadingEportBtn(false);
        return;
      }

      const formattedData = allData.map((item) => ({
        Nom: item?.cultivator?.cultivator_first_name || "",
        Prénom: item?.cultivator?.cultivator_last_name || "",
        Code: item?.cultivator?.cultivator_code || "",
        CNI: item?.cultivator?.cultivator_cni || "",
        "Quantité totale": (item?.quantity_blanc || 0) + (item?.quantity_jaune || 0),
        "Maïs blanc (kg)": item?.quantity_blanc || 0,
        "Maïs jaune (kg)": item?.quantity_jaune || 0,
        Hangar: item?.collector?.hangar?.hangar_name || "",
        "Date achat": item?.date_achat || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Achats");
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      const url = window.URL.createObjectURL(blob);
      const now = new Date();
      const filename = `achats_mais_${now.toISOString().slice(0, 10)}.xlsx`;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur exportation Excel achats :", error);
    } finally {
      setLoadingEportBtn(false);
    }
  };
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
                {user?.session?.category === "Admin" || user?.session?.category === "Superviseur" ? (
                  cultivator?.in_payment ? (
                    " "
                  ) : (
                    <div>
                      <EditIndividualAchats
                        id={cultivator?.id}
                        cultivator={cultivator.cultivator}
                        num_fiche={cultivator.num_fiche}
                        num_recu={cultivator.num_recu}
                        num_page={cultivator.num_page}
                        ca={cultivator.ca}
                        cb={cultivator.cb}
                        date={cultivator.date}
                        photo_fiche={cultivator.photo_fiche}
                        responsable_id={cultivator?.responsable_id}
                      />
                      <DropdownMenuItem
                        onSelect={() => HandleDelete(cultivator?.id, cultivator?.cultivator?.cultivator_code)}
                        className="text-destructive"
                      >
                        <ArchiveX className="text-destructive" /> Delete
                      </DropdownMenuItem>
                    </div>
                  )) : (
                  " "
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
        accessorKey: "date_creation",
        header: "Date Creation",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.getValue("date_creation")}
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
            <IndividualAchatsFilter handleFilter={handleFilter} />
          </div>
          {/* {(user?.session?.category !== "Superviseur" && user?.session?.category !== "Superviseur_Regional") && (
            <div className="flex items-center gap-3 text-gray-700">
              <ExportButton
                exportType="achats_individual"
                handlerExportAchat={async () => {
                  setLoadingEportBtn(true);
                  setActivedownloadBtn(false);
                  try {
                    if (externalExportFn) {
                      await externalExportFn();
                    } else {
                      await exportCultivatorsToExcel();
                    }
                  } finally {
                    setLoadingEportBtn(false);
                  }
                }}
                loading={LoadingEportBtn}
                activedownloadBtn={externalExportFn ? false : ActivedownloadBtn}
                onClickDownloadButton={externalExportFn ? undefined : DownloadCultivatorsToExcel}
              />
            </div>
          )} */}
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
            {loading ? (
              <TableRowsSkeleton columns={columns.length} rows={limit} />
            ) : table.getRowModel().rows?.length ? (
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
