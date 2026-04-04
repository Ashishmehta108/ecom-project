"use client";

export type AdminAnalytics = {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    averageOrderValue: number;
    refundsAmount: number;
    refundRate: number;
    paymentSuccessCount: number;
    paymentFailureCount: number;
    totalAdminCustomerOrders: number;
    adminCustomerRevenue: number;
  };
  revenueOverTime: Array<{ date: string; revenue: number }>;
  ordersOverTime: Array<{ date: string; count: number }>;
  revenueByStatus: Array<{ status: string; revenue: number }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalRevenue: number;
    totalQuantity: number;
  }>;
  recentOrders: Array<{
    id: string;
    userName: string | null;
    userEmail: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topCustomers: Array<{
    userId: string;
    name: string | null;
    email: string;
    totalSpent: number;
    ordersCount: number;
  }>;
  adminCustomerOrdersByStatus: Array<{
    status: string;
    count: number;
    revenue: number;
  }>;
  recentAdminCustomerOrders: Array<{
    id: string;
    customerName: string | null;
    customerEmail: string | null;
    total: number;
    status: string;
    orderStatus: string | null;
    createdAt: string;
  }>;
};

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
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

type Props = {
  analytics: AdminAnalytics;
};

export default function AdminSalesDashboard({ analytics }: Props) {
  const { kpis } = analytics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-EU").format(value);
  };

  return (
    <div className=" bg-white dark:bg-neutral-950 p-6 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Sales Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Real-time overview of your store performance
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            icon={
              <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            }
          />
          <KpiCard
            title="Total Orders"
            value={formatNumber(kpis.totalOrders)}
            icon={
              <ShoppingCart className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            }
          />
          <KpiCard
            title="Active Customers"
            value={formatNumber(kpis.activeCustomers)}
            icon={
              <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            }
          />
          <KpiCard
            title="Avg Order Value"
            value={formatCurrency(kpis.averageOrderValue)}
            icon={
              <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            }
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border bg-white dark:bg-neutral-900">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Success
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {formatNumber(kpis.paymentSuccessCount)}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                  <ArrowUpRight className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white dark:bg-neutral-900">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Failures
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {formatNumber(kpis.paymentFailureCount)}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 rounded">
                  <ArrowDownRight className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border bg-white dark:bg-neutral-900">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Refund Rate
                  </p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                    {kpis.refundRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                    {formatCurrency(kpis.refundsAmount)} refunded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Customer Orders Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Customer Orders
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Orders created by admin for customers
            </p>
          </div>

          {/* Admin Customer Orders KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-neutral-900">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Admin Orders
                    </p>
                    <p className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">
                      {formatNumber(kpis.totalAdminCustomerOrders)}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded">
                    <ShoppingCart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-neutral-900">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Admin Orders Revenue
                    </p>
                    <p className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(kpis.adminCustomerRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded">
                    <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border bg-white dark:bg-neutral-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.adminCustomerOrdersByStatus.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            item.status === "paid"
                              ? "bg-emerald-500"
                              : item.status === "pending"
                              ? "bg-amber-500"
                              : item.status === "refunded"
                              ? "bg-rose-500"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {item.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(item.count)} orders
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Admin Orders */}
            <Card className="border bg-white dark:bg-neutral-900">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Admin Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {analytics.recentAdminCustomerOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customerName || "No Name"}
                        </p>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              order.status === "paid"
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : order.status === "pending"
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {order.status}
                          </span>
                          {order.orderStatus && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              {order.orderStatus}
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Revenue Chart - Full Width */}
        <Card className="border bg-white dark:bg-neutral-900">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Revenue Trend
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Daily revenue performance over time
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart
                data={analytics.revenueOverTime}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
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
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    const date = new Date(value + "T00:00:00");
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `€${(value / 1000).toFixed(1)}k`;
                    }
                    return `€${value}`;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label + "T00:00:00");
                    return date.toLocaleDateString("en-EU", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6b7280"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Status & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Status */}
          <Card className="border bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Revenue by Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.revenueByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={analytics.revenueByStatus}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      strokeOpacity={0.5}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="status"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000) {
                          return `€${(value / 1000).toFixed(0)}k`;
                        }
                        return `€${value}`;
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Revenue",
                      ]}
                      labelFormatter={(label) => `Status: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="#6b7280" radius={[6, 6, 0, 0]}>
                      {analytics.revenueByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.status === "paid"
                              ? "#10b981"
                              : entry.status === "pending"
                              ? "#f59e0b"
                              : entry.status === "refunded"
                              ? "#ef4444"
                              : "#6b7280"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No revenue data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="border bg-white dark:bg-neutral-900">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={analytics.topProducts.slice(0, 5)}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e5e7eb"
                      strokeOpacity={0.5}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000) {
                          return `€${(value / 1000).toFixed(0)}k`;
                        }
                        return `€${value}`;
                      }}
                    />
                    <YAxis
                      type="category"
                      dataKey="productName"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                      tickFormatter={(value) => {
                        if (typeof value === "string") {
                          return value.length > 20
                            ? value.substring(0, 20) + "..."
                            : value;
                        }
                        return String(value);
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.98)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                      }}
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Revenue",
                      ]}
                      labelFormatter={(label) => `Product: ${label}`}
                    />
                    <Bar
                      dataKey="totalRevenue"
                      fill="#3b82f6"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                  No product data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Latest transactions from your customers
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-neutral-800">
                    <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 dark:border-neutral-800/50"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.userName || "Guest"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {order.userEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className="capitalize font-medium border-gray-300 dark:border-gray-600"
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-EU", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>


      </div>
    </div>
  );
}

// Helper Component: KPI Card
function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border bg-white dark:bg-neutral-900">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-3xl font-bold mt-3 tracking-tight text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
          <div className="p-3 rounded bg-gray-100 dark:bg-neutral-800">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
