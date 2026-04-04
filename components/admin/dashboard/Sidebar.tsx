"use client";

import {
  LayoutDashboard,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
};

export default function Sidebar({ collapsed, onToggle, activeNav, onNavChange }: Props) {
  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out shrink-0",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-2.5 px-4 h-14 border-b border-gray-200", collapsed && "justify-center px-0")}>
        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-900 tracking-tight">Vaultly</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              collapsed ? "justify-center" : "",
              activeNav === id
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-14 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors z-10 shadow-sm"
      >
        <ChevronLeft
          className={cn(
            "w-3 h-3 text-gray-400 transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
      </button>

      {/* Footer */}
      <div className={cn("p-2 border-t border-gray-200", collapsed && "flex justify-center")}>
        <div className={cn("flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors", collapsed && "justify-center")}>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">A</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">Admin</p>
              <p className="text-[10px] text-gray-500 truncate">admin@vaultly.io</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
