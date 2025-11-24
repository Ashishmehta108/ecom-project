"use client";
import { Address } from "@/lib/types/address.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddressCard } from "./addressPage";
import { AddNewAddressPage } from "./AddNewAddressPage";

export default function CheckoutAddressPage({
  address,
}: {
  address: Address[];
}) {
  const [page, setPage] = useState<"list" | "add">("list");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const router = useRouter();
  console.log(address);
  const goToPayment = () => {
    if (!selectedAddress || !selectedAddress.id) return;
    router.push(`/checkout/payment?id=${selectedAddress.id}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-3xl mx-auto text-sm sm:text-base">
        {page === "add" && <AddNewAddressPage onBack={() => setPage("list")} />}

        {page === "list" && (
          <>
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">
              Select Delivery Address
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

            <Button
              variant="outline"
              className="w-full py-4 border-dashed"
              onClick={() => setPage("add")}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Address
            </Button>

            <Button
              disabled={!selectedAddress}
              className="w-full mt-6 py-4"
              onClick={goToPayment}
            >
              Continue to Payment
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
