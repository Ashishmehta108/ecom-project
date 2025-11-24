"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense, useState } from "react";
import { Address } from "@/lib/types/address.types";
import { CartItem } from "@/lib/types/cart.types";

export default function Payment({
  address,
  cart,
}: {
  address: Address;
  cart: CartItem[];
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPage address={address} cart={cart} />
    </Suspense>
  );
}

export function PaymentPage({
  address,
  cart,
}: {
  address: Address;
  cart: CartItem[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const shipping = 0;

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const selectedAddress = address;
  const addressId = address.id;

  async function handleStripeCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          items: cart,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment error");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Stripe checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 text-sm sm:text-base">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-2 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-xl sm:text-2xl font-semibold mb-6">
          Confirm & Pay
        </h1>

        {/* Address */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <h2 className="font-semibold text-base">Delivery Address</h2>
            </div>

            {selectedAddress ? (
              <div className="space-y-1">
                <p>{selectedAddress.fullName}</p>
                <p>{selectedAddress.line1}</p>
                {selectedAddress.line2 && <p>{selectedAddress.line2}</p>}
                <p>
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.postalCode}
                </p>
                <p className="text-xs mt-2 opacity-70">
                  {selectedAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-red-500">Address not found.</p>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5" />
              <h2 className="font-semibold text-base">Order Summary</h2>
            </div>

            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800"
                >
                  <p>{item.name}</p>
                  <p>
                    ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 space-y-1 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between ">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold mt-2">
                <span>Total:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full py-4 flex items-center justify-center gap-2"
        >
          <CreditCard className="w-5 h-5" />
          {loading ? "Redirecting..." : "Proceed to Secure Stripe Payment"}
        </Button>
      </div>
    </div>
  );
}
