"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  Tag,
  CreditCard,
  ChevronLeft,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

  const routes = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      name: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      name: "Customers",
      icon: Users,
      href: "/admin/users",
    },
    {
      name: "Categories",
      icon: Tag,
      href: "/admin/categories",
    },
    {
      name: "Payments",
      icon: CreditCard,
      href: "/admin/payments",
    },
    {
      name: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "sticky left-0 top-0 z-40 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          {open && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-semibold truncate">Store Admin</h1>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute -right-3 top-20 h-6 w-6 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-all",
          !open && "rotate-180"
        )}
        onClick={() => setOpen(!open)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
        {routes.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  active
                    ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {/* Active Indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                )}

                <Icon
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    open ? "w-5 h-5" : "w-5 h-5 mx-auto"
                  )}
                />

                {open && (
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                )}

                {/* Tooltip for collapsed state */}
                {!open && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {open && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Admin User</p>
              <p className="text-xs text-neutral-500 truncate">
                admin@store.com
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
