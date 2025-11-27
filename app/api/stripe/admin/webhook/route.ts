// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeClient as stripe } from "@/lib/stripe";

import { db } from "@/lib/db";
import { orders, payments, refund } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";


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
      /* ------------------------------------------------------------
        CHECKOUT SESSION COMPLETED
      ------------------------------------------------------------ */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.client_reference_id;
        if (!orderId) break;

        // Update order to PAID
        await db
          .update(orders)
          .set({
            status: "paid",
            orderStatus: "paid",
          })
          .where(eq(orders.id, orderId));

        // Update payment entry
        await db
          .update(payments)
          .set({
            status: "succeeded",
            stripeCheckoutSessionId: session.id,
          })
          .where(eq(payments.orderId, orderId));

        break;
      }

      /* ------------------------------------------------------------
        PAYMENT INTENT SUCCEEDED (duplicate protection)
      ------------------------------------------------------------ */
      case "payment_intent.succeeded": {
        const pi = event.data.object as Stripe.PaymentIntent;

        // find payment by PI id
        await db
          .update(payments)
          .set({
            status: "succeeded",
            stripePaymentIntentId: pi.id,
          })
          .where(eq(payments.stripePaymentIntentId, pi.id));

        break;
      }

      /* ------------------------------------------------------------
        REFUND SUCCEEDED
      ------------------------------------------------------------ */
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const refundObj = charge.refunds?.data?.[0];

        if (!refundObj) break;

        const paymentIntentId = refundObj.payment_intent;
        const stripeRefundId = refundObj.id;
        const amount = refundObj.amount;

        // Find the payment row by PI
        const [paymentRecord] = await db
          .select()
          .from(payments)
          .where(eq(payments.stripePaymentIntentId, paymentIntentId!));

        if (!paymentRecord) break;

        await db.insert(refund).values({
          id: nanoid(),
          orderId: paymentRecord.orderId!,
          paymentId: paymentRecord.id,
          stripeRefundId,
          paymentIntentId: paymentIntentId as string,
          amount,
          status: "succeeded",
        });

        // Mark order refunded
        await db
          .update(orders)
          .set({ status: "refunded", orderStatus: "refunded" })
          .where(eq(orders.id, paymentRecord.orderId!));

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
