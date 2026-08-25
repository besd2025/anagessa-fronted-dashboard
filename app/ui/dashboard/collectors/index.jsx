"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, MoreHorizontal, SquareUserRound, IdCardLanyard } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import PaginationContent from "@/components/ui/pagination-content";
import { Edit } from "./edit";
import { fetchData } from "@/app/_utils/api";
import { UserContext } from "@/app/context/User_Context";
import { useContext } from "react";
import AddCollector from "./add-collector";

export default function CollectorsList() {
  const user = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [pointer, setPointer] = useState(0);
  const [allCollectors, setAllCollectors] = useState([])
  const [totalCount, setTotalCount] = useState(0);


  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    const ResponsableData = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/responsable_registration`,
          {
            params: { limit: limit, offset: pointer, search: searchValue, },
          },
        );

        const data = response?.results?.map((item) => ({
          id: item?.id,
          first_name: item?.first_name,
          last_name: item?.last_name,
          phone: item?.phone,
          identifiant: item?.identifiant,
          sdl_ct: "",
          cni: item?.cni || "",
          localite: {
            province:
              item?.adress?.zone_code?.commune_code?.province_code
                ?.province_name || "",
            commune: item?.adress?.zone_code?.commune_code?.commune_name,
            zone:
              item?.adress?.zone_code?.zone_name || "",
            colline: item?.adress?.colline_name || "",
          },
        }))
        setAllCollectors(data)
        setTotalCount(response.count);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      }
    };
    ResponsableData();
  }, [pointer, limit, searchValue]);

  return (
    <div className="w-full bg-sidebar p-2 rounded-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 py-4">
        <div className="relative">
          <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setCurrentPage(1);
              setPointer(0);
            }}
            className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background border-none"
          />
        </div>

      </div>

      <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collecteurs</TableHead>
              <TableHead>Téléphone</TableHead>
              {/*   <TableHead>Hangar</TableHead> */}
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCollectors.length > 0 ? (
              allCollectors.map((collector) => (
                <TableRow className="odd:bg-muted/50" key={collector.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <IdCardLanyard className="h-6 w-6 text-primary" />
                      <div>
                        <span className="block text-gray-800 text-theme-sm dark:text-white/90 font-bold">
                          {`${collector?.last_name} ${collector?.first_name}`}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {collector?.identifiant}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {collector?.localite?.province} - {collector?.localite?.commune} - {collector?.localite?.zone} - {collector?.localite?.colline}
                        </span>
                      </div>

                    </div>
                  </TableCell>
                  <TableCell>{collector.phone}</TableCell>
                  {/* <TableCell>{collector.sdl_ct}</TableCell> */}
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(collector.identifiant)
                          }
                        >
                          Copier l'ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Edit collector={collector} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Pas de résultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 py-4">
        <div className="flex-1 text-sm text-muted-foreground"></div>
        <PaginationContent
          datapaginationlimit={() => { }}
          currentPage={currentPage}
          totalPages={Math.ceil(totalCount / limit)}
          onPageChange={onPageChange}
          pointer={pointer}
          totalCount={totalCount}
          onLimitChange={onLimitChange}
        />
      </div>
    </div>
  );
}
