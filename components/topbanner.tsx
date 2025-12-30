"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";

export default function KlarnaBanner() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = [
    "Klarna Accepted",
    "Flexible Payments",
    "Pay in 3",
    "Zero Interest",
    "Shop Now, Pay Later",
    "Instant Approval",
  ];

  useEffect(() => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const content = el.querySelector(".marquee-content");
    if (!content) return;

    const clone = content.cloneNode(true);
    el.appendChild(clone);

    const width = content.getBoundingClientRect().width;

    const tween = gsap.to(el.children, {
      x: -width,
      duration: 12,
      repeat: -1,
      ease: "none"

    });

    return () => {tween.kill();}
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 py-4 border-y border-pink-300/15">
      {/* Subtle fading edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-950 to-transparent pointer-events-none" />

      {/* Soft accent lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/20 to-transparent" />

      <div
        ref={scrollRef}
        className="flex whitespace-nowrap select-none"
        aria-hidden="true"
      >
        <div className="marquee-content flex items-center gap-10 sm:gap-20 px-6 sm:px-12">
          {items.map((text, i) => (
            <div key={i} className="flex items-center gap-6">
              <span className="text-xs sm:text-sm font-medium tracking-[0.18em] uppercase text-pink-200/90">
                {text}
              </span>
              <ChevronRight className="w-3 h-3 text-pink-300/50" strokeWidth={2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
