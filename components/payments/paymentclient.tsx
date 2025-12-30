"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Package, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense, useState } from "react";
import { Address } from "@/lib/types/address.types";
import { CartItem } from "@/lib/types/cart.types";
import { useLanguage } from "@/app/context/languageContext";

// 🌎 Text Localization
const t = {
  en: {
    back: "Back",
    title: "Confirm & Pay",
    deliveryAddress: "Delivery Address",
    orderSummary: "Order Summary",
    subtotal: "Subtotal",
    shipping: "Shipping",
    free: "Free",
    total: "Total",
    pay: "Proceed to Secure Stripe Payment",
    redirecting: "Redirecting...",
    error: "Payment error",
  },
  pt: {
    back: "Voltar",
    title: "Confirmar e Pagar",
    deliveryAddress: "Endereço de Entrega",
    orderSummary: "Resumo do Pedido",
    subtotal: "Subtotal",
    shipping: "Frete",
    free: "Grátis",
    total: "Total",
    pay: "Ir para Pagamento Seguro com Stripe",
    redirecting: "Redirecionando...",
    error: "Erro no pagamento",
  },
};

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
  const { locale } = useLanguage();
  const text = t[locale];

  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  const addressId = address.id;
  const [errorMsg, setErrorMsg] = useState("");

  async function handleStripeCheckout() {
    try {
      setLoading(true);
      setErrorMsg("");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId, items: cart }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || text.error);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(text.error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 text-sm sm:text-base bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => router.push("/checkout")}
          className="flex items-center gap-2 mb-6 text-neutral-700 dark:text-neutral-300 hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          {text.back}
        </Button>

        <h1 className="text-xl sm:text-2xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
          {text.title}
        </h1>

        {/* Delivery Address */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <h2 className="font-semibold text-base text-neutral-800 dark:text-neutral-200">
                {text.deliveryAddress}
              </h2>
            </div>

            <div className="space-y-1 text-neutral-800 dark:text-neutral-300">
              <p>{address.fullName}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-xs mt-2 text-neutral-500 dark:text-neutral-400">
                {address.phone}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
              <h2 className="font-semibold text-base text-neutral-800 dark:text-neutral-200">
                {text.orderSummary}
              </h2>
            </div>

            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                >
                  <span className="truncate">{item.name}</span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-3 text-neutral-800 dark:text-neutral-200 space-y-1">
              <div className="flex justify-between">
                <span>{text.subtotal}:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{text.shipping}:</span>
                <span>{text.free}</span>
              </div>
              <div className="flex justify-between text-lg sm:text-xl font-bold mt-2">
                <span>{text.total}:</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {errorMsg && (
          <p className="text-red-500 text-center text-sm font-medium mb-4">
            {errorMsg}
          </p>
        )}

        {/* Payment Button */}
        <Button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="w-full py-4 flex items-center justify-center gap-2 text-base font-medium"
        >
          <CreditCard className="w-5 h-5" />
          {loading ? text.redirecting : text.pay}
        </Button>

      </div>
    </div>
  );
}
