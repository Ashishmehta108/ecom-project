"use client";
import { useSession } from "@/lib/auth-client";
import Container from "../giobal/Container";
import CartButton from "./CartItems";
import Logo from "./Logo";
import NavSearch from "./NavSearch";
import { Suspense } from "react";
import Image from "next/image";
import NotificationBell from "./NotificationBell";
function Navbar() {
  const { data } = useSession();
  const isloggedIn = data?.user.id;
  //   const { cart } = useCart();
  //   const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalItems = 10;
  return (
    <nav className=" bg-white dark:bg-neutral-950  top-0">
      <Container className="flex  sm:flex-row justify-between sm:items-center  flex-wrap py-8 gap-4">
        <Logo />
        <Suspense>
        </Suspense>
        <div className="flex gap-4 items-center">
          {isloggedIn && (
            <div className="hidden md:flex">
              <Image
                src={data.user.image!}
                alt="User Image"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          )}
          <CartButton items={totalItems} />
          <NotificationBell/>
          {/* <LinksDropdown /> */}
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
