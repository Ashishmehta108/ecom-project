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
import { Github } from "lucide-react";
import { Google } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import apple from "./../public/apple.svg";
import google from "./../public/google.svg";
import Image from "next/image";
import { redirect } from "next/navigation";

const formViaEmailSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Email is invalid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUpForm() {
  const { data } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in → redirect
  useEffect(() => {
    if (data?.user) {
      window.location.href = "/";
    }
  }, [data]);

  const form = useForm<z.infer<typeof formViaEmailSchema>>({
    resolver: zodResolver(formViaEmailSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formViaEmailSchema>) {
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (error) {
        if (
          error.message?.includes("unique") ||
          error.message?.includes("exists")
        ) {
          toast.error("An account with this email already exists.");
          return;
        }

        if (error.message?.includes("weak password")) {
          toast.error("Password is too weak.");
          return;
        }

        toast.error(error.message || "Something went wrong.");
        return;
      }

      toast.success("Account created! Please check your email to verify.");
      form.reset();
      
    } catch (err: any) {
      console.error("Signup error:", err);
      
      toast.error(err?.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
      redirect("/verification?email=" + values.email);
    }
  }

  return (
    <div className="absolute inset-0 min-h-screen w-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-start pt-24 px-6 space-y-8 top-20">
      <div>
        <h1 className="text-2xl font-semibold">Create an account with us</h1>
      </div>

      {/* Social Login Buttons */}
      <div className="relative w-full max-w-sm">
        <div className="flex w-full justify-center gap-2">
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2"
            onClick={async () =>
              await authClient.signIn.social({
                provider: "apple",
                disableRedirect: false,
                callbackURL: "/",
              })
            }
          >
            <Image src={apple.src} alt="hi" width={19} height={19} />
            Apple
          </Button>

          <Button
            variant="outline"
            className="flex w-1/2 items-center cursor-pointer justify-center gap-2"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                disableRedirect: false,
                callbackURL: "/",
              })
            }
          >
            <Image src={google.src} alt="hi" width={18} height={18} />
            Google
          </Button>
        </div>

        <div className="flex items-center justify-center py-4">
          <div className="border-t border-muted w-full" />
          <span className="px-2 text-muted-foreground text-sm">OR</span>
          <div className="border-t border-muted w-full" />
        </div>
      </div>

      {/* Email Signup Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 min-w-[300px] max-w-sm w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
}
