"use client";

import React, { useState } from "react";
import { Check, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
};

const MOCK_ADDRESSES: Address[] = [
  {
    id: "1",
    fullName: "John Doe",
    line1: "123 Main Street",
    line2: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "2",
    fullName: "John Doe",
    line1: "456 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    phone: "+1 (555) 987-6543",
  },
];

export default function CheckoutAddressPage() {
  const [page, setPage] = useState<"list" | "add">("list");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const router = useRouter();

  const goToPayment = () => {
    if (!selectedAddress || !selectedAddress.id) return;
    router.push(`/checkout/payment?addressId=${selectedAddress.id}`);
  };

  if (page === "add") {
    return <AddNewAddressPage onBack={() => setPage("list")} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4">
      <div className="max-w-3xl mx-auto text-sm sm:text-base">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">
          Select Delivery Address
        </h1>

        <div className="space-y-3 mb-6">
          {MOCK_ADDRESSES.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isSelected={selectedAddress?.id === address.id}
              onClick={() => setSelectedAddress(address)}
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
      </div>
    </div>
  );
}

function AddressCard({
  address,
  isSelected,
  onClick,
}: {
  address: Address;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      onClick={onClick}
      className={`relative cursor-pointer transition border-2 ${
        isSelected
          ? "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <CardContent className="p-3 sm:p-4 text-sm sm:text-base">
        {isSelected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-neutral-900 dark:bg-neutral-50 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white dark:text-neutral-900" />
          </div>
        )}

        <h3 className="font-semibold">{address.fullName || "Unnamed User"}</h3>
        <p>{address.line1 || "Address missing"}</p>
        {address.line2 && <p>{address.line2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-xs mt-1 opacity-70">{address.phone}</p>
      </CardContent>
    </Card>
  );
}

function AddNewAddressPage({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState<Address>({
    id: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const updateField = (field: keyof Address, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    onBack();
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-sm sm:text-base">
      <button onClick={onBack} className="flex items-center mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </button>

      <h1 className="text-xl sm:text-2xl font-semibold mb-4">
        Add New Address
      </h1>

      <Card className="p-6">
        <div className="space-y-4">
          {(
            [
              "fullName",
              "phone",
              "line1",
              "line2",
              "city",
              "state",
              "postalCode",
            ] as (keyof Address)[]
          ).map((field) => (
            <div key={field} className="space-y-1">
              <label className="capitalize text-xs sm:text-sm opacity-80">
                {field}
              </label>
              <Input
                value={form[field] || ""}
                onChange={(e) => updateField(field, e.target.value)}
                className="bg-neutral-50 dark:bg-neutral-800  focus-visible:ring-0 focus-visible:ring-offset-0" 
              />
            </div>
          ))}
        </div>

        <Button className="w-full mt-6 py-4" onClick={handleSave}>
          Save Address
        </Button>
      </Card>
    </div>
  );
}
