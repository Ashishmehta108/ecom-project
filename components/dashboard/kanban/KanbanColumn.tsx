"use client";

import { KanbanUser, PipelineStage } from "./kanban.types";
import { STAGE_CONFIG } from "./kanban.utils";
import { KanbanCard } from "./KanbanCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface KanbanColumnProps {
  stage: PipelineStage;
  users: KanbanUser[];
  onDragStart: (userId: string, e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (stage: PipelineStage, e: React.DragEvent) => void;
  isOver: boolean;
  draggingUserId: string | null;
}

export function KanbanColumn({
  stage,
  users,
  onDragStart,
  onDragOver,
  onDrop,
  isOver,
  draggingUserId,
}: KanbanColumnProps) {
  const config = STAGE_CONFIG[stage];

  return (
    <motion.div
      layout
      className="flex flex-col min-w-[280px] w-[280px] flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(stage, e)}
    >
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 rounded-2xl border mb-3",
          isOver
            ? cn(config.borderColor, config.bgColor, "ring-2 ring-offset-1 ring-offset-transparent ring-current")
            : "border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50"
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full", isOver ? "bg-current" : config.color.replace("text-", "bg-").replace("dark:", "").split(" ")[0])} />
          <h3 className={cn("text-sm font-semibold", config.color)}>
            {config.label}
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex items-center justify-center size-6 rounded-full text-xs font-bold",
            isOver
              ? config.bgColor
              : "bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400"
          )}
        >
          {users.length}
        </span>
      </div>

      {/* Drop zone / Cards container */}
      <div
        className={cn(
          "flex-1 rounded-2xl border-2 border-dashed p-2 transition-all duration-200 overflow-y-auto",
          "max-h-[calc(100vh-220px)] hide-scrollbar",
          isOver
            ? cn(config.borderColor, config.bgColor)
            : "border-transparent bg-gray-50/30 dark:bg-neutral-900/30"
        )}
      >
        <AnimatePresence mode="popLayout">
          {users.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <p className="text-sm text-gray-400 dark:text-neutral-600">
                No users yet
              </p>
              <p className="text-xs text-gray-300 dark:text-neutral-700 mt-1">
                Drop a card here
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {users.map((user) => (
                <KanbanCard
                  key={user.id}
                  user={user}
                  onDragStart={onDragStart}
                  isDragging={draggingUserId === user.id}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
