"use client";

import { Notification } from "iconsax-reactjs";

export default function NotificationBell() {
  return (
    <button
      className="
        flex items-center justify-center 
        p-2 rounded-full border border-black/20 dark:border-white/20 
        bg-transparent hover:bg-black/10 dark:hover:bg-white/10 
        transition-all duration-200
      "
      aria-label="Notifications"
    >
      <Notification size="26" color="#FFFFFF" variant="Bold" />
    </button>
  );
}
