// app/api/webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments, orders, orderItem, cartItem, cart } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server error", { status: 500 });
  }

  if (!stripe) {
    console.error("Stripe client not initialized");
    return new Response("Server error", { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error("Signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log(`Stripe Event: ${event.type}`);

  // ------------------------------------------------------------------
  // 1️⃣ Handle Checkout Session Completed (main flow)
  // ------------------------------------------------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Checkout Session Completed:", session.id);

    const userId = session.metadata?.userId;
    const addressId = session.metadata?.addressId ?? null;
    const checkoutSessionId = session.id;

    if (!userId) {
      console.error("Missing userId in session metadata");
      return new Response("OK", { status: 200 });
    }

    // Extract payment_intent id (string)
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "";

    // 1. Ensure PAYMENT row exists (idempotent)
    if (paymentIntentId) {
      const existingPayment = await db.query.payments.findFirst({
        where: (table, { eq }) =>
          eq(table.stripePaymentIntentId, paymentIntentId),
      });

      if (!existingPayment) {
        await db.insert(payments).values({
          id: nanoid(),
          userId,
          orderId: null,
          stripePaymentIntentId: paymentIntentId,
          stripeCheckoutSessionId: checkoutSessionId,
          amount: session.amount_total ?? 0, // in smallest unit (cents)
          currency: (session.currency ?? "eur").toLowerCase(),
          status: "succeeded",
        });

        console.log("Payment created from Checkout session");
      } else if (existingPayment.status !== "succeeded") {
        await db
          .update(payments)
          .set({ status: "succeeded" })
          .where(eq(payments.id, existingPayment.id));

        console.log("Payment status updated from Checkout session");
      }
    }

    // 2. Ensure ORDER does not already exist (idempotency)
    const existingOrder = await db.query.orders.findFirst({
      where: (table, { eq }) =>
        eq(table.stripeCheckoutSessionId, checkoutSessionId),
    });

    if (existingOrder) {
      console.log("Order already exists, skipping order creation.");
      return new Response("OK", { status: 200 });
    }

    const orderId = nanoid();

    await db.insert(orders).values({
      id: orderId,
      userId,
      status: "successful", // your order-level status
      subtotal: ((session.amount_subtotal ?? 0) / 100).toString(),
      tax: "0",
      shippingFee: "0",
      total: ((session.amount_total ?? 0) / 100).toString(),
      currency: (session.currency ?? "INR").toUpperCase(),
      shippingAddressId: addressId,
      stripePaymentIntentId: paymentIntentId,
      stripeCheckoutSessionId: session.id,
    });

    console.log("Order created:", orderId);

    // 3. Attach ORDER_ID back to payment (so relation is connected)
    if (paymentIntentId) {
      await db
        .update(payments)
        .set({ orderId })
        .where(eq(payments.stripePaymentIntentId, paymentIntentId));
    }

    // 4. Move CART → ORDER ITEMS and clear cart
    const userCart = await db.query.cart.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    if (!userCart) {
      console.log("No cart found for user");
      return new Response("OK", { status: 200 });
    }

    const userCartItems = await db.query.cartItem.findMany({
      where: (table, { eq }) => eq(table.cartId, userCart.id),
    });

    if (userCartItems.length === 0) {
      console.log("Cart empty, nothing to move to order items");
    } else {
      for (const item of userCartItems) {
        await db.insert(orderItem).values({
          id: nanoid(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
      }

      console.log("Order items added:", userCartItems.length);

      await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

      console.log("Cart cleared");
    }

    return new Response("OK", { status: 200 });
  }

  // ------------------------------------------------------------------
  // 2️⃣ (Optional) Handle PaymentIntent Failure – mainly for tracking
  // ------------------------------------------------------------------
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log("PaymentIntent failed:", intent.id);

    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.stripePaymentIntentId, intent.id));

    return new Response("OK", { status: 200 });
  }

  console.log("Unhandled event type:", event.type);
  return new Response("OK", { status: 200 });
}
