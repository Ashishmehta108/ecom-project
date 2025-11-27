// ❌ No "use client"

import { getUserNotifications } from "@/lib/actions/notification-action";

export default async function NotificationBellWrapper() {
  const notifications = await getUserNotifications();

  const NotificationBell = (await import("./NotificationBell")).default;

  return <NotificationBell notifications={notifications} />;
}
