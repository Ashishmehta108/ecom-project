import React from "react";
import "@/app/globals.css";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className = "", children }: SkeletonProps) {
  return <div className={`skeleton shadow-inner ${className}`}>{children}</div>;
}
