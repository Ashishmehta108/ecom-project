"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function verify() {
      const token = new URLSearchParams(window.location.search).get("token");
console.log(token)
      if (!token) {
        setStatus("error");
        return;
      }

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(res)

      if (res.ok) setStatus("success");
      else setStatus("error");
    }

    verify();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900 px-6">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <h1 className="text-2xl font-semibold">Email Verified!</h1>
          <p className="text-muted-foreground text-sm">
            Your email has been successfully verified.
          </p>
          <a
            href="/login"
            className="mt-3 px-4 py-2 bg-primary text-white rounded-md text-sm"
          >
            Continue to Login
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="h-12 w-12 text-red-600" />
          <h1 className="text-2xl font-semibold">Verification Failed</h1>
          <p className="text-muted-foreground text-sm">
            Invalid or expired verification link.
          </p>
        </div>
      )}
    </div>
  );
}
