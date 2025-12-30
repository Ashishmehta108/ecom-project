"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";

export default function KlarnaBanner() {
  const items = [
    { text: "Klarna Accepted", color: "from-cyan-400 to-blue-400" },
    { text: "Flexible Payments", color: "from-pink-400 to-rose-400" },
    { text: "Pay in 3", color: "from-purple-400 to-violet-400" },
    { text: "Zero Interest Options", color: "from-emerald-400 to-teal-400" },
  ];

  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (!marqueeRef.current) return;

    const container = marqueeRef.current;
    const width = container.scrollWidth / 2; // Since we duplicate once

    const animate = () => {
      controls.start({
        x: [-0, -width],
        transition: {
          duration: width / 55, // speed ~55px/sec (but scalable)
          ease: "linear",
          repeat: Infinity,
        },
      });
    };

    animate();
  }, [controls]);

  return (
    <div className="relative w-full overflow-hidden bg-neutral-950 border-y border-neutral-900">
      <motion.div
        ref={marqueeRef}
        className="flex gap-16 py-6 will-change-transform"
        style={{ translateZ: 0 }} // Trigger GPU acceleration
        animate={controls}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-16 select-none">
            <span
              className={`text-lg font-semibold bg-gradient-to-r ${item.color} bg-clip-text text-transparent whitespace-nowrap tracking-wide`}
            >
              {item.text}
            </span>
            <div className="w-px h-4 bg-neutral-800" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
