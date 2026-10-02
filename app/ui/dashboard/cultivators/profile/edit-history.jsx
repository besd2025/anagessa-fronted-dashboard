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
import PaginationControls from "@/components/ui/pagination-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const products = [
  {
    id: 101,
    name: "",
    cni: "",
    dob: "",
    bank_type: "",
    bank_name: "",
    account_number: "",
  },
];

export default function EditHistory() {
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
    <div className="w-full relative">
      <Tabs defaultValue="identification" className="">
        <TabsList className="gap-x-4">
          <TabsTrigger value="identification">Identification</TabsTrigger>
          <TabsTrigger value="achats">Achats</TabsTrigger>
        </TabsList>
        <TabsContent value="identification" className="w-full">
          <div className="w-full border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">ID</TableHead>
                  <TableHead>Nom et Prenom</TableHead>
                  <TableHead>CNI</TableHead>
                  <TableHead>Date de naissance</TableHead>
                  <TableHead>Type de Bank </TableHead>
                  <TableHead>Banque</TableHead>
                  <TableHead>N° compte</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="odd:bg-muted/50">
                    <TableCell className="pl-4">{product.id}</TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell>{product.cni}</TableCell>
                    <TableCell>{product.dob}</TableCell>
                    <TableCell>{product.bank_type}</TableCell>
                    <TableCell>{product.bank_name}</TableCell>
                    <TableCell>{product.account_number}</TableCell>
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
        </TabsContent>
        <TabsContent value="achats">Change your password here.</TabsContent>
      </Tabs>

      {/* <ComingSoonOverlay transparent={true} /> */}
    </div>
  );
}
