"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Mail, Lock, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Login failed");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="mt-20 flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border border-neutral-300 dark:border-neutral-800 shadow-sm bg-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Shield className="w-10 h-10 text-neutral-600 dark:text-neutral-300" />
          </div>
          <CardTitle className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
            Admin Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 w-4 h-4" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 w-4 h-4" />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="pl-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center -mt-3">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
