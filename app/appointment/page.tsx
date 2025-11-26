"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    await createAppointment({
      customerId: "replace-with-user-id",
      customerName: form.get("name"),
      customerEmail: form.get("email"),
      customerPhone: form.get("phone"),
      deviceType: form.get("device"),
      issueDescription: form.get("issue"),
      scheduledDate: new Date(form.get("date") as string),
    });

    router.push("/appointment/success");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Book Appointment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="name" placeholder="Full Name" required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input name="phone" placeholder="Phone Number" required />

        <Input
          name="device"
          placeholder="Device Type (Laptop / Mobile / etc.)"
          required
        />
        <Textarea name="issue" placeholder="Describe your issue" required />

        <Input type="date" name="date" required />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </form>
    </div>
  );
}
