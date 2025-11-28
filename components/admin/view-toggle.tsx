"use client";

import { useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewToggle({
  onChange,
}: {
  onChange: (mode: "grid" | "list") => void;
}) {
  const [mode, setMode] = useState<"grid" | "list">("grid");

  const toggle = (newMode: "grid" | "list") => {
    setMode(newMode);
    onChange(newMode);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-1 py-1 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${
          mode === "grid" ? "bg-neutral-200 dark:bg-neutral-700" : ""
        }`}
        onClick={() => toggle("grid")}
      >
        <LayoutGrid className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-full ${
          mode === "list" ? "bg-neutral-200 dark:bg-neutral-700" : ""
        }`}
        onClick={() => toggle("list")}
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
