
import { NextRequest, NextResponse } from "next/server";
import { stripeClient as stripe } from "@/lib/stripe";
import { getUserSession } from "@/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      console.error("Stripe client not initialized");
      return NextResponse.json(
        { error: "Stripe client not initialized" },
        { status: 500 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const sessionData = await getUserSession();
    const userId = sessionData?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { items, addressId } = body;

    if (!addressId) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items must be a non-empty array" },
        { status: 400 }
      );
    }

    // ✅ STOCK VALIDATION - Check if products are in stock before creating checkout
    for (const item of items) {
      if (!item.productId) {
        return NextResponse.json(
          { error: `Missing productId for item: ${item.name}` },
          { status: 400 }
        );
      }

      const productData = await db.query.product.findFirst({
        where: (table, { eq }) => eq(table.id, item.productId),
      });

      if (!productData) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 404 }
        );
      }

      // Check if product is in stock
      if (!productData.pricing.inStock) {
        return NextResponse.json(
          { error: `Product out of stock: ${item.name}` },
          { status: 400 }
        );
      }

      // Check if requested quantity is available
      const requestedQuantity = Number(item.quantity) || 1;
      if (productData.pricing.stockQuantity < requestedQuantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${item.name}. Available: ${productData.pricing.stockQuantity}, Requested: ${requestedQuantity}`,
          },
          { status: 400 }
        );
      }
    }

    const line_items: any[] = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.name !== "string" ||
        isNaN(item.price) ||
        Number(item.price) <= 0
      ) {
        return NextResponse.json(
          {
            error: "Invalid item: each item must contain a valid name & price",
          },
          { status: 400 }
        );
      }

      const quantity = Number(item.quantity) || 1;

      if (quantity <= 0) {
        return NextResponse.json(
          { error: "Invalid quantity" },
          { status: 400 }
        );
      }

      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            images:
              Array.isArray(item.images) && item.images.length > 0
                ? [item.images[0]]
                : [],
          },
          unit_amount: Math.round(Number(item.price) * 100), // cents
        },
        quantity,
      });
    }

    if (line_items.length === 0) {
      return NextResponse.json(
        { error: "No valid line items" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      console.error("Missing NEXT_PUBLIC_APP_URL env variable");
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL env variable" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "hosted",
      payment_method_types: [
        "card",
        "klarna",
        "giropay",
        "mb_way",
        "multibanco",
        "amazon_pay",
        "paypal",
      ],
      line_items,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userId,
        addressId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
