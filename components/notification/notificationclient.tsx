import {
  getUserNotifications,
  markNotificationRead,
  deleteNotification,
  clearNotifications,
} from "@/lib/actions/notification-action"

export default async function NotificationList() {
  const notifications = await getUserNotifications();

  if (!notifications?.length) {
    return <p className="text-sm text-muted-foreground">No notifications.</p>;
  }

  return (
    <div className="space-y-3">
      <form action={clearNotifications}>
        <button type="submit" className="text-xs text-red-500 underline mb-3">
          Clear all
        </button>
      </form>

      {notifications.map((n) => (
        <div
          key={n.id}
          className="border p-3 rounded-lg bg-card flex items-start justify-between"
        >
          <div>
            <p className="font-medium">{n.type}</p>
            <p className="text-sm text-muted-foreground">{n.message}</p>
            {!n.isRead && (
              <form action={markNotificationRead.bind(null, n.id)}>
                <button className="text-xs mt-1 underline">Mark as read</button>
              </form>
            )}
          </div>

          <form action={deleteNotification.bind(null, n.id)}>
            <button className="text-xs text-red-600 underline ml-2">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
