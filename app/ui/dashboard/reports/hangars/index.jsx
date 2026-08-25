"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Phone, Search } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { fetchData } from "@/app/_utils/api";
import { TableRowsSkeleton } from "@/components/ui/skeletons";
import PaginationContent from "@/components/ui/pagination-content";
import { UserContext } from "@/app/context/User_Context";
import { useState, useContext } from "react";
import EditRapport from "./edit_rapport";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import { ROLES } from "@/lib/permissions";
export default function HangarsListTableReports({ isLoading: externalLoading }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterData, setFilterData] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const isActuallyLoading = externalLoading ?? loading;
  const user = useContext(UserContext)
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportId, setReportId] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const [exportBlob, setExportBlob] = useState(null);

  React.useEffect(() => {
    const getHangars = async () => {
      setLoading(true);
      try {
        const response = await fetchData("get", "mais/rapportages_sdl_ct/get_ct_rapport/", {
          params: {
            limit: limit,
            offset: pointer,
            ...filterData,
            search: search,
          },
          additionalHeaders: {},
          body: {},
        });
        const results = response?.results;
        const ctData = results.map((hangar) => ({
          id: hangar?.id,
          hangar: {
            ct_code: hangar?.sdl_ct?.sdl_ct?.hangar?.ct_code,
            ct_name: hangar?.sdl_ct?.sdl_ct?.hangar?.ct_nom,
            ct_id: hangar?.sdl_ct?.sdl_ct?.hangar?.id,
          },
          society: hangar?.sdl_ct?.sdl_ct?.hangar?.hangar?.societe?.nom_societe,
          responsable: {
            first_name: hangar?.sdl_ct?.ct_responsable?.user?.first_name || "",
            last_name: hangar?.sdl_ct?.ct_responsable?.user?.last_name || "",
            telephone: hangar?.sdl_ct?.ct_responsable?.user?.phone || "",
          },
          localite: {
            province:
              hangar?.sdl_ct?.sdl_ct?.hangar?.ct_adress?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune: hangar?.sdl_ct?.sdl_ct?.hangar?.ct_adress?.zone_code?.commune_code?.commune_name,
          },
          quantite: {
            total_collecte: hangar?.quantite_grains_a_from_mobile + hangar?.quantite_grains_b_from_mobile || "",
            total_ca_collecte: hangar?.quantite_grains_a_from_mobile || "",
            total_cb_collecte: hangar?.quantite_grains_b_from_mobile || "",
            total_rapport: hangar?.quantite_grains_a_rapport + hangar?.quantite_grains_b_rapport || "",
            total_ca_rapport: hangar?.quantite_grains_a_rapport || "",
            total_cb_rapport: hangar?.quantite_grains_b_rapport || "",
            gap_total: (hangar?.quantite_grains_a_from_mobile + hangar?.quantite_grains_b_from_mobile) > (hangar?.quantite_grains_a_rapport + hangar?.quantite_grains_b_rapport) ? (hangar?.quantite_grains_a_from_mobile + hangar?.quantite_grains_b_from_mobile) - (hangar?.quantite_grains_a_rapport + hangar?.quantite_grains_b_rapport) : (hangar?.quantite_grains_a_rapport + hangar?.quantite_grains_b_rapport) - (hangar?.quantite_grains_a_from_mobile + hangar?.quantite_grains_b_from_mobile) || "",
            total_gap_ca: hangar?.quantite_grains_a_from_mobile > hangar?.quantite_grains_a_rapport ? hangar?.quantite_grains_a_from_mobile - hangar?.quantite_grains_a_rapport : hangar?.quantite_grains_a_rapport - hangar?.quantite_grains_a_from_mobile || "",
            total_gap_cb: hangar?.quantite_grains_b_from_mobile > hangar?.quantite_grains_b_rapport ? hangar?.quantite_grains_b_from_mobile - hangar?.quantite_grains_b_rapport : hangar?.quantite_grains_b_rapport - hangar?.quantite_grains_b_from_mobile || "",
          }
        }));

        setData(ctData);
        console.log("ctData :", results)
        setTotalCount(response?.count);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getHangars();
  }, [pointer, limit, filterData, search]);
  const totalPages = Math.ceil(totalCount / limit);
  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };
  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
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

  const exportRapportsCTToExcel = async () => {

    setLoadingEportBtn(true);
    try {
      // Étape 1 : Récupérer le nombre total d'enregistrements
      const initial_export = await fetchData(
        "get",
        "/mais/rapportages_sdl_ct/start_ct_export",
        {
          params: {},
          additionalHeaders: {},
          body: {},
        },
      );
      if (initial_export?.message == "Export lancé") {
        const task_id = initial_export?.task_id;
        let isDone = false;
        while (!isDone) {
          const export_excel = await fetchData(
            "get",
            "mais/rapportages_sdl_ct/check_ct_export",
            {
              params: { task_id: task_id },
            },
          );
          if (export_excel.export_status === "SUCCESS") {
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
  const DownloadRapportsCTToExcel = async () => {
    try {
      const response = await fetchData("get", "/mais/rapportages_sdl_ct/download_ct_export", {
        params: { task_id: reportId },
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
      let filename = `Rapport_ct_${timestamp}.xlsx`;

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





  // const handleExportCTs = async () => {
  //   setLoadingEportBtn(true);
  //   try {
  //     const initResponse = await fetchData("get", `mais/rapportages_sdl_ct/get_ct_rapport/`, {
  //       params: { limit: 1, ...filterData, search: search },
  //     });
  //     const total = initResponse?.count || 0;
  //     if (total === 0) {
  //       setLoadingEportBtn(false);
  //       return;
  //     }

  //     let allData = [];
  //     const batchSize = 5;
  //     for (let offset = 0; offset < total; offset += batchSize) {
  //       const response = await fetchData("get", `mais/rapportages_sdl_ct/get_ct_rapport/`, {
  //         params: { limit: batchSize, offset: offset, ...filterData, search: search },
  //       });
  //       if (response.results) {
  //         allData = [...allData, ...response.results];
  //       }
  //     }
  //     const formattedData = allData.map((item) => {
  //       const row = {
  //         Province:
  //           item.sdl_ct?.sdl_ct?.hangar?.ct_adress?.zone_code?.commune_code?.province_code
  //             ?.province_name || "",
  //         Commune: item.sdl_ct?.sdl_ct?.hangar?.ct_adress?.zone_code?.commune_code?.commune_name || "",
  //         Zone: item.sdl_ct?.sdl_ct?.hangar?.ct_adress?.zone_code?.zone_name || "",
  //         Colline: item.sdl_ct?.sdl_ct?.hangar?.ct_adress?.colline_name || "",
  //         NON_CT: item.sdl_ct?.sdl_ct?.hangar?.ct_nom || "",
  //         SDL_DESTINATION: item?.sdl_ct?.sdl_ct?.hangar?.hangar?.sdl_nom,
  //         SOCIETE: item?.sdl_ct?.sdl_ct?.hangar?.hangar?.societe?.nom_societe || "",
  //         NOM_RESPONSABLE: item?.sdl_ct?.sdl_ct?.responsable?.user?.last_name || "",
  //         PRENOM_RESPONSABLE: item?.sdl_ct?.sdl_ct?.responsable?.user?.first_name || "",
  //         TELEPHONE_RESPONSABLE: item?.sdl_ct?.sdl_ct?.responsable?.user?.phone || "",
  //         QUANTITE_A_RAPPORTEE: item?.quantite_grains_a_rapport,
  //         QUANTITE_B_RAPPORTEE: item?.quantite_grains_b_rapport,
  //         QUANTITE_A_COLLECTEE: item?.quantite_grains_a_from_mobile,
  //         QUANTITE_B_COLLECTEE: item?.quantite_grains_b_from_mobile,
  //         TOTAL_GAP_CELISE: (item?.quantite_grains_a_from_mobile + item?.quantite_grains_b_from_mobile) > (item?.quantite_grains_a_rapport + item?.quantite_grains_b_rapport) ? (item?.quantite_grains_a_from_mobile + item?.quantite_grains_b_from_mobile) - (item?.quantite_grains_a_rapport + item?.quantite_grains_b_rapport) : (item?.quantite_grains_a_rapport + item?.quantite_grains_b_rapport) - (item?.quantite_grains_a_from_mobile + item?.quantite_grains_b_from_mobile) || "",
  //         TOTAL_GAP_CA: item?.quantite_grains_a_from_mobile > item?.quantite_grains_a_rapport ? item?.quantite_grains_a_from_mobile - item?.quantite_grains_a_rapport : item?.quantite_grains_a_rapport - item?.quantite_grains_a_from_mobile || "",
  //         TOTAL_GAP_CB: item?.quantite_grains_b_from_mobile > item?.quantite_grains_b_rapport ? item?.quantite_grains_b_from_mobile - item?.quantite_grains_b_rapport : item?.quantite_grains_b_rapport - item?.quantite_grains_b_from_mobile || "",



  //         DATE_CREATION: item?.created_at
  //           ? new Date(item?.created_at).toLocaleString('fr-FR', {
  //             year: 'numeric',
  //             month: '2-digit',
  //             day: '2-digit',
  //             hour: '2-digit',
  //             minute: '2-digit',
  //             second: '2-digit',
  //           })
  //           : null
  //       }
  //       if (user?.session?.category === ROLES.ADMIN) {
  //         row.CODE_CT = item.sdl_ct?.sdl_ct?.hangar?.ct_code || "";
  //       }

  //       return row;
  //     });

  //     const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "hangar");
  //     const excelBuffer = XLSX.write(workbook, {
  //       bookType: "xlsx",
  //       type: "array",
  //     });
  //     const blob = new Blob([excelBuffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  //     });

  //     setExportBlob(blob);
  //     setActivedownloadBtn(true);
  //   } catch (error) {
  //     console.error("Erreur exportation Excel :", error);
  //   } finally {
  //     setLoadingEportBtn(false);
  //   }
  // };

  // const DownloadCTsToExcel = () => {
  //   if (!exportBlob) return;
  //   const now = new Date();
  //   const date = now.toISOString().split("T")[0];
  //   const hours = String(now.getHours()).padStart(2, "0");
  //   const minutes = String(now.getMinutes()).padStart(2, "0");
  //   const seconds = String(now.getSeconds()).padStart(2, "0");
  //   const time = `${hours}_${minutes}_${seconds}`;
  //   saveAs(exportBlob, `liste_CTs_et_les_responsables_${date}_${time}.xlsx`);
  //   setActivedownloadBtn(false);
  //   setExportBlob(null);
  // };

  const HandleDelete = async (id) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const results = await fetchData("delete", `/mais/rapportages_sdl_ct/${id}/`, {
          params: {},
          additionalHeaders: {},
        });
        if (results) {
          resolve({ id });
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
        setTimeout(() => window.location.reload(), 500);
        return `Le rapport a été supprimé avec succès`;
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
                onClick={() => navigator.clipboard.writeText(hangar.hangar.ct_code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href={`/anagessa-dashboard/hangarss/details/?id=${hangar.hangar.ct_id}`}>
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              {(user?.session?.category === "Admin" || user?.session?.category === "ANAGESSA") && (
                <EditRapport id={hangar?.id} />
              )}
              {(user?.session?.category === "Admin" || user?.session?.category === "ANAGESSA") && (
                <DropdownMenuItem onClick={() => HandleDelete(hangar?.id)} className="text-destructive" asChild>
                  <Button variant="ghost" className="text-destructive text-sm justify-start font-normal">Supprimer</Button>
                </DropdownMenuItem>
              )}
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
          hangar.ct_name.toLowerCase().includes(search) ||
          hangar.ct_code.toLowerCase().includes(search)
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

            <div className="relative w-max flex">
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {hangars.ct_name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                  {hangars.ct_code}
                </span>
              </div>
              <Badge className="size-max ml-2 text-xs">hangar</Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "society",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    {
      id: "localite",
      header: "Localité",
      cell: ({ row }) => {
        const localite = row.original.localite;
        return (
          <div className="text-sm">
            {localite?.province},{localite?.commune}
          </div>
        );
      },
    },
    {
      accessorKey: "qte_tot_collectee",
      header: "Qte Total collectee",
      cell: ({ row }) => {
        const qte_tot_achetee = row.original.quantite;
        return (
          <div className="relative flex flex-col gap-y-1">
            <div>
              <div className="text-lg  font-semibold tracking-tight tabular-nums">
                {qte_tot_achetee?.total_collecte >= 1000 ? (
                  <>
                    {(qte_tot_achetee?.total_collecte / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {qte_tot_achetee?.total_collecte?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-y-1 text-xs font-medium">
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-primary flex items-center gap-1">●</span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-primary">
                      MaÃ¯s blanc :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {qte_tot_achetee?.total_ca_collecte >= 1000 ? (
                      <>
                        {(qte_tot_achetee?.total_ca_collecte / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}{" "}
                        <span className="text-sm">T</span>
                      </>
                    ) : (
                      <>
                        {qte_tot_achetee?.total_ca_collecte?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageA.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-secondary flex items-center gap-1">
                    ●
                  </span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-secondary">
                      MaÃ¯s jaune :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {qte_tot_achetee?.total_cb_collecte >= 1000 ? (
                      <>
                        {(qte_tot_achetee?.total_cb_collecte / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                        <span className="text-xs">T</span>
                      </>
                    ) : (
                      <>
                        {qte_tot_achetee?.total_cb_collecte?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageB.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      },
    },
    {
      accessorKey: "qte_tot_rapportee",
      header: "Qte Total rapportee",
      cell: ({ row }) => {
        const qte_tot_rapportee = row.original.quantite;
        return (
          <div className="relative flex flex-col gap-y-1">
            <div>
              <div className="text-lg  font-semibold tracking-tight tabular-nums">
                {qte_tot_rapportee?.total_rapport >= 1000 ? (
                  <>
                    {(qte_tot_rapportee?.total_rapport / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {qte_tot_rapportee?.total_rapport?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-y-1 text-xs font-medium">
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-primary flex items-center gap-1">●</span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-primary">
                      MaÃ¯s blanc :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {qte_tot_rapportee?.total_ca_rapport >= 1000 ? (
                      <>
                        {(qte_tot_rapportee?.total_ca_rapport / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}{" "}
                        <span className="text-sm">T</span>
                      </>
                    ) : (
                      <>
                        {qte_tot_rapportee?.total_ca_rapport?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageA.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-secondary flex items-center gap-1">
                    ●
                  </span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-secondary">
                      MaÃ¯s jaune :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {qte_tot_rapportee?.total_cb_rapport >= 1000 ? (
                      <>
                        {(qte_tot_rapportee?.total_cb_rapport / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                        <span className="text-xs">T</span>
                      </>
                    ) : (
                      <>
                        {qte_tot_rapportee?.total_cb_rapport?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageB.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      },
    },
    {
      accessorKey: "gap",
      header: "GAP",
      cell: ({ row }) => {
        const gap = row.original.quantite;
        return (
          <div className="relative flex flex-col gap-y-1">
            <div>
              <div className="text-lg text-destructive font-semibold tracking-tight tabular-nums">
                {gap?.gap_total >= 1000 ? (
                  <>
                    {(gap?.gap_total / 1000).toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    <span className="text-base">T</span>
                  </>
                ) : (
                  <>
                    {gap?.gap_total?.toLocaleString("fr-FR") || 0}{" "}
                    <span className="text-sm">Kg</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-y-1 text-xs font-medium">
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-primary flex items-center gap-1">●</span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-primary">
                      MaÃ¯s blanc :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {gap?.total_gap_ca >= 1000 ? (
                      <>
                        {(gap?.total_gap_ca / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}{" "}
                        <span className="text-sm">T</span>
                      </>
                    ) : (
                      <>
                        {gap?.total_gap_ca?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageA.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
                <div className="flex flex-row gap-x-2 items-center">
                  <span className="text-secondary flex items-center gap-1">
                    ●
                  </span>
                  <div className="flex flex-row gap-x-1 items-center">
                    <div className="text-md font-semibold text-secondary">
                      MaÃ¯s jaune :
                    </div>
                  </div>
                  <div className="font-semibold text-accent-foreground text-sm">
                    {gap?.total_gap_cb >= 1000 ? (
                      <>
                        {(gap?.total_gap_cb / 1000).toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          },
                        )}
                        <span className="text-xs">T</span>
                      </>
                    ) : (
                      <>
                        {gap?.total_gap_cb?.toLocaleString("fr-FR") || 0}{" "}
                        <span className="text-xs">Kg</span>
                      </>
                    )}
                    {/* <span className="text-xs font-normal text-muted-foreground ml-2">
                                    ({percentageB.toFixed(1)}%)
                                </span> */}
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      },
    }
  ];
  const datapaginationlimit = (limitdata) => {
    setLimit(limitdata);
  };
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
            {/* <input
                placeholder="Rechercher..."
                value={table.getColumn("hangar")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("hangar")?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none focus-visible:ring-0"
              /> */}
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
                exportType="ct_data"
                handleExportCTs={async () => {
                  setLoadingEportBtn(true);
                  setActivedownloadBtn(false);
                  try {
                    await exportRapportsCTToExcel();
                  } finally {
                    setLoadingEportBtn(false);
                  }
                }}
                loading={LoadingEportBtn}
                activedownloadBtn={ActivedownloadBtn}
                onClickDownloadButton={DownloadRapportsCTToExcel}
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
            />
             */}

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
