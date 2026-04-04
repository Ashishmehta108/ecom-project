"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { AdminAnalytics } from "../types";

type Props = { analytics: AdminAnalytics };

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs shadow-sm">
      <p className="text-gray-900 font-semibold">{payload[0].name}</p>
      <p className="text-gray-500">{payload[0].value.toLocaleString()}</p>
    </div>
  );
}

export default function PaymentDonut({ analytics }: Props) {
  const { kpis } = analytics;
  const total = kpis.paymentSuccessCount + kpis.paymentFailureCount;
  const pending = Math.round(total * 0.05);

  const data = [
    { name: "Successful", value: kpis.paymentSuccessCount, color: "#10b981" },
    { name: "Failed", value: kpis.paymentFailureCount, color: "#f43f5e" },
    { name: "Pending", value: pending, color: "#f59e0b" },
  ];

  const successRate = ((kpis.paymentSuccessCount / (total + pending)) * 100).toFixed(1);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment Status</h3>
      <p className="text-xs text-gray-500 mb-2">All transactions</p>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{successRate}%</p>
            <p className="text-[10px] text-gray-500">success</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-500">{item.name}</span>
            </div>
            <span className="text-xs font-semibold text-gray-900">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
