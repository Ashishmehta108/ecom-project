"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import KpiCards from "./components/KpiCards";
import RevenueChart from "./components/RevenueChart";
import PieBreakdown from "./components/PieBreakdown";
import PaymentDonut from "./components/PaymentDonut";
import KanbanBoard from "./components/KanbanBoard";
import TransactionsTable from "./components/TransactionsTable";
import { mockAnalytics } from "./data/mockData";
import { DateRange } from "./types";

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [activeNav, setActiveNav] = useState("dashboard");

  return (
    <div className="flex h-screen bg-[#f9fafb] text-gray-900 overflow-hidden font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar dateRange={dateRange} onDateRangeChange={setDateRange} />

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Overview
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {dateRange === "7d"
                  ? "Last 7 days"
                  : dateRange === "30d"
                  ? "Last 30 days"
                  : "Last 12 months"}{" "}
                · Updated just now
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <KpiCards analytics={mockAnalytics} dateRange={dateRange} />

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RevenueChart data={mockAnalytics.revenueOverTime} />
            </div>
            <div>
              <PieBreakdown />
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PaymentDonut analytics={mockAnalytics} />
            </div>
            <div>
              {/* Placeholder for future chart */}
            </div>
          </div>

          {/* Kanban */}
          <KanbanBoard />

          {/* Transactions */}
          <TransactionsTable orders={mockAnalytics.recentOrders} />
        </main>
      </div>
    </div>
  );
}
