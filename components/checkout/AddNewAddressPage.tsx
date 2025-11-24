"use client";

import { createAddress } from "@/lib/actions/address-action";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export function AddNewAddressPage({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    const res = await createAddress(form);

    setLoading(false);

    if (!res.success) {
      alert(res.error);
      return;
    }

    window.location.href = `/checkout/payment?id=${res.addressId}`;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-4 text-neutral-600 dark:text-neutral-300"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h2 className="text-xl font-semibold mb-4">Add New Address</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm mb-1 block">Full Name *</label>
          <Input
            value={form.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Phone *</label>
          <Input
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="9876543210"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Address Line 1 *</label>
          <Input
            value={form.line1}
            onChange={(e) => updateField("line1", e.target.value)}
            placeholder="123 Street Name"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Address Line 2</label>
          <Input
            value={form.line2}
            onChange={(e) => updateField("line2", e.target.value)}
            placeholder="Apartment, Suite, etc."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">City *</label>
            <Input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">State *</label>
            <Input
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="Maharashtra"
            />
          </div>
        </div>

        <div>
          <label className="text-sm mb-1 block">Postal Code *</label>
          <Input
            value={form.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="400001"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">Country</label>
          <Input value={form.country} onChange={(e) => updateField("country", e.target.value)} />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-12 text-base rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-200"
        >
          {loading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </div>
  );
}
