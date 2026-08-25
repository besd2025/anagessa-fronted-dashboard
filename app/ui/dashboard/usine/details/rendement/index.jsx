"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import PaginationControls from "@/components/ui/pagination-controls";
import DetailsReceipt from "../receipt/details-receipt";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailsRendement from "./details-redement";

const products = [
  {
    id: 101,
    date: "12/8/2025",
    lot_num: 40,
    ca: 452,
    cb: 52,
    qte_total: 4455.5,
  },
];

export default function RedementC() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const totalItems = products.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedProducts = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [page, pageSize]);

  return (
    <div className="w-full mt-4">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Actions</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date d'achat</TableHead>
              <TableHead>No Lot</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>CB</TableHead>
              <TableHead>Qte TOTAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="odd:bg-muted/50">
                <TableCell className="pl-4" asChild>
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

                      <div>
                        <DetailsRendement />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="pl-4">{product.id}</TableCell>
                <TableCell className="font-medium">{product.date}</TableCell>
                <TableCell>{product.lot_num}</TableCell>
                <TableCell>{product.ca}</TableCell>
                <TableCell>{product.cb}</TableCell>
                <TableCell>{product.qte_total} Kg</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        className="mt-4"
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPage(1);
          setPageSize(size);
        }}
        hasNextPage={page < totalPages}
        hasPreviousPage={page > 1}
      />
    </div>
  );
}
