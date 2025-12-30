"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "../LoginForm";
export default function LoginModal({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 rounded-3xl overflow-hidden">
 <DialogTitle className="hidden"   >
    ello
 </DialogTitle>
        <div className="px-6 pb-6">
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
