"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  deleteCustomerOrder,
  updateOrderPaymentStatus,
  updateOrderFulfillmentStatus,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/actions/admin-actions/adminCustomerOrder";
import { updateOrderPaymentStatusWithValidation } from "@/lib/actions/admin-actions/payment-refund";
import { toast } from "sonner";
import {
  Search,
  Trash2,
  ChevronDown,
  X,
  Package,
  CreditCard,
  Users,
  TrendingUp,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
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
};

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

function fmt(amount: string, currency = "EUR") {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: currency || "EUR",
  }).format(Number(amount));
}

function fmtDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function OrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [filterOrder, setFilterOrder] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [openDropdown, setOpenDropdown] = useState<{ type: "payment" | "order"; orderId: string } | null>(null);
  
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: "default" | "danger" | "warning";
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + Number(o.total), 0);
    const paid = orders.filter((o) => o.status === "paid").length;
    const pending = orders.filter((o) => o.status === "pending").length;
    return { total, paid, pending, count: orders.length };
  }, [orders]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.stripePaymentIntentId?.toLowerCase().includes(q);
      const matchPayment =
        filterPayment === "all" || o.status === filterPayment;
      const matchOrder =
        filterOrder === "all" || o.orderStatus === filterOrder;
      return matchSearch && matchPayment && matchOrder;
    });
  }, [orders, search, filterPayment, filterOrder]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };
    
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openDropdown]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Order",
      message: "Are you sure you want to delete this order? This action cannot be undone.",
      variant: "danger",
      onConfirm: () => {
        setDeletingId(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        startTransition(async () => {
          const res = await deleteCustomerOrder(id);
          if (res.success) {
            setOrders((prev) => prev.filter((o) => o.id !== id));
            toast.success("Order deleted");
          } else {
            toast.error(res.error);
          }
          setDeletingId(null);
        });
      },
    });
  };

  const handlePaymentStatus = (id: string, status: PaymentStatus, options?: { confirmRefund?: boolean }) => {
    startTransition(async () => {
      const res = await updateOrderPaymentStatusWithValidation(id, status, options);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: status } : o))
        );
        if (selectedOrder?.id === id)
          setSelectedOrder((prev) => prev && { ...prev, status: status });
        toast.success("Payment status updated");
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleOrderStatus = (id: string, orderStatus: OrderStatus) => {
    startTransition(async () => {
      const res = await updateOrderFulfillmentStatus(id, orderStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, orderStatus } : o))
        );
        if (selectedOrder?.id === id)
          setSelectedOrder((prev) => prev && { ...prev, orderStatus });
        toast.success("Order status updated");
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* ── Header ── */}
      <div className="bg-white border-b border-[#E5E2DA]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
                Customer Orders
              </h1>
              <p className="text-sm text-[#6B6B6B] mt-0.5">
                Manage and track all customer orders
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#F7F6F3] rounded-lg transition-colors border border-[#E5E2DA]"
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              {
                label: "Total Orders",
                value: stats.count,
                icon: Package,
                color: "text-[#00312D]",
                bg: "bg-[#00312D]/8",
              },
              {
                label: "Revenue",
                value: fmt(String(stats.total)),
                icon: TrendingUp,
                color: "text-emerald-700",
                bg: "bg-emerald-50",
              },
              {
                label: "Paid",
                value: stats.paid,
                icon: CreditCard,
                color: "text-blue-700",
                bg: "bg-blue-50",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: Users,
                color: "text-amber-700",
                bg: "bg-amber-50",
              },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div
                key={label}
                className="bg-white border border-[#E5E2DA] rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div>
                    <p className="text-xs text-[#6B6B6B]">{label}</p>
                    <p className="text-lg font-bold text-[#1A1A1A]">{value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, order ID…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-[#E5E2DA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00312D]/20 focus:border-[#00312D]/40 placeholder:text-[#9B9B9B]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#1A1A1A]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Payment filter */}
          <div className="relative">
            <Filter
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
            />
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="pl-8 pr-8 py-2.5 text-sm bg-white border border-[#E5E2DA] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#00312D]/20 focus:border-[#00312D]/40 text-[#1A1A1A] cursor-pointer"
            >
              <option value="all">All Payments</option>
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] pointer-events-none"
            />
          </div>

          {/* Order status filter */}
          <div className="relative">
            <select
              value={filterOrder}
              onChange={(e) => setFilterOrder(e.target.value)}
              className="pl-4 pr-8 py-2.5 text-sm bg-white border border-[#E5E2DA] rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#00312D]/20 focus:border-[#00312D]/40 text-[#1A1A1A] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] pointer-events-none"
            />
          </div>

          <span className="text-xs text-[#9B9B9B] ml-auto">
            {filtered.length} of {orders.length} orders
          </span>
        </div>

        {/* ── Table ── */}
        <div className="mt-4 bg-white border border-[#E5E2DA] rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-[#9B9B9B]">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E2DA] bg-[#F7F6F3]">
                    {[
                      "Order",
                      "Customer",
                      "Total",
                      "Payment",
                      "Fulfillment",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-[#6B6B6B] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DA]">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#F7F6F3]/60 transition-colors group"
                    >
                      {/* Order ID */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#6B6B6B] bg-[#F7F6F3] px-2 py-1 rounded">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#1A1A1A] truncate max-w-[160px]">
                            {order.customerName || "—"}
                          </p>
                          <p className="text-xs text-[#9B9B9B] truncate max-w-[160px]">
                            {order.customerEmail || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[#1A1A1A]">
                          {fmt(order.total, order.currency || "EUR")}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const isOpen = openDropdown?.type === "payment" && openDropdown.orderId === order.id;
                              setOpenDropdown(isOpen ? null : { type: "payment", orderId: order.id });
                            }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none ${
                              PAYMENT_COLORS[order.status || "pending"] ||
                              PAYMENT_COLORS.pending
                            }`}
                          >
                            {order.status || "pending"}
                            <ChevronDown size={11} className="ml-1" />
                          </span>
                          {/* Dropdown */}
                          {openDropdown?.type === "payment" && openDropdown.orderId === order.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-full mt-1 z-[100] bg-white border border-[#E5E2DA] rounded-lg shadow-lg min-w-[140px]"
                            >
                              <div className="max-h-[180px] overflow-y-auto">
                              {PAYMENT_STATUSES.map((s) => {
                                const currentStatus = order.status || "pending";
                                const needsConfirmation =
                                  (currentStatus === "paid" && s === "refunded") ||
                                  (currentStatus === "paid" && s === "pending") ||
                                  (currentStatus === "refunded" && s === "paid");

                                const confirmData =
                                  currentStatus === "paid" && s === "refunded"
                                    ? { title: "Process Refund", message: "Are you sure you want to process a refund? This will refund the payment through Stripe.", variant: "warning" as const }
                                    : currentStatus === "paid" && s === "pending"
                                    ? { title: "Reverse Payment", message: "Are you sure you want to reverse this payment? This will change the status back to pending.", variant: "warning" as const }
                                    : currentStatus === "refunded" && s === "paid"
                                    ? { title: "Reverse Refund", message: "Are you sure you want to reverse this refund? This will change the status back to paid.", variant: "warning" as const }
                                    : { title: "", message: "", variant: "default" as const };

                                return (
                                  <button
                                    key={s}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (needsConfirmation) {
                                        setConfirmModal({
                                          isOpen: true,
                                          title: confirmData.title,
                                          message: confirmData.message,
                                          variant: confirmData.variant,
                                          onConfirm: () => {
                                            setConfirmModal(prev => ({ ...prev, isOpen: false }));
                                            setOpenDropdown(null);
                                            handlePaymentStatus(order.id, s, {
                                              confirmRefund: currentStatus === "paid" && s === "refunded",
                                            });
                                          },
                                        });
                                      } else {
                                        handlePaymentStatus(order.id, s);
                                        setOpenDropdown(null);
                                      }
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F7F6F3] transition-colors ${
                                      order.status === s
                                        ? "font-semibold text-[#00312D]"
                                        : "text-[#1A1A1A]"
                                    }`}
                                  >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </button>
                                );
                              })}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Order Status */}
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              const isOpen = openDropdown?.type === "order" && openDropdown.orderId === order.id;
                              setOpenDropdown(isOpen ? null : { type: "order", orderId: order.id });
                            }}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer select-none ${
                              ORDER_COLORS[order.orderStatus || "pending"] ||
                              ORDER_COLORS.pending
                            }`}
                          >
                            {order.orderStatus || "pending"}
                            <ChevronDown size={11} className="ml-1" />
                          </span>
                          <div className="absolute left-0 top-full mt-1 z-[100] bg-white border border-[#E5E2DA] rounded-lg shadow-lg min-w-[140px]">
                            <div className="max-h-[180px] overflow-y-auto">
                            {ORDER_STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderStatus(order.id, s);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-[#F7F6F3] transition-colors ${
                                  order.orderStatus === s
                                    ? "font-semibold text-[#00312D]"
                                    : "text-[#1A1A1A]"
                                }`}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#6B6B6B] whitespace-nowrap">
                          {fmtDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/orders/adminCustomerOrders/${order.id}`}
                            className="p-1.5 text-[#6B6B6B] hover:text-[#00312D] hover:bg-[#00312D]/8 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye size={15} />
                          </Link>
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  "Delete this order? This cannot be undone."
                                )
                              )
                                handleDelete(order.id);
                            }}
                            disabled={deletingId === order.id || isPending}
                            className="p-1.5 text-[#6B6B6B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete order"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPaymentStatus={handlePaymentStatus}
          onOrderStatus={handleOrderStatus}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedOrder(null);
          }}
        />
      )}

      {/* ── Confirm Modal ── */}
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