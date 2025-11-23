"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const MOCK_ADDRESSES: Record<string, Address> = {
  "1": {
    id: "1",
    fullName: "John Doe",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    phone: "+1 (555) 123-4567",
  },
};

const MOCK_ITEMS: CartItem[] = [
  { id: "1", name: "Wireless Headphones", price: 129.99, quantity: 1 },
  { id: "2", name: "Phone Case", price: 24.99, quantity: 2 },
];

export default function PaymentPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addressId = params.get("addressId") || "1";
  const selectedAddress = MOCK_ADDRESSES[addressId];

  const subtotal = MOCK_ITEMS.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  async function handleStripeCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId,
          items: MOCK_ITEMS,
          total,
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
              {MOCK_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-1 border-b border-neutral-200 dark:border-neutral-800"
                >
                  <p>{item.name}</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 space-y-1 text-sm sm:text-base">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between ">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold mt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
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
