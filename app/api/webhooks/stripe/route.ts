import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  payments,
  orders,
  orderItem,
  cartItem,
  product,
} from "@/lib/db/schema";
import {
  
  adminCustomerOrder,
  adminCustomerOrderItem,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/sendemail";
import { orderConfirmationTemplate } from "@/lib/orders/confirmationemail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolvePaymentIntentId(
  pi: string | Stripe.PaymentIntent | null,
): string | null {
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}

async function upsertPayment({
  userId,
  intentId,
  sessionId,
  amount,
  currency,
}: {
  userId: string;
  intentId: string | null;
  sessionId: string;
  amount: number | null;
  currency: string | null;
}) {
  if (!intentId) return;

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
      amount: amount ?? 0,
      currency: currency?.toLowerCase() ?? "eur",
      status: "succeeded",
    });
  } else if (existing.status !== "succeeded") {
    await db
      .update(payments)
      .set({ status: "succeeded" })
      .where(eq(payments.id, existing.id));
  }
}

async function createOrder(
  session: Stripe.Checkout.Session,
  userId: string,
): Promise<string> {
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
    stripePaymentIntentId: resolvePaymentIntentId(session.payment_intent),
    stripeCheckoutSessionId: session.id,
  });

  return orderId;
}

/**
 * Moves cart items → order_item rows.
 * Performs stock decrement inside a DB transaction.
 * If any item has insufficient stock the whole order is flagged
 * `requires_manual_review` and we return an empty array so the
 * caller knows to skip the confirmation email.
 */
type PurchasedItem = {
  name: any; // cartItem name
  productName: { en: string; pt: string } | null; // bilingual from product row
  quantity: number;
  price: string;
  image: string;
};

async function moveCartToOrder(
  orderId: string,
  userId: string,
): Promise<PurchasedItem[]> {
  const userCart = await db.query.cart.findFirst({
    where: (t, { eq }) => eq(t.userId, userId),
  });

  if (!userCart) return [];

  const items = await db.query.cartItem.findMany({
    where: (t, { eq }) => eq(t.cartId, userCart.id),
  });

  if (items.length === 0) return [];

  // ── Transactional: validate stock → decrement → move items ──
  try {
    const result = await db.transaction(async (tx) => {
      // 1. Validate all stock up-front so we can roll back atomically
      for (const item of items) {
        const current = await tx.query.product.findFirst({
          where: (t, { eq }) => eq(t.id, item.productId),
        });

        const available = current?.pricing?.stockQuantity ?? 0;
        if (available < item.quantity) {
          // Mark order as needing manual review then bail out of transaction
          await tx
            .update(orders)
            .set({
              status: "requires_manual_review",
              orderStatus: "requires_manual_review",
            })
            .where(eq(orders.id, orderId));

          console.warn(
            `[webhook] Insufficient stock for product ${item.productId}. ` +
              `Needed: ${item.quantity}, Available: ${available}. ` +
              `Order ${orderId} flagged requires_manual_review.`,
          );
          // Throwing inside a Drizzle transaction rolls it back
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      // 2. Insert order items, decrement stock, capture bilingual productName
      const purchasedItems: PurchasedItem[] = [];

      for (const item of items) {
        await tx.insert(orderItem).values({
          id: nanoid(),
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        const current = await tx.query.product.findFirst({
          where: (t, { eq }) => eq(t.id, item.productId),
          with: {
            productImages: true,
          },
        });

        if (current?.pricing) {
          const newQty = (current.pricing.stockQuantity ?? 0) - item.quantity;
          await tx
            .update(product)
            .set({
              pricing: {
                ...current.pricing,
                stockQuantity: Math.max(newQty, 0),
                inStock: newQty > 0,
              },
            })
            .where(eq(product.id, item.productId));
        }

        // Capture bilingual name from product row (already fetched above)
        purchasedItems.push({
          name: item.name, // fallback
          productName: current?.productName ?? null, // { en, pt }
          quantity: item.quantity,
          price: item.price,
          image:
            (current as any)?.productImages?.[0]?.url ??
            "https://dummyimage.com/80",
        });
      }

      // 3. Clear cart
      await tx.delete(cartItem).where(eq(cartItem.cartId, userCart.id));

      return purchasedItems;
    });

    return result;
  } catch (err: any) {
    if (err.message === "INSUFFICIENT_STOCK") {
      // Order already flagged — caller will skip email
      return [];
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN / POS FLOW helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Handles checkout.session.completed for the admin/POS flow.
 *
 * The admin checkout creates a `posOrder` row using nanoid() and stores that
 * id in `metadata.adminCustomerOrderId`.  We therefore update `posOrder` +
 * `posPayment` here (not adminCustomerOrder).
 *
 * Stock decrement is done inside a transaction; insufficient stock flags the
 * posOrder as `requires_manual_review`.
 */
async function handleAdminCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const orderId = session.metadata?.adminCustomerOrderId;
  if (!orderId) return;

  const paymentIntentId = resolvePaymentIntentId(session.payment_intent);

  await db.transaction(async (tx) => {
    // ── Idempotency ──
    const existing = await tx.query.adminCustomerOrder.findFirst({
      where: eq(adminCustomerOrder.id, orderId),
    });

    if (!existing) {
      console.warn(`[webhook/admin] adminCustomerOrder not found: ${orderId}`);
      return;
    }

    if (existing.status !== "pending") {
      console.log(
        `[webhook/admin] Already processed (${existing.status}). Skipping.`,
      );
      return;
    }

    // ── Fetch order items ──
    const orderItems = await tx.query.adminCustomerOrderItem.findMany({
      where: (t, { eq }) => eq(t.orderId, orderId),
    });

    // ── Validate + collect stock updates ──
    const stockUpdates: Array<{ productId: string; newQty: number }> = [];

    for (const item of orderItems) {
      const prod = await tx.query.product.findFirst({
        where: eq(product.id, item.productId),
      });

      const available = prod?.pricing?.stockQuantity ?? 0;
      if (available < item.quantity) {
        await tx
          .update(adminCustomerOrder)
          .set({
            status: "requires_manual_review",
            orderStatus: "requires_manual_review",
          })
          .where(eq(adminCustomerOrder.id, orderId));

        console.error(
          `[webhook/admin] Insufficient stock for ${item.productId}.`,
        );
        return;
      }

      stockUpdates.push({
        productId: item.productId,
        newQty: available - item.quantity,
      });
    }

    // ── Decrement stock ──
    for (const { productId, newQty } of stockUpdates) {
      const prod = await tx.query.product.findFirst({
        where: eq(product.id, productId),
      });
      if (!prod) continue;

      await tx
        .update(product)
        .set({
          pricing: {
            ...prod.pricing,
            stockQuantity: Math.max(newQty, 0),
            inStock: newQty > 0,
          },
        })
        .where(eq(product.id, productId));
    }

    // ── Mark order paid ──
    await tx
      .update(adminCustomerOrder)
      .set({
        status: "paid",
        orderStatus: "processing",
        stripePaymentIntentId: paymentIntentId,
        stripeCheckoutSessionId: session.id,
      })
      .where(eq(adminCustomerOrder.id, orderId));

    console.log(`[webhook/admin] adminCustomerOrder ${orderId} marked paid.`);
  });

  revalidatePath("/admin/orders");
}

/**
 * Handles checkout.session.expired for the admin/POS flow.
 */
async function handleAdminCheckoutExpired(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.adminCustomerOrderId;
  if (!orderId) return;

  await db
    .update(adminCustomerOrder) // ← was posOrder
    .set({ status: "expired", orderStatus: "expired" })
    .where(eq(adminCustomerOrder.id, orderId));
}

// ─────────────────────────────────────────────────────────────────────────────
// USER FLOW: checkout.session.completed handler
// ─────────────────────────────────────────────────────────────────────────────

async function handleUserCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const paymentIntentId = resolvePaymentIntentId(session.payment_intent);

  // ── Upsert payment record ──
  await upsertPayment({
    userId,
    intentId: paymentIntentId,
    sessionId: session.id,
    amount: session.amount_total,
    currency: session.currency,
  });

  // ── Idempotency: skip if order already exists for this session ──
  const existingOrder = await db.query.orders.findFirst({
    where: (t, { eq }) => eq(t.stripeCheckoutSessionId, session.id),
  });

  if (existingOrder) {
    console.log(
      `[webhook/user] Order already exists for session ${session.id}. Skipping.`,
    );
    return;
  }

  // ── Create order ──
  const orderId = await createOrder(session, userId);

  // ── Link payment → order ──
  if (paymentIntentId) {
    await db
      .update(payments)
      .set({ orderId })
      .where(eq(payments.stripePaymentIntentId, paymentIntentId));
  }

  // ── Move cart → order items (transactional stock decrement inside) ──
  const purchasedItems = await moveCartToOrder(orderId, userId);

  // ── Send confirmation email (only if order wasn't flagged) ──
  if (purchasedItems.length > 0 && session.customer_details?.email) {
    await sendEmail({
      to: session.customer_details.email,
      subject: "Your Techbar Order Confirmation",
      html: orderConfirmationTemplate({
        customerName: session.customer_details?.name ?? "Customer",
        orderId,
        orderDate: new Date().toLocaleDateString(),
        total: ((session.amount_total ?? 0) / 100).toString(),
        items: purchasedItems.map((i) => {
          const itemName =
            typeof i.name === "object" && i.name !== null
              ? (i.name as any).en || (i.name as any).pt
              : String(i.name);
          return {
            title: i.productName?.en ?? itemName ?? "Product",
            quantity: i.quantity,
            price: i.price,
            image: i.image,
          };
        }),
      }),
    });
  }

  console.log(`[webhook/user] Order ${orderId} created for user ${userId}`);
  revalidatePath("/cart");
}

// ─────────────────────────────────────────────────────────────────────────────
// Main POST handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 500 });
  }

  // Raw body required for Stripe signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error("[webhook] Signature verification failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  // ── Return 200 immediately; process async ──
  // Stripe retries on non-200, so we confirm receipt right away.
  const processStripe = async () => {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const meta = session.metadata ?? {};

          if (meta.adminCustomerOrderId) {
            // ▶ Admin / POS flow
            await handleAdminCheckoutCompleted(session);
          } else if (meta.userId) {
            // ▶ Regular user flow
            await handleUserCheckoutCompleted(session);
          } else {
            console.warn(
              "[webhook] checkout.session.completed — unknown metadata:",
              meta,
            );
          }
          break;
        }

        case "checkout.session.expired": {
          const session = event.data.object as Stripe.Checkout.Session;
          const meta = session.metadata ?? {};

          if (meta.adminCustomerOrderId) {
            await handleAdminCheckoutExpired(session);
          } else if (meta.userId) {
            // User flow: no special expired handling needed — cart is untouched
            console.log(
              `[webhook/user] Session expired for user ${meta.userId}`,
            );
          }
          break;
        }

        case "payment_intent.payment_failed": {
          const intent = event.data.object as Stripe.PaymentIntent;
          if (intent.metadata?.adminCustomerOrderId) {
            // Admin flow: mark order as failed so admin can retry payment
            await db
              .update(adminCustomerOrder)
              .set({ status: "pending" })
              .where(eq(adminCustomerOrder.stripePaymentIntentId, intent.id));

            console.log(
              `[webhook/admin] Payment failed for adminCustomerOrder ${intent.metadata.adminCustomerOrderId}`,
            );
            break;
          }

          await db
            .update(payments)
            .set({ status: "failed" })
            .where(eq(payments.stripePaymentIntentId, intent.id));

          console.log(`[webhook] payment_intent.payment_failed: ${intent.id}`);
          break;
        }

        default:
          console.log(`[webhook] Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error(`[webhook] Error processing event ${event.type}:`, err);
    }
  };
 await  processStripe();

  return new Response("OK", { status: 200 });
}
