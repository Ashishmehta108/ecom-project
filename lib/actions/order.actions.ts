"use server";

import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET ALL ORDERS (summary only)
 * Uses drizzle relations automatically
 */
export async function getAllOrders() {
  const result = await db.query.orders.findMany({
    columns: {
      id: true,
      userId: true,
      total: true,
      currency: true,
      createdAt: true,
      orderStatus: true,
    },
    orderBy: (orders, { asc }) => [asc(orders.createdAt)],
  });

  return result;
}

/**
 * GET FULL ORDER DETAILS USING DRIZZLE RELATIONS
 */
export async function getOrderDetails(orderId: string) {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),

    with: {
      user: true,

      shippingAddress: true,
      items: {
        with: {
          product: {
            with: {
              productImages: true,
            },
          },
        },
      },

      payments: true,
      refunds: true,
      shipments: true,
    },
  });

  return order;
}

/**
 * UPDATE ORDER STATUS
 */
export async function updateOrderStatus(orderId: string, status: string) {
  await db
    .update(orders)
    .set({ orderStatus: status })
    .where(eq(orders.id, orderId));

  return { success: true };
}
