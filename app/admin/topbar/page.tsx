"use client";

import { Search, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Topbar() {
  return (
    <header className="border-b border-neutral-300 dark:border-neutral-800 bg-card px-6 py-3 flex items-center justify-between">

      {/* Search Bar */}
      <div className="relative w-72 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <Input 
          className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
          placeholder="Search anything..."
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
        <User className="w-5 h-5 text-neutral-600 dark:text-neutral-300 cursor-pointer" />
      </div>

    </header>
  );
}
