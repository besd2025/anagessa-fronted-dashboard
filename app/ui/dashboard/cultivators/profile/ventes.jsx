"use client";

import * as React from "react";
import { fetchData } from "@/app/_utils/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ViewImageDialog from "@/components/ui/view-image-dialog";
import PaginationContent from "@/components/ui/pagination-content";
import { useSearchParams } from "next/navigation";
import { TableSkeleton, TableRowsSkeleton } from "@/components/ui/skeletons";
export default function Ventes({ cult_id }) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [limit, setLimit] = React.useState(10);
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pointer, setPointer] = React.useState(0);

  const totalPages = Math.ceil(totalCount / limit);

  const onPageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setPointer((pageNumber - 1) * limit);
  };

  const onLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPointer(0);
    setCurrentPage(1);
  };

  const datapaginationlimit = (limitdata) => {
    setLimit(limitdata);
  };

  const datapagination = {
    totalCount: totalCount,
    currentPage: currentPage,
    onPageChange: onPageChange,
    totalPages: totalPages,
    pointer: pointer,
    onLimitChange: onLimitChange,
    limit: limit,
  };
  React.useEffect(() => {
    const getCultivators = async () => {
      setLoading(true);
      try {
        const valuesdata = await fetchData(
          "get",
          `/cultivators/${cult_id}/get_mais_cultivateur_achat_mais/`,
          {
            params: {
              limit: limit,
              offset: pointer,
            },
            additionalHeaders: {},
            body: {},
          },
        );
        const AchatsData = valuesdata?.results?.map((item) => ({
          id: item?.id,
          date: item?.date_achat,
          sdl_ct_type: "hangar",
          sdl_ct: item?.responsable?.sdl_ct?.hangar?.sdl_nom
            ? "hangar " + item.responsable.sdl_ct.hangar.sdl_nom
            : "Hangar " + item?.responsable?.sdl_ct?.Hangar?.ct_nom,
          No_fiche: item?.cultivateur?.cultivator_assoc_numero_fiche,
          No_recus: item?.numero_recu,
          ca: item?.quantite_grains_a,
          cb: item?.quantite_grains_b,
          fiche_photo: item?.photo_fiche,
          montant: item?.montant_total,
        }));

        setData(AchatsData);
        setTotalCount(valuesdata?.count || 0);
      } catch (error) {
        console.error("Error fetching cultivators data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCultivators();
  }, [cult_id, currentPage, limit, pointer]);

  if (loading && data?.length === 0)
    return <TableSkeleton rows={5} columns={9} />;

  return (
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="pl-4">ID</TableHead> */}
              <TableHead>Date d'achat</TableHead>
              <TableHead>Hangar</TableHead>
              <TableHead>No Fiche</TableHead>
              <TableHead>No Recus</TableHead>
              <TableHead>CA</TableHead>
              <TableHead>CB</TableHead>
              <TableHead>Fiche</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRowsSkeleton columns={9} rows={5} />
            ) : (
              data.map((product) => (
                <TableRow key={product.id} className="odd:bg-muted/50">
                  {/* <TableCell className="pl-4">{product.id}</TableCell> */}
                  <TableCell className="font-medium">{product.date}</TableCell>
                  <TableCell>{product.sdl_ct}</TableCell>
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
                  <TableCell>
                    {Math.round(product.montant || (product.ca * 2800 + product.cb * 1400) || 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                    FBU
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationContent
        datapaginationlimit={datapaginationlimit}
        currentPage={datapagination.currentPage}
        totalPages={datapagination.totalPages}
        onPageChange={datapagination.onPageChange}
        pointer={datapagination.pointer}
        totalCount={datapagination.totalCount}
        onLimitChange={datapagination.onLimitChange}
      />
    </div>
  );
}
