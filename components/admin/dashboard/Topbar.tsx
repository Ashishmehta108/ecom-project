"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import { DateRange } from "./types";
import { cn } from "@/lib/utils";

const ranges: { label: string; value: DateRange }[] = [
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "1y", value: "1y" },
];

type Props = {
  dateRange: DateRange;
  onDateRangeChange: (r: DateRange) => void;
};

export default function Topbar({ dateRange, onDateRangeChange }: Props) {
  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center px-6 gap-4 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex-1" />

      {/* Date range */}
      <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
        {ranges.map((r) => (
          <button
            key={r.value}
            onClick={() => onDateRangeChange(r.value)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-md transition-all duration-150",
              dateRange === r.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Notifications */}
      <button className="relative w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
        <Bell className="w-4 h-4 text-gray-500" />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2 hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-xs font-bold text-white">A</span>
        </div>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>
    </header>
  );
}
