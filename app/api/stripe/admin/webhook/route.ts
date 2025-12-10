import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

import {
  adminCustomerOrder,
  adminCustomerOrderItem,
  product,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  // const body = await req.text();
  const buf = Buffer.from(await req.arrayBuffer());

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        // Optional: additional safety check
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "checkout.session.expired":
        await handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const orderId = session.metadata?.adminCustomerOrderId;

  if (!orderId) {
    console.error("No adminCustomerOrderId in session metadata");
    return;
  }

  try {
    await db.transaction(async (tx) => {
      // Fetch order with items
      const order = await tx.query.adminCustomerOrder.findFirst({
        where: eq(adminCustomerOrder.id, orderId),
        with: {
          items: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error(`Order not found: ${orderId}`);
      }

      if (order.status !== "pending") {
        console.log(
          `Order ${orderId} already processed. Status: ${order.status}`
        );
        return;
      }

      // Validate and decrement stock for each item
      const stockUpdates: Array<{ productId: string; newStock: number }> = [];
      //@ts-ignore
      for (const item of order?.items) {
        const currentStock = item.product.pricing.stockQuantity;

        if (currentStock < item.quantity) {
          await tx
            .update(adminCustomerOrder)
            .set({
              status: "requires_manual_review",
              orderStatus: "requires_manual_review",
            })
            .where(eq(adminCustomerOrder.id, orderId));

          console.error(
            `Insufficient stock for ${item.product.productName}. Available: ${currentStock}, Required: ${item.quantity}`
          );
          return;
        }

        stockUpdates.push({
          productId: item.productId,
          newStock: currentStock - item.quantity,
        });
      }

      // Apply stock decrements
      for (const update of stockUpdates) {
        const prod = await tx.query.product.findFirst({
          where: eq(product.id, update.productId),
        });

        if (!prod) continue;

        const updatedPricing = {
          ...prod.pricing,
          stockQuantity: update.newStock,
          inStock: update.newStock > 0,
        };

        await tx
          .update(product)
          .set({ pricing: updatedPricing })
          .where(eq(product.id, update.productId));
      }

      // Update order status
      await tx
        .update(adminCustomerOrder)
        .set({
          status: "paid",
          orderStatus: "completed",
          stripePaymentIntentId: session.payment_intent as string,
          stripeCheckoutSessionId: session.id,
        })
        .where(eq(adminCustomerOrder.id, orderId));

      console.log(`Order ${orderId} completed successfully. Stock updated.`);
    });
  } catch (error) {
    console.error("Error processing checkout session:", error);
    throw error;
  }
}

/**
 * Handle successful payment intent (optional extra validation)
 */
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
) {
  console.log(`Payment intent succeeded: ${paymentIntent.id}`);
  // Additional logic if needed
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.adminCustomerOrderId;

  if (!orderId) return;

  try {
    await db
      .update(adminCustomerOrder)
      .set({
        status: "expired",
        orderStatus: "expired",
      })
      .where(eq(adminCustomerOrder.id, orderId));

    console.log(`Order ${orderId} marked as expired`);
  } catch (error) {
    console.error("Error handling expired session:", error);
  }
}
