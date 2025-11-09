"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { createUserViaEmailAction } from "@/lib/actions/create-user";
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
// import { signIn, useSession } from "next-auth/react";
import { Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import logo from "@/public/google.svg";
import Image from "next/image";
import { CloudinaryUploader } from "@/components/CloudinaryUploader";
import { UploadedFile } from "@/lib/types/general.types";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { signIn, useSession } from "@/lib/auth-client";
import { Google } from "iconsax-reactjs";

const formViaEmailSchema = z.object({
  email: z.string().regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
    message: "Email is invalid",
  }),
  image: z.string().optional().nullable(),
  password: z.string(),
});

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const { data } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const uploadRef = useRef<UploadedFile[]>([]);

  useEffect(() => {
    if (data?.user) {
      window.location.href = "/dashboard";
    }
  }, [data]);

  const form = useForm<z.infer<typeof formViaEmailSchema>>({
    resolver: zodResolver(formViaEmailSchema),
    defaultValues: {
      email: "",
      image: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formViaEmailSchema>) {
    try {
      setIsSubmitting(true);
      const uploadedImage = uploadRef.current?.[0]?.uploadedUrl;
      const payload = {
        ...values,
        image: uploadedImage || values.image,
      };
      //   await createUserViaEmailAction(payload);
      window.location.href = "/dashboard";
      toast("User created successfully!");

      form.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 min-h-screen w-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-start pt-24 px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Create an account with us</h1>
      </div>
      <div className="relative w-full max-w-sm">
        <div className="flex w-full justify-center gap-2">
          <Button
            variant="outline"
            className="flex w-1/2 items-center cursor-pointer justify-center gap-2"
            onClick={
              async () =>
                await signIn.social({
                  provider: "github",
                  disableRedirect: false,
                  callbackURL: callbackUrl,
                })
              //   signIn("github", {
              //     redirect: true,
              //     callbackUrl: callbackUrl,
              //   })
            }
          >
            <Github className="h-5 w-5" />
            GitHub
          </Button>
          <Button
            variant="outline"
            className="flex w-1/2 items-center cursor-pointer justify-center gap-2"
            onClick={
              async () =>
                await signIn.social({
                  provider: "google",
                  disableRedirect: false,
                  callbackURL: callbackUrl,
                })
              //   signIn("google", {
              //     redirect: true,
              //     callbackUrl: callbackUrl,
              //   })
            }
          >
            <Google className="fill-neutral-800 dark:text-neutral-100 dark:fill-neutral-100 w-5 h-5 text-neutral-800" />
            Google
          </Button>
        </div>
        <div className="flex items-center justify-center py-4">
          <div className="border-t border-muted w-full" />
          <span className="px-2 text-muted-foreground text-sm">OR</span>
          <div className="border-t border-muted w-full" />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 min-w-[300px] max-w-sm w-full"
        >
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
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image (optional)</FormLabel>
                <FormControl>
                  <CloudinaryUploader
                    ref={uploadRef}
                    isSubmitting={isSubmitting}
                    accept={true}
                  />
                </FormControl>
              </FormItem>
            )}
          />
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
