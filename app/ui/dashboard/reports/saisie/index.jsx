"use client"
import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeeklyReportGrid from '@/app/ui/dashboard/reports/weekly-report-grid';
import { fetchData } from '@/app/_utils/api';
import PaginationContent from "@/components/ui/pagination-content";
import { toast } from 'sonner';

export default function Saisie() {
  // ── Données paginées (page courante) ──────────────────────────────────────
  const [sdlData, setSdlData] = useState([]);
  const [ctData, setCtData] = useState([]);

  const [sdlLimit, setSdlLimit] = useState(10);
  const [sdlPointer, setSdlPointer] = useState(0);
  const [sdlTotalCount, setSdlTotalCount] = useState(0);
  const [sdlCurrentPage, setSdlCurrentPage] = useState(1);

  const [ctLimit, setCtLimit] = useState(10);
  const [ctPointer, setCtPointer] = useState(0);
  const [ctTotalCount, setCtTotalCount] = useState(0);
  const [ctCurrentPage, setCtCurrentPage] = useState(1);

  // ── Saisies persistantes – survivent au changement de page ────────────────
  // Structure : { [id]: { ca: string, cb: string, responsable_id: number } }
  const [sdlInputs, setSdlInputs] = useState({});
  const [ctInputs, setCtInputs] = useState({});

  // ── Période ───────────────────────────────────────────────────────────────
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isSending, setIsSending] = useState(false);

  const dateFromRef = useRef(null);
  const dateToRef = useRef(null);

  const openPicker = (ref) => {
    if (ref.current) {
      try { ref.current.showPicker(); } catch (e) { ref.current.click(); }
    }
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}-${m}-${y}`;
  };

  // ── Fetch hangar ─────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchSdlData = async () => {
      try {
        const data = await fetchData("get", `mais/hangars/`, {
          params: { limit: sdlLimit, offset: sdlPointer }
        });
        const mapped = data?.results?.map((item) => ({
          id: item.id,
          responsable_id: item.sdl_responsable?.id,
          name: item.sdl_nom,
        }));
        setSdlData(mapped || []);
        setSdlTotalCount(data?.count || 0);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSdlData();
  }, [sdlLimit, sdlPointer]);

  // ── Fetch hangar ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    const fetchCtData = async () => {
      try {
        const hangar = await fetchData("get", `mais/centres_transite/`, {
          params: { limit: ctLimit, offset: ctPointer }
        });
        const mapped = hangar?.results?.map((item) => ({
          id: item.id,
          responsable_id: item.ct_responsable?.id,
          name: item.ct_nom,
        }));
        setCtData(mapped || []);
        setCtTotalCount(hangar?.count || 0);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCtData();
  }, [ctLimit, ctPointer]);

  // ── Handlers de saisie ────────────────────────────────────────────────────
  const handleSdlChange = (id, field, value, responsable_id) => {
    if (value !== "" && Number(value) < 0) return;
    setSdlInputs((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { ca: "", cb: "", responsable_id }), [field]: value, responsable_id },
    }));
  };

  const handleCtChange = (id, field, value, responsable_id) => {
    if (value !== "" && Number(value) < 0) return;
    setCtInputs((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { ca: "", cb: "", responsable_id }), [field]: value, responsable_id },
    }));
  };

  // ── Pagination hangar ────────────────────────────────────────────────────────
  const onSdlPageChange = (pageNumber) => {
    setSdlCurrentPage(pageNumber);
    setSdlPointer((pageNumber - 1) * sdlLimit);
  };
  const onSdlLimitChange = (newLimit) => {
    setSdlLimit(newLimit);
    setSdlPointer(0);
    setSdlCurrentPage(1);
  };

  // ── Pagination hangar ─────────────────────────────────────────────────────────
  const onCtPageChange = (pageNumber) => {
    setCtCurrentPage(pageNumber);
    setCtPointer((pageNumber - 1) * ctLimit);
  };
  const onCtLimitChange = (newLimit) => {
    setCtLimit(newLimit);
    setCtPointer(0);
    setCtCurrentPage(1);
  };

  // ── Envoi global ──────────────────────────────────────────────────────────
  const handleSend = async () => {
    if (!dateFrom || !dateTo) {
      toast.error("Veuillez sélectionner une période (Date début et Date fin)");
      return;
    }

    // Collecter toutes les entrées saisies (hangar + hangar) ayant au moins une valeur
    const allEntries = [
      ...Object.values(sdlInputs),
      ...Object.values(ctInputs),
    ].filter((e) => e.ca !== "" || e.cb !== "");

    if (allEntries.length === 0) {
      toast.warning("Aucune donnée saisie à envoyer.");
      return;
    }

    setIsSending(true);
    try {
      const promises = allEntries.map((entry) =>
        fetchData("post", `mais/rapportages_sdl_ct/`, {
          body: {
            sdl_ct: entry.responsable_id,
            quantite_grains_a: Number(entry.ca) || 0,
            quantite_grains_b: Number(entry.cb) || 0,
            week_beginning: dateFrom,
            week_end: dateTo,
          },
        })
      );

      const responses = await Promise.all(promises);
      const failures = responses.filter(
        (res) => res.status !== 201 && res.status !== 200
      );

      if (failures.length === 0) {
        let countdown = 3;
        const toastId = toast.success(
          `${allEntries.length} rapport(s) envoyé(s) avec succès. Rechargement dans ${countdown}s…`,
          { duration: countdown * 1000 }
        );
        const interval = setInterval(() => {
          countdown -= 1;
          if (countdown <= 0) {
            clearInterval(interval);
            window.location.reload();
          } else {
            toast.success(
              `${allEntries.length} rapport(s) envoyé(s) avec succès. Rechargement dans ${countdown}s…`,
              { id: toastId, duration: countdown * 1000 }
            );
          }
        }, 1000);
      } else if (failures.length < allEntries.length) {
        toast.warning(
          `${allEntries.length - failures.length} rapport(s) envoyé(s), ${failures.length} échec(s).`
        );
      } else {
        toast.error("Échec de l'envoi des rapports.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Extraire le message d'erreur de la réponse serveur (AxiosError)
      const serverData = error?.response?.data?.non_field_errors[0];
      let errorMsg = "Erreur lors de l'envoi.";
      if (serverData) {
        if (typeof serverData === "string") {
          errorMsg = serverData;
        } else if (typeof serverData === "object") {
          // Django renvoie souvent { field: ["message"] } ou { detail: "message" }
          errorMsg = Object.entries(serverData)
            .map(([key, val]) =>
              `${key}: ${Array.isArray(val) ? val.join(", ") : val}`
            )
            .join(" | ");
        }
      }
      toast.error(errorMsg);
    } finally {
      setIsSending(false);
    }
  };

  // ── Compteur de lignes saisies ────────────────────────────────────────────
  const totalSaisies = [
    ...Object.values(sdlInputs),
    ...Object.values(ctInputs),
  ].filter((e) => e.ca !== "" || e.cb !== "").length;

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-2 md:p-8 gap-y-6 max-w-7xl flex flex-col min-h-screen">

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/anagessa-dashboard/reports">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto hover:bg-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Retour
              </Button>
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
          </div>
          <h1 className="text-2xl font-semibold">Rapportage de la Semaine</h1>
        </div>
      </div>

      <div className="shadow-none">
        {/* Sélecteurs de dates + bouton Envoyer */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4 bg-card p-4 rounded-md">
          {/* Depuis */}
          <div className="flex-1 max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Depuis
            </label>
            <div className="relative" onClick={() => openPicker(dateFromRef)}>
              <input
                ref={dateFromRef}
                id="event-start-date"
                type="date"
                value={dateFrom || ""}
                onChange={(e) => setDateFrom(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <input
                type="text"
                readOnly
                value={formatDateDisplay(dateFrom)}
                placeholder="JJ-MM-AAAA"
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 pointer-events-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Jusqu'à */}
          <div className="flex-1 max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Jusqu'à
            </label>
            <div className="relative" onClick={() => openPicker(dateToRef)}>
              <input
                ref={dateToRef}
                id="event-end-date"
                type="date"
                value={dateTo || ""}
                onChange={(e) => setDateTo(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <input
                type="text"
                readOnly
                value={formatDateDisplay(dateTo)}
                placeholder="JJ-MM-AAAA"
                className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 pointer-events-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bouton Envoyer unique */}
          <div className="flex items-end">
            <Button
              className="h-11 flex gap-2 bg-primary hover:bg-primary/90 text-white shadow-md"
              onClick={handleSend}
              disabled={isSending}
            >
              <Send className="w-4 h-4" />
              {isSending
                ? "Envoi…"
                : totalSaisies > 0
                  ? `Envoyer (${totalSaisies})`
                  : "Envoyer"}
            </Button>
          </div>
        </div>

        {/* Tabs hangar / hangar */}
        <Tabs defaultValue="hangar" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="hangar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M3 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5H15v-18a.75.75 0 0 0 0-1.5H3ZM6.75 19.5v-2.25a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1-.75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 0 1.5h-.75A.75.75 0 0 1 6 6.75ZM6.75 9a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM6 12.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 6a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75Zm-.75 3.75A.75.75 0 0 1 10.5 9h.75a.75.75 0 0 1 0 1.5h-.75a.75.75 0 0 1-.75-.75ZM10.5 12a.75.75 0 0 0 0 1.5h.75a.75.75 0 0 0 0-1.5h-.75ZM16.5 6.75v15h5.25a.75.75 0 0 0 0-1.5H21v-12a.75.75 0 0 0 0-1.5h-4.5Zm1.5 4.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Zm.75 2.25a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75v-.008a.75.75 0 0 0-.75-.75h-.008ZM18 17.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" />
              </svg>
              Hangars
              {Object.values(sdlInputs).filter((e) => e.ca !== "" || e.cb !== "").length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                  {Object.values(sdlInputs).filter((e) => e.ca !== "" || e.cb !== "").length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger value="hangar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15A.75.75 0 0 0 15 9h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
              </svg>
              Hangarse
              {Object.values(ctInputs).filter((e) => e.ca !== "" || e.cb !== "").length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                  {Object.values(ctInputs).filter((e) => e.ca !== "" || e.cb !== "").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab hangar */}
          <TabsContent value="hangar" className="border-none outline-none p-0 focus:ring-0">
            <WeeklyReportGrid
              items={sdlData}
              inputs={sdlInputs}
              onInputChange={handleSdlChange}
              type="hangar"
            />
            <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <PaginationContent
                currentPage={sdlCurrentPage}
                totalPages={Math.ceil(sdlTotalCount / sdlLimit)}
                onPageChange={onSdlPageChange}
                pointer={sdlPointer}
                totalCount={sdlTotalCount}
                onLimitChange={onSdlLimitChange}
                limit={sdlLimit}
              />
            </div>
          </TabsContent>

          {/* Tab hangar */}
          <TabsContent value="hangar" className="m-0 border-none outline-none p-0 focus:ring-0">
            <WeeklyReportGrid
              items={ctData}
              inputs={ctInputs}
              onInputChange={handleCtChange}
              type="hangar"
            />
            <div className="mt-4 bg-white dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800">
              <PaginationContent
                currentPage={ctCurrentPage}
                totalPages={Math.ceil(ctTotalCount / ctLimit)}
                onPageChange={onCtPageChange}
                pointer={ctPointer}
                totalCount={ctTotalCount}
                onLimitChange={onCtLimitChange}
                limit={ctLimit}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Rappel bas de page */}
        {totalSaisies > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {totalSaisies} ligne(s) saisie(s) au total — Vérifiez les totaux avant d'envoyer.
            </p>
            <Button
              className="flex gap-2 bg-primary hover:bg-primary/90 text-white shadow-md"
              onClick={handleSend}
              disabled={isSending}
            >
              <Send className="w-4 h-4" />
              {isSending ? "Envoi en cours…" : `Envoyer (${totalSaisies})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
