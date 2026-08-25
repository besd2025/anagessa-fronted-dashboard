"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

/**
 * WeeklyReportGrid – composant d'affichage pur.
 * L'état des saisies est géré par le parent via `inputs` et `onInputChange`.
 *
 * Props:
 *  - items          : liste des hangar/hangar de la page courante
 *  - inputs         : objet { [id]: { ca, cb, responsable_id } } (toutes les pages)
 *  - onInputChange  : (id, field, value, responsable_id) => void
 *  - readOnly       : boolean
 */
export default function WeeklyReportGrid({
  items = [],
  inputs = {},
  onInputChange,
  readOnly = false,
}) {
  return (
    <Card className="shadow-none p-1">
      <CardContent className="p-0">
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] md:w-[300px] font-semibold">
                Nom de la hangar/hangar
              </TableHead>
              <TableHead className="w-[150px] font-semibold text-center">
                CA (kg)
              </TableHead>
              <TableHead className="w-[150px] font-semibold text-center">
                CB (kg)
              </TableHead>
              <TableHead className="w-[150px] font-semibold text-center">
                Total (kg)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  Aucune hangar/hangar trouvée pour cette catégorie.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => {
                const entry = inputs[item.id] ?? { ca: "", cb: "" };
                const caVal = readOnly ? (Number(item.ca) || 0) : (Number(entry.ca) || 0);
                const cbVal = readOnly ? (Number(item.cb) || 0) : (Number(entry.cb) || 0);
                const total = caVal + cbVal;
                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <TableCell className="font-medium align-middle">
                      {item.name}
                    </TableCell>

                    {/* CA */}
                    <TableCell className="align-middle text-center p-2">
                      {readOnly ? (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(Number(item.ca) || 0).toLocaleString()}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          value={item.ca}
                          onChange={(e) =>
                            onInputChange(
                              item.id,
                              "ca",
                              e.target.value,
                              item.responsable_id
                            )
                          }
                          className="text-center border-gray-200 dark:border-zinc-800 h-10 w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                          placeholder="0"
                        />
                      )}
                    </TableCell>

                    {/* CB */}
                    <TableCell className="align-middle text-center p-2">
                      {readOnly ? (
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {(Number(item.cb) || 0).toLocaleString()}
                        </span>
                      ) : (
                        <Input
                          type="number"
                          min="0"
                          value={item.cb}
                          onChange={(e) =>
                            onInputChange(
                              item.id,
                              "cb",
                              e.target.value,
                              item.responsable_id
                            )
                          }
                          className="text-center border-gray-200 dark:border-zinc-800 h-10 w-full hover:border-blue-400 focus:border-blue-500 transition-colors"
                          placeholder="0"
                        />
                      )}
                    </TableCell>

                    {/* Total */}
                    <TableCell className="align-middle text-center font-bold text-gray-700 dark:text-gray-300">
                      <span className="bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 py-1.5 px-3 rounded-md w-full inline-block">
                        {total.toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
