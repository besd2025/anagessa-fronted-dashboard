import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Grape, Layers2, MapPinHouse, MoreHorizontal, ReceiptText, Spline } from "lucide-react";
import { fetchData } from "@/app/_utils/api";
import { useEffect } from "react";
import { UserContext } from "@/app/context/User_Context";
import EditRendementParche from "./editParche";

export default function DetailsRendement({ data }) {
  const user = React.useContext(UserContext);

  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    setLoading(true);
    const getRapportC = async () => {
      try {
        const rapportC = await fetchData(
          "get",
          `cafe/rapport_jounalier/${data.id}/`,
          {
            params: {},
            additionalHeaders: {},
            body: {},
          },
        );
        setRapportCData(rapportC);
      } catch (error) {
        console.error("Error fetching rapportC:", error);
      } finally {
        setLoading(false);
      }
    };
    getRapportC();
  }, [data.id]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className=" px-2 py-1.5 w-full  flex justify-start">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Details Rendement</DialogTitle>
          <Card className="w-full border-none shadow-none">
            <CardContent className="p-0">
              <div className="grid w-full [&>div]:border [&>div]:rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-4">Actions</TableHead>
                      <TableHead>Grade</TableHead>
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
                    ) : data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Aucun rendement trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((product) => (
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
                                {/* <DetailsRendement data={product} /> */}
                                {(user?.session?.category == "Admin" || user?.session?.category == "Superviseur") && (
                                  <EditRendementParche data={product} />
                                )}
                                {/* <DropdownMenuItem className="text-destructive">
                            Supprimer
                          </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>

                          {/* <TableCell>{product.lot_num}</TableCell> */}
                          <TableCell className="bg-secondary/20">
                            {product.grade}
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
            </CardContent>
          </Card>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
