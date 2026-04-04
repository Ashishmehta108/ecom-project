"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { userGrowthData } from "../data/mockData";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-white/[0.08] rounded-xl px-4 py-3 shadow-xl space-y-1">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-xs font-medium text-emerald-400">+{payload[0]?.value} new</p>
      <p className="text-xs font-medium text-rose-400">-{payload[1]?.value} churned</p>
    </div>
  );
}

export default function UserGrowthChart() {
  return (
    <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-white">User Growth</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Weekly new vs churned</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-500">New</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-xs text-zinc-500">Churned</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={userGrowthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "#52525b" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#52525b" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff05" }} />
          <Bar dataKey="new" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} opacity={0.85} />
          <Bar dataKey="churned" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={28} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
