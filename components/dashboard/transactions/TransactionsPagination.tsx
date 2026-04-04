"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TransactionsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TransactionsPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}: TransactionsPaginationProps) {
  const startItem = (currentPage - 1) * 10 + 1;
  const endItem = Math.min(currentPage * 10, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-2">
      {/* Info */}
      <p className="text-sm text-gray-500 dark:text-neutral-400">
        Showing{" "}
        <span className="font-medium text-gray-700 dark:text-neutral-300">
          {startItem}-{endItem}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700 dark:text-neutral-300">
          {totalItems}
        </span>{" "}
        transactions
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            currentPage === 1
              ? "text-gray-300 dark:text-neutral-700 cursor-not-allowed"
              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="First page"
        >
          <ChevronsLeft className="size-4" />
        </button>

        {/* Previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            currentPage === 1
              ? "text-gray-300 dark:text-neutral-700 cursor-not-allowed"
              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1 text-gray-400 dark:text-neutral-600 text-sm select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                page === currentPage
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            currentPage === totalPages
              ? "text-gray-300 dark:text-neutral-700 cursor-not-allowed"
              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>

        {/* Last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            currentPage === totalPages
              ? "text-gray-300 dark:text-neutral-700 cursor-not-allowed"
              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="Last page"
        >
          <ChevronsRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
