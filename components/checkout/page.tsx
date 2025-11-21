// app/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  ElementsConsumer,
  PaymentElement,
} from "@stripe/react-stripe-js";
import type { Stripe, StripeElements } from "@stripe/stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import { Button } from "@/components/ui/button";

type Props = {
  amount: number;
};

export default function CheckoutClient({ amount }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createIntent = async () => {
      setLoading(true);
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || "Failed to create payment intent");
        setLoading(false);
        return;
      }
      setClientSecret(data.clientSecret);
      setLoading(false);
    };

    createIntent();
  }, [amount]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading payment…</p>;
  }

  if (!clientSecret) {
    return <p className="text-sm text-red-500">Unable to start payment.</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <RawCheckoutForm
            stripe={stripe}
            elements={elements}
            amount={amount}
          />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

function RawCheckoutForm({
  stripe,
  elements,
  amount,
}: {
  stripe: Stripe | null;
  elements: StripeElements | null;
  amount: number;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Customize success page
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    }); // :contentReference[oaicite:3]{index=3}

    if (error) {
      setErrorMessage(error.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-2">
        <p className="font-medium">Payment successful 🎉</p>
        <p className="text-sm text-muted-foreground">
          You’ll receive an email confirmation shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || !elements || submitting}
      >
        {submitting ? "Processing..." : `Pay ₹${amount / 100}`}
      </Button>
    </form>
  );
}
