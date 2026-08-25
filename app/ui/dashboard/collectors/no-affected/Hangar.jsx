"use client";

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDownIcon, MoreHorizontal, Phone, Search, Workflow } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
// import Filter from "../filter";
// import Edit from "../edit";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import PaginationContent from "@/components/ui/pagination-content";
import { UserContext } from "@/app/context/User_Context";
import { useState, useContext } from "react";
const XLSX = require("xlsx");
import { saveAs } from "file-saver";
import AddCollector from "../add-collector";
export default function NoAffectedHangars({ isLoading: externalLoading }) {
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

    useEffect(() => {
        const getHangars = async () => {
            setLoading(true);
            try {
                const response = await fetchData("get", "mais/hangars/get_sdl_non_responsable/", {
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
                const sdlData = results.map((hangar) => ({
                    id: hangar?.id,
                    hangar: {
                        sdl_code: hangar?.sdl_code,
                        sdl_name: hangar?.sdl_nom,
                        type: "",
                    },
                    society: hangar?.societe?.nom_societe || "",
                    responsable: {
                        first_name: hangar?.sdl_responsable?.user?.first_name || "",
                        last_name: hangar?.sdl_responsable?.user?.last_name || "",
                        telephone: hangar?.sdl_responsable?.user?.phone || "",
                    },
                    localite: {
                        province:
                            hangar?.sdl_adress?.zone_code?.commune_code?.province_code
                                ?.province_name || "",
                        commune:
                            hangar?.sdl_adress?.zone_code?.commune_code?.commune_name || "",
                    },
                }));
                // console.log(response);
                setData(sdlData);
                setTotalCount(response?.count);
            } catch (error) {
                console.error("Error fetching cultivators data:", error);
            } finally {
                setLoading(false);
            }
        };

        getHangars();
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
    const handleExportHangars = async () => {
        setLoadingEportBtn(true);
        try {
            const initResponse = await fetchData("get", `mais/hangars/get_sdl_non_responsable/`, {
                params: { limit: 1 },
            });
            const total = initResponse?.count || 0;
            if (total === 0) {
                setLoadingEportBtn(false);
                return;
            }

            const response = await fetchData("get", `mais/hangars/get_sdl_non_responsable/`, {
                params: { limit: total },
            });

            const allData = response.results || [];
            const formattedData = allData.map((item) => ({
                Province:
                    item.sdl_adress?.zone_code?.commune_code?.province_code
                        ?.province_name || "",
                Commune: item.sdl_adress?.zone_code?.commune_code?.commune_name || "",
                Zone: item.sdl_adress?.zone_code?.zone_name || "",
                Colline: item.sdl_adress?.colline_name || "",
                CODE_SDL: item?.sdl_code || "",
                NON_SDL: item.sdl_nom || "",
                SOCIETE: item?.societe?.nom_societe || "",
                NOM_RESPONSABLE: item?.sdl_responsable?.user?.last_name || "",
                PRENOM_RESPONSABLE: item?.sdl_responsable?.user?.first_name || "",
                TELEPHONE_RESPONSABLE: item?.sdl_responsable?.user?.phone || "",
                DATE_CREATION: item?.sdl_responsable?.created_at
                    ? new Date(item.sdl_responsable.created_at).toLocaleString('fr-FR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })
                    : null

            }));

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "hangar");
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

    const DownloadHangarsToExcel = () => {
        if (!exportBlob) return;
        const now = new Date();
        const date = now.toISOString().split("T")[0];
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const time = `${hours}_${minutes}_${seconds}`;
        saveAs(exportBlob, `liste_Hangars_et_les_responsables_${date}_${time}.xlsx`);
        setActivedownloadBtn(false);
        setExportBlob(null);
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
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="w-full p-0"
                            >
                                <AddCollector code={hangar?.hangar?.sdl_code} type="hangar" />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={`/anagessa-dashboard/hangarss/details/?id=${hangar?.id}`}>
                                <DropdownMenuItem>Details</DropdownMenuItem>
                            </Link>
                            {/* {user?.session?.category === "Admin" ? (<div>
                                <Edit id={hangar.id} />
                            </div>) : ""} */}
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
                const Hangars = row.original.hangar;
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
                                    {Hangars.sdl_name}
                                </span>
                                <span className="block text-gray-500 text-theme-xs dark:text-gray-400 mt-2">
                                    {Hangars.sdl_code}
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
                        {/* <div className="flex items-center gap-3">
                            <Filter handleFilter={handleFilter} />
                        </div> */}
                        <div className="flex items-center gap-3 text-gray-700">
                            <ExportButton
                                handleExportHangars={handleExportHangars}
                                exportType="sdl_data"
                                loading={LoadingEportBtn}
                                activedownloadBtn={ActivedownloadBtn}
                                onClickDownloadButton={DownloadHangarsToExcel}
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
