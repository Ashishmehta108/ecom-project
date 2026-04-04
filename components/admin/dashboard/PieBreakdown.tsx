"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getHybridAdminAnalytics } from "@/lib/actions/admin-actions/admin-analytic";

type AdminAnalytics = Awaited<ReturnType<typeof getHybridAdminAnalytics>>;

function CustomPieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-sm">
      <p className="text-gray-900 font-semibold">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value}%</p>
    </div>
  );
}

export default function PieBreakdown({ analytics }: { analytics: AdminAnalytics }) {
  const total = analytics.revenueByStatus.reduce((s, r) => s + r.revenue, 0);
  const pieData = analytics.revenueByStatus.map((r) => ({
    name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
    value: total > 0 ? Math.round((r.revenue / total) * 100) : 0,
    color:
      r.status === "paid"
        ? "#10b981"
        : r.status === "pending"
        ? "#f59e0b"
        : r.status === "refunded"
        ? "#f43f5e"
        : "#6b7280",
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Revenue Breakdown</h3>
      <p className="text-xs text-gray-500 mb-4">By order status</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {pieData.map((entry, i) => (
              <Cell key={i} fill={entry.color} opacity={0.9} />
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2 mt-2">
        {pieData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-500">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
