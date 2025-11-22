// // import { NextResponse } from "next/server";
// // import { headers } from "next/headers";
// // import { stripePromise } from "@/lib/stripe";
// // import { auth } from "@/auth";
// // import { db } from "@/lib/db";
// // import { payments } from "@/lib/db/schema";
// // import { eq } from "drizzle-orm";

// // export async function POST(req: Request) {
// //   const body = await req.json().catch(() => ({}));
// //   const { amount, currency = "inr" } = body as {
// //     amount?: number;
// //     currency?: string;
// //   };

// //   if (!amount || amount <= 0) {
// //     return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
// //   }

// //   const session = await auth.api.getSession({
// //     headers: await headers(),
// //   });

// //   if (!session) {
// //     return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
// //   }

// //   try {
// //     const paymentIntent = await (
// //       await stripePromise
// //     ).paymentIntents.create({
// //       amount, // e.g. 5000 = ₹50.00
// //       currency,
// //       metadata: {
// //         userId: session.user.id,
// //       },
// //     });

// //     // 3. Store in DB
// //     await db.insert(payments).values({
// //       id: paymentIntent.id,
// //       userId: session.user.id,
// //       stripePaymentIntentId: paymentIntent.id,
// //       amount,
// //       currency,
// //       status: paymentIntent.status,
// //     });

// //     return NextResponse.json({
// //       clientSecret: paymentIntent.client_secret,
// //     });
// //   } catch (error: any) {
// //     console.error("Stripe error", error);
// //     return NextResponse.json(
// //       { error: error?.message ?? "Something went wrong" },
// //       { status: 500 },
// //     );
// //   }
// // }

// import { NextResponse } from "next/server";
// import { headers } from "next/headers";
// import { auth } from "@/auth";
// import { db } from "@/lib/db";
// import { payments } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// export async function POST(req: Request) {
//   try {
//     const { amount, currency = "inr" } = await req.json();

//     if (!amount || amount <= 0) {
//       return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
//     }

//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session) {
//       return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//     }

//     // 1. Create PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency,
//       metadata: {
//         userId: session.user.id,
//       },
//       automatic_payment_methods: { enabled: true },
//     });

//     // 2. Store in DB
//     await db.insert(payments).values({
//       id: paymentIntent.id,
//       userId: session.user.id,
//       stripePaymentIntentId: paymentIntent.id,
//       amount,
//       currency,
//       status: paymentIntent.status,
//     });

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error: any) {
//     console.error("Stripe Error →", error);
//     return NextResponse.json(
//       { error: error.message || "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }

// app/api/payments/create-intent/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { stripeClient as stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { amount, currency = "eur" } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card", "klarna"],
      // automatic_payment_methods: { enabled: true },
      metadata: {
        userId: session.user.id,
      },
    });

    await db.insert(payments).values({
      id: paymentIntent.id,
      userId: session.user.id,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency,
      status: paymentIntent.status,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
