"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const validate = schema.safeParse({ email });
    if (!validate.success) {
      toast.error(validate.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Reset password link sent. Check your email!");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            Forgot Password
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button className="w-full" disabled={loading} onClick={onSubmit}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          <p
            onClick={() => router.push("/login")}
            className="text-sm text-center text-muted-foreground hover:underline cursor-pointer"
          >
            Back to Login
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
