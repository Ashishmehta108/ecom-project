import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { stripeClient as stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // -------------------- Parse Body --------------------
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { total: amount, currency = "eur", method } = body;
    console.log("Amount:", amount, "Currency:", currency, "Method:", method);

    // -------------------- Validation --------------------
    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const allowedCurrencies = ["eur", "usd", "eur"];
    if (!allowedCurrencies.includes(currency.toLowerCase())) {
      return NextResponse.json(
        { error: "Unsupported currency" },
        { status: 400 }
      );
    }

    if (!method) {
      return NextResponse.json(
        { error: "Payment method required" },
        { status: 400 }
      );
    }

    const allowedMethods = [
      "card",
      "paypal",
      "klarna",
      "giropay",
      "amazon_pay",
      "mb_way",
      "multibanco",
    ];

    if (!allowedMethods.includes(method)) {
      return NextResponse.json(
        { error: "Unsupported payment method" },
        { status: 400 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not initialized" },
        { status: 500 }
      );
    }

    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // -------------------- Create Payment Intent --------------------
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        // We ENABLE manual payment methods
        automatic_payment_methods: { enabled: false },
        payment_method: method,
      
        payment_method_types: [method],

        metadata: { userId, selected_method: method },
      });
    } catch (stripeError: any) {
      console.error("Stripe PI Creation Error →", stripeError);
      return NextResponse.json(
        { error: stripeError.message || "Payment creation failed" },
        { status: 500 }
      );
    }

    const existing = await db
      .select()
      .from(payments)
      .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(payments).values({
        id: paymentIntent.id,
        userId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: paymentIntent.status,
      });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Unexpected Error →", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
