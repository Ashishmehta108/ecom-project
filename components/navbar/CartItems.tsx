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
        <ShoppingCart className="size-5" />
        {props.items > 0 && (
          <span className="absolute -top-2 -right-2 bg-lime-500 text-white rounded-full h-5  w-5  flex items-center justify-center text-[12px] font-bold ">
            {props.items}
          </span>
        )}
      </Link>
    </Button>
  );
}
export default CartButton;
