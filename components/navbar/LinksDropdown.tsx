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
import menu from "../../app/menu.svg";
import Image from "next/image";
import { Menu } from "lucide-react";
import { ModeToggle } from "../ToggleTheme";
import { Profile } from "iconsax-reactjs";
// import { Menu } from "lucide-react";
// import { UserButton, useUser } from "@clerk/nextjs";
function LinksDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex cursor-pointer  gap-4 max-w-[80px] "
        >
          {/* <Image src={menu} alt="menu" className="w-6 h-6 dark:invert" /> */}
          <Menu className="size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        align="start"
        sideOffset={10}
        alignOffset={-5}
      >
        {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="capitalize w-full">
                {link.label}
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuItem>
          <Link href={"/profile"} className="flex gap-2 items-center">
            <Profile />
            Profile
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default LinksDropdown;
