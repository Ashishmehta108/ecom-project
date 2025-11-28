"use client";

import Sidebar from "./sidebar/page";
import Topbar from "./topbar/page";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = authClient.useSession();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith("/admin/login");
  const user = data?.user;

  // Show loading screen while session is being fetched
  if (isPending || data === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // ----------------------------
  // 🚫 BLOCK NON-ADMINS FIRST
  // ----------------------------
  if (user && user.role !== "admin" && !isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground mt-2">
            You do not have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------
  // ✔️ Allow login page or unauthenticated
  // ----------------------------
  if (!user || isAuthPage) {
    return <div className="p-6 w-full">{children}</div>;
  }

  // ----------------------------
  // ✔️ Admin layout
  // ----------------------------
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
