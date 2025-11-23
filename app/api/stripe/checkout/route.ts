// // import { NextRequest, NextResponse } from "next/server";
// // import { stripeClient as stripe } from "@/lib/stripe";

// // export async function POST(req: NextRequest) {
// //   try {
// //     const { items, userId } = await req.json();

// //     if (!items || items.length === 0) {
// //       return NextResponse.json({ error: "No items provided" }, { status: 400 });
// //     }

// //     // Convert items → Stripe line_items
// //     const line_items = items.map((item: any) => ({
// //       price_data: {
// //         currency: "inr",
// //         product_data: {
// //           name: item.name,
// //           images: item.images ? [item.images[0]] : [],
// //         },
// //         unit_amount: Math.round(item.price * 100), // ₹ → paise
// //       },
// //       quantity: item.quantity,
// //     }));

// //     // Create the checkout session
// //     const session = await stripe.checkout.sessions.create({
// //       mode: "payment",
// //       payment_method_types: [
// //         "card",
// //         "klarna",
// //         "giropay",
// //         "mb_way",
// //         "multibanco",
// //         "amazon_pay",
// //         "paypal",
// //       ],
// //       line_items,
// //       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
// //       metadata: {
// //         userId: userId || "guest",
// //       },
// //       ui_mode: "hosted",
// //       //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
// //     });

// //     console.log(session.id);

// //     return NextResponse.json({ url: session.url });
// //   } catch (error: any) {
// //     console.error("Checkout Error:", error);
// //     return NextResponse.json({ error: error.message }, { status: 500 });
// //   }
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { stripeClient as stripe } from "@/lib/stripe";

// export async function POST(req: NextRequest) {
//   try {
//     const { items, userId } = await req.json();

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "No items provided" }, { status: 400 });
//     }

//     // Convert cart to Stripe line items
//     const line_items = items.map((item: any) => ({
//       price_data: {
//         currency: "eur",
//         product_data: {
//           name: item.name,
//           images: item.images ? [item.images[0]] : [],
//         },
//         unit_amount: Math.round(item.price * 100),
//       },
//       quantity: item.quantity,
//     }));

//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",

//       payment_method_types: [
//         "card",
//         "klarna",
//         "giropay",
//         "mb_way",
//         "multibanco",
//         "amazon_pay",
//         "paypal",
//       ],

//       // Payment Methods list is NOT required
//       // Checkout finds the best ones automatically.

//       line_items,

//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,

//       // Hosted UI
//       ui_mode: "hosted",

//       metadata: {
//         userId: userId || "guest",
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("Checkout Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripeClient as stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // ---------- Parse Body Safely ----------
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { items, userId, addressId } = body;

    if (!addressId) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    // ---------- Validate Items ----------
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items must be a non-empty array" },
        { status: 400 }
      );
    }

    // ---------- Build Line Items Safely ----------
    const line_items = [];
    console.log(items);
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
          unit_amount: Math.round(item.price * 100),
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

    // ---------- Validate APP URL ----------
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL env variable" },
        { status: 500 }
      );
    }

    // ---------- Validate Stripe Client ----------
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe client not initialized" },
        { status: 500 }
      );
    }

    // ---------- Allowed Payment Methods ----------
    const paymentMethods = [
      "card",
      "klarna",
      "giropay",
      "mb_way",
      "multibanco",
      "amazon_pay",
      "paypal",
    ];

    // ---------- Create Checkout Session ----------
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: paymentMethods,
      ui_mode: "hosted",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: {
        userId: userId || "guest",
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
