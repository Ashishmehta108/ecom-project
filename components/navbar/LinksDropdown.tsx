"use client";

import Link from "next/link";
import { Menu, User, LogOut, ChevronRight } from "lucide-react";
import { links } from "@/utils/links";
import { authClient } from "@/lib/auth-client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

import userCartState from "@/lib/states/cart.state";

// Clean icon mapping (kept simple)
const linkIcons = {
  Home: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2 7-7 7 7 2 2M5 10v10a1 1 0 001 1h3m8-11v10a1 1 0 01-1 1h-3" />
    </svg>
  ),
  Products: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Favorites: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  Cart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Orders: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6M7 3h6l5 5v13a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    </svg>
  ),
  About: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8h.01M11 12h1v4h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function LinksDropdown() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    userCartState.getState().clear();
  };

  return (
    <Sheet modal>
      {/* Trigger */}
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Menu size={20} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </SheetTrigger>

      {/* Sidebar */}
      <SheetContent
        side="right"
        className="
          w-[85%] sm:w-[340px] h-full p-0
          flex flex-col
          bg-white dark:bg-neutral-950
          border-l border-neutral-200 dark:border-neutral-800
        "
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
              <Menu size={16} className="text-white dark:text-black" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Menu
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Navigate
              </p>
            </div>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <div className="space-y-1">
            {links.map((item) => {
              const Icon =
                linkIcons[item.label as keyof typeof linkIcons] ?? linkIcons.Home;

              return (
                <SheetClose key={item.href} asChild>
                  <Link
                    href={item.href}
                    className="
                      flex items-center justify-between
                      px-3 py-2.5 rounded-lg
                      text-sm font-medium
                      text-neutral-700 dark:text-neutral-300
                      hover:bg-neutral-100 dark:hover:bg-neutral-800
                      transition-colors
                    "
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-500">{Icon}</span>
                      <span>{item.label}</span>
                    </div>

                    <ChevronRight
                      size={16}
                      className="opacity-60 text-neutral-400"
                    />
                  </Link>
                </SheetClose>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          {isPending ? (
            <div className="space-y-2">
              <div className="h-10 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              <div className="h-9 rounded-md bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
            </div>
          ) : user ? (
            <div className="space-y-2">
              {/* Profile */}
              <SheetClose asChild>
                <Link
                  href="/profile"
                  className="
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-neutral-900 dark:text-neutral-100
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    transition-colors
                  "
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center">
                    <User size={16} className="text-white dark:text-black" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.name ?? "User"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Profile
                    </p>
                  </div>
                </Link>
              </SheetClose>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="
                  w-full flex items-center justify-center gap-2
                  py-2.5 rounded-lg
                  bg-red-500 hover:bg-red-600
                  text-white text-sm font-medium
                  transition-colors
                "
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="
                    w-full block text-center py-2.5 rounded-lg
                    bg-neutral-900 dark:bg-white
                    text-white dark:text-black text-sm font-medium
                  "
                >
                  Login
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/signup"
                  className="
                    w-full block text-center py-2.5 rounded-lg
                    border border-neutral-300 dark:border-neutral-700
                    text-neutral-800 dark:text-white text-sm font-medium
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    transition-colors
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