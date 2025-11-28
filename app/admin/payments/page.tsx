"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPaymentsPaginated } from "@/lib/actions/payments.actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const page = Number(params.get("page") || 1);
  const search = params.get("search") || "";

  const [loading, setLoading] = useState(false);
  const [paginated, setPaginated] = useState<any>(null);
  const [searchValue, setSearchValue] = useState(search);

  // ---------------- Skeleton ---------------- //
  function TableSkeleton() {
    return (
      <div className="animate-fade">
        <div className="flex gap-2 mb-4">
          <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
          <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
        </div>

        <div className="grid grid-cols-6 gap-4 px-2 py-3 border-b">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"
            />
          ))}
        </div>

        <div className="space-y-3 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 px-2 py-3 border-b items-center"
            >
              <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-4 w-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-full animate-pulse" />
              <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              <div className="h-8 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-md animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-10 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // ---------------- Load Data ---------------- //
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getPaymentsPaginated({ page, search });
      setPaginated(data);
      setLoading(false);
    }
    load();
  }, [page, search]);

  function updateQuery(obj: any) {
    const newParams = new URLSearchParams(params.toString());
    Object.entries(obj).forEach(([k, v]) =>
      v ? newParams.set(k, String(v)) : newParams.delete(k)
    );
    router.push(`/admin/payments?${newParams.toString()}`);
  }

  // ---------------- Loading State ---------------- //
  if (!paginated || loading) {
    return (
      <Card className="mt-6 p-6">
        <TableSkeleton />
      </Card>
    );
  }

  // ---------------- Main UI ---------------- //
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payments</CardTitle>
      </CardHeader>

      <CardContent>
        {/* SEARCH */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button onClick={() => updateQuery({ search: searchValue, page: 1 })}>
            Search
          </Button>
        </div>

        {/* TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.data.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="text-xs">{p.id}</TableCell>
                <TableCell>{p.userEmail || "N/A"}</TableCell>
                <TableCell>
                  {(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      p.status === "succeeded"
                        ? "default"
                        : p.status === "processing"
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>

                <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>

                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Payment Details</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        {/* Order */}
                        <div>
                          <h3 className="font-semibold text-sm mb-2">
                            Order Summary
                          </h3>
                          <div className="text-sm space-y-1">
                            <p>
                              <span className="font-medium">Order ID:</span>{" "}
                              {p.orderId || "N/A"}
                            </p>
                            <p>
                              <span className="font-medium">Status:</span>{" "}
                              {p.orderStatus}
                            </p>
                            <p>
                              <span className="font-medium">Subtotal:</span> €
                              {p.subtotal}
                            </p>
                            <p>
                              <span className="font-medium">Tax:</span> €{p.tax}
                            </p>
                            <p>
                              <span className="font-medium">Shipping Fee:</span>{" "}
                              €{p.shippingFee}
                            </p>
                            <p>
                              <span className="font-medium">Total:</span> €
                              {p.total}
                            </p>
                          </div>
                        </div>

                        {/* Shipping */}
                        <div>
                          <h3 className="font-semibold text-sm mb-2">
                            Shipping Address
                          </h3>

                          {p.shippingName ? (
                            <div className="text-sm space-y-1">
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {p.shippingName}
                              </p>
                              <p>
                                <span className="font-medium">Phone:</span>{" "}
                                {p.shippingPhone}
                              </p>
                              <p>
                                {p.line1}, {p.line2 && `${p.line2}, `}
                                {p.city}, {p.state} - {p.postalCode},{" "}
                                {p.country}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No address found
                            </p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => updateQuery({ page: page - 1 })}
          >
            Previous
          </Button>

          <span>
            Page {page} of {paginated.totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page >= paginated.totalPages}
            onClick={() => updateQuery({ page: page + 1 })}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
