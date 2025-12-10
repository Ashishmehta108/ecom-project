"use server";

import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import {
  adminCustomerOrder,
  adminCustomerOrderItem,
} from "../db/schema";

/**
 * 📌 Fetch ALL POS orders
 * POS orders are simply adminCustomerOrders
 */
export async function getPosOrders() {
  const orders = await db.query.adminCustomerOrder.findMany({
    with: {
      items: true,
    },
    orderBy: (o) => desc(o.createdAt),
  });

  return orders;
}

/**
 * 📌 Fetch a single POS order
 */
export async function getPosOrder(orderId: string) {
  const [order] = await db.query.adminCustomerOrder.findMany({
    where: eq(adminCustomerOrder.id, orderId),
    with: {
      items: true,
    },
  });

  if (!order) return null;

  return {
    order,
    items: order.items, // order items already included
  };
}

/**
 * 📌 Update POS order status
 */
export async function updatePosOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "expired" | "cancelled"
) {
  await db
    .update(adminCustomerOrder)
    .set({ status })
    .where(eq(adminCustomerOrder.id, orderId));

  return { success: true };
}
