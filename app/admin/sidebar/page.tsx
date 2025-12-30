"use client";

import { useState } from "react";
import SidebarSkeleton from "./loading";
import { authClient } from "@/lib/auth-client";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Tag,
  CreditCard,
  ChevronLeft,
  Store,
  UserSearch,
  Menu,
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const { data, isPending } = authClient.useSession();

  if (isPending) return <SidebarSkeleton open={open} />;

  const user = data?.user;

  const routes = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Orders", icon: ShoppingCart, href: "/admin/orders" },
    { name: "Products", icon: Package, href: "/admin/products" },
    { name: "Appointment", icon: UserSearch, href: "/admin/appointment" },
    { name: "Customers", icon: Users, href: "/admin/users" },
    { name: "Categories", icon: Tag, href: "/admin/categories" },
    { name: "Payments", icon: CreditCard, href: "/admin/payments" },
    {
      name: "Buy for customer",
      icon: ShoppingCart,
      href: "/admin/customers/order",
    },
    
  ];

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "sticky left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out",
        open ? "w-64" : "w-20"
      )}
    >
      {/* HEADER WITH TOGGLE */}
      <div className="relative flex items-center p-4 h-20 border-b border-neutral-200">
        {/* Sidebar toggle button replaces the logo */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
          className="h-9 w-9  text-neutral-700 hover:bg-neutral-100"
        >
          <Menu className={cn("h-5 w-5")} />
        </Button>

        {/* Title when expanded */}
        {open && (
          <h1 className="ml-3 text-xl font-semibold tracking-tight text-neutral-900">
            Admin Panel
          </h1>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-9rem)]">
        {routes.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative text-sm",
                  active
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                )}

                <Icon className="w-5 h-5 flex-shrink-0" />

                {/* Show text only when open */}
                {open && <span className="truncate">{item.name}</span>}

                {/* Tooltip when collapsed */}
                {!open && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-200 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible whitespace-nowrap shadow-md">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER USER CARD */}
      {open && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 bg-white">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-neutral-50">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-medium">
              {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.name ?? "Admin User"}
              </p>
              <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
