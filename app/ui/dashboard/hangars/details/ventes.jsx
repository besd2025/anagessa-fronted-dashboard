"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import PaginationControls from "@/components/ui/pagination-controls";

const products = [
  {
    id: 101,
    date: "12/8/2025",
    sdl_ct_type: "hangar",
    sdl_ct_name: "Ngome",
    No_fiche: 59.99,
    No_recus: 4.5,
    ca: 452,
    cb: 52,
    fiche_photo: "/images/logo_1.jpg",
    montant: 5555555,
  },
  {
    id: 102,
    date: "12/8/2025",
    sdl_ct_type: "hangar",
    sdl_ct_name: "Ngome",
    No_fiche: 59.99,
    No_recus: 4.5,
    ca: 452,
    cb: 52,
    fiche_photo: "/images/logo_1.jpg",
    montant: 5555555,
  },
];

export default function Ventes() {
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
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Date d'achat</TableHead>
              <TableHead>hangar/CT</TableHead>
              <TableHead>No Fiche</TableHead>
              <TableHead>No Recus</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>CB</TableHead>
              <TableHead>Fiche</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="odd:bg-muted/50">
                <TableCell className="pl-4">{product.id}</TableCell>
                <TableCell className="font-medium">{product.date}</TableCell>
                <TableCell>
                  {product.sdl_ct_type} {product.sdl_ct_name}
                </TableCell>
                <TableCell>{product.No_fiche}</TableCell>
                <TableCell>{product.No_recus}</TableCell>
                <TableCell>{product.ca}</TableCell>
                <TableCell>{product.cb}</TableCell>
                <TableCell>
                  <ViewImageDialog
                    imageUrl={product.fiche_photo}
                    profile={false}
                  />
                </TableCell>
                <TableCell>{product.montant} Fbu</TableCell>
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
