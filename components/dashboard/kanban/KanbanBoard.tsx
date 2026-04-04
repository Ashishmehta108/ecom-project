"use client";

import { useState, useCallback } from "react";
import { KanbanUser, PipelineStage } from "./kanban.types";
import { COLUMNS, generateKanbanUsers, moveUser } from "./kanban.utils";
import { KanbanColumn } from "./KanbanColumn";
import { motion } from "framer-motion";
import { Users, Loader2 } from "lucide-react";

interface KanbanBoardProps {
  initialUsers?: KanbanUser[];
}

export function KanbanBoard({ initialUsers }: KanbanBoardProps) {
  const [usersByStage, setUsersByStage] = useState<Record<PipelineStage, KanbanUser[]>>(() => {
    const users = initialUsers || generateKanbanUsers();
    const grouped: Record<PipelineStage, KanbanUser[]> = {
      leads: [],
      trial: [],
      paying: [],
      churned: [],
    };
    for (const user of users) {
      grouped[user.stage].push(user);
    }
    return grouped;
  });

  const [draggingUserId, setDraggingUserId] = useState<string | null>(null);
  const [sourceStage, setSourceStage] = useState<PipelineStage | null>(null);
  const [overStage, setOverStage] = useState<PipelineStage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragStart = useCallback((userId: string, e: React.DragEvent) => {
    setDraggingUserId(userId);
    // Find source stage
    for (const stage of COLUMNS) {
      if (usersByStage[stage].some((u) => u.id === userId)) {
        setSourceStage(stage);
        break;
      }
    }
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", userId);
  }, [usersByStage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDragEnterColumn = useCallback((stage: PipelineStage) => {
    setOverStage(stage);
  }, []);

  const handleDragLeaveColumn = useCallback(() => {
    setOverStage(null);
  }, []);

  const handleDrop = useCallback((toStage: PipelineStage, e: React.DragEvent) => {
    e.preventDefault();
    const userId = e.dataTransfer.getData("text/plain") as string;

    if (!sourceStage || !userId) {
      setDraggingUserId(null);
      setSourceStage(null);
      setOverStage(null);
      return;
    }

    setIsLoading(true);

    // Simulate brief API call
    setTimeout(() => {
      setUsersByStage((prev) => moveUser(prev, userId, sourceStage, toStage));
      setIsLoading(false);
      setDraggingUserId(null);
      setSourceStage(null);
      setOverStage(null);
    }, 200);
  }, [sourceStage]);

  const totalUsers = Object.values(usersByStage).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="w-full">
      {/* Board header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-neutral-800">
            <Users className="size-5 text-gray-600 dark:text-neutral-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Customer Pipeline
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              {totalUsers} users across {COLUMNS.length} stages
            </p>
          </div>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
            <Loader2 className="size-4 animate-spin" />
            <span>Moving...</span>
          </div>
        )}
      </div>

      {/* Board columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
        {COLUMNS.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            users={usersByStage[stage]}
            onDragStart={handleDragStart}
            onDragOver={(e) => {
              handleDragOver(e);
              handleDragEnterColumn(stage);
            }}
            onDrop={handleDrop}
            onDragLeave={handleDragLeaveColumn}
            isOver={overStage === stage}
            draggingUserId={draggingUserId}
          />
        ))}
      </div>
    </div>
  );
}
