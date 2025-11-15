"use client";
import Sidebar from "./sidebar/page";
import Topbar from "./topbar/page";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
