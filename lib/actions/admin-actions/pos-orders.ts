"use server";

import { db } from "@/lib/db";
import { posOrder, posCustomer, posPayment } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

type PosOrder = typeof posOrder.$inferSelect;
type PosCustomer = typeof posCustomer.$inferSelect;
type PosPayment = typeof posPayment.$inferSelect;

export type PosOrderWithMeta = {
  orderId: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;

  total: string;
  currency: string | null;

  status: string | null;
  orderStatus: string | null;

  createdAt: Date | null;

  paymentId: string | null;
  paymentStatus: string | null;

  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;

  isSuccess: boolean;
};

export async function getPosOrders(): Promise<PosOrderWithMeta[]> {
  const rows = await db
    .select({
      orderId: posOrder.id,
      customerName: posCustomer.name,
      customerEmail: posCustomer.email,
      customerPhone: posCustomer.phone,

      total: posOrder.total,
      currency: posOrder.currency,

      status: posOrder.status,
      orderStatus: posOrder.orderStatus,
      createdAt: posOrder.createdAt,

      paymentId: posPayment.id,
      paymentStatus: posPayment.status,

      stripePaymentIntentId: posOrder.stripePaymentIntentId,
      stripeCheckoutSessionId: posOrder.stripeCheckoutSessionId,
    })
    .from(posOrder)
    .leftJoin(posCustomer, eq(posCustomer.id, posOrder.customerId))
    .leftJoin(posPayment, eq(posPayment.orderId, posOrder.id))
    .orderBy(desc(posOrder.createdAt));

  return rows.map((row) => {
    if (!row) {
      return {
        orderId: "",
        customerName: null,
        customerEmail: null,
        customerPhone: null,
        total: "0",
        currency: "EUR",
        status: null,
        orderStatus: null,
        createdAt: null,
        paymentId: null,
        paymentStatus: null,
        stripePaymentIntentId: null,
        stripeCheckoutSessionId: null,
        isSuccess: false,
      };
    }

    const paymentStatus = row.paymentStatus?.toLowerCase() ?? "";
    const status = row.status?.toLowerCase() ?? "";
    const orderStatus = row.orderStatus?.toLowerCase() ?? "";

    const isSuccess =
      paymentStatus === "succeeded" ||
      paymentStatus === "successful" ||
      orderStatus === "paid" ||
      status === "paid";

    return {
      orderId: row.orderId,
      customerName: row.customerName ?? null,
      customerEmail: row.customerEmail ?? null,
      customerPhone: row.customerPhone ?? null,
      total: String(row.total),
      currency: row.currency,
      status: row.status,
      orderStatus: row.orderStatus,
      createdAt: row.createdAt ?? null,
      paymentId: row.paymentId ?? null,
      paymentStatus: row.paymentStatus ?? null,
      stripePaymentIntentId: row.stripePaymentIntentId ?? null,
      stripeCheckoutSessionId: row.stripeCheckoutSessionId ?? null,
      isSuccess,
    };
  });
}
