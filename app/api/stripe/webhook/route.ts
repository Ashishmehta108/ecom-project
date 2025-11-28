import { NextRequest } from "next/server";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  payments,
  orders,
  orderItem,
  cartItem,
  cart,
  product,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/sendemail";
import { orderConfirmationTemplate } from "@/lib/orders/confirmationemail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------
// 🔧 Helper functions
// ---------------------------------------------

async function upsertPayment({
  userId,
  intentId,
  sessionId,
  amount,
  currency,
}: any) {
  const existing = await db.query.payments.findFirst({
    where: (t, { eq }) => eq(t.stripePaymentIntentId, intentId),
  });

  if (!existing) {
    await db.insert(payments).values({
      id: nanoid(),
      userId,
      orderId: null,
      stripePaymentIntentId: intentId,
      stripeCheckoutSessionId: sessionId,
      amount: amount || 0,
      currency: currency?.toLowerCase() || "eur",
      status: "succeeded",
    });
  } else if (existing.status !== "succeeded") {
    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.id, existing.id));
  }
}

async function createOrder(session: Stripe.Checkout.Session, userId: string) {
  const orderId = nanoid();

  await db.insert(orders).values({
    id: orderId,
    userId,
    status: "successful",
    subtotal: ((session.amount_subtotal ?? 0) / 100).toString(),
    tax: "0",
    shippingFee: "0",
    total: ((session.amount_total ?? 0) / 100).toString(),
    currency: (session.currency ?? "EUR").toUpperCase(),
    shippingAddressId: session.metadata?.addressId ?? null,
    stripePaymentIntentId: session.payment_intent as string,
    stripeCheckoutSessionId: session.id,
  });

  return orderId;
}

async function moveCartToOrder(orderId: string, userId: string) {
  const userCart = await db.query.cart.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  });

  if (!userCart) return [];

  const items = await db.query.cartItem.findMany({
    where: (t, { eq }) => eq(t.cartId, userCart.id),
  });

  for (const item of items) {
    await db.insert(orderItem).values({
      id: nanoid(),
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    });

    // Reduce inventory
    const current = await db.query.product.findFirst({
      where: (t, { eq }) => eq(t.id, item.productId),
    });

    if (current?.pricing) {
      const updated = {
        ...current.pricing,
        stockQuantity: Math.max(
          (current.pricing.stockQuantity || 0) - item.quantity,
          0
        ),
        inStock: (current.pricing.stockQuantity || 0) - item.quantity > 0,
      };

      await db
        .update(product)
        .set({ pricing: updated })
        .where(eq(product.id, item.productId));
    }
  }

  await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

  return items;
}

// ---------------------------------------------
// 🚀 Webhook Route
// ---------------------------------------------

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Missing webhook secret", { status: 500 });

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature!, secret);
  } catch (err: any) {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    // -------------------------------------------------
    // 1️⃣ PAYMENT INTENT SUCCEEDED
    // -------------------------------------------------
    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const userId = intent.metadata?.userId;
      if (!userId) break;

      await upsertPayment({
        userId,
        intentId: intent.id,
        sessionId: intent.metadata?.checkoutSessionId ?? "",
        amount: intent.amount_received,
        currency: intent.currency,
      });

      break;
    }

    // -------------------------------------------------
    // 2️⃣ CHECKOUT COMPLETED → CREATE ORDER
    // -------------------------------------------------
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      // Save payment
      await upsertPayment({
        userId,
        intentId: paymentIntentId,
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
      });

      // Prevent duplicate orders
      const existingOrder = await db.query.orders.findFirst({
        where: (t, { eq }) => eq(t.stripeCheckoutSessionId, session.id),
      });

      if (existingOrder) break;

      // Create order
      const orderId = await createOrder(session, userId);

      // Attach orderId to payment
      await db
        .update(payments)
        .set({ orderId })
        .where(eq(payments.stripePaymentIntentId, paymentIntentId!));

      // Move cart items → order items
      const purchasedItems = await moveCartToOrder(orderId, userId);

      // Send email
      await sendEmail({
        to: session.customer_details?.email!,
        subject: "Your Techbar Order Confirmation",
        html: orderConfirmationTemplate({
          customerName: session.customer_details?.name ?? "Customer",
          orderId,
          orderDate: new Date().toLocaleDateString(),
          total: ((session.amount_total ?? 0) / 100).toString(),
          items: purchasedItems.map((i) => ({
            title: i.name,
            quantity: i.quantity,
            price: i.price,
          })),
        }),
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;

      await db
        .update(payments)
        .set({ status: "failed" })
        .where(eq(payments.stripePaymentIntentId, intent.id));

      break;
    }

    default:
      console.log("Unhandled event:", event.type);
  }

  return new Response("OK", { status: 200 });
}
