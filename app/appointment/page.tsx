"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { useLanguage } from "@/app/context/languageContext";

// 🟦 Translations
const t = {
  en: {
    title: "Book an Appointment",
    name: "Full Name",
    email: "Email",
    phone: "Phone Number",
    device: "Device Type",
    issue: "Issue Description",
    date: "Preferred Date",
    submit: "Book Appointment",
    submitting: "Booking...",
  },
  pt: {
    title: "Agendar Consulta",
    name: "Nome Completo",
    email: "E-mail",
    phone: "Telefone",
    device: "Tipo de Dispositivo",
    issue: "Descrição do Problema",
    date: "Data Preferida",
    submit: "Agendar",
    submitting: "A Agendar...",
  },
};

// Validation Schema
const appointmentSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{7,15}$/),
  device: z.string().min(2),
  issue: z.string().min(10),
  date: z.string().refine((d) => !isNaN(Date.parse(d))),
});

export default function CreateAppointmentPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const text = t[locale];

  const user = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);
    const formData = Object.fromEntries(form) as Record<string, string>;

    const result = appointmentSchema.safeParse(formData);
    if (!result.success) {
      const formatted: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formatted[issue.path[0]] = issue.message;
      });
      setErrors(formatted);
      setLoading(false);
      return;
    }

    await createAppointment({
      customerId: user.data?.user.id,
      customerName: result.data.name,
      customerEmail: result.data.email,
      customerPhone: result.data.phone,
      deviceType: result.data.device,
      issueDescription: result.data.issue,
      scheduledDate: new Date(result.data.date),
    });

    router.push("/appointment/success");
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-lg border rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {text.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Dynamic Fields Rendering */}
            {[
              { name: "name", type: "text", label: text.name, placeholder: "John Doe" },
              { name: "email", type: "email", label: text.email, placeholder: "example@mail.com" },
              { name: "phone", type: "text", label: text.phone, placeholder: "+91 9876543210" },
              { name: "device", type: "text", label: text.device, placeholder: "Laptop, Mobile, Tablet..." },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm font-medium">{field.label}</label>
                <Input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  defaultValue={
                    field.name === "name"
                      ? user.data?.user?.name ?? ""
                      : field.name === "email"
                      ? user.data?.user?.email ?? ""
                      : ""
                  }
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Issue */}
            <div className="space-y-1">
              <label className="text-sm font-medium">{text.issue}</label>
              <Textarea name="issue" placeholder="Describe the problem…" />
              {errors.issue && (
                <p className="text-red-500 text-xs">{errors.issue}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium">{text.date}</label>
              <Input type="date" name="date" />
              {errors.date && (
                <p className="text-red-500 text-xs">{errors.date}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? text.submitting : text.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
