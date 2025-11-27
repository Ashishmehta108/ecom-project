"use client";

import useSWR from "swr";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function CategoriesSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Table container */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-3 bg-gray-100 dark:bg-neutral-900 p-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 p-3 items-center">
              <Skeleton className="h-14 w-14 rounded-md" />
              <Skeleton className="h-4 w-32" />

              <div className="flex gap-3">
                <Skeleton className="h-8 w-10 rounded-md" />
                <Skeleton className="h-8 w-10 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoriesPage() {
  const { data: categories, mutate } = useSWR("/api/categories", fetcher);
  if (!categories) return <CategoriesSkeleton />;

  async function deleteCategory(id: string) {
    await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    mutate();
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button>Add Category</Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories?.map((cat: any) => (
              <tr key={cat.id} className="border-b">
                <td className="p-3">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                </td>

                <td className="p-3 font-medium">{cat.name}</td>

                <td className="p-3 flex gap-3">
                  <Link href={`/admin/categories/${cat.id}`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {!categories?.length && (
              <tr>
                <td colSpan={3} className="p-5 text-center text-gray-400">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
