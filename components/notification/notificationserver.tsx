import { getUserNotifications } from "@/lib/actions/notification-action";

import NotificationList from "./notificationclient";

export default async function NotificationServer() {
  const notifications = await getUserNotifications();

  return <NotificationList notifications={notifications} />;
}
