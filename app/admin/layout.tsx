import type { Metadata } from "next";
import { Inter } from "next/font/google";
//@ts-ignore
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin | Furniture Store",
  description: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}