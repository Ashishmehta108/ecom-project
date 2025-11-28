// "use client";

// import { usePathname } from "next/navigation";
// import Container from "../giobal/Container";
// import Logo from "./Logo";
// import NavSearch from "./NavSearch";
// import LinksDropdown from "./LinksDropdown";
// import { CartButton } from "./CartItems";
// import userCartState from "@/lib/states/cart.state";
// import { User } from "lucide-react";
// import Link from "next/link";
// import { authClient } from "@/lib/auth-client";
// ;


// export default function Navbar() {
//   const pathname = usePathname();
//   const { data, isPending } = authClient.useSession();
//   const isLoggedIn = !!data?.session;
//   const itemsCount = userCartState((state) => state.items.length);

//   // Hide navbar in /admin routes
//   if (pathname.startsWith("/admin")) return null;

//   return (
//     <nav
//       className="
//         w-full border-b border-neutral-200 dark:border-neutral-800
//         bg-white dark:bg-neutral-950 sticky top-0 z-50
//       "
//     >
//       <Container>
//         <div className="flex items-center justify-evenly py-3.5 md:py-4 gap-3 md:gap-4">
//           {/* Logo */}
//           <div className="flex items-center gap-3 flex-shrink-0">
//             <Logo />

           
//           </div>
         


//           {/* Search - Desktop */}
//           <div className="hidden md:block flex-1 max-w-xl">
//             <NavSearch />
//           </div>

//           {/* Right Side */}
//           <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
//             {/* Mobile Search */}
//             <div className="md:hidden">
//               <NavSearch />
//             </div>
//             {/* <NotificationBellWrapper /> */}
//             {/* Cart */}
//             <CartButton items={itemsCount} />
//             {!isLoggedIn && (
//               <Link
//                 href="/login"
//                 className="p-2 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
//                 aria-label="Sign in"
//               >
//                 <User
//                   size={22}
//                   className="text-neutral-600 dark:text-neutral-400"
//                 />
//               </Link>
//             )}
//             <LinksDropdown />
//           </div>
//         </div>
//       </Container>
//     </nav>
//   );
// }



"use client";

import { usePathname } from "next/navigation";
import Container from "../giobal/Container";
import Logo from "./Logo";
import LogoFull from "./LogoFull"; // <-- full desktop logo
import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import { CartButton } from "./CartItems";
import userCartState from "@/lib/states/cart.state";
import { User } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const { data } = authClient.useSession();
  const isLoggedIn = !!data?.session;
  const itemsCount = userCartState((state) => state.items.length);

  // Hide navbar in /admin, /login, /signup
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
      <Container className="w-full mx-2 max-w-full xl:max-w-full">
        <div className="flex items-center justify-between py-3.5 md:py-4 gap-3 md:gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Mobile Logo */}
            <div className="md:hidden">
              <Logo />
            </div>

            {/* Desktop Full Logo */}
            <div className="hidden md:block">
              <LogoFull />
            </div>

          </div>

          {/* Search - Desktop */}
          <div className="hidden md:block flex-1 max-w-xl">
            <NavSearch />
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">

            {/* Mobile Search */}
            <div className="md:hidden">
              <NavSearch />
            </div>

            {/* Cart */}
            <CartButton items={itemsCount} />

            <LinksDropdown />
          </div>
        </div>
      </Container>
    </nav>
  );
}
