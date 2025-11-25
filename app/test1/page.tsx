import { NotificationServer } from "@/components/notification/notificationserver";
import TestNotificationButton from "./client";

export default async function Test() {
  return (
    <>
      <TestNotificationButton />
      <NotificationServer/>
    </>
  );
}
