"use client";

import Link from "next/link";
import gsap from "gsap";
import { startTransition } from "@/lib/transition";

export default function AnimatedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault();

        startTransition(() => {
          gsap.to(".page-transition", {
            opacity: 0,
            y: -4,
            duration: 0.2,
            ease: "power1.in",
            onComplete: () => {
              window.location.href = href;
            },
          });
        });
      }}
    >
      {children}
    </Link>
  );
}
