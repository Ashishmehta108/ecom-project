"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Profile() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Skeleton className="w-64 h-40 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
          You're not logged in
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Please login to access your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card className="border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl">
        <CardHeader className="items-center text-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3 border border-neutral-200 dark:border-neutral-700">
            <Image
              src={user.image || "/default-avatar.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <CardTitle className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            {user.name || "User"}
          </CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {user.email}
          </p>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full rounded-xl border-neutral-300 dark:border-neutral-700"
          >
            Edit Profile
          </Button>
        </CardContent>

        <Button onClick={() => authClient.signOut()}>logout</Button>
      </Card>
    </div>
  );
}
