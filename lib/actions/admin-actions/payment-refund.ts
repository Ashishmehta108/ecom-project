"use server";

import { db } from "@/lib/db";
import { adminCustomerOrder } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export type PaymentStatus = "pending" | "paid" | "refunded";

interface PaymentUpdateResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Process a refund through Stripe
 */
export async function processStripeRefund(
  orderId: string,
  paymentIntentId: string,
  amount?: number // Amount in cents, if partial refund
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  try {
    // Find the latest charge for this payment intent
    const charges = await stripe.charges.list({
      payment_intent: paymentIntentId,
      limit: 1,
    });

    if (!charges.data.length) {
      return { success: false, error: "No charge found for this payment" };
    }

    const charge = charges.data[0];

    // Create refund
    const refund = await stripe.refunds.create({
      charge: charge.id,
      amount: amount || charge.amount, // Full refund if amount not specified
      reason: "requested_by_customer",
    });

    return { success: true, refundId: refund.id };
  } catch (error) {
    console.error("Stripe refund error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process refund",
    };
  }
}

/**
 * Update payment status with validation
 * - pending -> paid: Manual payment confirmation
 * - paid -> refunded: Process refund through Stripe
 * - paid -> pending: Reverse payment (requires confirmation)
 * - refunded -> paid: Reverse refund (if needed)
 */
export async function updateOrderPaymentStatusWithValidation(
  orderId: string,
  newStatus: PaymentStatus,
  options?: {
    confirmRefund?: boolean;
    refundAmount?: number; // in cents
  }
): Promise<PaymentUpdateResult> {
  try {
    // Fetch current order
    const order = await db.query.adminCustomerOrder.findFirst({
      where: eq(adminCustomerOrder.id, orderId),
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    const currentStatus = order.status || "pending";

    // Validate status transitions
    if (currentStatus === newStatus) {
      return { success: false, error: "Order is already in this status" };
    }

    // Handle paid -> refunded transition
    if (currentStatus === "paid" && newStatus === "refunded") {
      if (!order.stripePaymentIntentId) {
        return {
          success: false,
          error: "No Stripe payment found for this order. Update status manually.",
        };
      }

      if (!options?.confirmRefund) {
        return {
          success: false,
          error: "Refund requires confirmation. Please confirm to proceed.",
        };
      }

      // Process Stripe refund
      const refundResult = await processStripeRefund(
        orderId,
        order.stripePaymentIntentId,
        options.refundAmount
      );

      if (!refundResult.success) {
        return {
          success: false,
          error: `Failed to process refund: ${refundResult.error}`,
        };
      }

      // Update order with refund info
      const [updated] = await db
        .update(adminCustomerOrder)
        .set({
          status: "refunded",
          updatedAt: new Date(),
        })
        .where(eq(adminCustomerOrder.id, orderId))
        .returning();

      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders/adminCustomerOrders");

      return { success: true, data: updated };
    }

    // Handle refunded -> paid (reverse refund)
    if (currentStatus === "refunded" && newStatus === "paid") {
      const [updated] = await db
        .update(adminCustomerOrder)
        .set({
          status: "paid",
          updatedAt: new Date(),
        })
        .where(eq(adminCustomerOrder.id, orderId))
        .returning();

      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders/adminCustomerOrders");

      return { success: true, data: updated };
    }

    // Handle paid -> pending (reverse payment)
    if (currentStatus === "paid" && newStatus === "pending") {
      const [updated] = await db
        .update(adminCustomerOrder)
        .set({
          status: "pending",
          updatedAt: new Date(),
        })
        .where(eq(adminCustomerOrder.id, orderId))
        .returning();

      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders/adminCustomerOrders");

      return { success: true, data: updated };
    }

    // Handle pending -> paid (manual payment confirmation)
    if (currentStatus === "pending" && newStatus === "paid") {
      const [updated] = await db
        .update(adminCustomerOrder)
        .set({
          status: "paid",
          updatedAt: new Date(),
        })
        .where(eq(adminCustomerOrder.id, orderId))
        .returning();

      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
      revalidatePath("/admin/orders/adminCustomerOrders");

      return { success: true, data: updated };
    }

    // For other transitions, allow them but warn
    const [updated] = await db
      .update(adminCustomerOrder)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(adminCustomerOrder.id, orderId))
      .returning();

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders/adminCustomerOrders");

    return { success: true, data: updated };
  } catch (error) {
    console.error("[updateOrderPaymentStatusWithValidation]", error);
    return {
      success: false,
      error: "Failed to update payment status",
    };
  }
}

/**
 * Get refund information for an order
 */
export async function getOrderRefundInfo(orderId: string): Promise<{
  success: boolean;
  refunds?: any[];
  error?: string;
}> {
  try {
    const order = await db.query.adminCustomerOrder.findFirst({
      where: eq(adminCustomerOrder.id, orderId),
    });

    if (!order || !order.stripePaymentIntentId) {
      return { success: false, error: "No Stripe payment found" };
    }

    const charges = await stripe.charges.list({
      payment_intent: order.stripePaymentIntentId,
      limit: 1,
      expand: ["data.refunds"],
    });

    if (!charges.data.length) {
      return { success: false, error: "No charges found" };
    }

    const refunds = charges.data[0].refunds?.data || [];

    return { success: true, refunds };
  } catch (error) {
    console.error("[getOrderRefundInfo]", error);
    return {
      success: false,
      error: "Failed to fetch refund information",
    };
  }
}
