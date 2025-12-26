"use client";

import "./shimmer.css";
export default function DiagonalShimmer({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative   overflow-hidden bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-tr from-transparent via-white/40 to-transparent dark:via-white/10" />
    </div>
  );
}
