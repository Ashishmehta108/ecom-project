
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

  // Verify signature
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: any) {
    console.error("Signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  console.log(`Stripe Event: ${event.type}`);

  // ------------------------------------------------------------------
  // 1️⃣ PAYMENT INTENT SUCCEEDED
  // ------------------------------------------------------------------
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.log("PaymentIntent succeeded:", intent.id);

    const userId = intent.metadata?.userId;
    if (!userId) return new Response("OK", { status: 200 });

    const existingPayment = await db.query.payments.findFirst({
      where: (table, { eq }) => eq(table.stripePaymentIntentId, intent.id),
    });

    if (existingPayment) {
      await db
        .update(payments)
        .set({ status: "succeeded" })
        .where(eq(payments.stripePaymentIntentId, intent.id));

      return new Response("OK", { status: 200 });
    }

    await db.insert(payments).values({
      id: nanoid(),
      userId,
      orderId: null,
      stripePaymentIntentId: intent.id,
      stripeCheckoutSessionId: intent.metadata?.checkoutSessionId ?? "",
      amount: intent.amount_received ?? 0,
      currency: intent.currency ?? "EUR",
      status: "succeeded",
    });

    console.log("Payment created successfully");
    return new Response("OK", { status: 200 });
  }

  // ------------------------------------------------------------------
  // 2️⃣ CHECKOUT SESSION COMPLETED
  // ------------------------------------------------------------------
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("Checkout Session Completed:", session.id);

    const userId = session.metadata?.userId;
    const addressId = session.metadata?.addressId ?? null;
    const checkoutSessionId = session.id;

    if (!userId) return new Response("OK", { status: 200 });

    // Extract paymentIntentId
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? "";

    // Create/Update PAYMENT (Idempotent)
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
          amount: session.amount_total ?? 0,
          currency: (session.currency ?? "EUR").toLowerCase(),
          status: "succeeded",
        });
      } else if (existingPayment.status !== "succeeded") {
        await db
          .update(payments)
          .set({ status: "succeeded" })
          .where(eq(payments.id, existingPayment.id));
      }
    }

    // Idempotency: Skip if order already exists
    const existingOrder = await db.query.orders.findFirst({
      where: (table, { eq }) =>
        eq(table.stripeCheckoutSessionId, checkoutSessionId),
    });

    if (existingOrder) return new Response("OK", { status: 200 });

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
      shippingAddressId: addressId,
      stripePaymentIntentId: paymentIntentId,
      stripeCheckoutSessionId: checkoutSessionId,
    });

    console.log("Order created:", orderId);

    // Attach orderId to payment
    if (paymentIntentId) {
      await db
        .update(payments)
        .set({ orderId })
        .where(eq(payments.stripePaymentIntentId, paymentIntentId));
    }

    // Move cart → order items AND UPDATE INVENTORY
    const userCart = await db.query.cart.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });

    if (userCart) {
      const userCartItems = await db.query.cartItem.findMany({
        where: (table, { eq }) => eq(table.cartId, userCart.id),
      });

      // Create order items and update product quantities
      for (const item of userCartItems) {
        // Insert order item
        await db.insert(orderItem).values({
          id: nanoid(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        // ✅ REDUCE PRODUCT QUANTITY IN INVENTORY (JSONB pricing field)
        try {
          // Fetch current product to get pricing data
          const currentProduct = await db.query.product.findFirst({
            where: (table, { eq }) => eq(table.id, item.productId),
          });

          if (currentProduct && currentProduct.pricing) {
            const updatedPricing = {
              ...currentProduct.pricing,
              stockQuantity: Math.max(
                (currentProduct.pricing.stockQuantity || 0) - item.quantity,
                0
              ),
              inStock:
                (currentProduct.pricing.stockQuantity || 0) - item.quantity > 0,
            };

            await db
              .update(product)
              .set({ pricing: updatedPricing })
              .where(eq(product.id, item.productId));

            console.log(
              `Updated inventory for product ${item.productId}: reduced by ${item.quantity} (new stock: ${updatedPricing.stockQuantity})`
            );
          }
        } catch (error) {
          console.error(
            `Failed to update inventory for product ${item.productId}:`,
            error
          );
          // Continue processing other items even if one fails
        }
      }

      // Send confirmation email
      await sendEmail({
        to: session.customer_details?.email!,
        subject: "Your Techbar Order Confirmation",
        html: orderConfirmationTemplate({
          customerName: session.customer_details?.name ?? "Customer",
          orderId,
          orderDate: new Date().toLocaleDateString(),
          total: ((session.amount_total ?? 0) / 100).toString(),
          items: userCartItems.map((item) => ({
            title: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      // Clear cart
      await db.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

      console.log(
        "Cart moved to order items, inventory updated, and cart cleared"
      );
    }

    return new Response("OK", { status: 200 });
  }

  // ------------------------------------------------------------------
  // 3️⃣ PAYMENT FAILED
  // ------------------------------------------------------------------
  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;

    await db
      .update(payments)
      .set({ status: "failed" })
      .where(eq(payments.stripePaymentIntentId, intent.id));

    console.log("Payment failed:", intent.id);
    // ❌ NO INVENTORY UPDATE - Product quantity remains unchanged
    return new Response("OK", { status: 200 });
  }

  console.log("Unhandled event type:", event.type);
  return new Response("OK", { status: 200 });
}
