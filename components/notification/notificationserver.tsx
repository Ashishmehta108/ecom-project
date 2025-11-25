"use server";
import { getUserNotifications } from "@/lib/actions/notification-action";
import NotificationList from "./notificationclient";

export  async function NotificationServer() {
  const notifications = await getUserNotifications();
  return <NotificationList notifications={notifications} />;
}
