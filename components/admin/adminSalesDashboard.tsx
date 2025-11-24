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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 p-6 md:p-8 lg:p-10">
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
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `€${value / 1000}k`}
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
                    const date = new Date(label);
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
              <div className="space-y-3">
                {analytics.revenueByStatus.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded bg-gray-50 dark:bg-neutral-800/50"
                  >
                    <Badge
                      variant="outline"
                      className="capitalize font-medium border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      {item.status}
                    </Badge>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                ))}
              </div>
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
              <div className="space-y-3">
                {analytics.topProducts.slice(0, 5).map((product, idx) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-4 rounded bg-gray-50 dark:bg-neutral-800/50"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {product.productName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {formatNumber(product.totalQuantity)} units sold
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(product.totalRevenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders Table */}
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

        {/* Top Customers */}
        <Card className="border bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              Top Customers
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Your most valuable customers by total spend
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCustomers.slice(0, 5).map((customer, idx) => (
                <div
                  key={customer.userId}
                  className="flex items-center justify-between p-5 rounded bg-gray-50 dark:bg-neutral-800/50"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">
                        {(customer.name || "G")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {customer.name || "Guest"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {customer.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {formatNumber(customer.ordersCount)} orders
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-xl text-gray-900 dark:text-white ml-4 whitespace-nowrap">
                    {formatCurrency(customer.totalSpent)}
                  </span>
                </div>
              ))}
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
