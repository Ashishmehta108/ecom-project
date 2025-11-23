// // app/checkout/CheckoutClient.tsx
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Elements,
//   PaymentElement,
//   ElementsConsumer,
// } from "@stripe/react-stripe-js";
// import { stripePromise } from "@/lib/stripe-client";
// import { Button } from "@/components/ui/button";
// import type { Stripe, StripeElements } from "@stripe/stripe-js";

// type Props = {
//   amount: number;
// };

// export default function CheckoutClient({ amount }: Props) {
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function createIntent() {
//       try {
//         setLoading(true);

//         const res = await fetch("/api/payments/create-intent", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ amount }),
//         });

//         const data = await res.json();

//         if (!res.ok) throw new Error(data.error || "Failed to create intent");

//         setClientSecret(data.clientSecret);
//       } catch (err) {
//         console.error(err);
//         setClientSecret(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     createIntent();
//   }, [amount]);

//   if (loading) return <p className="text-muted-foreground">Loading payment…</p>;
//   if (!clientSecret) return <p className="text-red-500">Unable to start payment.</p>;

//   return (
//     <Elements
//       stripe={stripePromise}
//       options={{
//         clientSecret,
//         appearance: { theme: "stripe" },
//       }}
//     >
//       <ElementsConsumer>
//         {({ stripe, elements }) => (
//           <CheckoutForm stripe={stripe} elements={elements} amount={amount} />
//         )}
//       </ElementsConsumer>
//     </Elements>
//   );
// }

// function CheckoutForm({
//   stripe,
//   elements,
//   amount,
// }: {
//   stripe: Stripe | null;
//   elements: StripeElements | null;
//   amount: number;
// }) {
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setSubmitting(true);
//     setError(null);

//     const { error: stripeError } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: `${window.location.origin}/checkout/success`,
//       },
//       redirect: "if_required",
//     });

//     if (stripeError) {
//       setError(stripeError.message || "Payment failed");
//       setSubmitting(false);
//       return;
//     }

//     // If no redirect required (UPI/cards sometimes)
//     window.location.href = "/checkout/success";
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <PaymentElement />
//       {error && <p className="text-sm text-red-500">{error}</p>}

//       <Button
//         type="submit"
//         disabled={!stripe || submitting}
//         className="w-full"
//       >
//         {submitting ? "Processing..." : `Pay ₹${amount / 100}`}
//       </Button>
//     </form>
//   );
// }

// app/checkout/CheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Elements,
  PaymentElement,
  ElementsConsumer,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe-client";
import { Button } from "@/components/ui/button";
import type { Stripe, StripeElements } from "@stripe/stripe-js";

type Props = {
  amount: number;
};

export default function CheckoutClient({ amount }: Props) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function createIntent() {
      try {
        setLoading(true);

        const res = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to create intent");

        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error(err);
        setClientSecret(null);
      } finally {
        setLoading(false);
      }
    }

    createIntent();
  }, [amount]);

  if (loading) return <p className="text-muted-foreground">Loading payment…</p>;
  if (!clientSecret)
    return <p className="text-red-500">Unable to start payment.</p>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: "stripe" },
      }}
    >
      <ElementsConsumer>
        {({ stripe, elements }) => (
          <CheckoutForm stripe={stripe} elements={elements} amount={amount} />
        )}
      </ElementsConsumer>
    </Elements>
  );
}

function CheckoutForm({
  stripe,
  elements,
  amount,
}: {
  stripe: Stripe | null;
  elements: StripeElements | null;
  amount: number;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed");
      setSubmitting(false);
      return;
    }

    // If no redirect required (UPI/cards sometimes)
    window.location.href = "/checkout/success";
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={!stripe || submitting} className="w-full">
        {submitting ? "Processing..." : `Pay €${amount / 100}`}
      </Button>
    </form>
  );
}
