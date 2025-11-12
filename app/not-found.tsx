"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-[400px] items-center justify-center bg-neutral-50 dark:bg-neutral-950  min-h-screen">
      <Card className="w-full max-w-md text-center border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-inner shadow-neutral-300/50 dark:shadow-black/40 rounded-2xl">
        <CardContent className="p-8 flex flex-col items-center">
          <AlertTriangle className="w-14 h-14 text-neutral-500 dark:text-neutral-400 mb-6" />
          <h2 className="text-3xl font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
            Page Not Found
          </h2>
          <p className="mb-6 text-neutral-600 dark:text-neutral-400 text-base">
            Sorry, the page you’re looking for doesn’t exist.
          </p>
          <Button
            asChild
            variant="outline"
            className="text-sm px-5 py-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            <Link href="/">Return Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
