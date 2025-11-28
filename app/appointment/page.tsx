"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";
import { z } from "zod";

// ---------------------- ZOD SCHEMA ----------------------
const appointmentSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().regex(/^\+?[0-9\s-]{7,15}$/, "Invalid phone number format"),
  device: z.string().min(2, "Device type is required"),
  issue: z.string().min(10, "Issue description must be at least 10 characters"),
  date: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: "Invalid date selected",
  }),
});

export default function CreateAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------------- FORM SUBMIT ----------------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = new FormData(e.currentTarget);

    const formData = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      device: form.get("device"),
      issue: form.get("issue"),
      date: form.get("date"),
    };

    // Validate form data
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

    // Submit to backend
    await createAppointment({
      customerId: "replace-with-user-id",
      customerName: result.data.name,
      customerEmail: result.data.email,
      customerPhone: result.data.phone,
      deviceType: result.data.device,
      issueDescription: result.data.issue,
      scheduledDate: new Date(result.data.date),
    });

    router.push("/appointment/success");
  }

  // ---------------------- UI ----------------------
  return (
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Book an Appointment
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" placeholder="John Doe" />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" name="email" placeholder="example@mail.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone" placeholder="+91 9876543210" />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Device */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Device Type</label>
              <Input name="device" placeholder="Laptop, Mobile, Tablet..." />
              {errors.device && (
                <p className="text-red-500 text-sm">{errors.device}</p>
              )}
            </div>

            {/* Issue */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Description</label>
              <Textarea name="issue" placeholder="Describe the problem…" />
              {errors.issue && (
                <p className="text-red-500 text-sm">{errors.issue}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date</label>
              <Input type="date" name="date" />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 text-base font-semibold"
            >
              {loading ? "Booking Appointment..." : "Book Appointment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
