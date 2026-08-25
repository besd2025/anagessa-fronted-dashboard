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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
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
import Filter from "../filter";
import EditSociety from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationContent from "@/components/ui/pagination-content";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import { ROLES } from "@/lib/permissions";
import { UserContext } from "@/app/context/User_Context";
import { useContext } from "react";
import { Input } from "@/components/ui/input";
export default function SocietiesListTable({ isLoading: externalLoading }) {
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
  const [filterData, setFilterData] = React.useState([]);
  const [search, setSearch] = useState("");
  const [LoadingEportBtn, setLoadingEportBtn] = useState(false);
  const [ActivedownloadBtn, setActivedownloadBtn] = useState(false);
  const [exportBlob, setExportBlob] = useState(null);

  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);

  const isActuallyLoading = externalLoading ?? loading;

  const user = useContext(UserContext)


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPointer(0);
    setCurrentPage(1);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  useEffect(() => {
    const getSocieties = async () => {
      setLoading(true);
      try {

        const response = await fetchData("get", "mais/societes/", {
          params: { search: search, limit: limit, offset: pointer },
        });
        const results = response?.results || [];
        setTotalCount(response?.count || 0);
        const societiesData = results.map((society) => ({
          id: society?.id,
          code: society?.code_societe,
          name: society?.nom_societe,
          responsable: {
            first_name: society?.responsable?.user?.first_name || "",
            last_name: society?.responsable?.user?.last_name || "",
            telephone: society?.responsable?.user?.phone || "",
          },
          localite: {
            province:
              society?.adresse?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune:
              society?.adresse?.zone_code?.commune_code?.commune_name || "",
            zone: society?.adresse?.zone_code?.zone_name || "",
          },
        }));

        setData(societiesData);
      } catch (error) {
        console.error("Error fetching societies data:", error);
      } finally {
        setLoading(false);
      }
    };

    getSocieties();
  }, [search, limit, pointer]);

  const handleFilter = (filteredData) => {
    setFilterData(filteredData);
    console.log("Filtered Data:", filteredData);
  };
  const handleExportSocieties = async () => {
    setLoadingEportBtn(true);
    try {
      const initResponse = await fetchData("get", `mais/societes/`, {
        params: { limit: 1 },
      });
      const total = initResponse?.count || 0;
      if (total === 0) {
        setLoadingEportBtn(false);
        return;
      }

      const response = await fetchData("get", `mais/societes/`, {
        params: { limit: total },
      });

      const allData = response.results || [];
      const formattedData = allData.map((item) => {
        const row = {
          Province:
            item.adresse?.zone_code?.commune_code?.province_code?.province_name ||
            "",
          Commune: item.adresse?.zone_code?.commune_code?.commune_name || "",
          Zone: item.adresse?.zone_code?.zone_name || "",
          Colline: item.adresse?.colline_name || "",
          NON_SOCIETE: item.nom_societe || "",
          NOM_RESPONSABLE: item?.responsable?.user?.last_name || "",
          PRENOM_RESPONSABLE: item?.responsable?.user?.first_name || "",
          TELEPHONE_RESPONSABLE: item?.responsable?.user?.phone || "",
          DATE_CREATION: item?.created_at,
        };
        if (user?.session?.category === ROLES.ADMIN) {
          row.CODE_SOCIETE = item?.code_societe || "";
        }
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SOCIETE");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      setExportBlob(blob);
      setActivedownloadBtn(true);
    } catch (error) {
      console.error("Erreur exportation Excel :", error);
    } finally {
      setLoadingEportBtn(false);
    }
  };

  const DownloadSocietiesToExcel = () => {
    if (!exportBlob) return;
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const time = `${hours}_${minutes}_${seconds}`;
    saveAs(
      exportBlob,
      `liste_societes_et_les_responsables_${date}_${time}.xlsx`,
    );
    setActivedownloadBtn(false);
    setExportBlob(null);
  };
  const columns = [
    {
      id: "actions",
      enableHiding: false,
      header: "Actions",
      cell: ({ row }) => {
        const society = row.original;

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
                onClick={() => navigator.clipboard.writeText(society.code)}
              >
                Copier code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link
                href={`/anagessa-dashboard/societies/details/?id=${society?.id}`}
              >
                <DropdownMenuItem>Details</DropdownMenuItem>
              </Link>
              {user?.session?.category === "Admin" ? (
                <div>
                  <EditSociety id={society.id} />
                </div>
              ) : (
                ""
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "name",
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
      filterFn: (row, columnId, filterValue) => {
        const name = row.original.name;
        if (!filterValue) return true;
        const search = filterValue.toLowerCase();
        return name.toLowerCase().includes(search);
      },
      cell: ({ row }) => {
        const society = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 text-gray-500"
              >
                <path
                  fillRule="evenodd"
                  d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                  clipRule="evenodd"
                />
                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
              </svg>
            </div>

            <div className="relative w-max flex ">
              <div>
                <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                  {society.name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                  {society.code}
                </span>
              </div>

              {/* <Badge className="size-max ml-2 text-xs">SOCIETE</Badge> */}
            </div>
          </div>
        );
      },
    },
    // {
    //   accessorKey: "responsable",
    //   header: "Responsable",
    //   cell: ({ row }) => {
    //     const responsable = row.original.responsable;
    //     return (
    //       <div className="text-sm flex flex-col gap-y-1">
    //         <span>
    //           {responsable?.first_name} {responsable?.last_name}
    //         </span>
    //         <span className="flex flex-row gap-x-2 text-accent-foreground/70">
    //           <Phone size={18} />
    //           {responsable?.telephone}
    //         </span>
    //       </div>
    //     );
    //   },
    // },
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
    <div className="w-full bg-sidebar p-4 rounded-lg">
      {isActuallyLoading && data.length === 0 ? (
        <TableSkeleton rows={limit} columns={4} />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4 ">
            <div className="relative ">
              <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 " />
              <Input
                placeholder="Rechercher Société..."
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
                  handleExportSocieties={handleExportSocieties}
                  exportType="society_data"
                  loading={LoadingEportBtn}
                  activedownloadBtn={ActivedownloadBtn}
                  onClickDownloadButton={DownloadSocietiesToExcel}
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
                      Aucun résultat.
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
            <PaginationContent
              datapaginationlimit={(l) => { }}
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / limit)}
              onPageChange={onPageChange}
              pointer={pointer}
              totalCount={totalCount}
              onLimitChange={onLimitChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
