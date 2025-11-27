// components/admin/sidebar-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton({ open = true }: { open?: boolean }) {
  return (
    <aside
      className={`sticky left-0 top-0 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <Skeleton className="w-8 h-8 rounded-lg" />
          {open && <Skeleton className="h-5 w-28" />}
        </div>
      </div>

      {/* Toggle Button */}
      <Skeleton className={`absolute -right-3 top-20 h-6 w-6 rounded-full`} />

      {/* Nav items */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          >
            <Skeleton className="w-5 h-5" />
            {open && <Skeleton className="h-4 w-32" />}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {open && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
