"use client";

import { useState, useMemo, useCallback } from "react";
import { Transactions as TransactionType, TransactionStatus, SortConfig, SortDirection } from "./kanban.types";
import { generateTransactions } from "./kanban.utils";
import { TransactionsPagination } from "./TransactionsPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, CreditCard, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

interface TransactionsTableProps {
  initialTransactions?: TransactionType[];
}

const statusVariant: Record<TransactionStatus, "default" | "destructive" | "secondary" | "outline"> = {
  successful: "default",
  failed: "destructive",
  pending: "secondary",
  refunded: "outline",
};

const statusColor: Record<TransactionStatus, string> = {
  successful: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  refunded: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-400 border-gray-200 dark:border-gray-700",
};

const ITEMS_PER_PAGE = 10;

type SortableKey = "userName" | "amount" | "status" | "date" | "paymentMethod";

export function TransactionsTable({ initialTransactions }: TransactionsTableProps) {
  const [transactions] = useState<TransactionType[]>(
    initialTransactions || generateTransactions()
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date" as keyof TransactionType,
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSort = useCallback((key: SortableKey) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        const nextDir: Record<SortDirection, SortDirection> = {
          asc: "desc",
          desc: null,
          null: "asc",
        };
        return { key, direction: nextDir[prev.direction] };
      }
      return { key, direction: "asc" };
    });
    setCurrentPage(1);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.userName.toLowerCase().includes(q) ||
          t.userEmail.toLowerCase().includes(q) ||
          t.paymentMethod.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortConfig.direction) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let aVal = a[key as keyof TransactionType];
        let bVal = b[key as keyof TransactionType];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const cmp = aStr.localeCompare(bStr);
        return direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [transactions, sortConfig, searchQuery]);

  const totalPages = Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredAndSorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalAmount = filteredAndSorted.reduce((sum, t) => sum + t.amount, 0);

  const SortIcon = ({ columnKey }: { columnKey: SortableKey }) => {
    if (sortConfig.key !== columnKey || !sortConfig.direction) {
      return <ArrowUpDown className="size-3.5 text-gray-400 dark:text-neutral-600 ml-1" />;
    }
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="size-3.5 text-gray-700 dark:text-neutral-300 ml-1" />;
    }
    return <ArrowDown className="size-3.5 text-gray-700 dark:text-neutral-300 ml-1" />;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
            {filteredAndSorted.length} transactions &middot; {formatCurrency(totalAmount)} total
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-neutral-500" />
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => {
              setIsLoading(true);
              setSearchQuery(e.target.value);
              setCurrentPage(1);
              setTimeout(() => setIsLoading(false), 150);
            }}
            className="pl-9 h-9 text-sm bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden bg-white dark:bg-neutral-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-neutral-900/80 hover:bg-gray-50 dark:hover:bg-neutral-900/80">
              <TableHead className="w-[40%]">
                <button
                  onClick={() => handleSort("userName")}
                  className="flex items-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                >
                  User
                  <SortIcon columnKey="userName" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Amount
                  <SortIcon columnKey="amount" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Status
                  <SortIcon columnKey="status" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Date
                  <SortIcon columnKey="date" />
                </button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <button
                  onClick={() => handleSort("paymentMethod")}
                  className="flex items-center text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
                >
                  Payment
                  <SortIcon columnKey="paymentMethod" />
                </button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <Loader2 className="size-5 animate-spin mx-auto text-gray-400 dark:text-neutral-600" />
                </TableCell>
              </TableRow>
            ) : paginatedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <p className="text-sm text-gray-400 dark:text-neutral-500">
                    No transactions found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              <AnimateRows items={paginatedItems} formatCurrency={formatCurrency} />
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <TransactionsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredAndSorted.length}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

function AnimateRows({ items, formatCurrency }: { items: TransactionType[]; formatCurrency: (v: number) => string }) {
  return (
    <motion.div layout>
      {items.map((transaction, index) => (
        <motion.tr
          key={transaction.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
          className="border-b border-gray-100 dark:border-neutral-800/50 last:border-0 hover:bg-gray-50/80 dark:hover:bg-neutral-800/30 transition-colors"
        >
          <TableCell className="py-3.5">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
                <img
                  src={transaction.avatar}
                  alt={transaction.userName}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {transaction.userName}
                </p>
                <p className="text-xs text-gray-400 dark:text-neutral-500 truncate">
                  {transaction.userEmail}
                </p>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-3.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatCurrency(transaction.amount)}
            </span>
          </TableCell>
          <TableCell className="py-3.5">
            <Badge
              variant={statusVariant[transaction.status]}
              className={cn(
                "capitalize text-xs font-medium px-2.5 py-0.5 border",
                statusColor[transaction.status]
              )}
            >
              {transaction.status}
            </Badge>
          </TableCell>
          <TableCell className="py-3.5">
            <span className="text-sm text-gray-600 dark:text-neutral-400">
              {transaction.date}
            </span>
          </TableCell>
          <TableCell className="hidden lg:table-cell py-3.5">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-neutral-400">
              <CreditCard className="size-3.5" />
              <span>{transaction.paymentMethod}</span>
            </div>
          </TableCell>
        </motion.tr>
      ))}
    </motion.div>
  );
}
