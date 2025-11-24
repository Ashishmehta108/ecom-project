"use client";
import { createNotification } from "@/lib/actions/notification-action";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {NotificationServer} from "@/components/notification/notificationserver";

export default function TestNotificationButton() {
  const [isPending, startTransition] = useTransition();

  function sendNotification() {
    startTransition(async () => {
      await createNotification("info", "Hello! This is a test notification.");
    });
  }

  return (
    <div>

    <Button onClick={sendNotification} disabled={isPending}>
      Create Notification
    </Button>
    </div>
  );
}
