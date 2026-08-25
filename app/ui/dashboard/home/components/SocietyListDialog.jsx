"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportButton from "@/components/ui/export_button";
import PaginationControls from "@/components/ui/pagination-controls";
import { Eye } from "lucide-react";
import Link from "next/link";

export function SocietyListDialog({ title, data }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Dialog>
      <DialogTrigger asChild >
        <Button variant="ghost" size="sm" className="flex items-center justify-end gap-2">
          <Eye className="h-4 w-4" />
          Voir plus
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl sm:max-w-[70vw]">
        <DialogHeader className="flex flex-col md:flex-row items-center md:justify-between justify-center mt-4">
          <DialogTitle className="line-clamp-1">{title}</DialogTitle>
          <div className="mr-">
            <ExportButton
              exportType="society_data"
              handleExportSocieties={() => console.log("Exporting...", data)}
            />
          </div>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la Société</TableHead>
                <TableHead className="text-center">Valeur</TableHead>
                <TableHead className="text-center">Unité</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-center">
                    {item.value.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">{item.sub}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/anagessa-dashboard/hangarss/details?id=${item.id}`}>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <PaginationControls
            page={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPageSizeSelect={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
