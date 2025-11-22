
import { NotificationBing } from "iconsax-reactjs";
import NotificationServer from "../notification/notificationserver";

// import { Notification, NotificationBing } from "iconsax-reactjs";
// import NotificationServer from "../notification/notificationserver";

// export default function NotificationBell() {
//   return (
//     <button
//       className="
//         flex items-center justify-center
//         p-2 rounded-full
//         bg-transparent hover:bg-neutral-100 dark:hover:bg-white/10
//         transition-all duration-200 cursor-pointer
//       "
//       aria-label="Notifications"
//     >
//       <NotificationBing className="size-[22px]" />
//       {/* <NotificationServer /> */}
//     </button>
//   );
// }

export default async function NotificationBell() {
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
      <NotificationBing className="size-[22px]" />
      <NotificationServer />
    </button>
  );
}
