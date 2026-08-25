"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ExportButton({
  onClickExportButton,
  onClickDownloadButton,
  loading = false,
  activedownloadBtn = false,
  typeExport,
  onExportToExcel,
  onExportAssociationToExcel,
  handleExportUsines,
  handleExportSDLs,
  handleExportCTs,
  onExportAchat_IndividuelToExcel,
  onExportAchat_AssociationToExcel,
  exportType,
  handleExportSocieties,
  handlerExportAchat,
}) {
  const value = typeExport || "individuel";
  const [exportTypeState, setExportTypeState] = React.useState("");
  const [downloading, setDownloading] = React.useState(false);
  // TODO: Use this state when server provides real download progress
  // const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    setExportTypeState(exportType);
    console.log(exportType);
  }, [exportType]);

  const handleDownload = async () => {
    setDownloading(true);

    try {
      await Promise.resolve(onClickDownloadButton());
    } catch (e) {
      console.error("Download error:", e);
    }

    setDownloading(false);
  };

  const isDisabled = loading || downloading;

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              "min-w-[120px] transition-all duration-300 relative overflow-hidden",
              downloading
                ? "bg-green-600 text-white hover:bg-green-700"
                : activedownloadBtn || loading
                  ? "bg-primary text-white hover:bg-primary/80"
                  : "bg-green-600 text-white hover:bg-green-700",
              "px-3 py-2 text-sm h-10",
            )}
            onClick={() => {
              if (isDisabled) return;
              if (activedownloadBtn) {
                handleDownload();
              } else {
                if (exportTypeState === "cultivator_individual") {
                  onExportToExcel();
                } else if (exportTypeState === "cultivator_association") {
                  onExportAssociationToExcel();
                } else if (exportTypeState === "achats_individual") {
                  handlerExportAchat();
                } else if (exportTypeState === "achats_association") {
                  handleExportSocieties();
                } else if (exportTypeState === "usine_data") {
                  handleExportUsines();
                } else if (exportTypeState === "sdl_data") {
                  handleExportSDLs();
                } else if (exportTypeState === "ct_data") {
                  handleExportCTs();
                } else if (exportTypeState === "society_data") {
                  handleExportSocieties();
                }
              }
            }}
            disabled={isDisabled}
          >
            {/* TODO: Uncomment progress bar when server provides real download progress
            {downloading && (
              <div
                className="absolute inset-0 bg-green-900 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            )} */}

            {loading ? (
              <Item
                variant="muted"
                className="bg-transparent border-none p-0 gap-2 h-full items-center"
              >
                <ItemMedia className="text-white">
                  <Spinner className="size-4" />
                </ItemMedia>
                <ItemContent className="hidden sm:flex">
                  <ItemTitle className="text-white text-xs font-medium">
                    Exportation...
                  </ItemTitle>
                </ItemContent>
              </Item>
            ) : downloading ? (
              <div className="flex items-center gap-2 relative z-10">
                <Spinner className="size-4" />
                <span className="text-xs font-medium">
                  Téléchargement...
                </span>
              </div>
            ) : activedownloadBtn ? (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <span>Telecharger</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
                <span>Exporter</span>
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {loading
              ? "Operation en cours..."
              : downloading
                ? "Téléchargement en cours..."
                : activedownloadBtn
                  ? "Prêt pour le téléchargement"
                  : "Exporter en Excel"}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default ExportButton;
