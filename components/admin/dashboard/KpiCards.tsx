"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Percent } from "lucide-react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { getHybridAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";
import { DateRange } from "./types";

type AdminAnalytics = Awaited<ReturnType<typeof getHybridAdminAnalytics>>;

// Generate random sparkline data
function spark(base: number, length = 12): number[] {
  let val = base;
  return Array.from({ length }, () => {
    val = Math.max(0, val + (Math.random() - 0.44) * base * 0.15);
    return Math.round(val);
  });
}

type KpiCardProps = {
  title: string;
  value: string;
  change: number;
  sparkData: number[];
  icon: React.ReactNode;
  accent: string;
  bgClass: string;
};

function KpiCard({ title, value, change, sparkData, icon, accent, bgClass }: KpiCardProps) {
  const positive = change >= 0;
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-5 overflow-hidden hover:border-gray-300 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1 tracking-tight">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass}`}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-1.5">
          {positive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          )}
          <span className={`text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-500"}`}>
            {positive ? "+" : ""}{change}%
          </span>
          <span className="text-xs text-gray-400">vs last period</span>
        </div>

        <div className="w-24 h-8 opacity-60">
          <Sparklines data={sparkData} margin={2}>
            <SparklinesLine
              color={positive ? "#10b981" : "#f43f5e"}
              style={{ fill: "none", strokeWidth: 1.5 }}
            />
          </Sparklines>
        </div>
      </div>
    </div>
  );
}

type Props = {
  analytics: AdminAnalytics;
  dateRange: DateRange;
};

export default function KpiCards({ analytics, dateRange }: Props) {
  const { kpis } = analytics;

  // Combine revenue from both sources
  const totalCombinedRevenue = kpis.totalRevenue + kpis.adminCustomerRevenue;

  // Format revenue with max 3 decimals
  const formatRevenue = (value: number) => {
    if (value >= 1000) {
      const k = value / 1000;
      return `€${k.toFixed(Math.min(3, 1))}k`;
    }
    return `€${value.toFixed(3).replace(/\.?0+$/, "")}`;
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatRevenue(totalCombinedRevenue),
      change: 12.4,
      sparkData: spark(totalCombinedRevenue / 30),
      icon: <DollarSign className="w-4 h-4" />,
      accent: "#6366f1",
      bgClass: "bg-indigo-50",
    },
    {
      title: "Total Orders",
      value: kpis.totalOrders.toLocaleString(),
      change: 8.1,
      sparkData: spark(kpis.totalOrders),
      icon: <ShoppingCart className="w-4 h-4" />,
      accent: "#8b5cf6",
      bgClass: "bg-violet-50",
    },
    {
      title: "Active Customers",
      value: kpis.activeCustomers.toLocaleString(),
      change: 5.7,
      sparkData: spark(kpis.activeCustomers),
      icon: <Users className="w-4 h-4" />,
      accent: "#06b6d4",
      bgClass: "bg-cyan-50",
    },
    {
      title: "Avg Order Value",
      value: `€${kpis.averageOrderValue.toFixed(2)}`,
      change: -0.3,
      sparkData: spark(kpis.averageOrderValue),
      icon: <Percent className="w-4 h-4" />,
      accent: "#f59e0b",
      bgClass: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <KpiCard key={card.title} {...card} />
      ))}
    </div>
  );
}
