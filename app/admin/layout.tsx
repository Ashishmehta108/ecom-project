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

  const user = data?.user;

  // Hide sidebar/topbar on login page
  const isAuthPage = pathname.startsWith("/admin/login");

  // While session is loading
  if (isPending) return <div className="p-6 w-full">{children}</div>;

  // If logged out OR on login page → show only children
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
