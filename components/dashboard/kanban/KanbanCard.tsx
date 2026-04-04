"use client";

import { KanbanUser, PlanType } from "./kanban.types";
import { Mail, Calendar, DollarSign, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KanbanCardProps {
  user: KanbanUser;
  onDragStart: (userId: string, e: React.DragEvent) => void;
  isDragging: boolean;
}

const planColors: Record<PlanType, string> = {
  Starter: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Pro: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Enterprise: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

export function KanbanCard({ user, onDragStart, isDragging }: KanbanCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={(e: any) => onDragStart(user.id, e)}
      className={cn(
        "group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800",
        "p-4 cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:border-gray-300 dark:hover:border-neutral-700",
        "transition-all duration-200",
        isDragging && "opacity-40 rotate-2 scale-95"
      )}
    >
      {/* Drag handle */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="size-4 text-gray-400 dark:text-neutral-600" />
      </div>

      {/* User info */}
      <div className="flex items-start gap-3 mb-3 pr-6">
        <div className="size-10 rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {user.name}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Mail className="size-3 text-gray-400 dark:text-neutral-500 flex-shrink-0" />
            <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Plan badge */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium",
            planColors[user.plan]
          )}
        >
          {user.plan}
        </span>
        <div className="flex items-center gap-1 text-gray-700 dark:text-neutral-300">
          <DollarSign className="size-3.5" />
          <span className="text-sm font-semibold">{user.monthlyValue}</span>
          <span className="text-xs text-gray-400 dark:text-neutral-500">/mo</span>
        </div>
      </div>

      {/* Join date */}
      <div className="flex items-center gap-1.5 text-gray-400 dark:text-neutral-500">
        <Calendar className="size-3" />
        <span className="text-xs">Joined {user.joinDate}</span>
      </div>
    </motion.div>
  );
}
