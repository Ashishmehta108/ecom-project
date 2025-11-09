import { Button } from "@/components/ui/button";
import { ShoppingCart } from "iconsax-reactjs";
import Link from "next/link";
function CartButton(props: { items: number }) {
  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="flex justify-center items-center  relative   "
    >
      <Link href="/cart">
        <ShoppingCart className="" />
        {props.items > 0 && (
          <span className="absolute -top-0 -right-0 bg-blue-800 text-white rounded-full h-3 w-3 flex items-center justify-center text-[7px]">
            {props.items}
          </span>
        )}
      </Link>
    </Button>
  );
}
export default CartButton;
