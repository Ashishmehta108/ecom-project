import Link from "next/link";
import { Button } from "../ui/button";
import { Icon } from "iconsax-reactjs";

function Logo() {
  return (
    <Button size="icon" className="" asChild>
      <Link href="/">
        <Icon />
      </Link>
    </Button>
  );
}

export default Logo;
