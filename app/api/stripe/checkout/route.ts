// import { NextRequest, NextResponse } from "next/server";
// import { stripeClient as stripe } from "@/lib/stripe";

// export async function POST(req: NextRequest) {
//   try {
//     const { items, userId } = await req.json();

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "No items provided" }, { status: 400 });
//     }

//     // Convert items → Stripe line_items
//     const line_items = items.map((item: any) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//           images: item.images ? [item.images[0]] : [],
//         },
//         unit_amount: Math.round(item.price * 100), // ₹ → paise
//       },
//       quantity: item.quantity,
//     }));

//     // Create the checkout session
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
//       line_items,
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
//       metadata: {
//         userId: userId || "guest",
//       },
//       ui_mode: "hosted",
//       //   return_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//     });

//     console.log(session.id);

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("Checkout Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { stripeClient as stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { items, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Convert cart to Stripe line items
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.images ? [item.images[0]] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: [
        "card",
        "klarna",
        "giropay",
        "mb_way",
        "multibanco",
        "amazon_pay",
        "paypal",
      ],

      // Payment Methods list is NOT required
      // Checkout finds the best ones automatically.

      line_items,

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,

      // Hosted UI
      ui_mode: "hosted",

      metadata: {
        userId: userId || "guest",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
