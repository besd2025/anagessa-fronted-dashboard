"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, FileChartPie, FileSpreadsheet, ListTodo, MoreHorizontal, Phone, Search, Summary } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
import { Eye } from "lucide-react";
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
import { cn } from "@/lib/utils";
import ExportButton from "@/components/ui/export_button";
import Filter from "../filter";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import Edit from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationControls from "@/components/ui/pagination-controls";
import PaginationContent from "@/components/ui/pagination-content";
import { UserContext } from "@/app/context/User_Context";
import { useState, useContext } from "react";
import AddSdl from "../add-hangar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ROLES } from "@/lib/permissions";
import { Spinner } from "@/components/ui/spinner";

export default function HangarsListTable({ isLoading: externalLoading }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const user = useContext(UserContext)
  const [filterData, setFilterData] = React.useState([]);
  const isActuallyLoading = externalLoading ?? loading;
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportId, setReportId] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const [exportBlob, setExportBlob] = useState(null);
  const [ActiveSdlValidationBtn, setActiveSdlValidationBtn] = useState(false);
  const [isSdlExportPending, setIsSdlExportPending] = useState(false);
  const [LoadingSdlValidationBtn, setLoadingSdlValidationBtn] = useState(false);
  const exportSdlValidationToExcel = async () => {
    setIsSdlExportPending(true);
    setLoadingSdlValidationBtn(true);
    try {
      // Export asynchrone identique à anagessa_dashboard/hangar_list.jsx
      const initial_export = await fetchData("post", "/hangars/export_excel/", {
        params: {},
        additionalHeaders: {},
        body: {},
      });

      if (initial_export.status == 202) {
        setLoadingEportBtn(true);
        const task_id = initial_export?.data?.task_id;
        const intervalId = setInterval(async () => {
          const export_excel = await fetchData("get", "/hangars/check_task/", {
            params: { task_id: task_id },
          });
          if (export_excel.status === "done") {
            clearInterval(intervalId);
            setLoadingEportBtn(false);
            setActivedownloadBtn(true);
          }
        }, 2000);
      }
    } catch (error) {
      setLoadingEportBtn(false);
      console.error("Erreur lors de l'exportation:", error);
    }
  };
  useEffect(() => {
    const getSdls = async () => {
      setLoading(true);
      try {
        const params = {
          limit: limit,
          offset: pointer,
          search: search,
        };
        // Appliquer les filtres depuis anagessa_dashboard/hangar_list.jsx
        if (filterData && Object.keys(filterData).length > 0) {
          if (filterData.province) params.province = filterData.province;
          if (filterData.commune) params.commune = filterData.commune;
          if (filterData.zone) params.zone = filterData.zone;
          if (filterData.QtMinAchetee) params.min_quantity_achete = filterData.QtMinAchetee;
          if (filterData.QtMaxAchete) params.max_quantity_achete = filterData.QtMaxAchete;
          if (filterData.QtMinVendue) params.min_quantity_vendu = filterData.QtMinVendue;
          if (filterData.QtMaxVendue) params.max_quantity_vendu = filterData.QtMaxVendue;
        }
        const response = await fetchData("get", "/hangars/", {
          params,
          additionalHeaders: {},
          body: {},
        });
        const results = response?.results;
        const sdlData = results.map((hangar) => ({
          id: hangar?.id,
          hangar: {
            sdl_code: hangar?.hangar_code,
            sdl_name: hangar?.hangar_name,
            type: hangar?.type || "",
          },
          responsable: {
            first_name: hangar?.responsable_name?.split(" ")?.[0] || hangar?.responsable_name || "",
            last_name: hangar?.responsable_name?.split(" ")?.[1] || "",
            telephone: hangar?.responsable_phone || "",
          },
          localite: {
            province: hangar?.province || "",
            commune: hangar?.commune || "",
            zone: hangar?.zone || "",
          },
          qte_achete: hangar?.qte_achete,
          qte_vendu: hangar?.qte_vendu,
          stock_actuel: hangar?.stock_actuel,
        }));
        setData(sdlData);
        setTotalCount(response?.count);
      } catch (error) {
        console.error("Error fetching hangars data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSdls();
  }, [limit, pointer, filterData, search]);

  const datapaginationlimit = (limitdata) => {
    setLimit(limitdata);
  };
  const totalPages = Math.ceil(totalCount / limit);
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    //localStorage.setItem("table_limit", String(newLimit));
    setPointer(0);
    setCurrentPage(1);
  };
  const datapagination = {
    totalCount: totalCount,
    currentPage: currentPage,
    onPageChange: onPageChange,
    totalPages: totalPages,
    pointer: pointer,
    onLimitChange: onLimitChange,
    limit: limit,
  };
  const handleFilter = (filteredData) => {
    setFilterData(filteredData);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const ExportHangarsToExcel = async () => {
    setLoadingEportBtn(true);
    try {
      const initial_export = await fetchData("post", "/hangars/export_excel/", {
        params: {},
        additionalHeaders: {},
        body: {},
      });

      if (initial_export.status == 202) {
        setLoadingEportBtn(true);
        const task_id = initial_export?.data?.task_id;
        const intervalId = setInterval(async () => {
          const export_excel = await fetchData("get", "/hangars/check_task/", {
            params: { task_id: task_id },
          });
          if (export_excel.status === "done") {
            clearInterval(intervalId); // Arrêtez l'intervalle
            setLoadingEportBtn(false);
            setActivedownloadBtn(true);
          }
        }, 2000);
      }

      // Vérifier toutes les 6 secondes
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    } finally {
      //setLoadingEportBtn(false);
    }
  };
  const DownloadHangarsToExcel = async () => {
    try {
      const response = await fetchData("get", "/hangars/download_excel/", {
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
      let filename = `hangars_list_${timestamp}.xlsx`;

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
      setActivedownloadBtn(false);
    }
  };






  const DownloadSdlValidationToExcel = async () => {
    try {
      const response = await fetchData("get", "cafe/cafe_payments/download_payment_validation_export/", {
        params: { task_id: sdlValidationReportId },
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
      let filename = `taux_validation_paiement_${timestamp}.xlsx`;

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




  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const hangar = row.original;

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
                onClick={() => navigator.clipboard.writeText(hangar.hangar.sdl_code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/odeca-dashboard/hangars/details/?id=${hangar?.id}`}>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              {user?.session?.category === "Admin" ? (<div>
                <Edit id={hangar.id} />
              </div>) : ""}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "hangar",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            hangar
            <ArrowUpDownIcon />
          </Button>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        const hangar = row.original.hangar;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return (
          hangar.sdl_name.toLowerCase().includes(search) ||
          hangar.sdl_code.toLowerCase().includes(search)
        );
      },
      cell: ({ row }) => {
        const hangars = row.original.hangar;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="relative w-max flex ">
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {hangars.sdl_name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                  {hangars.sdl_code}
                </span>
              </div>

              <Badge className="size-max ml-2 text-xs">hangar</Badge>
            </div>
          </div>
        );
      },
    },

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
      accessorKey: "responsable",
      header: "Responsable",
      cell: ({ row }) => {
        const responsable = row.original.responsable;
        return (
          <div className="text-sm flex flex-col gap-y-1">
            <span>
              {responsable?.first_name} {responsable?.last_name}
            </span>
            <span className="flex flex-row gap-x-2 text-accent-foreground/70">
              <Phone size={18} />
              {responsable?.telephone}
            </span>
          </div>
        );
      },
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
    <div className="w-full bg-sidebar p-4 rounded-lg">

      <>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
          <div className="relative ">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
            <input
              placeholder="Rechercher..."
              value={search}
              onChange={handleSearch}
              className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-row justify-between gap-x-3">
            <div className="flex items-center gap-3">
              <Filter handleFilter={handleFilter} />
            </div>
            <div className="flex items-center gap-3 text-gray-700">

              <ExportButton
                handleExportSDLs={ExportHangarsToExcel}
                exportType="sdl_data"
                loading={LoadingEportBtn}
                activedownloadBtn={ActivedownloadBtn}
                onClickDownloadButton={DownloadHangarsToExcel}
              />
            </div>
            <div className="hidden lg:flex items-center gap-3">
              {user?.session?.category === "Admin" && <AddSdl />}
              {(user?.session?.category === ROLES.ADMIN || user?.session?.category === ROLES.SUPERVISEUR) && !ActiveSdlValidationBtn ? (
                <Button
                  variant="outline"
                  className="border-primary"
                  onClick={exportSdlValidationToExcel}
                  disabled={LoadingSdlValidationBtn}
                >
                  {LoadingSdlValidationBtn ? (
                    <>
                      <Spinner className="size-4" />
                      Préparation...
                    </>
                  ) : (
                    <>
                      <ListTodo className="size-4" />
                      Taux de validation
                    </>
                  )}
                </Button>
              ) : ActiveSdlValidationBtn ? (
                <Button
                  variant="ghost"
                  className="text-green-600 hover:text-green-700"
                  onClick={DownloadSdlValidationToExcel}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                    />
                  </svg>
                  Télécharger
                </Button>
              ) : null}
              {user?.session?.category === "Admin" &&
                <Button
                  className="text-sm"
                  variant="outline"
                >
                  <FileChartPie className=" h-4 w-4" />
                  Rapport hangar
                </Button>
              }
            </div>
            <div className="block lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost"><MoreHorizontal size={16} /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user?.session?.category === "Admin" &&
                    <DropdownMenuItem>
                      <AddSdl />
                    </DropdownMenuItem>
                  }
                  {(user?.session?.category === ROLES.ADMIN || user?.session?.category === ROLES.SUPERVISEUR) && !ActiveSdlValidationBtn ? (
                    <DropdownMenuItem>
                      <Button
                        variant="outline"
                        className="border-primary "
                        onClick={exportSdlValidationToExcel}
                        disabled={LoadingSdlValidationBtn}
                      >
                        {LoadingSdlValidationBtn ? (
                          <>
                            <Spinner className="size-4" />
                            Préparation...
                          </>
                        ) : (
                          <>
                            <ListTodo className="size-4" />
                            Taux de validation
                          </>
                        )}
                      </Button>
                    </DropdownMenuItem>) : ActiveSdlValidationBtn ? (
                      <DropdownMenuItem>
                        <Button
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          onClick={DownloadSdlValidationToExcel}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                            />
                          </svg>
                          Télécharger
                        </Button>
                      </DropdownMenuItem>) : null}
                  {user?.session?.category === "Admin" &&
                    <DropdownMenuItem>
                      <Button
                        className="font-normal text-sm w-full"
                        variant="outline"
                      >
                        <FileChartPie className=" h-4 w-4" />
                        Rapport hangar
                      </Button>
                    </DropdownMenuItem>
                  }
                </DropdownMenuContent>
              </DropdownMenu>
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
              {isActuallyLoading ? (
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
          <div className="flex-1 text-sm text-muted-foreground">
            {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected. */}
          </div>
          {/* <PaginationControls
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getState().pagination.pageSize}
              totalItems={table.getFilteredRowModel().rows.length}
              totalPages={table.getPageCount()}
              onPageChange={(pageNumber) => table.setPageIndex(pageNumber - 1)}
              onPageSizeChange={(size) => table.setPageSize(size)}
              hasNextPage={table.getCanNextPage()}
              hasPreviousPage={table.getCanPreviousPage()}
            /> */}
          <PaginationContent
            datapaginationlimit={datapaginationlimit}
            currentPage={datapagination.currentPage}
            totalPages={datapagination.totalPages}
            onPageChange={datapagination.onPageChange}
            pointer={datapagination.pointer}
            totalCount={datapagination.totalCount}
            onLimitChange={datapagination.onLimitChange}
          />
        </div>
      </>
    </div>
  );
}
