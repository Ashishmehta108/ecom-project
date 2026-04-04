"use client";

import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "default" | "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    default: "bg-indigo-600 hover:bg-indigo-700",
    danger: "bg-rose-600 hover:bg-rose-700",
    warning: "bg-amber-600 hover:bg-amber-700",
  };

  const iconColors = {
    default: "text-indigo-600",
    danger: "text-rose-600",
    warning: "text-amber-600",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DA]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-[#F7F6F3]`}>
              <AlertTriangle size={20} className={iconColors[variant]} />
            </div>
            <h3 className="font-semibold text-[#1A1A1A] text-lg">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-[#6B6B6B] leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 pb-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-[#E5E2DA] text-[#6B6B6B] hover:bg-[#F7F6F3]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`flex-1 text-white ${variantStyles[variant]}`}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
