"use client";
import React, { useState } from "react";
// import ViewPaymentExportList from "./view_payment_export";
import ExportButton from "@/components/ui/export_button";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListView from "./list-view";

function ExportPayment() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showList, setShowList] = useState(false);
  const [exportProcess, setExportProcess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processDone, setProcessDone] = useState(true);

  const exportPaymentListToExcel = () => {
    setExportProcess(true);
    // Simuler un processus d'exportation
    setTimeout(() => {
      // setExportProcess(false);
      setProcessDone(true);
    }, 5000);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="bg-sidebar m-4 p-4 lg:p-0 rounded-lg">
      <div className="md:p-6 relative">
        <div className="">
          <div className="flex items-center justify-between  w-full ">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Exporter la liste de paiement
            </h3>
          </div>
          <div className="grid grid-cols-6 gap-4 ">
            <div className="col-span-6 lg:col-span-1 ">
              <div className="space-y-6">
                <div className="relative z-40">
                  <div className="mt-6">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Depuis
                    </label>
                    <div className="relative">
                      <input
                        id="event-start-date"
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setDateFrom(value);
                          } else {
                            setDateFrom("");
                          }
                        }}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-6 lg:col-span-1 ">
              <div className="space-y-6">
                <div>
                  <div className="mt-6">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Jusqu'à
                    </label>
                    <div className="relative">
                      <input
                        id="event-end-date"
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value) {
                            setDateTo(value);
                          } else {
                            setDateTo("");
                          }
                        }}
                        className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ExportButton onClick={exportPaymentListToExcel} />
          </div>
          {exportProcess && (
            <div className="flex flex-col lg:flex-row w-full items-center justify-between mt-4 gap-y-4">
              <div className="relative py-4 w-full lg:w-[70%]">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                      En cours...
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-secondary">
                      70%
                    </span>
                  </div>
                </div>
                <Progress value={progress} />
              </div>
              {processDone && (
                <div className="flex gap-x-2">
                  <Button
                    className={`bg-secondary text-secondary-foreground  px-3 py-2 text-sm h-max`}
                    onClick={() => setShowList(!showList)}
                    // loading={loading}
                    // loadingType="spinner"
                    size=""
                    variant="outline"
                    startIcon={!showList ? <Eye /> : <EyeOff />}
                  >
                    Apercus
                  </Button>
                  <Button
                    className={`bg-primary px-3 py-2 text-sm h-max`}
                    // onClick={onClick}
                    // loading={loading}
                    // loadingType="spinner"
                    size=""
                    startIcon={<Download />}
                  >
                    Telecharger
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showList && (
        <div className="mt-2 rounded-2xl border border-gray-200 bg-white  dark:border-gray-800 dark:bg-gray-900 md:p-6 relative">
          <ListView />
        </div>
      )}
    </div>
  );
}

export default ExportPayment;
