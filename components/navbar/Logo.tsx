import Image from "next/image";
import Link from "next/link";
import techbar from "@/public/Tech Bar (4).svg"

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image src={techbar} alt="TechBar Logo" width={36} height={36} priority />
      <span className="text-lg font-semibold">TechBar</span>
    </Link>
  );
}
