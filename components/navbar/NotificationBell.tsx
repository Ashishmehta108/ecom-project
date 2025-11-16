"use client";

import { Notification, NotificationBing } from "iconsax-reactjs";

export default function NotificationBell() {
  return (
    <button
      className="
        flex items-center justify-center 
        p-2 rounded-full   
        bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10 
        transition-all duration-200 cursor-pointer
      "
      aria-label="Notifications"
    >
      <NotificationBing className="size-[22px]"/>
    </button>
  );
}
