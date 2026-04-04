"use client";

import { useState } from "react";
import { kanbanData } from "./kanbanData";
import { KanbanCard, KanbanColumn } from "./types";
import { Clock } from "lucide-react";

const columnColors: Record<string, { accent: string; border: string; bg: string; hoverBorder: string; hoverBg: string; badgeBg: string; badgeText: string }> = {
  leads: { accent: "#6366f1", border: "border-indigo-500", bg: "bg-indigo-50/50", hoverBorder: "border-indigo-300", hoverBg: "bg-indigo-50/30", badgeBg: "bg-indigo-50", badgeText: "text-indigo-700" },
  trial: { accent: "#f59e0b", border: "border-amber-500", bg: "bg-amber-50/50", hoverBorder: "border-amber-300", hoverBg: "bg-amber-50/30", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  paying: { accent: "#10b981", border: "border-emerald-500", bg: "bg-emerald-50/50", hoverBorder: "border-emerald-300", hoverBg: "bg-emerald-50/30", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  churned: { accent: "#f43f5e", border: "border-rose-500", bg: "bg-rose-50/50", hoverBorder: "border-rose-300", hoverBg: "bg-rose-50/30", badgeBg: "bg-rose-50", badgeText: "text-rose-700" },
};

function Card({ card, columnId }: { card: KanbanCard; columnId: string }) {
  const colors = columnColors[columnId] || columnColors.leads;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("cardId", card.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="bg-white border border-gray-200 rounded-xl p-3.5 cursor-grab active:cursor-grabbing hover:border-gray-300 transition-all duration-150 group shadow-sm"
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${colors.badgeBg} ${colors.badgeText}`}
        >
          {card.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">{card.name}</p>
          <p className="text-[10px] text-gray-500 truncate">{card.email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.badgeBg} ${colors.badgeText}`}>
          {card.tag}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
          <Clock className="w-2.5 h-2.5" />
          {card.daysInStage}d
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-900 mt-2">€{card.value.toLocaleString()}</p>
    </div>
  );
}

function Column({
  col,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
}: {
  col: KanbanColumn;
  onDrop: (colId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  isDragOver: boolean;
}) {
  const totalValue = col.cards.reduce((s, c) => s + c.value, 0);
  const colors = columnColors[col.id] || columnColors.leads;

  return (
    <div
      className="flex-1 min-w-[200px] max-w-[280px]"
      onDrop={(e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("cardId");
        if (cardId) onDrop(col.id);
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${colors.border.replace("border-", "bg-")}`} />
        <span className="text-xs font-semibold text-gray-700">{col.title}</span>
        <span className="text-xs text-gray-400 ml-auto">
          {col.cards.length} · €{(totalValue / 1000).toFixed(1)}k
        </span>
      </div>
      <div
        className={`space-y-2 min-h-[120px] rounded-xl p-2 border-2 border-dashed transition-colors ${
          isDragOver
            ? `${colors.hoverBorder} ${colors.hoverBg}`
            : "border-gray-200 bg-gray-50/50"
        }`}
      >
        {col.cards.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            Drop here
          </div>
        ) : (
          col.cards.map((card) => (
            <Card key={card.id} card={card} columnId={col.id} />
          ))
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(kanbanData);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleDrop = (toColId: string) => {
    const cardId = (event as DragEvent)?.dataTransfer?.getData("cardId");
    if (!cardId) return;

    setColumns((prev) => {
      let draggedCard: KanbanCard | null = null;
      let fromColId: string | null = null;

      const updated = prev.map((col) => {
        const card = col.cards.find((c) => c.id === cardId);
        if (card) {
          draggedCard = card;
          fromColId = col.id;
          return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
        }
        return col;
      });

      if (draggedCard && fromColId !== toColId) {
        return updated.map((col) =>
          col.id === toColId ? { ...col, cards: [...col.cards, draggedCard!] } : col
        );
      }

      return prev;
    });
    setDragOverCol(null);
  };

  const handleDragOver = (colId: string) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Customer Pipeline</h3>
          <p className="text-xs text-gray-500 mt-0.5">Drag cards to move customers between stages</p>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((col) => (
          <Column
            key={col.id}
            col={col}
            onDrop={handleDrop}
            onDragOver={handleDragOver(col.id)}
            onDragLeave={handleDragLeave}
            isDragOver={dragOverCol === col.id}
          />
        ))}
      </div>
    </div>
  );
}
