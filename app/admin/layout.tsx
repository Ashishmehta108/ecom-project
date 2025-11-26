"use client";

import Sidebar from "./sidebar/page";
import Topbar from "./topbar/page";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const { data, isPending } = authClient.useSession();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/admin/login");
  const user = data?.user;

  const isLoadingSession = isPending || data === undefined;

  // Wait for session to fully resolve
  if (isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If logged out or on login page
  if (!user || isAuthPage) {
    return <div className="p-6 w-full">{children}</div>;
  }

  // Logged-in admin view
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
