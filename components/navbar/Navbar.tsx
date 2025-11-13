"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Container from "../giobal/Container";
import CartButton from "./CartItems";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import NotificationBell from "./NotificationBell";
import LinksDropdown from "./LinksDropdown";
import { ModeToggle } from "../ToggleTheme";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import CategoriesBar from "./CategoriesBar";

export default function Navbar() {
  const { data } = useSession();
  const isLoggedIn = data?.user?.id;
  const totalItems = 10;


  return (
    <nav className="w-full border-b bg-white dark:bg-neutral-950 sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-3 sm:py-4 gap-4">

          <div className="flex items-center gap-4">
           
            <Logo />
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-xl">
            <NavSearch />
          </div>

          <div className="flex items-center gap-4">

            <ModeToggle />

            <NotificationBell />

            <CartButton items={totalItems} />

            {isLoggedIn && (
              <Image
                src={data.user.image!}
                width={38}
                height={38}
                alt="User"
                className="rounded-full hidden sm:block"
              />
            )}

            <LinksDropdown />
            
          </div>
        </div>
        <CategoriesBar/>

        <div className="md:hidden px-1 pb-3">
          <NavSearch />
        </div>

      </Container>
    </nav>
  );
}
