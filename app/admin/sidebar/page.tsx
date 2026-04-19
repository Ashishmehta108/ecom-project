"use client";

import { useState } from "react";
import SidebarSkeleton from "./loading";
import { authClient } from "@/lib/auth-client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  CreditCard,
  UserSearch,
  PanelLeftClose,
  PanelLeftOpen,
  Store,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { name: "Dashboard",             icon: LayoutDashboard, href: "/admin" },
  { name: "Orders",                icon: ShoppingCart,    href: "/admin/orders" },
  { name: "Products",              icon: Package,         href: "/admin/products" },
  { name: "Appointments",          icon: UserSearch,      href: "/admin/appointment" },
  { name: "Customers",             icon: Users,           href: "/admin/users" },
  { name: "Categories",            icon: Tag,             href: "/admin/categories" },
  { name: "Payments",              icon: CreditCard,      href: "/admin/payments" },
  { name: "Customer Orders",       icon: ShoppingCart,    href: "/admin/orders/adminCustomerOrders" },
  { name: "Buy for Customer",      icon: Store,           href: "/admin/customers/order" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { data, isPending } = authClient.useSession();

  if (isPending) return <SidebarSkeleton open={open} />;

  const user = data?.user;

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === href;
    if (href === "/admin/orders") return pathname === "/admin/orders";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen border-r border-neutral-100 dark:border-neutral-800",
        "bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm",
        "transition-[width] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "overflow-hidden shrink-0 z-40",
        open ? "w-[220px]" : "w-[64px]"
      )}
    >
      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 px-3 h-16 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        {/* Toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl shrink-0",
            "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            "transition-colors duration-150"
          )}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open
            ? <PanelLeftClose className="w-4.5 h-4.5" strokeWidth={1.75} />
            : <PanelLeftOpen  className="w-4.5 h-4.5" strokeWidth={1.75} />}
        </button>

        {/* Logo text — fades + shrinks instead of mounting/unmounting */}
        <span
          className={cn(
            "font-semibold text-[15px] tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap",
            "transition-all duration-200 origin-left",
            open ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 pointer-events-none"
          )}
        >
          Admin Panel
        </span>
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {routes.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.name} href={item.href} title={!open ? item.name : undefined}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm",
                  "transition-all duration-150 cursor-pointer select-none",
                  active
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/70 hover:text-neutral-800 dark:hover:text-neutral-200"
                )}
              >
                {/* Active bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-500 rounded-r-full transition-all" />
                )}

                {/* Icon */}
                <Icon
                  className={cn(
                    "shrink-0 transition-colors duration-150",
                    active ? "w-[18px] h-[18px] text-indigo-600 dark:text-indigo-400" : "w-[18px] h-[18px]"
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                />

                {/* Label — CSS transition, no mount/unmount */}
                <span
                  className={cn(
                    "truncate leading-none transition-all duration-200 whitespace-nowrap",
                    open ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 pointer-events-none"
                  )}
                >
                  {item.name}
                </span>

                {/* Tooltip on collapsed */}
                {!open && (
                  <span
                    className={cn(
                      "absolute left-full ml-2.5 px-2.5 py-1.5 z-50",
                      "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900",
                      "text-[11px] font-medium rounded-lg whitespace-nowrap shadow-lg",
                      "invisible opacity-0 -translate-x-1",
                      "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0",
                      "transition-all duration-150 pointer-events-none"
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── FOOTER USER CARD ── */}
      <div className="shrink-0 px-2 pb-3 border-t border-neutral-100 dark:border-neutral-800 pt-2">
        <div
          className={cn(
            "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl",
            "bg-neutral-50 dark:bg-neutral-900/60",
            "transition-all duration-300"
          )}
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
          </div>

          {/* Info — CSS transition */}
          <div
            className={cn(
              "min-w-0 transition-all duration-200",
              open ? "opacity-100 max-w-[160px]" : "opacity-0 max-w-0 pointer-events-none overflow-hidden"
            )}
          >
            <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 truncate leading-snug">
              {user?.name ?? "Admin"}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate leading-snug">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
