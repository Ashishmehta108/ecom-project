import { getCustomerOrderById } from "@/lib/actions/admin-actions/adminCustomerOrder";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Hash,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderActions from "./OrderActions";

export const dynamic = "force-dynamic";

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

function fmt(amount: string | null, currency = "EUR") {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: currency || "EUR",
  }).format(Number(amount || 0));
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

const PAYMENT_STYLES: Record<string, { dot: string; pill: string; label: string }> = {
  pending:  { dot: "bg-amber-400",   pill: "bg-amber-50 text-amber-700 ring-amber-200",    label: "Pending"  },
  paid:     { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "Paid"  },
  refunded: { dot: "bg-rose-400",    pill: "bg-rose-50 text-rose-700 ring-rose-200",        label: "Refunded" },
  requires_manual_review: { dot: "bg-orange-400", pill: "bg-orange-50 text-orange-700 ring-orange-200", label: "Review" },
  expired:  { dot: "bg-slate-400",   pill: "bg-slate-50 text-slate-600 ring-slate-200",     label: "Expired"  },
};

const ORDER_STYLES: Record<string, { dot: string; pill: string; label: string }> = {
  pending:    { dot: "bg-slate-400",   pill: "bg-slate-50 text-slate-600 ring-slate-200",      label: "Pending"    },
  processing: { dot: "bg-blue-400",    pill: "bg-blue-50 text-blue-700 ring-blue-200",         label: "Processing" },
  shipped:    { dot: "bg-violet-400",  pill: "bg-violet-50 text-violet-700 ring-violet-200",   label: "Shipped"    },
  delivered:  { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",label: "Delivered"  },
  cancelled:  { dot: "bg-rose-400",    pill: "bg-rose-50 text-rose-700 ring-rose-200",         label: "Cancelled"  },
  completed:  { dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 ring-emerald-200",label: "Completed"  },
};

function StatusPill({ map, value }: { map: typeof PAYMENT_STYLES; value: string | null }) {
  const s = map[value || "pending"] ?? map["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${s.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  const result = await getCustomerOrderById(id);

  if (!result.success || !result.data) notFound();

  const order = result.data;
  const shortId = order.id.slice(-10).toUpperCase();
  const itemCount = order.items?.length ?? 0;
  const hasStripe = !!(order.stripePaymentIntentId || order.stripeCheckoutSessionId);

  return (
    <div className="min-h-screen bg-[#F4F3F0]">

      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button asChild variant="ghost" size="sm" className="shrink-0 -ml-1 text-[#666] hover:text-[#111]">
              <Link href="/admin/orders/adminCustomerOrders">
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Orders
              </Link>
            </Button>
            <span className="text-[#D0CEC9] select-none">·</span>
            <span className="text-sm font-mono text-[#888] truncate">#{shortId}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <StatusPill map={PAYMENT_STYLES} value={order.status} />
            <StatusPill map={ORDER_STYLES} value={order.orderStatus} />
            <OrderActions order={order} />
          </div>
        </div>
      </header>

      {/* ── Page body ──────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-5 py-7 space-y-5">

        {/* ── Hero row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Order total",
              value: fmt(order.total, order.currency ?? "EUR"),
              sub: `${itemCount} item${itemCount !== 1 ? "s" : ""}`,
              accent: "text-[#00312D]",
            },
            {
              label: "Customer",
              value: order.customerName ?? "—",
              sub: order.customerEmail ?? "",
              accent: "text-[#1A1A1A]",
            },
            {
              label: "Placed",
              value: fmtDate(order.createdAt),
              sub: `Updated ${fmtDate(order.updatedAt)}`,
              accent: "text-[#1A1A1A]",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl border border-black/[0.06] px-5 py-4 shadow-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#AAA] mb-1">
                {card.label}
              </p>
              <p className={`text-lg font-semibold leading-tight truncate ${card.accent}`}>
                {card.value}
              </p>
              <p className="text-xs text-[#999] mt-0.5 truncate">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT — items */}
          <section className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0EEE9] flex items-center gap-2">
              <Package className="w-4 h-4 text-[#999]" />
              <h2 className="text-sm font-semibold text-[#1A1A1A]">Order Items</h2>
              {itemCount > 0 && (
                <span className="ml-auto text-xs text-[#BBB] font-medium">{itemCount} items</span>
              )}
            </div>

            {order.items && order.items.length > 0 ? (
              <ul className="divide-y divide-[#F4F3F0]">
                {order.items.map((item: any, idx: number) => {
                  const name =
                    typeof item.name === "object"
                      ? item.name?.en || item.name?.pt || "Product"
                      : item.name || "Product";
                  const img = item.product?.productImages?.[0]?.url;
                  const brand = item.product?.brand ?? "";
                  const model = item.product?.model ?? "";
                  const lineTotal = (Number(item.price) * item.quantity).toFixed(2);

                  return (
                    <li key={item.id} className="flex items-start gap-4 px-5 py-4 group hover:bg-[#FAFAF8] transition-colors">
                      {/* Image */}
                      <div className="w-16 h-16 shrink-0 rounded-xl bg-[#F4F3F0] border border-black/[0.05] flex items-center justify-center overflow-hidden">
                        {img ? (
                          <img src={img} alt={name} className="w-full h-full object-contain p-1.5" />
                        ) : (
                          <Package className="w-6 h-6 text-[#CCC]" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{name}</p>
                        {(brand || model) && (
                          <p className="text-xs text-[#999] mt-0.5">{[brand, model].filter(Boolean).join(" · ")}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs bg-[#F4F3F0] text-[#666] px-2 py-0.5 rounded-full">
                            ×{item.quantity}
                          </span>
                          <span className="text-xs text-[#999]">
                            {fmt(item.price, order.currency ?? "EUR")} each
                          </span>
                        </div>
                      </div>

                      {/* Line total + link */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-[#1A1A1A]">
                          {fmt(lineTotal, order.currency ?? "EUR")}
                        </p>
                        {item.productId && (
                          <Link
                            href={`/admin/products?id=${item.productId}`}
                            className="inline-flex items-center gap-0.5 mt-1 text-[10px] text-indigo-500 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View <ExternalLink className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-16 text-center">
                <Package className="w-10 h-10 text-[#DDD] mx-auto mb-3" />
                <p className="text-sm text-[#BBB]">No items in this order</p>
              </div>
            )}

            {/* Totals footer */}
            <div className="border-t border-[#F0EEE9] px-5 py-4 bg-[#FAFAF8] space-y-2">
              {[
                { label: "Subtotal", val: fmt(order.subtotal, order.currency ?? "EUR") },
                { label: "Tax",      val: fmt(order.tax || "0", order.currency ?? "EUR") },
                { label: "Shipping", val: fmt(order.shippingFee || "0", order.currency ?? "EUR") },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-xs text-[#999]">
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold text-[#1A1A1A] pt-2 border-t border-[#ECEAE4] mt-1">
                <span>Total</span>
                <span>{fmt(order.total, order.currency ?? "EUR")}</span>
              </div>
            </div>
          </section>

          {/* RIGHT — sidebar */}
          <aside className="space-y-4">

            {/* Customer */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F0EEE9] flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#999]" />
                <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Customer</h3>
              </div>
              <div className="px-4 py-3 space-y-3">
                {[
                  { icon: User,   label: "Name",    value: order.customerName },
                  { icon: Mail,   label: "Email",   value: order.customerEmail },
                  { icon: Phone,  label: "Phone",   value: order.customerPhone },
                  { icon: MapPin, label: "Address", value: order.customerAddress },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <div className="mt-0.5 w-6 h-6 shrink-0 rounded-lg bg-[#F4F3F0] flex items-center justify-center">
                      <Icon className="w-3 h-3 text-[#888]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#BBB] uppercase tracking-wide">{label}</p>
                      <p className="text-xs text-[#1A1A1A] mt-0.5 break-words">{value || "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F0EEE9] flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#999]" />
                <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Timeline</h3>
              </div>
              <div className="px-4 py-3 space-y-3">
                {[
                  { label: "Created",      value: fmtDate(order.createdAt) },
                  { label: "Last updated", value: fmtDate(order.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[10px] text-[#BBB] uppercase tracking-wide">{label}</p>
                    <p className="text-xs text-[#1A1A1A] mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stripe */}
            {hasStripe && (
              <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F0EEE9] flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-[#999]" />
                  <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Stripe</h3>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {order.stripePaymentIntentId && (
                    <div>
                      <p className="text-[10px] text-[#BBB] uppercase tracking-wide">Payment Intent</p>
                      <p className="text-[10px] font-mono text-[#555] mt-1 break-all leading-relaxed bg-[#F4F3F0] px-2 py-1.5 rounded-lg">
                        {order.stripePaymentIntentId}
                      </p>
                    </div>
                  )}
                  {order.stripeCheckoutSessionId && (
                    <div>
                      <p className="text-[10px] text-[#BBB] uppercase tracking-wide">Checkout Session</p>
                      <p className="text-[10px] font-mono text-[#555] mt-1 break-all leading-relaxed bg-[#F4F3F0] px-2 py-1.5 rounded-lg">
                        {order.stripeCheckoutSessionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Order ID */}
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F0EEE9] flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-[#999]" />
                <h3 className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-wider">Order ID</h3>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-mono text-[#555] break-all leading-relaxed">
                  {order.id}
                </p>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
}