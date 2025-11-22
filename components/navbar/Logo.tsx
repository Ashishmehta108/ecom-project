// import Image from "next/image";
// import Link from "next/link";
// import techbar from "@/public/Tech Bar (4).svg"

// export default function Logo() {
//   return (
//     <Link href="/" className="flex items-center gap-2">
//       <Image src={techbar} alt="TechBar Logo" width={36} height={36} priority />
//       <span className="text-lg font-semibold">TechBar</span>
//     </Link>
//   );
// }


import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import techbar from "@/public/Tech Bar (4).svg";

function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
      aria-label="TechBar - Go to homepage"
    >
      <Image src={techbar} alt="" width={36} height={36} priority />
     
    </Link>
  );
}

export default memo(Logo);
