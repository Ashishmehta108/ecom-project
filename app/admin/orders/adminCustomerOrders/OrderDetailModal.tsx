"use client";

import { useState } from "react";
import {
  X,
  Trash2,
  CreditCard,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  ExternalLink,
  Calendar,
  Hash,
} from "lucide-react";
import {
  type PaymentStatus,
  type OrderStatus,
} from "@/lib/actions/admin-actions/adminCustomerOrder";
import Link from "next/link";
import ConfirmModal from "@/components/ui/confirm-modal";

type Order = {
  id: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  subtotal: string;
  tax: string;
  shippingFee: string;
  total: string;
  currency: string | null;
  status: string | null;
  orderStatus: string | null;
  stripePaymentIntentId: string | null;
  stripeCheckoutSessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    id: string;
    productId: string;
    name: any;
    quantity: number;
    price: string;
    product?: any;
  }>;
  shippingAddress?: {
    taxId?: string | null;
    taxType?: string | null;
    companyName?: string | null;
  };
};

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "refunded"];
const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STYLES: Record<string, { dot: string; pill: string }> = {
  pending:  { dot: "bg-amber-400",   pill: "bg-amber-50   text-amber-700  ring-amber-200"   },
  paid:     { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  refunded: { dot: "bg-rose-400",    pill: "bg-rose-50    text-rose-700   ring-rose-200"    },
};

const ORDER_STYLES: Record<string, { dot: string; pill: string }> = {
  pending:    { dot: "bg-slate-400",   pill: "bg-slate-50   text-slate-600  ring-slate-200"   },
  processing: { dot: "bg-blue-400",    pill: "bg-blue-50    text-blue-700   ring-blue-200"    },
  shipped:    { dot: "bg-violet-400",  pill: "bg-violet-50  text-violet-700 ring-violet-200"  },
  delivered:  { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200"},
  cancelled:  { dot: "bg-rose-400",    pill: "bg-rose-50    text-rose-700   ring-rose-200"    },
};

function fmt(amount: string | null, currency = "EUR") {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: currency || "EUR",
  }).format(Number(amount || 0));
}

function fmtDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(date));
}

interface Props {
  order: Order;
  onClose: () => void;
  onPaymentStatus: (
    id: string,
    status: PaymentStatus,
    options?: { confirmRefund?: boolean }
  ) => void;
  onOrderStatus: (id: string, status: OrderStatus) => void;
  onDelete: (id: string) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onPaymentStatus,
  onOrderStatus,
  onDelete,
}: Props) {
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "default" | "danger" | "warning";
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  const payStyle = PAYMENT_STYLES[order.status || "pending"] ?? PAYMENT_STYLES.pending;
  const ordStyle = ORDER_STYLES[order.orderStatus || "pending"] ?? ORDER_STYLES.pending;

  const handlePaymentStatusChange = (newStatus: PaymentStatus) => {
    const cur = order.status || "pending";
    
    if (cur === "paid" && newStatus === "refunded") {
      setConfirmModal({
        isOpen: true,
        title: "Process Refund",
        message: "Are you sure you want to process a refund? This will refund the payment through Stripe.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onPaymentStatus(order.id, newStatus, { confirmRefund: true });
        },
      });
    } else if (cur === "paid" && newStatus === "pending") {
      setConfirmModal({
        isOpen: true,
        title: "Reverse Payment",
        message: "Are you sure you want to reverse this payment? This will change the status back to pending.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onPaymentStatus(order.id, newStatus);
        },
      });
    } else if (cur === "refunded" && newStatus === "paid") {
      setConfirmModal({
        isOpen: true,
        title: "Reverse Refund",
        message: "Are you sure you want to reverse this refund? This will change the status back to paid.",
        variant: "warning",
        onConfirm: () => {
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onPaymentStatus(order.id, newStatus);
        },
      });
    } else {
      onPaymentStatus(order.id, newStatus);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 bg-[#FAFAF8] w-full sm:max-w-xl sm:rounded-2xl shadow-2xl max-h-[94dvh] flex flex-col overflow-hidden border border-black/[0.06]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[#ECEAE4]">
          <div className="min-w-0">
            <p className="text-xs font-mono text-[#999]">
              #{order.id.slice(-10).toUpperCase()}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {/* Payment badge */}
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${payStyle.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${payStyle.dot}`} />
                {order.status ?? "pending"}
              </span>
              {/* Order badge */}
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${ordStyle.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ordStyle.dot}`} />
                {order.orderStatus ?? "pending"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-3">
            <button
              onClick={() => { if (confirm("Delete this order?")) onDelete(order.id); }}
              className="p-2 rounded-lg text-[#999] hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#999] hover:text-[#1A1A1A] hover:bg-[#F0EEE9] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Status selects */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#AAA] mb-1.5 flex items-center gap-1">
                <CreditCard size={10} /> Payment
              </label>
              <select
                value={order.status || "pending"}
                onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-black/[0.08] bg-white text-[#1A1A1A] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00312D]/20 shadow-sm"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#AAA] mb-1.5 flex items-center gap-1">
                <Package size={10} /> Fulfillment
              </label>
              <select
                value={order.orderStatus || "pending"}
                onChange={(e) => onOrderStatus(order.id, e.target.value as OrderStatus)}
                className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-black/[0.08] bg-white text-[#1A1A1A] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00312D]/20 shadow-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-[#ECEAE4] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-[#F4F3F0] flex items-center gap-1.5">
              <User size={12} className="text-[#AAA]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA]">Customer</span>
            </div>
            <div className="px-4 py-3 grid grid-cols-1 gap-2.5">
              {[
                { icon: User,   label: "Name",    value: order.customerName },
                { icon: Mail,   label: "Email",   value: order.customerEmail },
                { icon: Phone,  label: "Phone",   value: order.customerPhone },
                { icon: MapPin, label: "Address", value: order.customerAddress },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-5 h-5 shrink-0 bg-[#F4F3F0] rounded-md flex items-center justify-center">
                    <Icon size={10} className="text-[#888]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#BBB]">{label}</p>
                    <p className="text-xs text-[#1A1A1A] break-words">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Information */}
          {order.shippingAddress && (order.shippingAddress.taxId || order.shippingAddress.companyName) && (
            <div className="bg-white rounded-2xl border border-[#ECEAE4] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F4F3F0] flex items-center gap-1.5">
                <CreditCard size={12} className="text-[#AAA]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA]">Tax Information</span>
              </div>
              <div className="px-4 py-3 grid grid-cols-1 gap-2.5">
                {order.shippingAddress.companyName && (
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-5 h-5 shrink-0 bg-[#F4F3F0] rounded-md flex items-center justify-center">
                      <User size={10} className="text-[#888]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#BBB]">Company Name</p>
                      <p className="text-xs text-[#1A1A1A]">{order.shippingAddress.companyName}</p>
                    </div>
                  </div>
                )}
                {order.shippingAddress.taxId && (
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-5 h-5 shrink-0 bg-[#F4F3F0] rounded-md flex items-center justify-center">
                      <Hash size={10} className="text-[#888]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#BBB]">Tax ID</p>
                      <p className="text-xs text-[#1A1A1A] break-words">{order.shippingAddress.taxId}</p>
                    </div>
                  </div>
                )}
                {order.shippingAddress.taxType && (
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-5 h-5 shrink-0 bg-[#F4F3F0] rounded-md flex items-center justify-center">
                      <CreditCard size={10} className="text-[#888]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#BBB]">Tax Type</p>
                      <p className="text-xs text-[#1A1A1A]">{order.shippingAddress.taxType}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#ECEAE4] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F4F3F0] flex items-center gap-1.5">
                <Package size={12} className="text-[#AAA]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA]">Items</span>
                <span className="ml-auto text-[10px] text-[#CCC]">{order.items.length}</span>
              </div>
              <ul className="divide-y divide-[#F4F3F0]">
                {order.items.map((item) => {
                  const name =
                    typeof item.name === "object"
                      ? item.name?.en || item.name?.pt || "Product"
                      : item.name || "Product";
                  const img = item.product?.productImages?.[0]?.url;
                  const brand = item.product?.brand ?? "";
                  const model = item.product?.model ?? "";

                  return (
                    <li key={item.id} className="flex items-start gap-3 px-4 py-3 group hover:bg-[#FAFAF8] transition-colors">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#F4F3F0] border border-black/[0.05] flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img src={img} alt={name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <Package size={16} className="text-[#CCC]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#1A1A1A] truncate">{name}</p>
                        {(brand || model) && (
                          <p className="text-[10px] text-[#999] mt-0.5">{[brand, model].filter(Boolean).join(" · ")}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] bg-[#F4F3F0] text-[#666] px-1.5 py-0.5 rounded-full">×{item.quantity}</span>
                          <span className="text-[10px] text-[#999]">{fmt(item.price, order.currency ?? "EUR")} each</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-[#1A1A1A]">
                          {fmt((Number(item.price) * item.quantity).toFixed(2), order.currency ?? "EUR")}
                        </p>
                        {item.productId && (
                          <Link
                            href={`/admin/products?id=${item.productId}`}
                            className="inline-flex items-center gap-0.5 mt-1 text-[10px] text-indigo-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View <ExternalLink size={9} />
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-[#ECEAE4] px-4 py-3 space-y-2">
            {[
              { label: "Subtotal", val: fmt(order.subtotal, order.currency ?? "EUR") },
              { label: "Tax",      val: fmt(order.tax || "0", order.currency ?? "EUR") },
              { label: "Shipping", val: fmt(order.shippingFee || "0", order.currency ?? "EUR") },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between text-xs text-[#999]">
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#F0EEE9]">
              <span>Total</span>
              <span>{fmt(order.total, order.currency ?? "EUR")}</span>
            </div>
          </div>

          {/* Stripe */}
          {(order.stripePaymentIntentId || order.stripeCheckoutSessionId) && (
            <div className="bg-white rounded-2xl border border-[#ECEAE4] overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F4F3F0] flex items-center gap-1.5">
                <CreditCard size={12} className="text-[#AAA]" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#AAA]">Stripe</span>
              </div>
              <div className="px-4 py-3 space-y-3">
                {order.stripePaymentIntentId && (
                  <div>
                    <p className="text-[10px] text-[#BBB] mb-1">Payment Intent</p>
                    <p className="text-[10px] font-mono text-[#555] break-all bg-[#F4F3F0] px-2 py-1.5 rounded-lg leading-relaxed">
                      {order.stripePaymentIntentId}
                    </p>
                  </div>
                )}
                {order.stripeCheckoutSessionId && (
                  <div>
                    <p className="text-[10px] text-[#BBB] mb-1">Checkout Session</p>
                    <p className="text-[10px] font-mono text-[#555] break-all bg-[#F4F3F0] px-2 py-1.5 rounded-lg leading-relaxed">
                      {order.stripeCheckoutSessionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex gap-4 pb-1">
            {[
              { label: "Created",  value: fmtDate(order.createdAt) },
              { label: "Updated",  value: fmtDate(order.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[#BBB]">{label}</p>
                <p className="text-xs text-[#666] mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
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