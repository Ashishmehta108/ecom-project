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


"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { links } from "@/utils/links";
import { Menu, User } from "lucide-react";

function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
          aria-label="Open user menu"
        >
          <Menu size={22} className="text-neutral-600 dark:text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 border-neutral-200 dark:border-neutral-800"
        align="end"
        sideOffset={8}
      >
        {links.map((link) => (
          <DropdownMenuItem key={link.href} asChild>
            <Link href={link.href} className="capitalize w-full cursor-pointer">
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex gap-2 items-center cursor-pointer">
            <User size={16} />
            Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LinksDropdown;
