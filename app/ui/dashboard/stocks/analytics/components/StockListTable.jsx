"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";

export function StockListTable({ isLoading: externalLoading }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const isActuallyLoading = externalLoading ?? loading;

  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/detail_rendements/get_rendement_5_avec_grande_quantite/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const gradeData = response?.map((item) => ({
          id: item?.rendement__numero_lot,
          type:
            item?.grade__grade_name === "A1" ||
            item?.grade__grade_name === "A2" ||
            item?.grade__grade_name === "A3"
              ? "grains A"
              : item?.grade__grade_name === "B1" ||
                  item?.grade__grade_name === "B2"
                ? "grains B"
                : "Inconnu",
          grade: item?.grade__grade_name,
          quantity: item?.total_grains + " Kg",
          entryDate: item?.date_entre,
          status: "En Stock",
        }));
        setData(gradeData);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDatas();
  }, []);

  if (isActuallyLoading && data.length === 0)
    return (
      <div className="col-span-1 lg:col-span-3">
        <TableSkeleton rows={5} columns={6} />
      </div>
    );

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Liste des Lots</CardTitle>
          <CardDescription>
            Aperçu des lots actuellement en stock
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          Voir Tout <ArrowRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lot ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Date Entrée</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isActuallyLoading ? (
              <TableRowsSkeleton columns={6} rows={5} />
            ) : (
              data.map((lot, idd = 1) => (
                <TableRow key={idd + 1}>
                  <TableCell className="font-medium">{lot.id}</TableCell>
                  <TableCell>{lot.type}</TableCell>
                  <TableCell>{lot.grade}</TableCell>
                  <TableCell>{lot.quantity}</TableCell>
                  <TableCell>{lot.entryDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{lot.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
