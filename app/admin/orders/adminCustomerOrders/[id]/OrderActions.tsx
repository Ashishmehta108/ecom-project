"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { updateOrderPaymentStatusWithValidation } from "@/lib/actions/admin-actions/payment-refund";
import { updateOrderFulfillmentStatus, type OrderStatus } from "@/lib/actions/admin-actions/adminCustomerOrder";
import { toast } from "sonner";
import ConfirmModal from "@/components/ui/confirm-modal";

type PaymentStatus = "pending" | "paid" | "refunded";

interface Order {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  subtotal: string | null;
  tax: string | null;
  shippingFee: string | null;
  total: string | null;
  currency: string | null;
  status: string | null;
  orderStatus: string | null;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: any[];
}

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "refunded"];
const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  refunded: "bg-rose-100 text-rose-700 border-rose-200",
};

const ORDER_COLORS: Record<string, string> = {
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipped: "bg-violet-100 text-violet-700 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

interface OrderActionsProps {
  order: Order;
}

export default function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(
    order.status || "pending"
  );
  const [currentOrderStatus, setCurrentOrderStatus] = useState(
    order.orderStatus || "pending"
  );
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "default" | "danger" | "warning";
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    const currentStatus = currentPaymentStatus;

    // Confirm refund when changing from paid to refunded
    if (currentStatus === "paid" && newStatus === "refunded") {
      setConfirmModal({
        isOpen: true,
        title: "Process Refund",
        message: "Are you sure you want to process a refund? This will refund the payment through Stripe.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          executePaymentStatusChange(newStatus, true);
        },
      });
    }
    // Confirm when reversing payment from paid to pending
    else if (currentStatus === "paid" && newStatus === "pending") {
      setConfirmModal({
        isOpen: true,
        title: "Reverse Payment",
        message: "Are you sure you want to reverse this payment? This will change the status back to pending.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          executePaymentStatusChange(newStatus, false);
        },
      });
    }
    // Confirm when reversing refund from refunded to paid
    else if (currentStatus === "refunded" && newStatus === "paid") {
      setConfirmModal({
        isOpen: true,
        title: "Reverse Refund",
        message: "Are you sure you want to reverse this refund? This will change the status back to paid.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          executePaymentStatusChange(newStatus, false);
        },
      });
    } else {
      executePaymentStatusChange(newStatus, false);
    }
  };

  const executePaymentStatusChange = (newStatus: PaymentStatus, confirmRefund: boolean) => {
    startTransition(async () => {
      const res = await updateOrderPaymentStatusWithValidation(order.id, newStatus, {
        confirmRefund,
      });

      if (res.success) {
        setCurrentPaymentStatus(newStatus);
        toast.success("Payment status updated");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleOrderStatusChange = (newStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderFulfillmentStatus(order.id, newStatus);

      if (res.success) {
        setCurrentOrderStatus(newStatus);
        toast.success("Order status updated");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Payment Status Dropdown */}
      <div className="relative">
        <select
          value={currentPaymentStatus}
          onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
          disabled={isPending}
          className={`appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-lg border cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            PAYMENT_COLORS[currentPaymentStatus] || PAYMENT_COLORS.pending
          }`}
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
        />
      </div>

      {/* Order Status Dropdown */}
      <div className="relative">
        <select
          value={currentOrderStatus}
          onChange={(e) => handleOrderStatusChange(e.target.value as OrderStatus)}
          disabled={isPending}
          className={`appearance-none px-3 py-2 pr-8 text-sm font-medium rounded-lg border cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
            ORDER_COLORS[currentOrderStatus] || ORDER_COLORS.pending
          }`}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
        />
      </div>
      
        <ConfirmModal
            isOpen={confirmModal.isOpen}
            title={confirmModal.title}
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            variant={confirmModal.variant}
          />
    </div>
  );
}
