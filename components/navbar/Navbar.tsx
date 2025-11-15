"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

import Container from "../giobal/Container";
import CartButton from "./CartItems";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import NotificationBell from "./NotificationBell";
import LinksDropdown from "./LinksDropdown";
import { checkUser } from "@/lib/actions/navbar.action";
export default function Navbar() {
  const { data } = useSession();
  const isLoggedIn = !!data?.user?.id;

  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const totalItems = 10;

  useEffect(() => {
    const fetchRole = async () => {
      const r = await checkUser();
      console.log("User role:", r);
      setRole(r!);
      setLoadingRole(false);
    };
    fetchRole();
  }, []);

  // if (loadingRole) return null;

  // if (role == "admin") return null;

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
            <NotificationBell />
            <CartButton items={totalItems} />
           <LinksDropdown />
          </div>
        </div>

        <div className="md:hidden px-1 pb-3">
          <NavSearch />
        </div>
      </Container>
    </nav>
  );
}
