"use client";

import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { links } from "@/utils/links";
import { authClient } from "@/lib/auth-client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

export default function RightSidebar() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <Sheet>
      {/* OPEN BUTTON */}
      <SheetTrigger asChild>
        <button className="p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <Menu size={22} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[80%] sm:w-[340px] p-0 
        bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Menu
          </h2>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
          {links.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-3 rounded-lg
                text-neutral-800 dark:text-neutral-200 
                hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          {isPending && (
            <div className="h-11 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
          )}

          {/* USER LOGGED IN */}
          {!isPending && user && (
            <div className="space-y-3">
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg 
                  bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
                  hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-700 text-white">
                    <User size={16} />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name || "User"}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      View profile
                    </p>
                  </div>
                </Link>
              </SheetClose>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-lg font-medium
                bg-red-600 text-white
                hover:bg-red-500 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}

          {/* USER LOGGED OUT */}
          {!isPending && !user && (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="w-full px-4 py-3 rounded-lg text-center font-medium
                  bg-neutral-900 text-white hover:bg-neutral-800 transition"
                >
                  Login
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/signup"
                  className="w-full px-4 py-3 rounded-lg text-center font-medium
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
                >
                  Create Account
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
