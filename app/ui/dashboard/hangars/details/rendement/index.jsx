"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationControls from "@/components/ui/pagination-controls";
import { MoreHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DetailsRendement from "./details-redement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditRendement from "./edit";
import { Input } from "@/components/ui/input";
import { fetchData } from "@/app/_utils/api";
import { useContext } from "react";
import { UserContext } from "@/app/context/User_Context";
import EditRendementParche from "./editParche";
export default function RedementC({ id }) {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [rapportCData, setRapportCData] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const user = React.useContext(UserContext);
  console.log(user.session.category)
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const offset = (page - 1) * pageSize;

  React.useEffect(() => {
    const getRapportC = async () => {
      //setLoading(true);
      try {
        const response = await fetchData(
          "get",
          `cafe/hangars/${id}/get_rendement_cerise/`,
          {
            params: {
              limit: pageSize,
              offset: offset,
            },
          },
        );

        // Support deux formats : { count, results } (DRF paginé) ou tableau direct
        const results = Array.isArray(response)
          ? response
          : response?.results ?? [];
        const count = Array.isArray(response)
          ? response.length
          : response?.count ?? results.length;

        const rapports = results.map((rapport) => ({
          id: rapport?.id,
          grade_code: rapport?.grade?.grade_code,
          date: rapport?.enregistrement_date,
          lot_num: rapport?.rendement?.numero_lot,
          grade: rapport?.grade?.grade_name,
          QteParche: rapport?.quantite_cafe_parche,
          rendement_code: rapport?.rendement?.rendement_cerise_code,
          rendement_detail_code: rapport?.rendement_cerise_detail_code,
        }));

        setRapportCData(rapports);
        setTotalItems(count);
      } catch (error) {
        console.error("Error fetching rendement data:", error);
      } finally {
        setLoading(false);
      }
    };

    getRapportC();
  }, [id, page, pageSize]);

  return (
    <div>
      <Card className="w-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Rapport C – Rendements Cerises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="h-5 w-5 absolute inset-y-0 my-auto left-2.5" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 flex-1 shadow-none w-[300px] lg:w-[380px] rounded-lg bg-background max-w-sm border-none"
            />
          </div>

          <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Actions</TableHead>
                  <TableHead>Date Emmangasinage</TableHead>
                  <TableHead>No Lot</TableHead>
                  <TableHead>Qte CA</TableHead>
                  <TableHead>Qte CB</TableHead>
                  <TableHead>QteParche</TableHead>
                  {/* <TableHead>Rendement</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : rapportCData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Aucun rendement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  rapportCData.map((product) => (
                    <TableRow key={product.id} className="odd:bg-muted/50">
                      <TableCell className="pl-4">
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
                            <DetailsRendement data={rapportCData} />
                            {(user?.session?.category == "Admin" || user?.session?.category == "Superviseur") && (
                              <EditRendement data={product} />
                            )}
                            <DropdownMenuItem className="text-destructive">
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>

                      <TableCell className="font-medium">{product.date}</TableCell>
                      <TableCell>{product.lot_num}</TableCell>
                      <TableCell className="bg-accent">
                        {product.QteParche}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </TableCell>
                      <TableCell className="bg-accent">
                        {product.QteParche}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </TableCell>
                      <TableCell className="bg-accent">
                        {product.QteParche}{" "}
                        <span className="text-xs normal-case">Kg</span>
                      </TableCell>
                      {/* <TableCell>{product.rendement_code}</TableCell> */}
                    </TableRow>
                  ))
                )}
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
        </CardContent>
      </Card>
    </div>
  );
}
