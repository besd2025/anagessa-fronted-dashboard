"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ELLIPSIS = "ellipsis";

const createPageSequence = (totalPages, currentPage, siblingCount) => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = 3 + 2 * siblingCount;
    return [
      ...Array.from({ length: leftRange }, (_, index) => index + 1),
      ELLIPSIS,
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightRange = 3 + 2 * siblingCount;
    return [
      1,
      ELLIPSIS,
      ...Array.from(
        { length: rightRange },
        (_, index) => totalPages - rightRange + index + 1,
      ),
    ];
  }

  return [
    1,
    ELLIPSIS,
    ...Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, index) => leftSiblingIndex + index,
    ),
    ELLIPSIS,
    totalPages,
  ];
};

export default function PaginationControls({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50, 100],
  siblingCount = 1,
  showSummary = true,
  summaryFormatter,
  className,
  hasNextPage,
  hasPreviousPage,
  showPageSizeSelect = true,
  PaginatedDateFunction,
}) {
  const PaginatedData = {
    page,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    // onPageSizeChange,
    pageSizeOptions,
    siblingCount,
    showSummary,
    summaryFormatter,
    className,
    hasNextPage,
    hasPreviousPage,
    showPageSizeSelect,
  };
  const [currentPageSize, setCurrentPageSize] = React.useState(pageSize);
  const handlePageSizeChange = (newPageSize) => {
    if (typeof onPageSizeChange === "function") {
      onPageSizeChange(newPageSize);
    } else if (typeof PaginatedDateFunction === "function") {
      PaginatedDateFunction({
        ...PaginatedData,
        pageSize: newPageSize,
      });
    }
    setCurrentPageSize(newPageSize);
  };
  // React.useEffect(() => {
  //   PaginatedDateFunction(PaginatedData);
  // }, []);
  const resolvedTotalPages = React.useMemo(() => {
    if (typeof totalPages === "number" && totalPages > 0) {
      return Math.max(totalPages, 1);
      //  return Math.max(totalPages, 1);
    }

    if (typeof totalItems === "number" && pageSize > 0) {
      return Math.max(Math.ceil(totalItems / pageSize), 1);
    }

    return 1;
  }, [pageSize, totalItems, totalPages]);

  const currentPage = React.useMemo(() => {
    if (!page) return 1;
    return Math.min(Math.max(page, 1), resolvedTotalPages);
  }, [page, resolvedTotalPages]);

  const canGoToPrevious =
    typeof hasPreviousPage === "boolean" ? hasPreviousPage : currentPage > 1;
  const canGoToNext =
    typeof hasNextPage === "boolean"
      ? hasNextPage
      : currentPage < resolvedTotalPages;

  const pageSequence = React.useMemo(
    () => createPageSequence(resolvedTotalPages, currentPage, siblingCount),
    [resolvedTotalPages, currentPage, siblingCount],
  );

  React.useEffect(() => {
    setCurrentPageSize(pageSize);
  }, [pageSize]);

  // Sync initial + changes
  React.useEffect(() => {
    if (typeof PaginatedDateFunction === "function") {
      PaginatedDateFunction({
        page: currentPage,
        pageSize: currentPageSize,
      });
    }
  }, [currentPage, currentPageSize]);
  const handlePageChange = React.useCallback(
    (nextPage) => {
      if (
        typeof onPageChange !== "function" ||
        nextPage < 1 ||
        nextPage > resolvedTotalPages ||
        nextPage === currentPage
      ) {
        return;
      }

      onPageChange(nextPage);
    },
    [currentPage, onPageChange, resolvedTotalPages],
  );

  const summaryText = React.useMemo(() => {
    if (!showSummary) return null;

    if (typeof summaryFormatter === "function") {
      return summaryFormatter({
        page: currentPage,
        pageSize,
        totalItems,
        totalPages: resolvedTotalPages,
      });
    }

    if (typeof totalItems !== "number") return null;

    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(start + pageSize - 1, totalItems);

    if (totalItems === 0) {
      return "Aucun élément à afficher";
    }

    return `Affichage ${start}-${end} sur ${totalItems} élément(s)`;
  }, [
    currentPage,
    pageSize,
    resolvedTotalPages,
    showSummary,
    summaryFormatter,
    totalItems,
  ]);

  const formattedPageSizeOptions = React.useMemo(
    () =>
      pageSizeOptions
        .map((option) => Number(option))
        .filter((size) => !Number.isNaN(size) && size > 0),
    [pageSizeOptions],
  );

  const showPagination = resolvedTotalPages > 1;
  console.log("PaginatedData dddd:", showPagination);
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {summaryText ?? ""}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {currentPageSize > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground whitespace-nowrap">
              Par page
            </span>
            <Select
              value={String(currentPageSize)}
              onValueChange={(value) => handlePageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder={currentPageSize} />
              </SelectTrigger>
              <SelectContent>
                {formattedPageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showPagination && (
          <Pagination>
            <PaginationContent>
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
                      handlePageChange(currentPage - 1);
                    }
                  }}
                />
              </PaginationItem>
              {pageSequence.map((item, index) => (
                <PaginationItem key={`${item}-${index}`}>
                  {item === ELLIPSIS ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={item === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        handlePageChange(item);
                      }}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={!canGoToNext}
                  className={cn(
                    !canGoToNext && "pointer-events-none opacity-50",
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    if (canGoToNext) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
