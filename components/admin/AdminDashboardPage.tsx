"use client";

import { useState } from "react";
import Sidebar from "./dashboard/Sidebar";
import Topbar from "./dashboard/Topbar";
import KpiCards from "./dashboard/KpiCards";
import RevenueChart from "./dashboard/RevenueChart";
import PieBreakdown from "./dashboard/PieBreakdown";
import PaymentDonut from "./dashboard/PaymentDonut";
import TransactionsTable from "./dashboard/TransactionsTable";
import { getHybridAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { DateRange } from "./dashboard/types";
import { ShoppingCart, DollarSign, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminAnalytics = Awaited<ReturnType<typeof getHybridAdminAnalytics>>;

type Props = {
  analytics: AdminAnalytics;
};

const statusColors: Record<string, { dot: string; bg: string; text: string }> = {
  paid: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  pending: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
  refunded: { dot: "bg-rose-500", bg: "bg-rose-50", text: "text-rose-700" },
  failed: { dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-700" },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default function AdminDashboardPage({ analytics }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [activeNav, setActiveNav] = useState("dashboard");

  const { kpis } = analytics;

  return (
    <div className="flex h-screen bg-[#f9fafb] text-gray-900 overflow-hidden font-sans">
 

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar dateRange={dateRange} onDateRangeChange={setDateRange} />

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Sales Overview
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {dateRange === "7d" ? "Last 7 days" : dateRange === "30d" ? "Last 30 days" : "Last 12 months"}
              {" · "}Updated just now
            </p>
          </div>

          {/* KPI Cards */}
          <KpiCards analytics={analytics} dateRange={dateRange} />

          {/* Secondary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Payment Success</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(kpis.paymentSuccessCount)}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Payment Failures</p>
                <p className="text-lg font-semibold text-gray-900">{formatNumber(kpis.paymentFailureCount)}</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Refund Rate</p>
                <p className="text-lg font-semibold text-gray-900">{kpis.refundRate.toFixed(1)}%</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Refunded</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(kpis.refundsAmount)}</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RevenueChart data={analytics.revenueOverTime} />
            </div>
            <div>
              <PieBreakdown analytics={analytics} />
            </div>
          </div>

          {/* Payment Donut */}
          <PaymentDonut analytics={analytics} />

          {/* Admin Customer Orders */}
          <AdminCustomerOrdersSection analytics={analytics} />

          {/* Transactions */}
          <TransactionsTable orders={analytics.recentOrders} />
        </main>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Admin Customer Orders Section
   ────────────────────────────────────────────── */
function AdminCustomerOrdersSection({ analytics }: { analytics: AdminAnalytics }) {
  const { kpis, adminCustomerOrdersByStatus, recentAdminCustomerOrders } = analytics;

  const hasData = kpis.totalAdminCustomerOrders > 0 || recentAdminCustomerOrders.length > 0;

  if (!hasData) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Admin Customer Orders</h3>
            <p className="text-xs text-gray-500 mt-0.5">Orders created by admin for customers</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12 text-sm text-gray-400">
          No admin customer orders yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Admin Customer Orders</h3>
          <p className="text-xs text-gray-500 mt-0.5">Orders created by admin for customers</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{formatNumber(kpis.totalAdminCustomerOrders)} total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{formatCurrency(kpis.adminCustomerRevenue)} revenue</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Orders by Status */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">By Status</h4>
          <div className="space-y-2">
            {adminCustomerOrdersByStatus.map((item) => {
              const colors = statusColors[item.status] || statusColors.pending;
              return (
                <div
                  key={item.status}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    <span className="text-sm font-medium text-gray-700 capitalize">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatNumber(item.count)} orders
                    </p>
                    <p className="text-xs text-gray-500">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Admin Orders */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Orders</h4>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {recentAdminCustomerOrders.slice(0, 6).map((order) => {
              const colors = statusColors[order.status] || statusColors.pending;
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {order.customerName || "No Name"}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          colors.bg,
                          colors.text
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{order.customerEmail}</p>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5 justify-end">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
