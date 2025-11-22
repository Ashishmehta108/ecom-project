"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
// import { Google } from "iconsax-reactjs";
import google from "./../public/google.svg";
import apple from "./../public/apple.svg";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Apple } from "iconsax-reactjs";

const formViaEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {

  const form = useForm<z.infer<typeof formViaEmailSchema>>({
    resolver: zodResolver(formViaEmailSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(values: z.infer<typeof formViaEmailSchema>) {
    try {
      setIsSubmitting(true);

      const resp = await authClient.signIn.email({
        email: values.email,
        password: values.password,
        rememberMe: true,
      });

      if (resp.error) {
        toast.error(resp.error.message || "Login failed.");
        return;
      }

      toast.success("Logged in successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center bg-white dark:bg-neutral-900 justify-center mt-10 px-4">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome Back 👋
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* SIGN IN WITH PROVIDERS */}
          <div className="flex w-full gap-3">
             <Button
              variant="outline"
              className="flex-1 h-11 gap-2"
              onClick={async () =>
                await authClient.signIn.social({ provider: "apple" })
              }
            >
              <Image
              src={apple.src}
              alt="hi"
              width={19}
              height={19}
             />
              Apple
            </Button>

            <Button
              variant="outline"
              className="flex-1 h-11 gap-2"
              onClick={async () =>
                await authClient.signIn.social({ provider: "google" })
              }
            >
              <Image
              src={google.src}
              alt="hi"
              width={18}
              height={18}
             />
              Google
            </Button>
          </div>

          {/* SEPARATOR */}
          <div className="relative">
            <Separator />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="px-3 text-sm text-muted-foreground bg-white dark:bg-neutral-900">
                OR
              </span>
            </span>
          </div>

          {/* FORM */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* EMAIL FIELD */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PASSWORD FIELD WITH SHOW/HIDE */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="h-11 pr-10"
                          {...field}
                        />
                      </FormControl>

                      <button
                        type="button"
                        className="absolute right-3 top-3 text-neutral-600 dark:text-neutral-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FORGOT PASSWORD */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 text-base cursor-pointer"
              >
                {isSubmitting ? (
                  <Skeleton className="h-4 w-24 rounded" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </Form>

          {/* SIGNUP LINK */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
