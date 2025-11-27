"use client";

import { Mail, RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationSent() {
  const params = useSearchParams();
  const email = params.get("email");

  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-black p-6">
      <div className="bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-center mb-6">
          <Mail className="w-16 h-16 text-primary" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>

        <p className="text-gray-600 dark:text-gray-300 mb-3">
          We’ve sent a verification link to:
        </p>

        <p className="font-semibold text-primary mb-6">{email}</p>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          If you haven’t received the email, please check your <b>Spam</b> or
          <b> Junk</b> folder.
        </p>
      </div>
    </div>
  );
}
