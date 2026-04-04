"use client";

import { KanbanBoard } from "./kanban/KanbanBoard";
import { TransactionsTable } from "./transactions/TransactionsTable";
import { KanbanUser } from "./kanban/kanban.types";
import { generateKanbanUsers } from "./kanban/kanban.utils";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  RefreshCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// ─── KPI Data ────────────────────────────────────────────────────────────────

interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  refundsAmount: number;
  refundRate: number;
  paymentSuccessCount: number;
  paymentFailureCount: number;
  conversionRate: number;
  churnRate: number;
  mrr: number;
  mrrGrowth: number;
}

function generateKpiData(): KpiData {
  return {
    totalRevenue: 48250,
    totalOrders: 342,
    activeCustomers: 186,
    averageOrderValue: 141,
    refundsAmount: 2340,
    refundRate: 4.2,
    paymentSuccessCount: 318,
    paymentFailureCount: 24,
    conversionRate: 12.8,
    churnRate: 3.1,
    mrr: 12480,
    mrrGrowth: 8.4,
  };
}

// ─── Chart Data ──────────────────────────────────────────────────────────────

function generateRevenueData() {
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  return months.map((month) => ({
    month,
    revenue: Math.round(8000 + Math.random() * 12000),
    orders: Math.round(40 + Math.random() * 60),
  }));
}

function generateStatusData() {
  return [
    { status: "Paid", count: 318, revenue: 42800, color: "#10b981" },
    { status: "Pending", count: 48, revenue: 3200, color: "#f59e0b" },
    { status: "Failed", count: 24, revenue: 1650, color: "#ef4444" },
    { status: "Refunded", count: 14, revenue: 2340, color: "#6b7280" },
  ];
}

function generatePlanDistribution() {
  return [
    { name: "Starter", value: 84, color: "#64748b" },
    { name: "Pro", value: 68, color: "#3b82f6" },
    { name: "Enterprise", value: 34, color: "#8b5cf6" },
  ];
}

// ─── Dashboard Page ──────────────────────────────────────────────────────────

export function DashboardPage() {
  const [kanbanUsers] = useState<KanbanUser[]>(() => generateKanbanUsers());
  const kpis = useMemo(() => generateKpiData(), []);
  const revenueData = useMemo(() => generateRevenueData(), []);
  const statusData = useMemo(() => generateStatusData(), []);
  const planData = useMemo(() => generatePlanDistribution(), []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-EU").format(value);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-neutral-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Welcome back. Here is what is happening with your business today.
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-medium px-3 py-1 border-gray-300 dark:border-neutral-700 text-gray-600 dark:text-neutral-400"
            >
              Last 30 days
            </Badge>
          </div>
        </motion.div>

        {/* Primary KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            subtitle="+12.5% from last month"
            icon={<DollarSign className="size-5" />}
            trend="up"
            trendValue={12.5}
          />
          <KpiCard
            title="Total Orders"
            value={formatNumber(kpis.totalOrders)}
            subtitle="+8.2% from last month"
            icon={<ShoppingCart className="size-5" />}
            trend="up"
            trendValue={8.2}
          />
          <KpiCard
            title="Active Customers"
            value={formatNumber(kpis.activeCustomers)}
            subtitle="+3.1% from last month"
            icon={<Users className="size-5" />}
            trend="up"
            trendValue={3.1}
          />
          <KpiCard
            title="Avg Order Value"
            value={formatCurrency(kpis.averageOrderValue)}
            subtitle="-2.4% from last month"
            icon={<TrendingUp className="size-5" />}
            trend="down"
            trendValue={2.4}
          />
        </motion.div>

        {/* Secondary KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MiniKpiCard
            title="MRR"
            value={formatCurrency(kpis.mrr)}
            subtitle={`+${kpis.mrrGrowth}% growth`}
            icon={<DollarSign className="size-4" />}
            accent="emerald"
          />
          <MiniKpiCard
            title="Conversion Rate"
            value={`${kpis.conversionRate}%`}
            subtitle="Visitor to trial"
            icon={<ArrowUpRight className="size-4" />}
            accent="blue"
          />
          <MiniKpiCard
            title="Churn Rate"
            value={`${kpis.churnRate}%`}
            subtitle="Monthly churn"
            icon={<ArrowDownRight className="size-4" />}
            accent="rose"
          />
          <MiniKpiCard
            title="Refund Rate"
            value={`${kpis.refundRate}%`}
            subtitle={formatCurrency(kpis.refundsAmount) + " refunded"}
            icon={<RefreshCcw className="size-4" />}
            accent="amber"
          />
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Revenue Overview
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Monthly revenue and order volume
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000) return `EUR${(value / 1000).toFixed(0)}k`;
                      return `EUR${value}`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? formatCurrency(value) : formatNumber(value),
                      name === "revenue" ? "Revenue" : "Orders",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6b7280"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                    dot={{ r: 3, fill: "#6b7280", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#6b7280" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Status Breakdown & Plan Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Status Breakdown */}
          <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Orders by Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statusData.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatNumber(item.count)}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-neutral-500">
                        {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number) => [`${value} users`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-2">
                {planData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-gray-600 dark:text-neutral-400">
                      {entry.name} ({entry.value})
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Kanban Board */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm px-4 py-5">
            <KanbanBoard initialUsers={kanbanUsers} />
          </Card>
        </motion.div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm px-4 py-5">
            <TransactionsTable />
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// ─── KPI Card Component ──────────────────────────────────────────────────────

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend: "up" | "down";
  trendValue: number;
}

function KpiCard({ title, value, subtitle, icon, trend, trendValue }: KpiCardProps) {
  return (
    <Card className="border bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {value}
            </p>
            <div className="flex items-center gap-1.5">
              {trend === "up" ? (
                <ArrowUpRight className="size-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="size-3 text-rose-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                )}
              >
                {trendValue}%
              </span>
              <span className="text-xs text-gray-400 dark:text-neutral-500">
                {subtitle.replace(/^[+-]\d+\.\d%?\s*/, "").replace("from last month", "vs last month")}
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800">
            <span className="text-gray-600 dark:text-neutral-400">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Mini KPI Card Component ─────────────────────────────────────────────────

type AccentColor = "emerald" | "blue" | "rose" | "amber";

interface MiniKpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: AccentColor;
}

const accentStyles: Record<AccentColor, { bg: string; text: string; iconBg: string }> = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
  },
};

function MiniKpiCard({ title, value, subtitle, icon, accent }: MiniKpiCardProps) {
  const style = accentStyles[accent];

  return (
    <Card className={cn("border rounded-2xl shadow-sm", style.bg)}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
              {title}
            </p>
            <p className={cn("text-xl font-bold mt-1.5", style.text)}>
              {value}
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
              {subtitle}
            </p>
          </div>
          <div className={cn("p-2 rounded-lg", style.iconBg)}>
            <span className={style.text}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardPage;
