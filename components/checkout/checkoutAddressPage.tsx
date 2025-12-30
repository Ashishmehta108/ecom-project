"use client";

import { Address } from "@/lib/types/address.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddressCard } from "./addressPage";
import { AddNewAddressPage } from "./AddNewAddressPage";
import { useLanguage } from "@/app/context/languageContext";

// 🌐 Multi-language text
const t = {
  en: {
    title: "Select Delivery Address",
    addNew: "Add New Address",
    continue: "Continue to Payment",
  },
  pt: {
    title: "Selecionar Endereço de Entrega",
    addNew: "Adicionar Novo Endereço",
    continue: "Continuar para o Pagamento",
  },
};

export default function CheckoutAddressPage({
  address,
}: {
  address: Address[];
}) {
  const router = useRouter();
  const { locale } = useLanguage();
  const text = t[locale];

  const [page, setPage] = useState<"list" | "add">("list");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const goToPayment = () => {
    if (!selectedAddress?.id) return;
    router.push(`/checkout/payment?id=${selectedAddress.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-3xl mx-auto text-sm sm:text-base">
        {/* Add Address Page */}
        {page === "add" && <AddNewAddressPage onBack={() => setPage("list")} />}

        {/* Address List Page */}
        {page === "list" && (
          <>
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              {text.title}
            </h1>

            <div className="space-y-3 mb-6">
              {address.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  isSelected={selectedAddress?.id === addr.id}
                  onClick={() => setSelectedAddress(addr)}
                />
              ))}
            </div>

            {/* Add New Address Button */}
            <Button
              variant="outline"
              className="w-full py-4 border-dashed border-2 dark:border-neutral-700"
              onClick={() => setPage("add")}
            >
              <Plus className="w-5 h-5 mr-2" />
              {text.addNew}
            </Button>

            {/* Continue */}
            <Button
              disabled={!selectedAddress}
              className="w-full mt-6 py-4 text-base font-medium disabled:opacity-50"
              onClick={goToPayment}
            >
              {text.continue}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
