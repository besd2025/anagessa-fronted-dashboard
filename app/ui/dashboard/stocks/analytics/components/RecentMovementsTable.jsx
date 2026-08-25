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
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
const movements = [
  {
    date: "2024-06-15",
    type: "Entrée",
    lot: "LOT-2024-001",
    quantity: "5.2 T",
    origin: "Station Kayanza",
  },
  {
    date: "2024-06-14",
    type: "Sortie",
    lot: "LOT-2023-089",
    quantity: "12.0 T",
    origin: "Export - Belgium",
  },
  {
    date: "2024-06-12",
    type: "Entrée",
    lot: "LOT-2024-002",
    quantity: "3.8 T",
    origin: "Station Ngozi",
  },
  {
    date: "2024-06-10",
    type: "Entrée",
    lot: "LOT-2024-003",
    quantity: "4.5 T",
    origin: "Station Gitega",
  },
  {
    date: "2024-06-08",
    type: "Sortie",
    lot: "LOT-2023-092",
    quantity: "8.5 T",
    origin: "Torréfaction Locale",
  },
];

export function RecentMovementsTable({ isLoading: externalLoading }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const isActuallyLoading = externalLoading ?? loading;

  React.useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await fetchData(
          "get",
          `/mais/transfert_sdl_usine_detail/get_rendement_5_recement/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        const gradeData = response?.map((item) => ({
          date: item?.date_entre,
          lot: item?.grade__grade_name,
          type: "sortie",
          quantity: item?.total_grains + " Kg",
          origin: item?.origine,
          destination: item?.destination,
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
    return <TableSkeleton rows={5} columns={6} />;

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Mouvements Récents</CardTitle>
        <CardDescription>Dernières entrées et sorties de stock</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Origine</TableHead>
              <TableHead>Destination</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isActuallyLoading ? (
              <TableRowsSkeleton columns={6} rows={5} />
            ) : (
              data.map((movement, index) => (
                <TableRow key={index}>
                  <TableCell>{movement.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        movement.type === "Entrée" ? "default" : "destructive"
                      }
                    >
                      {movement.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{movement.lot}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.origin}</TableCell>
                  <TableCell>{movement.destination}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
