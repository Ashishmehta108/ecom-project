"use client";

import React from "react";

type HighlighterTextProps = {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};

export function HighlightText({
  children,
  as: Tag = "span",
  className = "",
}: HighlighterTextProps) {
  return (
    <Tag className={`relative inline-block group cursor-pointer ${className}`}>
      {/* Actual text */}
      <span className="relative z-10">{children}</span>

      {/* Highlighter background */}
      <span
        className="
          absolute
          inset-x-0
          bottom-0
          h-full
        
          
          rounded-sm
          bg-lime-500
          dark:bg-lime-400
          origin-left
          scale-x-100
        "
        aria-hidden="true"
      />
    </Tag>
  );
}
