"use client";

import { createAddress } from "@/lib/actions/address-action";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

// 🌍 Localized Text
const t = {
  en: {
    back: "Back",
    title: "Add New Address",
    name: "Full Name *",
    phone: "Phone *",
    line1: "Address Line 1 *",
    line2: "Address Line 2",
    city: "City *",
    state: "State *",
    postal: "Postal Code *",
    country: "Country",
    save: "Save Address",
    saving: "Saving...",
    requiredMsg: "Please fill all required fields",
  },
  pt: {
    back: "Voltar",
    title: "Adicionar Novo Endereço",
    name: "Nome Completo *",
    phone: "Telefone *",
    line1: "Endereço Linha 1 *",
    line2: "Endereço Linha 2",
    city: "Cidade *",
    state: "Estado *",
    postal: "Código Postal *",
    country: "País",
    save: "Salvar Endereço",
    saving: "Salvando...",
    requiredMsg: "Por favor, preencha todos os campos obrigatórios",
  },
};

export function AddNewAddressPage({ onBack }: { onBack: () => void }) {
  const { locale } = useLanguage();
  const text = t[locale];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const updateField = (field: string, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.line1 ||
      !form.city ||
      !form.state ||
      !form.postalCode
    ) {
      setError(text.requiredMsg);
      return;
    }

    setLoading(true);
    const res = await createAddress(form);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Something went wrong");
      return;
    }

    window.location.href = `/checkout/payment?id=${res.addressId}`;
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm mb-4 text-neutral-600 dark:text-neutral-300 hover:opacity-80"
      >
        <ArrowLeft className="w-4 h-4" />
        {text.back}
      </button>

      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
        {text.title}
      </h2>

      {/* Error Snackbar */}
      {error && (
        <p className="text-red-500 text-sm mb-2 font-medium">{error}</p>
      )}

      <div className="space-y-4">
        {[
          { key: "fullName", label: text.name, placeholder: "John Doe" },
          { key: "phone", label: text.phone, placeholder: "9876543210" },
          { key: "line1", label: text.line1, placeholder: "123 Street Name" },
          {
            key: "line2",
            label: text.line2,
            placeholder: "Apartment, Suite, etc.",
          },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm mb-1 block">{field.label}</label>
            <Input
              value={(form as any)[field.key]}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm mb-1 block">{text.city}</label>
            <Input
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Mumbai"
            />
          </div>

          <div>
            <label className="text-sm mb-1 block">{text.state}</label>
            <Input
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="Maharashtra"
            />
          </div>
        </div>

        <div>
          <label className="text-sm mb-1 block">{text.postal}</label>
          <Input
            value={form.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            placeholder="400001"
          />
        </div>

        <div>
          <label className="text-sm mb-1 block">{text.country}</label>
          <Input
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-12 text-base rounded-xl font-semibold disabled:opacity-50"
        >
          {loading ? text.saving : text.save}
        </Button>
      </div>
    </div>
  );
}
