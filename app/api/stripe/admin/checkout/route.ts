import { NextRequest, NextResponse } from "next/server";
import { stripeClient as stripe } from "@/lib/stripe";
import { getCustomerCart, clearCustomerCart } from "@/lib/queries/admin-cart";
import { db } from "@/lib/db";
import { orders, orderItem, payments } from "@/lib/db/schema";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  console.log("🔥 /api/stripe/checkout HIT");

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
    console.log("🧍 customerId:", customerId);

    if (!customerId) {
      console.error("❌ Missing customerId");
      return NextResponse.json(
        { error: "Missing customerId" },
        { status: 400 }
      );
    }

    // 1. Get cart
    console.log("🛒 Fetching cart for:", customerId);
    const cartData = await getCustomerCart(customerId);
    console.log("🛒 Cart Data:", cartData);

    if (!cartData || cartData.items.length === 0) {
      console.error("❌ Cart is empty");
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = cartData.subtotal;
    const total = subtotal;
    console.log("💰 Totals → subtotal:", subtotal, " total:", total);

    // 2. Create order
    console.log("📦 Creating order…");
    const [order] = await db
      .insert(orders)
      .values({
        id: nanoid(),
        userId: customerId,
        subtotal: subtotal.toString(),
        tax: "0",
        shippingFee: "0",
        total: total.toString(),
        currency: "INR",
        status: "pending",
        orderStatus: "pending",
      })
      .returning();

    console.log("📦 Order Created:", order);

    // 3. Order items
    console.log("📦 Creating order items:", cartData.items);
    await db.insert(orderItem).values(
      cartData.items.map((i) => ({
        id: nanoid(),
        orderId: order.id,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price.toString(),
      }))
    );
    console.log("📦 Order Items inserted");

    // 4. Stripe
    console.log("💳 Creating Stripe Checkout Session…");
    console.log("➡ Stripe Payload:", {
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/cancel`,
      line_items: cartData.items,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/cancel`,

      client_reference_id: order.id,

      line_items: cartData.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "EUR", // ⚠ You set EUR here — leave it or change back to INR
          product_data: {
            name: item.productName,
            description: `${item.brand} ${item.model}`,
          },
          unit_amount: Number(item.price) * 100,
        },
      })),
    });

    console.log("💳 Stripe Session CREATED:", session.id);

    // 5. Add payment
    console.log("💾 Storing payment info…");
    await db.insert(payments).values({
      id: nanoid(),
      userId: customerId,
      orderId: order.id,
      amount: Math.round(total),
      currency: "INR",
      status: "requires_payment_method",
      stripeCheckoutSessionId: session.id,
    });

    console.log("💾 Payment saved");

    // 6. Clear cart
    console.log("🧹 Clearing cart...");
    await clearCustomerCart(customerId);

    console.log("✅ All done. Returning session URL:", session.url);
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("🔥 Stripe checkout error CATCH BLOCK:", {
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
