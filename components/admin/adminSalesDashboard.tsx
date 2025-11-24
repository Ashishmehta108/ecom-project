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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Sales Analytics
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Overview of your store performance
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(kpis.totalRevenue)}
          icon={<DollarSign className="h-5 w-5 text-neutral-500" />}
          trend={null}
        />
        <KpiCard
          title="Total Orders"
          value={formatNumber(kpis.totalOrders)}
          icon={<ShoppingCart className="h-5 w-5 text-neutral-500" />}
          trend={null}
        />
        <KpiCard
          title="Active Customers"
          value={formatNumber(kpis.activeCustomers)}
          icon={<Users className="h-5 w-5 text-neutral-500" />}
          trend={null}
        />
        <KpiCard
          title="Avg Order Value"
          value={formatCurrency(kpis.averageOrderValue)}
          icon={<TrendingUp className="h-5 w-5 text-neutral-500" />}
          trend={null}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Payment Success</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatNumber(kpis.paymentSuccessCount)}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Payment Failures</p>
                <p className="text-2xl font-semibold mt-1">
                  {formatNumber(kpis.paymentFailureCount)}
                </p>
              </div>
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500">Refund Rate</p>
                <p className="text-2xl font-semibold mt-1">
                  {kpis.refundRate.toFixed(1)}%
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  {formatCurrency(kpis.refundsAmount)} refunded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={analytics.revenueOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e5e5"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-IN");
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Over Time */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analytics.ordersOverTime}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e5e5"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [value, "Orders"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString("en-IN");
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Status & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Revenue by Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.revenueByStatus.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize font-normal">
                      {item.status}
                    </Badge>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topProducts.slice(0, 5).map((product, idx) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {product.productName}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {formatNumber(product.totalQuantity)} units
                    </p>
                  </div>
                  <span className="font-medium text-sm ml-4">
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium">
                          {order.userName || "Guest"}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {order.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className="capitalize font-normal"
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card className="border-neutral-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topCustomers.slice(0, 5).map((customer, idx) => (
              <div
                key={customer.userId}
                className="flex items-center justify-between p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{customer.name || "Guest"}</p>
                  <p className="text-sm text-neutral-500">{customer.email}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {formatNumber(customer.ordersCount)} orders
                  </p>
                </div>
                <span className="font-semibold text-lg ml-4">
                  {formatCurrency(customer.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component: KPI Card
function KpiCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: { value: string; positive: boolean } | null;
}) {
  return (
    <Card className="border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-neutral-500 font-medium">{title}</p>
            <p className="text-3xl font-semibold mt-2 tracking-tight">
              {value}
            </p>
            {trend && (
              <div
                className={`flex items-center gap-1 mt-2 text-sm ${
                  trend.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.positive ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
