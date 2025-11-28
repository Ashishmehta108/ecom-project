"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";


export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    localStorage.removeItem("adminCustomerCartId");
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Order Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-neutral-600">
            <p className="mb-2">
              Payment successful! The order has been created and stock has been
              updated.
            </p>
            <p className="text-sm">
              Order ID:{" "}
              <span className="font-mono font-semibold">{orderId}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <Link href="/admin-customer-cart">Create New Order</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/admin/orders/${orderId}`}>View Order Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
