
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import techbar from "@/public/Tech Bar (10).svg";

interface LogoProps {
  size?: number; // optional
}

function Logo({ size = 140 }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
      aria-label="TechBar - Go to homepage"
    >
      <Image
        src={techbar}
        alt=""
        width={size}
        height={size}
        priority
      />

    </Link>
  );
}

export default memo(Logo);