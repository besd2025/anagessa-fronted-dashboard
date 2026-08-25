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
import {
  ArrowUpDownIcon,
  IdCard,
  MoreHorizontal,
  Search,
  Trash,
  User,
  UserX,
} from "lucide-react";

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
import ExportButton from "@/components/ui/export_button";
import IndividualFilter from "../IndividualFilter";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Edit from "../edit";
import Link from "next/link";
import PaginationContent from "@/components/ui/pagination-content";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
import { fetchData } from "@/app/_utils/api";
import { UserContext } from "@/app/context/User_Context";
export default function IndividualCultivatorsTable({
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
  const [filterData, setFilterData] = useState(null);
  const [searchvalue, setSearchValue] = useState("");
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const user = useContext(UserContext);

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

  // Mode autonome (page cultivateurs) : fetch propre
  useEffect(() => {
    if (!isCultivatorsPage) return; // ne pas fetcher si on est en mode hangar
    const getCultivators = async () => {
      setLoading(true);
      try {
        const response = await fetchData(
          "get",
          "cultivators/get_mais_cultivators/?cultivateur_type=personne",
          {
            params: {
              limit: limit,
              offset: pointer,
              ...filterData,
              search: searchvalue,
            },
          },
        );
        const formattedData = response.results.map((cultivator) => ({
          id: cultivator.id,
          cultivator: {
            cultivator_code: cultivator?.cultivator_code,
            first_name: cultivator?.cultivator_first_name,
            last_name: cultivator?.cultivator_last_name,
            image_url: cultivator?.cultivator_photo,
            telephone: cultivator?.cultivator_telephone,
          },
          cni: cultivator?.cultivator_cni,
          in_payment: cultivator?.in_payment,
          cni_image_url: cultivator?.cultivator_cni_photo,
          sdl_ct: cultivator?.ct_sdl_name,
          society: cultivator?.societe_name,
          localite: {
            province:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.province_code?.province_name,
            commune:
              cultivator?.cultivator_adress?.zone_code?.commune_code
                ?.commune_name,
          },
          champs: cultivator?.nombre_champs,
        }));


        setData(formattedData);
        console.log("formattedData", response);
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching individual cultivators:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, [pointer, limit, filterData, searchvalue, isCultivatorsPage]);

  const [reportId, setReportId] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const exportCultivatorsToExcel = async () => {
    setLoadingEportBtn(true);
    try {
      // Étape 1 : Récupérer le nombre total d'enregistrements
      const initial_export = await fetchData(
        "post",
        "/mais/achat_mais/export_achat_quantites/",
        {
          params: {},
          additionalHeaders: {},
          body: { cultivateur_type: "personne", export_type: "RESUME" },
        },
      );
      if (initial_export.data?.status == "PENDING") {
        const task_id = initial_export?.data?.report_id;
        let isDone = false;
        while (!isDone) {
          const export_excel = await fetchData(
            "get",
            "mais/achat_mais/export_achat_status/",
            {
              params: { report_id: task_id },
            },
          );
          if (export_excel.status === "SUCCESS") {
            console.log("export_excel", export_excel);
            setActivedownloadBtn(true);
            setReportId(task_id);
            isDone = true;
          } else {
            // Attendre 2 secondes avant la prochaine vérification
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    } finally {
      setLoadingEportBtn(false);
    }
  };
  const DownloadCultivatorsToExcel = async () => {
    try {
      const response = await fetchData("get", "/mais/achat_mais/download/", {
        params: { report_id: reportId },
        isBlob: true,
      });

      // Créer le blob avec le bon type MIME
      const blob = new Blob([response.data], {
        type:
          response.headers["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const timestamp = `${day}_${month}_${year}_${hours}_${minutes}_${seconds}`;
      // Nom du fichier par défaut
      let filename = `cultivator_list_${timestamp}.xlsx`;

      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }

      // Création du <a> temporaire
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      link.remove();
      window.URL.revokeObjectURL(url);

      setActivedownloadBtn(false);
    } catch (error) {
      console.error("Erreur lors de l'exportation Excel :", error);
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
          `/cultivators/${id}/`,
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
        setTimeout(() => setOpen(false), 1000);
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
          const result = row.original;
          const cultivator = result.cultivator;
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
                    navigator.clipboard.writeText(cultivator?.cultivator_code)
                  }
                >
                  Copier code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link
                  href={`/anagessa-dashboard/cultivators/profile/?id=${result?.id}`}
                >
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                {user?.session?.category === "Admin" || user?.session?.category === "Superviseur" ? (
                  result?.in_payment ? (
                    " "
                  ) : (
                    <div>
                      <Edit
                        cultivator={result?.id}
                        sdl_ct={result?.sdl_ct}
                        society={result?.society}
                        localite={result?.localite}
                        champs={result?.champs}
                      />
                      <DropdownMenuItem
                        onSelect={() => HandleDelete(result?.id, cultivator?.cultivator_code)}
                        className="text-destructive"
                      >
                        <UserX className="text-destructive" /> Delete
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            cultivateur
            <ArrowUpDownIcon />
          </Button>
        ),
        filterFn: (row, columnId, filterValue) => {
          const cultivator = row.original.cultivator;
          if (!filterValue) return true;
          const search = filterValue.toLowerCase();
          return (
            (cultivator?.first_name || "").toLowerCase().includes(search) ||
            (cultivator?.last_name || "").toLowerCase().includes(search) ||
            (cultivator?.cultivator_code || "").toLowerCase().includes(search)
          );
        },
        cell: ({ row }) => {
          const cultivators = row.original.cultivator;
          return (
            <div className="flex items-center gap-3">
              <ViewImageDialog
                imageUrl={cultivators?.image_url || null}
                alt={`${cultivators?.last_name} ${cultivators?.first_name}`}
              />
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {`${cultivators?.last_name} ${cultivators?.first_name}`}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {cultivators?.cultivator_code}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "CNI",
        header: "CNI",
        cell: ({ row }) => {
          const cni = row.original.cni;
          const cni_image_url = row.original.cni_image_url;
          return (
            <div className="flex items-center gap-3">
              <ViewImageDialog
                imageUrl={cni_image_url || null}
                alt="CNI"
                profile={false}
              />
              <div>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  <span className="flex justify-center items-center">
                    <IdCard size={18} /> : {cni}
                  </span>
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: "Telephone",
        header: "Téléphone",
        cell: ({ row }) => (
          <div className="text-center font-semibold">
            {row.original.cultivator?.telephone}
          </div>
        ),
      },
      ...(isCultivatorsPage
        ? [
          {
            accessorKey: "sdl_ct",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Hangar
                <ArrowUpDownIcon />
              </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("sdl_ct")}</div>,
          },
          {
            accessorKey: "society",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
              >
                Société
                <ArrowUpDownIcon />
              </Button>
            ),
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
      // {
      //   accessorKey: "champs",
      //   header: "Champs",
      //   cell: ({ row }) => (
      //     <div className="text-center font-semibold">
      //       {row.getValue("champs")}
      //     </div>
      //   ),
      // },
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


  return (
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
        <div className="relative ">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
          <Input
            placeholder="Rechercher..."
            value={searchvalue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
          />
        </div>

        <div className="flex flex-row justify-between gap-x-3">
          <div className="flex items-center gap-3">
            <IndividualFilter handleFilter={setFilterData} />
          </div>
          {(user?.session?.category === "Admin") && (
            <div className="flex items-center gap-3 text-gray-700">
              <ExportButton
                exportType="cultivator_individual"
                onExportToExcel={async () => {
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
          )}
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
        <div className="flex-1 text-sm text-muted-foreground"></div>
        {/* Mode hangar : utiliser la pagination du parent. Mode autonome : pagination interne */}
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
            datapaginationlimit={(l) => { }}
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
