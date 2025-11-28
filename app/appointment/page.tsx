"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";

export default function CreateAppointmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);

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
    <div className="max-w-lg mx-auto p-6">
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Book an Appointment
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input name="name" placeholder="John Doe" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input name="phone" placeholder="+91 9876543210" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Device Type</label>
              <Input
                name="device"
                placeholder="Laptop, Mobile, Tablet..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Issue Description</label>
              <Textarea
                name="issue"
                placeholder="Describe the problem…"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Date</label>
              <Input type="date" name="date" required />
            </div>

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
