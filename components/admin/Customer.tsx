// components/admin/CustomerDetailsForm.tsx
"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function CustomerDetailsForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (data: CustomerFormValues) => Promise<void> | void;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      phone: defaultValues?.phone ?? "",
      address: defaultValues?.address ?? "",
    },
  });

  const submitHandler = form.handleSubmit((data) => {
    startTransition(async () => {
      await onSubmit(data);
    });
  });

  return (
    <Card className="p-6 space-y-5">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        <User className="w-5 h-5" />
        Customer Details
      </h1>

      <form onSubmit={submitHandler} className="space-y-4">
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input
            placeholder="Enter name"
            {...form.register("name")}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            placeholder="Enter email"
            {...form.register("email")}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label>Phone</Label>
          <Input
            placeholder="Enter phone"
            {...form.register("phone")}
            disabled={isPending}
          />
        </div>

        <div className="grid gap-2">
          <Label>Address</Label>
          <Input
            placeholder="Enter address"
            {...form.register("address")}
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving..." : "Save Details"}
        </Button>
      </form>
    </Card>
  );
}
