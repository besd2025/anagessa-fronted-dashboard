"use client";

import React, { useEffect, useState } from "react";
import { Factory } from "lucide-react";
import TransferCtDep from "@/app/ui/dashboard/stocks/transfers/components/hangar-transfers/transfer-hangar";
import { fetchData } from "@/app/_utils/api";
import { TableSkeleton } from "@/components/ui/skeletons";
import ProtectedRoute from "@/app/ui/protection/ProtectedRoute";
import { ROLES } from "@/lib/permissions";

export default function TransfersPage() {
  const [ctTransfers, setCtTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchvalue, setSearchValue] = useState("");

  // Shared Pagination states
  const [limit, setLimit] = useState(10);
  const [pointer, setPointer] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchDataForActiveTab = async () => {
      try {
        setLoading(true);
        const response_ct_sdl = await fetchData("get", "transfert", {
          params: { limit: limit, offset: pointer, search: searchvalue },
        });
        const results2 = response_ct_sdl?.results || [];
        const mappedCtTransfers = results2.map((transfer) => ({
          id: transfer.id,
          transfer_code: transfer?.code_transfert || `TR-${transfer.id}`,
          from: transfer?.from_hangar?.hangar_name,
          to: transfer?.to_hangar?.hangar_name,
          date: transfer?.transfer_date,
          status: transfer?.is_confirmed,
          qte_tranferer: {
            ca: transfer?.quantity_blanc,
            cb: transfer?.quantity_jaune,
          },
          quantity: transfer?.quantity_blanc + transfer?.quantity_jaune,
          photo_fiche: transfer?.transfer_receipt,
          chauffeur: transfer?.chauffeur_nom + " " + transfer?.chauffeur_prenom,
          accompagnateur: transfer?.accompagnateur_nom + " " + transfer?.accompagnateur_prenom,
          localite: {
            province: transfer?.from_hangar?.province,
            commune: transfer?.from_hangar?.commune,
          },
          created_at: transfer?.created_at,
        }));
        setCtTransfers(mappedCtTransfers);
        setTotalCount(response_ct_sdl?.count || 0);
      } catch (error) {
        console.error("Error fetching hangar transfers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataForActiveTab();
  }, [limit, pointer, searchvalue]);

  const datapagination = {
    totalCount: totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: currentPage,
    pointer: pointer,
    limit: limit,

    onPageChange: (page) => {
      setCurrentPage(page);
      setPointer((page - 1) * limit);
    },
    onLimitChange: (newLimit) => {
      setLimit(newLimit);
      setPointer(0);
      setCurrentPage(1);
    },
  };

  useEffect(() => {
    setPointer(0);
    setCurrentPage(1);
  }, [searchvalue]);

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.GENERAL, ROLES.ANAGESSA, ROLES.SOCIETE, ROLES.SUPERVISEUR_REGIONAL, ROLES.SUPERVISEUR]}>
      <div className="p-4 space-y-4 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gestion des Transferts</h1>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Transferts depuis les Hangars
            </h2>
            <p className="text-sm text-muted-foreground">
              Liste des transferts effectués depuis les Hangars.
            </p>
          </div>
          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <TransferCtDep data={ctTransfers} datapagination={datapagination} search={handleSearch} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
