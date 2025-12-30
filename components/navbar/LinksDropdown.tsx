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


import userCartState from "@/lib/states/cart.state";



export default function RightSidebar() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  const handleLogout = async () => {
    await authClient.signOut(); // Logout from auth
    userCartState.getState().clear(); // 🔥 Reset Cart
  };
  

  return (
    <Sheet modal>
      {/* TRIGGER BUTTON */}
      <SheetTrigger asChild>
        <button className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <Menu size={22} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </SheetTrigger>

      {/* SIDEBAR PANEL */}
      <SheetContent
        side="right"
        className="
          w-[80%] sm:w-[340px] h-full p-0 
          flex flex-col
          border-l border-neutral-200 dark:border-neutral-800 
          bg-white dark:bg-neutral-950 
          shadow-xl
          transition-transform duration-300 will-change-transform
        "
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Menu
          </h2>
        </div>

        {/* LINKS */}
        <nav className="flex-1 px-1 py-4 space-y-1 overflow-y-auto">
          {links.map((item) => (
            <SheetClose key={item.href} asChild>
              <Link
                href={item.href}
                className="
                  flex items-center px-5 py-3 rounded-lg
                  text-[15px] tracking-tight font-medium
                  text-neutral-800 dark:text-neutral-300
                  hover:bg-neutral-100 dark:hover:bg-neutral-800 transition
                "
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* FOOTER SECTION */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          {isPending ? (
            <div className="h-11 rounded-lg animate-pulse bg-neutral-200 dark:bg-neutral-800" />
          ) : user ? (
            <div className="space-y-3">
              {/* PROFILE */}
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    bg-neutral-100 dark:bg-neutral-800
                    text-neutral-900 dark:text-neutral-200
                    hover:bg-neutral-200 dark:hover:bg-neutral-700 transition
                  "
                >
                  <div className="w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-700 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name ?? "User"}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      View Profile
                    </p>
                  </div>
                </Link>
              </SheetClose>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center justify-center gap-2 py-3 rounded-lg
                  bg-red-600 hover:bg-red-500 transition text-white text-sm font-medium
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="
                    w-full text-center py-3 rounded-lg font-medium tracking-tight
                    bg-indigo-600 hover:bg-indigo-500 transition text-white
                  "
                >
                  Login
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/signup"
                  className="
                    w-full text-center py-3 rounded-lg border font-medium tracking-tight
                    border-neutral-300 dark:border-neutral-800
                    text-neutral-800 dark:text-white
                    hover:bg-neutral-100 dark:hover:bg-neutral-800 transition
                  "
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
