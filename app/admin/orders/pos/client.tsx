"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Copy } from "lucide-react";
import { useState } from "react";
import type { PosOrderWithMeta } from "@/lib/actions/admin-actions/pos-orders";
import { cn } from "@/lib/utils";

type Props = {
  orders: PosOrderWithMeta[];
};

export default function PosOrdersTableClient({ orders }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (value: string | null, id: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
        <p>No POS orders found yet.</p>
        <p className="text-xs">
          Create a POS order to see it appear here with payment status.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background/40">
      <div className="max-h-[540px] overflow-auto">
        <Table className="min-w-full text-sm">
          <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur">
            <TableRow className="border-border/60">
              <TableHead className="w-[140px]">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Success</TableHead>
              <TableHead className="w-[140px]">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const paymentDisplayId =
                order.stripePaymentIntentId ??
                order.stripeCheckoutSessionId ??
                order.paymentId;

              const created =
                order.createdAt &&
                new Date(order.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

              const totalFormatted = `${order.currency ?? "EUR"} ${Number(
                order.total ?? "0"
              ).toFixed(2)}`;

              return (
                <TableRow
                  key={order.orderId}
                  className="border-border/40 transition-colors hover:bg-muted/40"
                >
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="truncate text-xs text-muted-foreground">
                        {order.orderId}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[13px] font-medium">
                        {order.customerName ?? "Walk-in customer"}
                      </span>
                      {order.customerPhone && (
                        <span className="text-[11px] text-muted-foreground">
                          {order.customerPhone}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {paymentDisplayId ? (
                      <div className="flex items-center gap-1">
                        <span className="max-w-[160px] truncate text-xs font-mono text-muted-foreground">
                          {paymentDisplayId}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleCopy(paymentDisplayId, order.orderId)
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        {copiedId === order.orderId && (
                          <span className="text-[10px] text-muted-foreground">
                            Copied
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="text-[13px] font-medium">
                      {totalFormatted}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant="outline"
                        className="w-fit border-border/70 bg-background/40 px-2 py-0 text-[11px] font-normal capitalize"
                      >
                        {order.status ?? "pending"}
                      </Badge>
                      {order.orderStatus &&
                        order.orderStatus !== order.status && (
                          <span className="text-[10px] text-muted-foreground capitalize">
                            Order: {order.orderStatus}
                          </span>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={cn(
                        "flex w-fit items-center gap-1 px-2 py-0 text-[11px] font-medium",
                        order.isSuccess
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/40"
                          : "bg-amber-500/10 text-amber-500 border-amber-500/40"
                      )}
                      variant="outline"
                    >
                      {order.isSuccess ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-[11px] text-muted-foreground">
                      {created ?? "—"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
