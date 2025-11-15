"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const routes = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" },
    { name: "Products", icon: <Package size={18} />, href: "/admin/products" },
    { name: "Orders", icon: <ShoppingCart size={18} />, href: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, href: "/admin/users" },
  ];

  return (
    <div
      className={`border-r border-neutral-300 dark:border-neutral-800 bg-card h-screen p-4 transition-all duration-300 
      ${open ? "w-60" : "w-16"} relative`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 rounded-full shadow"
        onClick={() => setOpen(!open)}
      >
        <Menu />
      </Button>

      <div className="flex items-center gap-2 mb-8 mt-2 px-2">
        <span className="font-bold text-lg">🛒</span>
        {open && <span className="text-lg font-semibold">Admin</span>}
      </div>

      <nav className="space-y-2">
        {routes.map((item) => (
          <Link key={item.name} href={item.href}>
            <div className="flex items-center gap-3 p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer">
              {item.icon}
              {open && <span>{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
