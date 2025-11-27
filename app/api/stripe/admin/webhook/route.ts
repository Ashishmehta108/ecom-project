import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";

import { db } from "@/lib/db";
import { posOrder, posPayment } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.client_reference_id;
        if (!orderId) break;

        // Update POS order to PAID
        await db
          .update(posOrder)
          .set({
            status: "paid",
            orderStatus: "paid",
            stripeCheckoutSessionId: session.id,
          })
          .where(eq(posOrder.id, orderId));

        // Update POS payment entry
        await db
          .update(posPayment)
          .set({
            status: "succeeded",
            stripeCheckoutSessionId: session.id,
          })
          .where(eq(posPayment.orderId, orderId));

        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;

        await db
          .update(posPayment)
          .set({
            status: "succeeded",
            stripePaymentIntentId: pi.id,
          })
          .where(eq(posPayment.stripePaymentIntentId, pi.id));

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
