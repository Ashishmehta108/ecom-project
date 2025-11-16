import Stripe from "stripe";
import { headers } from "next/headers";
import { stripeClient } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripeClient.webhooks.constructEvent(
      body,
      signature,
      endpointSecret
    );
  } catch (err: any) {
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // TODO: mark order as paid in DB
    console.log("Payment successful:", session.id);
  }

  return new Response("OK", { status: 200 });
}


//"C:\Users\ashis\Downloads\stripe_1.32.0_windows_x86_64\stripe.exe"
