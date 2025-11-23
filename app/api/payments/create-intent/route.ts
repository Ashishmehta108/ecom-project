import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { stripeClient as stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // ---- Parse Body Safely ----
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { amount, currency = "eur" } = body;

    // ---- Validate Amount ----
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // ---- Validate Currency ----
    const allowedCurrencies = ["eur", "usd", "inr"];
    if (!allowedCurrencies.includes(currency.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe client not initialized" },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
        metadata: { userId },
      });
    } catch (stripeError: any) {
      console.error("Stripe PI Creation Error →", stripeError);
      return NextResponse.json(
        { error: "Unable to create payment. Try again later." },
        { status: 502 }
      );
    }

    const existing = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
      .limit(1);

    if (existing.length === 0) {
      await db
        .insert(payments)
        .values({
          id: paymentIntent.id,
          userId,
          stripePaymentIntentId: paymentIntent.id,
          amount,
          currency,
          status: paymentIntent.status,
        })
        .catch((dbError) => {
          console.error("DB Insert Error →", dbError);
        });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Unexpected Error →", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
