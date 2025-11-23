// "use client";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import { Button } from "../ui/button";
// import { links } from "@/utils/links";
// import menu from "../../app/menu.svg";
// import Image from "next/image";
// import { Menu } from "lucide-react";
// import { ModeToggle } from "../ToggleTheme";
// import { Profile } from "iconsax-reactjs";
// // import { Menu } from "lucide-react";
// // import { UserButton, useUser } from "@clerk/nextjs";
// function LinksDropdown() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           className="flex cursor-pointer  gap-4 max-w-[80px] "
//         >
//           {/* <Image src={menu} alt="menu" className="w-6 h-6 dark:invert" /> */}
//           <Menu className="size-6" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         className="w-40"
//         align="start"
//         sideOffset={10}
//         alignOffset={-5}
//       >
//         {links.map((link) => {
//           return (
//             <DropdownMenuItem key={link.href}>
//               <Link href={link.href} className="capitalize w-full">
//                 {link.label}
//               </Link>
//             </DropdownMenuItem>
//           );
//         })}

//         <DropdownMenuItem>
//           <Link href={"/profile"} className="flex gap-2 items-center">
//             <Profile />
//             Profile
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
// export default LinksDropdown;


// "use client";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Link from "next/link";
// import { Button } from "../ui/button";
// import { links } from "@/utils/links";
// import { Menu, User } from "lucide-react";

// function LinksDropdown() {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
//           aria-label="Open user menu"
//         >
//           <Menu size={22} className="text-neutral-600 dark:text-neutral-400" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent
//         className="w-48 border-neutral-200 dark:border-neutral-800"
//         align="end"
//         sideOffset={8}
//       >
//         {links.map((link) => (
//           <DropdownMenuItem key={link.href} asChild>
//             <Link href={link.href} className="capitalize w-full cursor-pointer">
//               {link.label}
//             </Link>
//           </DropdownMenuItem>
//         ))}

//         <DropdownMenuItem asChild>
//           <Link href="/profile" className="flex gap-2 items-center cursor-pointer">
//             <User size={16} />
//             Profile
//           </Link>
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

// export default LinksDropdown;



"use client";

import Link from "next/link";
import { Menu, User } from "lucide-react";
import { links } from "@/utils/links";
import { authClient } from "@/lib/auth-client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

export default function RightSidebar() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  return (
    <Sheet>
      {/* OPEN BUTTON */}
      <SheetTrigger asChild>
        <button className="p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <Menu size={24} className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </SheetTrigger>

      {/* SIDEBAR */}
      <SheetContent
        side="right"
        className="w-[85%] sm:w-[360px] p-0 bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 flex flex-col h-full"
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Menu
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Explore</p>
        </div>

        {/* LINK LIST (scroll area) */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-1.5">
          {links.map((item, index) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="block px-4 py-3 rounded-lg text-neutral-700 dark:text-neutral-300
                font-medium text-[15px] transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
                style={{ transitionDelay: `${index * 20}ms` }}
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>

        {/* FOOTER (sticks to bottom) */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40 backdrop-blur-sm">

          {/* LOADING STATE */}
          {isPending && (
            <div className="h-12 w-full bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse" />
          )}

          {/* LOGGED IN */}
          {!isPending && user && (
            <SheetClose asChild>
              <Link
                href="/profile"
                className="group flex items-center gap-3.5 px-4 py-3.5 rounded-lg
                bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
                hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition"
              >
                {/* PROFILE ICON */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full 
                bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md">
                  <User size={18} />
                </div>

                {/* TEXTS */}
                <div className="flex-1">
                  <p className="font-semibold text-sm text-neutral-900 dark:text-white">
                    {user.name || "Profile"}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Manage your account
                  </p>
                </div>

                {/* ARROW */}
                <svg
                  className="w-5 h-5 text-neutral-400 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </SheetClose>
          )}

          {/* LOGGED OUT */}
          {!isPending && !user && (
            <div className="flex flex-col gap-3">
              <SheetClose asChild>
                <Link
                  href="/login"
                  className="w-full px-4 py-3.5 rounded-lg text-center font-medium
                  bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Login
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href="/signup"
                  className="w-full px-4 py-3.5 rounded-lg text-center font-medium
                  bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700
                  hover:bg-neutral-100 dark:hover:bg-neutral-700/60 transition"
                >
                  Create Account
                </Link>
              </SheetClose>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}





