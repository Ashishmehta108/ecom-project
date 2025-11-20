"use client";

import { useEffect, useState } from "react";
import Container from "../giobal/Container";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import NotificationBell from "./NotificationBell";
import LinksDropdown from "./LinksDropdown";
import CartButton from "./CartItems";
import userCartState from "@/lib/states/cart.state";
import { checkUser } from "@/lib/actions/navbar.action";
import { User } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import CategoriesBar from "./CategoriesBar";

export default function Navbar() {
  const { data, isPending } = authClient.useSession();
  const [isLoggedIn, setIsloggedin] = useState(false);

  useEffect(() => {
    if (!isPending) {
      console.log(data?.user.id);
      setIsloggedin(!!data?.user?.id);
    }
  }, [isPending, data]);

  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const { items } = userCartState();

  useEffect(() => {
    const fetchRole = async () => {
      const r = await checkUser();
      setRole(r || null);
      setLoadingRole(false);
    };
    fetchRole();
  }, []);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="w-full border-b bg-white dark:bg-neutral-950 sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-3 sm:py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo />
          </div>

          <div className="md:block hidden  max-w-xl w-full">
            <NavSearch />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <div className="md:hidden block">
              <NavSearch />
            </div>
            <NotificationBell />

            <CartButton items={items.length} />

            {!isLoggedIn ? (
              <Link
                href="/login"
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <User
                  size={22}
                  className="text-neutral-700 dark:text-neutral-300"
                />
              </Link>
            ) : (
              <LinksDropdown />
            )}
          </div>
          {/* <div>
   <CategoriesBar/>
          </div> */}
        </div>
      </Container>
    </nav>
  );
}
