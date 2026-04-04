
import { NextRequest, NextResponse } from "next/server";
import { stripeClient as stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import {
  posCart,
  posCartItem,
  posCustomer,
  posOrder,
  posOrderItem,
  posPayment,
  product,
} from "@/lib/db/schema";
import { getPosCart, clearPosCart } from "@/lib/queries/admin-cart";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  console.log("🔥 /api/stripe/admin/checkout HIT");

  try {
    let body;
    try {
      body = await req.json();
      console.log("📩 Received Body:", body);
    } catch (e) {
      console.error("❌ Invalid JSON:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { customerId } = body;
    console.log("🧍 POS customerId:", customerId);

    if (!customerId) {
      console.error("❌ Missing customerId");
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    // 1. Get cart
    console.log("🛒 Fetching POS cart for:", customerId);
    const cartData = await getPosCart(customerId);
    console.log("🛒 POS Cart Data:", cartData);

    if (!cartData || cartData.items.length === 0) {
      console.error("❌ Cart is empty");
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartData.subtotal;
    const total = subtotal;
    console.log("💰 Totals → subtotal:", subtotal, " total:", total);

    // 2. Create POS order
    console.log("📦 Creating POS order…");
    const [order] = await db
      .insert(posOrder)
      .values({
        id: nanoid(),
        customerId,
        subtotal: subtotal.toString(),
        tax: "0",
        total: total.toString(),
        currency: "EUR",
        status: "pending",
      })
      .returning();

    console.log("📦 POS Order Created:", order);

    // 3. Order items
    console.log("📦 Creating POS order items:", cartData.items);
    await db.insert(posOrderItem).values(
      cartData.items.map((i) => {

        return {
          id: nanoid(),
          orderId: order.id,
          productId: i.productId,
          quantity: i.quantity,
          price: i.price.toString(),
          name: i.productName as { en: string; pt: string },
          brand: i.brand,
          model: i.model,
        };
      })
    );
    console.log("📦 POS Order Items inserted");

    console.log("💳 Creating Stripe Checkout Session…");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/pos`,

      client_reference_id: order.id,

      line_items: cartData.items.map((item) => {
        const itemName = typeof item.productName === "object" && item.productName !== null ? (item.productName as any).en || (item.productName as any).pt || "Product" : String(item.productName || "Product");
        return {
          quantity: item.quantity,
          price_data: {
            currency: "EUR",
            product_data: {
              name: itemName,
              description: `${item.brand} ${item.model}`,
            },
            unit_amount: Number(item.price) * 100,
          },
        };
      }),
      metadata: { adminCustomerOrderId: order.id }
    });

    console.log(" Stripe Session CREATED:", session.id);

    console.log(" Storing POS payment info…");
    await db.insert(posPayment).values({
      id: nanoid(),
      orderId: order.id,
      amount: Math.round(total),
      currency: "EUR",
      status: "requires_payment_method",
      stripeCheckoutSessionId: session.id,
    });

    console.log("POS Payment saved");

    console.log("Clearing POS cart...");
    await clearPosCart(customerId);

    console.log(" All done. Returning session URL:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error(" Stripe checkout error CATCH BLOCK:", {
      message: error.message,
      stack: error.stack,
      full: error,
    });

    return NextResponse.json(
      { error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}
