import { getPosOrders } from "@/lib/actions/admin-actions/pos-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { CheckCircle2, XCircle, CreditCard, RefreshCcw } from "lucide-react";
import { Suspense } from "react";
import PosOrdersTableClient from "./client";

export const dynamic = "force-dynamic";

export default async function PosOrdersPage() {
  const orders = await getPosOrders();

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Page header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">POS Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track in-store orders, payments, and success status in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <span className="text-2xl font-semibold">{orders.length}</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Successful Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-2xl font-semibold">
                {orders.filter((o) => o.isSuccess).length}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {orders.length
                ? `${Math.round(
                    (orders.filter((o) => o.isSuccess).length / orders.length) *
                      100
                  )}%`
                : "0%"}{" "}
              success rate
            </span>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Revenue (POS)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <span className="text-2xl font-semibold">
              {orders.length
                ? `${orders[0].currency ?? "EUR"} ${orders
                    .map((o) => Number(o.total ?? "0"))
                    .reduce((a, b) => a + b, 0)
                    .toFixed(2)}`
                : "0.00"}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="border-border/60 bg-card/80 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-semibold">
              Recent POS Orders
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Includes payment IDs and success indicators.
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Suspense
            fallback={
              <div className="text-sm text-muted-foreground">
                Loading orders...
              </div>
            }
          >
            <PosOrdersTableClient orders={orders} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
