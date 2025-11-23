import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { payments, orders, orderItem, cartItem, cart } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error("❌ Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server error", { status: 500 });
  }

  // Stripe requires raw text body
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error("❌ Signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log(`⚡ Stripe Event Received: ${event.type}`);

  /* ===========================================================
      1) CHECKOUT SESSION COMPLETED
  ============================================================ */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("🎉 Checkout Session Completed:", session.id);

    const userId = session.metadata?.userId;
    const addressId = session.metadata?.addressId;

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const checkoutSessionId = session.id;

    // ---- Prevent Duplicate ----
    const existingPayment = await db
      .select()
      .from(payments)
      .where(eq(payments.stripeCheckoutSessionId, checkoutSessionId))
      .limit(1);

    if (existingPayment.length > 0) {
      console.log("⚠️ Payment already exists, skipping.");
      return new Response("OK", { status: 200 });
    }

    // ---- Create Payment ----
    await db.insert(payments).values({
      id: nanoid(),
      userId,
      stripePaymentIntentId: paymentIntentId ?? "",
      stripeCheckoutSessionId: checkoutSessionId,
      amount: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      status: "processing",
    });

    console.log("💾 Payment saved in database");

    // ===========================================================
    //  Create Order Immediately After Successful Checkout
    // ===========================================================

    const orderId = nanoid();

    await db.insert(orders).values({
      id: orderId,
      userId: userId!,
      status: "processing",
      subtotal: ((session.amount_subtotal ?? 0) / 100).toString(),
      tax: "0",
      shippingFee: "0",
      total: ((session.amount_total ?? 0) / 100).toString(),
      currency: session.currency ?? "INR",
      shippingAddressId: addressId || null,
      stripePaymentIntentId: paymentIntentId ?? "",
      stripeCheckoutSessionId: checkoutSessionId,
    });

    console.log("Order created:", orderId);

    const cart = await db.query.cart.findFirst({
      where: (table, { eq }) => eq(table.userId, userId!),
    });
    const cartItems = await db.query.cartItem.findMany({
      where: (table, { eq }) => eq(table.cartId, cart?.id!),
    });
    for (const item of cartItems) {
      await db.insert(orderItem).values({
        id: nanoid(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    console.log(" Order items added:", cartItems.length);

    return new Response("OK", { status: 200 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;

    console.log("PaymentIntent succeeded:", intent.id);

    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.stripePaymentIntentId, intent.id));

    return new Response("OK", { status: 200 });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;

    console.log(" PaymentIntent failed:", intent.id);

    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.stripePaymentIntentId, intent.id));

    return new Response("OK", { status: 200 });
  }

  console.log("Unhandled Stripe Event:", event.type);
  return new Response("OK", { status: 200 });
}
