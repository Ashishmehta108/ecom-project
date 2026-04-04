"use client";

import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getHybridAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { cn } from "@/lib/utils";

type AdminAnalytics = Awaited<ReturnType<typeof getHybridAdminAnalytics>>;

type Order = AdminAnalytics["recentOrders"][0];
type SortKey = "total" | "createdAt" | "status";

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  paid: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700" },
  successful: { label: "Successful", bg: "bg-emerald-50", text: "text-emerald-700" }, // add this
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700" },
  refunded: { label: "Refunded", bg: "bg-rose-50", text: "text-rose-700" },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-700" },
};

type Props = { orders: Order[] };

export default function TransactionsTable({ orders }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "createdAt",
    dir: "desc",
  });

  const sorted = [...orders].sort((a, b) => {
    const mul = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "total") return (a.total - b.total) * mul;
    if (sort.key === "createdAt")
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
        mul
      );
    if (sort.key === "status") return a.status.localeCompare(b.status) * mul;
    return 0;
  });

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sort.key !== k)
      return <ArrowUpDown className="w-3 h-3 text-gray-400" />;
    return sort.dir === "asc" ? (
      <ArrowUp className="w-3 h-3 text-indigo-500" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-500" />
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Recent Transactions
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Latest {orders.length} orders
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-3 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                Customer
              </th>
              <th className="text-left pb-3 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                Order ID
              </th>
              <th
                className="text-left pb-3 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => toggleSort("total")}
              >
                <span className="flex items-center gap-1">
                  Amount <SortIcon k="total" />
                </span>
              </th>
              <th
                className="text-left pb-3 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => toggleSort("status")}
              >
                <span className="flex items-center gap-1">
                  Status <SortIcon k="status" />
                </span>
              </th>
              <th
                className="text-left pb-3 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest cursor-pointer select-none hover:text-gray-700 transition-colors"
                onClick={() => toggleSort("createdAt")}
              >
                <span className="flex items-center gap-1">
                  Date <SortIcon k="createdAt" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((order) => {
              console.log(orders);
              const cfg = statusConfig[order.status] ?? statusConfig.failed;
              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0">
                        {(order.userName || order.userEmail)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900">
                          {order.userName || "Guest"}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {order.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-[10px] font-mono text-gray-500">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-xs font-semibold text-gray-900">
                      €{order.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        cfg.bg,
                        cfg.text,
                      )}
                    >
                      {cfg.label}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-[10px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
