// "use server";

// import { db } from "@/lib/db";
// import {
//   orders,
//   payments,
//   refund,
//   orderItem,
//   product,
//   user,
// } from "@/lib/db/schema";

// import { and, eq, gte, inArray, desc, count, sum, sql, countDistinct } from "drizzle-orm";

// export async function getAdminAnalytics(daysBack: number = 30) {
//   const startDate = new Date();
//   startDate.setDate(startDate.getDate() - daysBack);

//   const SUCCESS = ["succeeded", "success", "paid"];
//   const FAILED = ["failed", "canceled", "cancelled"];

//   // -------------------------
//   //  KPIs
//   // -------------------------

//   const revenueQuery = await db
//     .select({
//       total: sum(payments.amount).mapWith(Number),
//     })
//     .from(payments)
//     .where(inArray(payments.status, SUCCESS));

//   const totalRevenue = (revenueQuery[0]?.total ?? 0) / 100;

//   const ordersQuery = await db.select({ count: count() }).from(orders);

//   const totalOrders = ordersQuery[0]?.count ?? 0;

//   const activeCustomersQuery = await db
//     .select({
//       count: countDistinct(orders.userId),
//     })
//     .from(orders)
//     .innerJoin(payments, eq(orders.id, payments.orderId))
//     .where(inArray(payments.status, SUCCESS));

//   const activeCustomers = activeCustomersQuery[0]?.count ?? 0;
//   const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

//   const refundsQuery = await db
//     .select({
//       total: sum(refund.amount).mapWith(Number),
//       count: count(),
//     })
//     .from(refund)
//     .where(eq(refund.status, "succeeded"));

//   const refundsAmount = (refundsQuery[0]?.total ?? 0) / 100;
//   const refundRate =
//     totalRevenue > 0 ? (refundsAmount / totalRevenue) * 100 : 0;

//   const paymentSuccessQuery = await db
//     .select({ count: count() })
//     .from(payments)
//     .where(inArray(payments.status, SUCCESS));

//   const paymentSuccessCount = paymentSuccessQuery[0]?.count ?? 0;

//   const paymentFailureQuery = await db
//     .select({ count: count() })
//     .from(payments)
//     .where(inArray(payments.status, FAILED));

//   const paymentFailureCount = paymentFailureQuery[0]?.count ?? 0;

//   // -------------------------
//   //  Revenue Over Time
//   // -------------------------

//   const revenueOverTime = await db
//     .select({
//       date: sql<string>`CAST(${payments.createdAt} AS DATE)`,
//       revenue: sum(payments.amount),
//     })
//     .from(payments)
//     .where(
//       and(gte(payments.createdAt, startDate), inArray(payments.status, SUCCESS))
//     )
//     .groupBy(sql`CAST(${payments.createdAt} AS DATE)`)
//     .orderBy(sql`CAST(${payments.createdAt} AS DATE)`);

//   // -------------------------
//   //  Orders Over Time
//   // -------------------------

//   const ordersOverTime = await db
//     .select({
//       date: sql<string>`CAST(${orders.createdAt} AS DATE)`,
//       count: count(),
//     })
//     .from(orders)
//     .where(gte(orders.createdAt, startDate))
//     .groupBy(sql`CAST(${orders.createdAt} AS DATE)`)
//     .orderBy(sql`CAST(${orders.createdAt} AS DATE)`);

//   // -------------------------
//   //  Revenue by Order Status
//   // -------------------------

//   const revenueByStatus = await db
//     .select({
//       status: orders.status,
//       revenue: sum(orders.total),
//     })
//     .from(orders)
//     .groupBy(orders.status)
//     .orderBy(desc(sum(orders.total)));

//   // -------------------------
//   //  Top Products
//   // -------------------------

//   const topProducts = await db
//     .select({
//       productId: orderItem.productId,
//       productName: product.productName,
//       totalRevenue: sum(orderItem.price).mapWith(Number),
//       totalQuantity: sum(orderItem.quantity).mapWith(Number),
//     })
//     .from(orderItem)
//     .innerJoin(product, eq(orderItem.productId, product.id))
//     .groupBy(orderItem.productId, product.productName)
//     .orderBy(desc(sum(orderItem.price)))
//     .limit(10);

//   // -------------------------
//   //  Recent Orders
//   // -------------------------

//   const recentOrders = await db
//     .select({
//       id: orders.id,
//       userName: user.name,
//       userEmail: user.email,
//       total: orders.total,
//       status: orders.status,
//       createdAt: orders.createdAt,
//     })
//     .from(orders)
//     .innerJoin(user, eq(orders.userId, user.id))
//     .orderBy(desc(orders.createdAt))
//     .limit(10);

//   // -------------------------
//   //  Top Customers
//   // -------------------------

//   const topCustomers = await db
//     .select({
//       userId: user.id,
//       name: user.name,
//       email: user.email,
//       totalSpent: sum(orders.total),
//       ordersCount: count(),
//     })
//     .from(user)
//     .innerJoin(orders, eq(user.id, orders.userId))
//     .groupBy(user.id, user.name, user.email)
//     .orderBy(desc(sum(orders.total)))
//     .limit(10);

//   return {
//     kpis: {
//       totalRevenue,
//       totalOrders,
//       activeCustomers,
//       averageOrderValue,
//       refundsAmount,
//       refundRate,
//       paymentSuccessCount,
//       paymentFailureCount,
//     },

//     revenueOverTime: revenueOverTime.map((r) => ({
//       date: String(r.date),
//       revenue: Number(r.revenue ?? 0) / 100,
//     })),

//     ordersOverTime: ordersOverTime.map((o) => ({
//       date: String(o.date),
//       count: Number(o.count),
//     })),

//     revenueByStatus: revenueByStatus.map((r) => ({
//       status: r.status,
//       revenue: Number(r.revenue ?? 0),
//     })),

//     topProducts: topProducts.map((p) => ({
//       productId: p.productId,
//       productName: p.productName,
//       totalRevenue: Number(p.totalRevenue ?? 0),
//       totalQuantity: Number(p.totalQuantity ?? 0),
//     })),

//     recentOrders: recentOrders.map((o) => ({
//       id: o.id,
//       userName: o.userName,
//       userEmail: o.userEmail,
//       total: Number(o.total ?? 0),
//       status: o.status,
//       createdAt: o.createdAt.toISOString(),
//     })),

//     topCustomers: topCustomers.map((c) => ({
//       userId: c.userId,
//       name: c.name,
//       email: c.email,
//       totalSpent: Number(c.totalSpent ?? 0),
//       ordersCount: Number(c.ordersCount ?? 0),
//     })),
//   };
// }

"use server";

import Stripe from "stripe";
import { db } from "@/lib/db";
import { orders, orderItem, user, product } from "@/lib/db/schema";
import { eq, desc, sum, count, inArray } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

/*
  HYBRID ANALYTICS (Stripe + DB)
*/

export async function getHybridAdminAnalytics(daysBack = 30) {
  const since = Math.floor(
    (Date.now() - daysBack * 24 * 60 * 60 * 1000) / 1000
  );

  // ------------------------------
  // STRIPE ANALYTICS
  // ------------------------------

  // 1. Fetch Payments (successful, failed)
  const paymentIntents = await stripe.paymentIntents.list({
    limit: 100,
    created: { gte: since },
  });

  const succeeded = paymentIntents.data.filter((p) => p.status === "succeeded");
  const failed = paymentIntents.data.filter(
    (p) => p.status === "canceled" || p.status === "requires_payment_method"
  );

  const totalRevenue =
    succeeded.reduce((sum, p) => sum + p.amount_received, 0) / 100;

  const paymentSuccessCount = succeeded.length;
  const paymentFailureCount = failed.length;

  // Revenue over time (stripe)
  const revenueOverTimeMap = new Map<string, number>();

  succeeded.forEach((p) => {
    const date = new Date(p.created * 1000).toISOString().split("T")[0];

    revenueOverTimeMap.set(
      date,
      (revenueOverTimeMap.get(date) ?? 0) + p.amount_received / 100
    );
  });

  const revenueOverTime = [...revenueOverTimeMap].map(([date, revenue]) => ({
    date,
    revenue,
  }));

  // Refunds
  const refunds = await stripe.refunds.list({
    limit: 100,
    created: { gte: since },
  });

  const refundsAmount =
    refunds.data.reduce((sum, r) => sum + r.amount, 0) / 100;

  const refundRate =
    totalRevenue > 0 ? (refundsAmount / totalRevenue) * 100 : 0;

  // Top Stripe Customers (by spend)
  const customerSpend: Record<string, { email: string | null; total: number }> =
    {};

  succeeded.forEach((p) => {
    const email = p.receipt_email ?? "unknown";

    if (!customerSpend[email]) {
      customerSpend[email] = { email, total: 0 };
    }

    customerSpend[email].total += p.amount_received / 100;
  });

  const topStripeCustomers = Object.values(customerSpend)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // ------------------------------
  // DATABASE ANALYTICS (Products + Orders)
  // ------------------------------

  // Count orders
  const totalOrdersRes = await db.select({ count: count() }).from(orders);

  const totalOrders = totalOrdersRes[0]?.count ?? 0;

  // Active customers (distinct userIds who made orders)
  const activeCustomersRes = await db.select({ count: count() }).from(orders);

  const activeCustomers = activeCustomersRes[0]?.count ?? 0;

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Revenue by status
  const revenueByStatus = await db
    .select({
      status: orders.status,
      revenue: sum(orders.total),
    })
    .from(orders)
    .groupBy(orders.status)
    .orderBy(desc(sum(orders.total)));

  // Top products
  const topProducts = await db
    .select({
      productId: orderItem.productId,
      productName: product.productName,
      totalRevenue: sum(orderItem.price),
      totalQuantity: sum(orderItem.quantity),
    })
    .from(orderItem)
    .innerJoin(product, eq(orderItem.productId, product.id))
    .groupBy(orderItem.productId, product.productName)
    .orderBy(desc(sum(orderItem.price)))
    .limit(5);

  // Recent orders
  const recentOrders = await db
    .select({
      id: orders.id,
      userName: user.name,
      userEmail: user.email,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(user, eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  return {
    kpis: {
      totalRevenue,
      totalOrders,
      activeCustomers,
      averageOrderValue,
      refundsAmount,
      refundRate,
      paymentSuccessCount,
      paymentFailureCount,
    },

    revenueOverTime,

    ordersOverTime: [], // Stripe does not store order count — optional

    revenueByStatus: revenueByStatus.map((r) => ({
      status: r.status,
      revenue: Number(r.revenue),
    })),

    topProducts: topProducts.map((p) => ({
      productId: p.productId,
      productName: p.productName,
      totalRevenue: Number(p.totalRevenue),
      totalQuantity: Number(p.totalQuantity),
    })),

    recentOrders: recentOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      total: Number(o.total),
    })),

    topCustomers: topStripeCustomers,
  };
}
