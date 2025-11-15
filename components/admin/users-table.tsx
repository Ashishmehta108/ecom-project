"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { UsersTableSkeleton } from "./usersSkeleton";

export interface AppUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: "admin" | "user" | string;
  banned: boolean;
  banReason: string | null;
  banExpires: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersTable({ users }: { users: AppUser[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <UsersTableSkeleton />;
  }

  return (
    <div className="rounded-xl border border-neutral-300 dark:border-neutral-800 bg-card shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-100 dark:bg-neutral-900/50">
              <TableHead className="w-48">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Verified</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-900"
              >
                <TableCell className="font-medium">{u.name || "—"}</TableCell>
                <TableCell>{u.email}</TableCell>

                <TableCell className="text-center">
                  <Badge variant="outline" className="capitalize">
                    {u.role}
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  {u.emailVerified ? (
                    <Badge className="bg-green-600 text-white">Verified</Badge>
                  ) : (
                    <Badge variant="destructive">Not Verified</Badge>
                  )}
                </TableCell>

                <TableCell className="text-right text-sm text-neutral-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
