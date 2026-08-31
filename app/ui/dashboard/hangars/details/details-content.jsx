"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchData } from "@/app/_utils/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import EditHistory from "./edit-history";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartNoAxesCombined,
  FileSpreadsheet,
  History,
  MapPinHouse,
  MoreHorizontal,
  ScrollText,
  ShoppingCart,
  Spline,
  Users,
} from "lucide-react";
import CultivatorsListTable from "../../cultivators/list";
import AchatsListTable from "@/app/ui/dashboard/stocks/achats/achats-list-table";
import ReceiptSdlCt from "./receipt/receipt-hangar";
import RedementC from "./rendement";
import RHlist from "./rapports/RH";
import { Button } from "@/components/ui/button";
import TransferSdlDep from "@/app/ui/dashboard/stocks/transfers/components/hangar-transfers/transfer-hangar";
import SharedGeoLocalisation from "@/components/ui/geo-localisation";
import Rapports from "./rapports";
import ComingSoonOverlay from "@/app/ui/components/coming-soon-overlay";

function DetailsContent({ id }) {
  // const transferData = [
  //   {
  //     id: "cultivator_001",
  //     from_sdl: "Ngome",
  //     to_depulpeur_name: "NGANE",
  //     society: "ODECA",
  //     qte_tranferer: {
  //       ca: 78452,
  //       cb: 741,
  //     },
  //     photo_fiche: "/images/logo_1.jpg",
  //     localite: {
  //       province: "Buja",
  //       commune: "Ntahangwa",
  //     },
  //   },
  // ];

  const [tab, setTab] = useState("cultivators");

  const [data, setData] = React.useState([]);
  const [individualAchatsData, setIndividualAchatsData] = React.useState([]);
  const [associationAchatsData, setAssociationAchatsData] = React.useState([]);
  const [individualCultivatorsData, setIndividualCultivatorsData] =
    React.useState([]);
  const [associationCultivatorsData, setAssociationCultivatorsData] =
    React.useState([]);
  const [transferData, setTransferData] = React.useState([]);
  const [receptionSdl, setReceptionSdl] = React.useState([]);
  // Cultivators Pagination
  const [pointer, setPointer] = useState(0);
  const [limit, setLimit] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cultivateur_type, setCultivateur_type] = useState(
    "cultivator_individual",
  );

  // Achats Pagination
  const [pointerAchat, setPointerAchat] = useState(0);
  const [limitAchat, setLimitAchat] = useState(5);
  const [totalCountAchat, setTotalCountAchat] = useState(0);
  const [currentPageAchat, setCurrentPageAchat] = useState(1);
  const [achatCultivateur_type, setAchatCultivateur_type] = useState(
    "achat_cultivator_individual",
  );
  const getAchatsSDls = async () => {
    try {
      const response = await fetchData(
        "get",
        `hangars/${id}/achats/`,
        {
          params: {
            limit: limitAchat,
            offset: pointerAchat,
          },
        },
      );
      const results = response?.results || [];
      const formatData = (achats) => ({
        id: achats?.id,
        in_payment: achats?.in_payment,
        cultivator: {
          cultivator_id: achats?.cultivator?.id || achats?.cultivateur?.id,
          cultivator_code: achats?.cultivator?.cultivator_code || achats?.cultivateur?.cultivator_code,
          first_name: achats?.cultivator?.cultivator_first_name || achats?.cultivateur?.first_name,
          last_name: achats?.cultivator?.cultivator_last_name || achats?.cultivateur?.last_name,
          image_url: achats?.cultivator?.photo || achats?.cultivateur?.photo,
          cultivator_type: "individual",
        },
        localite: {
          province: achats?.cultivator?.province || achats?.province || "N/A",
          commune: achats?.cultivator?.commune || achats?.commune || "N/A",
        },
        num_fiche: achats?.numero_fiche || "0",
        num_recu: achats?.numero_recu || "N/A",
        photo_fiche: achats?.photo_fiche,
        ca: achats?.quantity_blanc || achats?.quantite_blanc || 0,
        cb: achats?.quantity_jaune || achats?.quantite_jaune || 0,
        date: achats?.date_achat,
      });

      const formattedResults = results?.map(formatData) || [];
      setTotalCountAchat(response?.count || 0);
      setIndividualAchatsData(formattedResults);
      setAssociationAchatsData([]);
    } catch (error) {
      console.error("Error fetching achats data:", error);
    }
  };

  const getCultivatorsIndividual = async () => {
    try {
      const response = await fetchData(
        "get",
        `hangars/${id}/cultivateurs_list/`,
        {
          params: { limit: limit, offset: pointer },
        },
      );
      const results = response?.results || [];
      const cultivatorsData = results?.map((cultivator) => ({
        id: cultivator?.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.first_name || cultivator?.cultivator_first_name,
          last_name: cultivator?.last_name || cultivator?.cultivator_last_name,
          image_url: cultivator?.photo || cultivator?.cultivator_photo,
          telephone: cultivator?.telephone || cultivator?.cultivator_telephone,
        },
        in_payment: cultivator?.in_payment,
        cni: cultivator?.cni || cultivator?.cultivator_cni,
        cni_image_url: cultivator?.cni_photo || cultivator?.cultivator_cni_photo,
        localite: {
          province: cultivator?.province || "N/A",
          commune: cultivator?.commune || "N/A",
        },
        champs: cultivator?.nombre_champs || 1,
      }));
      setIndividualCultivatorsData(cultivatorsData);
      setTotalCount(response?.count || 0);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };

  const getCultivatorsAssociation = async () => {
    try {
      const response = await fetchData(
        "get",
        `cafe/hangars/${id}/get_cultivators_association/`,
        {
          params: { limit: limit, offset: pointer },
        },
      );
      const results = response?.results;

      const cultivatorsData = results?.map((cultivator) => ({
        id: cultivator?.id,
        cultivator: {
          cultivator_code: cultivator?.cultivator_code,
          first_name: cultivator?.cultivator_assoc_name,
          last_name: cultivator?.cultivator_last_name,
          image_url: cultivator?.cultivator_photo,
          telephone: cultivator?.cultivator_telephone,
          cultivator_assoc_rep_phone: cultivator?.cultivator_assoc_rep_phone,
          cultivator_assoc_numero_fiche:
            cultivator?.cultivator_assoc_numero_fiche,
          cultivator_assoc_name: cultivator?.cultivator_assoc_name,
          cultivator_assoc_rep_name: cultivator?.cultivator_assoc_rep_name,
          in_payment: cultivator?.in_payment,
        },
        localite: {
          province:
            cultivator?.cultivator_adress?.zone_code?.commune_code
              ?.province_code?.province_name,
          commune:
            cultivator?.cultivator_adress?.zone_code?.commune_code
              ?.commune_name,
        },
        champs: cultivator?.nombre_champs,

      }));
      setAssociationCultivatorsData(cultivatorsData);

      setTotalCount(response?.count);
    } catch (error) {
      console.error("Error fetching cultivators data:", error);
    }
  };

  const getTransfers = async () => {
    try {
      const response = await fetchData(
        "get",
        `hangars/${id}/transfers/`,
        {
          params: {},
        },
      );
      const results = response?.results || [];
      const transferData = results?.map((transfer) => ({
        id: transfer?.id,
        code: transfer?.code_transfert || `TR-${transfer?.id}`,
        date_transfert: transfer?.transfer_date || transfer?.date_transfert,
        from_sdl: transfer?.from_hangar?.hangar_name || "Hangar",
        qte_total_tranferer: (transfer?.quantity_blanc || 0) + (transfer?.quantity_jaune || 0),
        qte_tranferer: {
          ca: transfer?.quantity_blanc || 0,
          cb: transfer?.quantity_jaune || 0,
        },
        photo_fiche: transfer?.photo_bordereau || transfer?.photo_fiche,
        localite: {
          province: transfer?.from_hangar?.province || "N/A",
          commune: transfer?.from_hangar?.commune || "N/A",
        },
      }));
      setTransferData(transferData);
    } catch (error) {
      console.error("Error fetching transfers data:", error);
    }
  };
  const getReceptionSdl = async () => {
    try {
      const response = await fetchData(
        "get",
        `hangars/${id}/receptions/`,
        {
          params: {},
        },
      );
      const results = response?.results || [];
      const transferData = results?.map((transfer) => ({
        ...transfer,
        id: transfer?.id,
        code: transfer?.code_transfert || `TR-${transfer?.id}`,
        from_sdl: transfer?.from_hangar?.hangar_name || "Hangar Source",
        date_transfert: transfer?.transfer_date || transfer?.date_transfert,
        qte_total_tranferer: (transfer?.quantity_blanc || 0) + (transfer?.quantity_jaune || 0),
        qte_tranferer: {
          ca: transfer?.quantity_blanc || 0,
          cb: transfer?.quantity_jaune || 0,
        },
        photo_fiche: transfer?.photo_bordereau || transfer?.photo_fiche,
      }));
      setReceptionSdl(transferData);
    } catch (error) {
      console.error("Error fetching receptions data:", error);
    }
  };

  // ── Export functions filtrées par hangar ──────────────────────────────────────
  const buildXlsx = (rows, sheetName, filename) => {
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      filename,
    );
  };

  const exportIndividualCultivatorsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/hangars/${id}/get_cultivators/`, { params: { limit: 1 } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/hangars/${id}/get_cultivators/`, { params: { limit: total, offset: 0 } });
      const rows = (res?.results || []).map((c) => ({
        Code: c?.cultivator_code || "",
        Nom: c?.cultivator_last_name || "",
        Prénom: c?.cultivator_first_name || "",
        Téléphone: c?.cultivator_telephone || "",
        Province: c?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: c?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
        Zone: c?.cultivator_adress?.zone_code?.zone_name || "",
        Colline: c?.cultivator_adress?.colline_name || "",
        Champs: c?.nombre_champs || 0,
        status: c?.in_payment ? "Payé" : "Non Payé",

      }));
      buildXlsx(rows, "Cultivateurs", `cultivateurs_sdl_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export cultivateurs erreur:", e); }
  };

  const exportAssociationCultivatorsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/hangars/${id}/get_cultivators_association/`, { params: { limit: 1 } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/hangars/${id}/get_cultivators_association/`, { params: { limit: total, offset: 0 } });
      const rows = (res?.results || []).map((c) => ({
        Code: c?.cultivator_code || "",
        Association: c?.cultivator_assoc_name || "",
        Représentant: c?.cultivator_assoc_rep_name || "",
        Téléphone_rep: c?.cultivator_assoc_rep_phone || "",
        Num_fiche: c?.cultivator_assoc_numero_fiche || "",
        NIF: c?.cultivator_assoc_nif || "",
        Province: c?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: c?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
        Champs: c?.nombre_champs || 0,
      }));
      buildXlsx(rows, "Associations", `associations_sdl_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export associations erreur:", e); }
  };

  const exportIndividualAchatsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/hangars/${id}/get_achats/`, { params: { limit: 1, cafeiculteur_type: "personne" } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/hangars/${id}/get_achats/`, { params: { limit: total, offset: 0, cafeiculteur_type: "personne" } });
      const rows = (res?.results || []).map((a) => ({
        Code_cultivateur: a?.cafeiculteur?.cultivator_code || "",
        Nom: a?.cafeiculteur?.cultivator_last_name || "",
        Prénom: a?.cafeiculteur?.cultivator_first_name || "",
        Num_recu: a?.numero_recu || "",
        CA: a?.quantite_cerise_a || 0,
        CB: a?.quantite_cerise_b || 0,
        Date: a?.date_achat || "",
        Province: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
      }));
      buildXlsx(rows, "Achats", `achats_ind_sdl_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export achats individuel erreur:", e); }
  };

  const exportAssociationAchatsToExcel = async () => {
    try {
      const init = await fetchData("get", `cafe/hangars/${id}/get_achats/`, { params: { limit: 1, cafeiculteur_type: "association" } });
      const total = init?.count || 0;
      if (total === 0) return;
      const res = await fetchData("get", `cafe/hangars/${id}/get_achats/`, { params: { limit: total, offset: 0, cafeiculteur_type: "association" } });
      const rows = (res?.results || []).map((a) => ({
        Code_cultivateur: a?.cafeiculteur?.cultivator_code || "",
        Association: a?.cafeiculteur?.cultivator_assoc_name || "",
        Représentant: a?.cafeiculteur?.cultivator_assoc_rep_name || "",
        Num_recu: a?.numero_recu || "",
        CA: a?.quantite_cerise_a || 0,
        CB: a?.quantite_cerise_b || 0,
        Date: a?.date_achat || "",
        Province: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.province_code?.province_name || "",
        Commune: a?.cafeiculteur?.cultivator_adress?.zone_code?.commune_code?.commune_name || "",
      }));
      buildXlsx(rows, "Achats", `achats_assoc_sdl_${id}_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (e) { console.error("Export achats association erreur:", e); }
  };

  useEffect(() => {
    if (tab === "achats") {
      getAchatsSDls();
    }
  }, [achatCultivateur_type, limitAchat, pointerAchat, tab]);

  useEffect(() => {
    if (cultivateur_type === "cultivator_individual") {
      getCultivatorsIndividual();
    } else if (cultivateur_type === "cultivator_association") {
      getCultivatorsAssociation();
    }
    if (tab === "transferSdl") {
      getTransfers();
    }
    if (tab === "receptionSdl") {
      getReceptionSdl();
    }

  }, [cultivateur_type, limit, pointer, tab]);
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

  const totalPagesAchat = Math.ceil(totalCountAchat / limitAchat);
  const onPageChangeAchat = (pageNumber) => {
    setCurrentPageAchat(pageNumber);
    setPointerAchat((pageNumber - 1) * limitAchat);
  };
  const onLimitChangeAchat = (newLimit) => {
    setLimitAchat(newLimit);
    setPointerAchat(0);
    setCurrentPageAchat(1);
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

  const dataAchatpagination = {
    totalCount: totalCountAchat,
    currentPage: currentPageAchat,
    onPageChange: onPageChangeAchat,
    totalPages: totalPagesAchat,
    pointer: pointerAchat,
    onLimitChange: onLimitChangeAchat,
    limit: limitAchat,
  };

  const fetchCultivatorsByType = (type) => {
    setCultivateur_type(type);
    setPointer(0);
    setCurrentPage(1);
    setTotalCount(0);
    if (type === "cultivator_individual") {
      setAssociationCultivatorsData([]);
    } else {
      setIndividualCultivatorsData([]);
    }
  };

  const fetchAchatCultivatorsByType = (type) => {
    setAchatCultivateur_type(type);
    setCurrentPageAchat(1);
    setPointerAchat(0);
    setTotalCountAchat(0);
    if (type === "achat_cultivator_individual") {
      setAssociationAchatsData([]);
    } else {
      setIndividualAchatsData([]);
    }
  };

  const handleTabChange = (tab) => {
    setTab(tab);
    if (tab === "cultivators") {
      fetchCultivatorsByType(cultivateur_type);
    } else if (tab === "achats") {
      fetchAchatCultivatorsByType(achatCultivateur_type);
    }
  };
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [transfertbtnLoading, setTransfertbtnLoading] = useState(false);
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setSelectedPosition(place?.coordinates);
  };
  const handleFilter = (filterData) => {
    // Implement filtering logic here based on filterData
    console.log("Received filter data ffffhhh:", filterData);
    // You can use filterData to fetch filtered cultivators from the API
  };
  const fethTransfertbtnLoading = (loading) => {
    setTransfertbtnLoading(loading);
  };
  return (
    <Card className="p-2 space-y-4 rounded-xl shadow-sm">
      <Tabs
        value={tab}
        className=" w-full"
        onValueChange={handleTabChange}
      >
        {/* TABS LIST */}
        <TabsList className="overflow-x-auto flex-nowrap gap-2 w-full">
          <TabsTrigger value="cultivators" className="shrink-0">
            <Users className="w-4 h-4" /> Cafeiculteurs
          </TabsTrigger>

          <TabsTrigger value="achats" className="shrink-0">
            <ShoppingCart className="w-4 h-4" /> Achats effectues
          </TabsTrigger>

          {/* Hidden on Mobile */}
          <TabsTrigger value="transferSdl" className="hidden lg:flex shrink-0">
            <Spline className="w-4 h-4" /> Transfer(hangar → Deparchage)
          </TabsTrigger>

          <TabsTrigger value="receptionSdl" className="hidden lg:flex shrink-0">
            <Spline className="w-4 h-4" /> Reception(CT)
          </TabsTrigger>

          <TabsTrigger value="rh" className="hidden lg:flex shrink-0">
            <ScrollText className="w-4 h-4" /> Rapports
          </TabsTrigger>

          <TabsTrigger value="maps" className="hidden lg:flex shrink-0">
            <MapPinHouse className="w-4 h-4" /> Map
          </TabsTrigger>

          {/* MOBILE DROPDOWN */}
          <div className="block lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>

                <DropdownMenuItem>
                  <TabsTrigger value="transferSdl" className="shrink-0"><Spline className="w-4 h-4" /> Transfer(hangar → Depulpage)</TabsTrigger>

                </DropdownMenuItem>

                <DropdownMenuItem>
                  <TabsTrigger value="receptionSdl" className="shrink-0"> <Spline className="w-4 h-4" /> Reception(CT)</TabsTrigger>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <TabsTrigger value="rendement" className="shrink-0"> <ChartNoAxesCombined className="w-4 h-4" /> Rendement</TabsTrigger>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <TabsTrigger value="rh" className="shrink-0"> <ScrollText className="w-4 h-4" /> RH</TabsTrigger>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <TabsTrigger value="maps" className="shrink-0"> <MapPinHouse className="w-4 h-4" /> Map</TabsTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TabsList>
        <TabsContent value="cultivators">
          <h1 className="text-xl font-semibold m-2">Liste des Cafeiculteurs</h1>
          <CultivatorsListTable
            individualData={individualCultivatorsData}
            associationData={associationCultivatorsData}
            isCultivatorsPage={false}
            handleFilter={handleFilter}
            fetchCultivatorsByType={fetchCultivatorsByType}
            datapagination={datapagination}
            limit={limit}
            totalCount={totalCount}
            onExportIndividualToExcel={exportIndividualCultivatorsToExcel}
            onExportAssociationToExcel={exportAssociationCultivatorsToExcel}
          />
        </TabsContent>
        <TabsContent value="achats">
          <h1 className="text-xl font-semibold m-2">Achats effectues</h1>
          <AchatsListTable
            individualData={individualAchatsData}
            associationData={associationAchatsData}
            isCultivatorsPage={false}
            fetchCultivatorsByType={fetchAchatCultivatorsByType}
            datapagination={dataAchatpagination}
            limit={limitAchat}
            totalCount={totalCountAchat}
            onExportIndividualToExcel={exportIndividualAchatsToExcel}
            onExportAssociationToExcel={exportAssociationAchatsToExcel}
          />
        </TabsContent>

        <TabsContent value="maps">
          <div className="relative w-full h-full overflow-hidden">

            <SharedGeoLocalisation
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlace}
              onCloseDetails={() => setSelectedPlace(null)}
              flyToPosition={selectedPosition}
              mainMap={false}
              data={[
                {
                  name: "hangar",
                  coordinates: [-3.3896077, 29.9755819],
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-10 text-red-500 drop-shadow-xl"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ),
                  mapIcon: (
                    <div className="relative size-16 flex items-center justify-center">
                      {/* PIN */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="absolute inset-0 size-full text-red-500/50 drop-shadow-xl z-0"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      {/* ICON CENTER */}
                      <div className="absolute -top-2 inset-0 flex items-center justify-center z-999">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6 text-white drop-shadow-md"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  ),
                  places: [
                    {
                      name: "hangar GATABO",
                      coordinates: [-3.3896077, 29.9755819],
                      type: "hangar",
                      address: "Zone Gatabo, Commune Kayanza",
                      stockCA: 5600,
                      stockCB: 1200,
                      farmersCount: 89,
                    },
                    {
                      name: "hangar KIGENGE",
                      coordinates: [-3.3896077, 29.9755819],
                      type: "hangar",
                      address: "Zone Kigenge, Commune Ngozi",
                      stockCA: 7800,
                      stockCB: 2300,
                      farmersCount: 112,
                    },
                  ],
                },
              ]}
            />
            {/* <ComingSoonOverlay transparent={true} /> */}
          </div>
        </TabsContent>
        <TabsContent value="transferSdl">
          <div className="relative w-full h-full overflow-hidden">
            <TransferSdlDep data={transferData} />
            {/* <ComingSoonOverlay transparent={true} /> */}
          </div>
        </TabsContent>
        <TabsContent value="receptionSdl">
          <div className="relative w-full h-full overflow-hidden">
            <ReceiptSdlCt data={receptionSdl} />
            {/* <ComingSoonOverlay transparent={true} /> */}
          </div>
        </TabsContent>

        <TabsContent value="rh">
          <h1 className="text-xl font-semibold m-2">
            Selectionner les Rapports
          </h1>
          <Rapports id={id} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default DetailsContent;
