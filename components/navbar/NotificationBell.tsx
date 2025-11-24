"use client";

import { NotificationBing } from "iconsax-reactjs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import NotificationList from "../notification/notificationclient";

export default function NotificationBell({ notifications }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition">
          <NotificationBing className="size-[22px]" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[400px] overflow-y-auto"
      >
        <NotificationList notifications={notifications} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
