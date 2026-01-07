"use client";
import { usePathname } from "next/navigation";
import Container from "../giobal/Container";
import Logo from "./Logo";
import LogoFull from "./LogoFull"; 
import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import CartButton from "./CartItems";
import LanguageSwitcher from "../LanguageSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const hideNavbar =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (hideNavbar) return null;

  return (
    <nav
      className="
        w-full border-b border-neutral-200 dark:border-neutral-800
        bg-white dark:bg-neutral-950 sticky top-0 z-50
      "
    >
      <Container className="w-full  max-w-full xl:max-w-full">
        <div className="flex items-center justify-between py-3.5 md:py-4 gap-3 md:gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="md:hidden">
              <Logo />
            </div>
            <div className="hidden md:block">
              <LogoFull />
            </div>
          </div>
          <div className="hidden md:block flex-1 max-w-xl">
            <NavSearch />
          </div>        
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          
            <div className="md:hidden">
              <NavSearch />
            </div>
            <CartButton  />
            <LanguageSwitcher />
            <LinksDropdown />
          </div>
        </div>
      </Container>
    </nav>
  );
}
