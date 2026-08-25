"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

function RelatedTable({ data, type }) {
  const columns = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "location",
      header: "Localité",
    },
    {
      accessorKey: "responsable",
      header: "Responsable",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Aucun résultat.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DetailsContent({ id }) {
  const [tab, setTab] = useState("Hangars");
  const [Hangars, setHangars] = React.useState([]);
  const [cts, setCts] = React.useState([]);

  React.useEffect(() => {
    const getRelatedHangars = async () => {
      try {
        const response = await fetchData("get", `mais/hangars/`, {
          params: { societe: id },
        });
      } catch (error) {
        console.error("Error fetching related Hangars:", error);
      }
    };
  }, [id]);

  React.useEffect(() => {
    // Fetch Hangars
    const fetchHangars = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/societes/${id}/get_Hangars/`,
          {},
        );
        // Map to simple structure
        const results = response?.results || [];
        setHangars(
          results.map((hangar) => ({
            code: hangar.sdl_code,
            name: hangar.sdl_nom,
            location: hangar.sdl_adress?.zone_code?.commune_code?.commune_name,
          })),
        );
      } catch (e) {
        console.log(e);
      }
    };

    const fetchCts = async () => {
      try {
        const response = await fetchData(
          "get",
          `mais/societes/${id}/get_cts/`,
          {},
        );
        const results = response?.results || [];
        setCts(
          results.map((Hangar) => ({
            code: Hangar.ct_code,
            name: Hangar.ct_nom,
            location: Hangar.ct_adress?.zone_code?.commune_code?.commune_name,
          })),
        );
      } catch (e) {
        console.log(e);
      }
    };

    if (id) {
      fetchHangars();
      fetchCts();
    }
  }, [id]);

  return (
    <Card className="p-4 space-y-4 rounded-xl shadow-sm bg-white dark:bg-sidebar border-none">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="Hangars">Hangars Associés</TabsTrigger>
          <TabsTrigger value="cts">CTs Associés</TabsTrigger>
        </TabsList>
        <TabsContent value="Hangars" className="mt-4 space-y-4">
          <h2 className="text-xl font-semibold">Liste des Hangars</h2>
          <RelatedTable data={Hangars} type="hangar" />
        </TabsContent>
        <TabsContent value="cts" className="mt-4 space-y-4">
          <h2 className="text-xl font-semibold">Liste des CTs</h2>
          <RelatedTable data={cts} type="Hangar" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
