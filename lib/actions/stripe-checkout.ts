"use server";

import { stripeClient } from "../stripe";

export async function createCheckoutSession(items: any[]) {
  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "klarna"],
    line_items: items.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: item.price * 100,
        product_data: {
          name: item.name,
          images: [item.image],
        },
      },
      quantity: item.quantity,
    })),

    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
  });

  return { url: session.url };
}
