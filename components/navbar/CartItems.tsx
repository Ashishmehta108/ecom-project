// import { Button } from "@/components/ui/button";
// import { ShoppingCart } from "iconsax-reactjs";
// import Link from "next/link";
// function CartButton(props: { items: number }) {
//   return (
//     <Button
//       asChild
//       variant="ghost"
//       size="icon"
//       className="flex justify-center items-center  relative   "
//     >
//       <Link href="/cart">
//         <ShoppingCart className="size-5" />
//         {props.items > 0 && (
//           <span className="absolute -top-2 -right-2 bg-lime-500 text-white rounded-full h-5  w-5  flex items-center justify-center text-[12px] font-bold ">
//             {props.items}
//           </span>
//         )}
//       </Link>
//     </Button>
//   );
// }
// export default CartButton;


import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

interface CartButtonProps {
  items: number;
}

function CartButton({ items }: CartButtonProps) {
  return (
    <Link
      href="/cart"
      className="relative p-2 rounded-full hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 transition-colors duration-200"
      aria-label={`Shopping cart, ${items} ${items === 1 ? "item" : "items"}`}
    >
      <ShoppingCart size={22} className="text-neutral-600 dark:text-neutral-400" />
      {items > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold rounded-full">
          {items > 99 ? "99+" : items}
        </span>
      )}
    </Link>
  );
}

export default memo(CartButton);
