"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent as PaginationContentUI,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PaginationContent = ({
  datapaginationlimit,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  pointer = 0,
  totalCount = 0,
  onLimitChange = () => { }, // Nouvelle prop pour gérer le changement de limite
  limit: initialLimit = 5, // Prop pour la limite initiale
  className,
}) => {
  const [limit, setLimit] = useState(initialLimit); // Limite basée sur la prop

  React.useEffect(() => {
    setLimit(initialLimit);
  }, [initialLimit]);

  const currentPageNumber = Number.isFinite(Number(currentPage)) ? Number(currentPage) : 1;
  const totalPagesNumber = Number.isFinite(Number(totalPages)) ? Math.max(1, Number(totalPages)) : 1;
  const pointerNumber = Number.isFinite(Number(pointer)) ? Number(pointer) : 0;
  const countNumber = Number.isFinite(Number(totalCount)) ? Number(totalCount) : 0;
  const actualLimit = Number.isFinite(Number(limit)) ? Number(limit) : 5;

  // Calcul des pages à afficher
  const pagesToShow = [];
  const startPage = Math.max(1, currentPageNumber - 1);
  const endPage = Math.min(totalPagesNumber, startPage + 2);
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }

  const dataNumberOptions = [5, 10, 50, 100];

  const handleDataNumber = (selectedOption) => {
    const newLimit = selectedOption;
    setLimit(newLimit);
    onLimitChange(newLimit); // Appelle la fonction pour mettre à jour la limite
    onPageChange(1); // Réinitialise à la première page
  };

  const actualPointer = pointerNumber;

  React.useEffect(() => {
    if (typeof datapaginationlimit === "function") {
      datapaginationlimit(limit);
    }
  }, [limit]);

  const canGoToPrevious = currentPageNumber > 1;
  const canGoToNext = currentPageNumber < totalPagesNumber;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800 sm:px-6 w-full",
        className,
      )}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        Affichage de{" "}
        <span className="font-medium">
          {countNumber === 0 ? 0 : pointerNumber + 1}
        </span>{" "}
        à{" "}
        <span className="font-medium">
          {Math.min(actualPointer + actualLimit, countNumber)}
        </span>{" "}
        sur <span className="font-medium">{countNumber}</span> résultats
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground whitespace-nowrap">
            Par page
          </span>
          <Select
            value={String(limit)}
            onValueChange={(value) => handleDataNumber(Number(value))}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {dataNumberOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Pagination>
          <PaginationContentUI>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!canGoToPrevious}
                className={cn(
                  !canGoToPrevious && "pointer-events-none opacity-50",
                )}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoToPrevious) {
                    onPageChange(currentPageNumber - 1);
                  }
                }}
              />
            </PaginationItem>

            {pagesToShow.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPageNumber}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!canGoToNext}
                className={cn(!canGoToNext && "pointer-events-none opacity-50")}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoToNext) {
                    onPageChange(currentPageNumber + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContentUI>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationContent;
