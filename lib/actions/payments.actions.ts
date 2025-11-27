"use server";

import { db } from "../db";
import { payments, user, orders, address } from "@/lib/db/schema";
import { desc, eq, like, sql } from "drizzle-orm";

export async function getPaymentsPaginated({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const offset = (page - 1) * limit;

  const whereClause = search
    ? like(user.email, `%${search}%`)
    : undefined;

  const data = await db
    .select({
      // payment fields
      id: payments.id,
      amount: payments.amount,
      currency: payments.currency,
      status: payments.status,
      createdAt: payments.createdAt,

      // user
      userEmail: user.email,

      // order
      orderId: orders.id,
      orderStatus: orders.orderStatus,
      subtotal: orders.subtotal,
      tax: orders.tax,
      shippingFee: orders.shippingFee,
      total: orders.total,

      // address
      shippingName: address.fullName,
      shippingPhone: address.phone,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    })
    .from(payments)
    .leftJoin(user, eq(payments.userId, user.id))
    .leftJoin(orders, eq(payments.orderId, orders.id))
    .leftJoin(address, eq(orders.shippingAddressId, address.id))
    .where(whereClause)
    .orderBy(desc(payments.createdAt))
    .limit(limit)
    .offset(offset);

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(payments)
    .leftJoin(user, eq(payments.userId, user.id))
    .where(whereClause);

  return {
    data,
    total: Number(total[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(total[0].count) / limit),
  };
}
