"use client";

import { ArrowRight } from "lucide-react";

export default function TechbarCTA() {
  return (
    <section className="relative w-[95%] mx-auto overflow-hidden rounded-[40px] mt-20 mb-10 
      bg-gradient-to-br from-[#0d0d0f] via-[#111113] to-[#0c0c0e]
      border border-white/5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.6)]">
      
      {/* Soft Glow Lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[-150px] top-[-100px] w-[420px] h-[420px] 
            bg-indigo-500/10 blur-[160px] rounded-full" />
        <div className="absolute right-[-150px] bottom-[-100px] w-[420px] h-[420px] 
            bg-purple-500/10 blur-[160px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto text-center px-6 py-24 md:py-32">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.15]
          bg-gradient-to-b from-white to-white/70 text-transparent bg-clip-text">
          Elevate Your Shopping Experience
        </h2>

        <p className="text-base text-neutral-300 md:text-lg mt-6 opacity-80 mx-auto max-w-xl">
          Discover premium tech curated just for you — with fast delivery, secure checkout, 
          and AI-powered smart recommendations.
        </p>

        {/* Button */}
        <button className="group relative mt-8 px-8 py-4 rounded-2xl font-semibold
          bg-white text-neutral-700 cursor-pointer shadow-lg shadow-black/20
          hover:shadow-xl hover:shadow-black/30 hover:bg-white/95
          transition-all duration-300">
          <span className="flex items-center gap-2">
            Start Shopping Now
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>

          {/* subtle glossy highlight */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-0 
            group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
        </button>

        {/* Divider line */}
        <div className="w-20 h-px bg-white/15 mx-auto mt-10" />

        <p className="mt-4 text-xs md:text-sm text-neutral-200 opacity-70 tracking-wide">
          No signup needed • Lightning-fast checkout • Trusted by 10,000+ shoppers
        </p>
      </div>
    </section>
  );
}
