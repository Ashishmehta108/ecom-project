"use client";

import { Order } from "@/lib/types/orders.types";
import { PackageCheck, Clock, Truck, MapPin, XCircle } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/app/context/languageContext";
import { getTranslatedText } from "@/lib/utils/language";

// 🌍 Translations
const t = {
  en: {
    heading: "My Orders",
    subtitle: "Track and manage your orders",
    noOrders: "No orders yet",
    noOrdersDesc: "Once you place orders, they will appear here.",
    totalAmount: "Total Amount",
    viewDetails: "View Details",
    oneItem: "1 item",
    manyItems: (n: number) => `${n} items`,
    delivered: "Delivered",
    shipped: "Shipped",
    processing: "Processing",
    paymentSuccess: "Payment Successful",
    paymentFailed: "Payment Failed",
    paymentPending: "Payment Pending",
  },
  pt: {
    heading: "Meus Pedidos",
    subtitle: "Acompanhe e gerencie seus pedidos",
    noOrders: "Nenhum pedido ainda",
    noOrdersDesc: "Quando você fizer pedidos, eles aparecerão aqui.",
    totalAmount: "Valor Total",
    viewDetails: "Ver Detalhes",
    oneItem: "1 item",
    manyItems: (n: number) => `${n} itens`,
    delivered: "Entregue",
    shipped: "Enviado",
    processing: "Processando",
    paymentSuccess: "Pagamento Realizado",
    paymentFailed: "Falha no Pagamento",
    paymentPending: "Pagamento Pendente",
  },
};

export default function OrdersClient({
  orders,
  locale,
}: {
  orders: Order[];
  locale: string;
}) {
  const text = t[locale];

  if (!orders?.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <PackageCheck className="w-16 h-16 mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {text.noOrders}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          {text.noOrdersDesc}
        </p>
      </div>
    );
  }

  const formatPrice = (value: number) =>
    value.toLocaleString(locale, { style: "currency", currency: "EUR" });

  const statusLabels = {
    delivered: text.delivered,
    shipped: text.shipped,
    processing: text.processing,
  };

  const paymentLabels = {
    successful: text.paymentSuccess,
    failed: text.paymentFailed,
    pending: text.paymentPending,
  };

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered")
      return "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300";
    if (s === "shipped")
      return "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300";
    return "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
  };

  const getPaymentStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "successful")
      return "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300";
    if (s === "failed")
      return "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300";
    return "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          {text.heading}
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {text.subtitle}
        </p>
      </div>

      {orders.map((order) => {
        const first = order.items[0];
        const img = first?.product?.productImages?.[0]?.url;
        const totalItems = order.items.length;

        return (
          <div
            key={order.id}
            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-5 md:p-6 gap-6 flex flex-col lg:flex-row">
              {/* Thumbnail + title */}
              <div className="flex gap-4 lg:flex-1">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  {img ? (
                    <img src={img} className="w-full h-full object-cover" />
                  ) : (
                    <PackageCheck className="w-full h-full object-center text-neutral-500" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {first?.product?.name
                      ? getTranslatedText(first.product.name, locale)
                      : "Product"}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {totalItems === 1
                      ? text.oneItem
                      : text.manyItems(totalItems)}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              {/* Status + Total */}
              <div className="lg:w-52 flex lg:flex-col justify-between items-end gap-3">
                {/* Payment Status */}
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getPaymentStatusStyle(
                    order.status
                  )}`}
                >
                  {paymentLabels[order.status.toLowerCase() as keyof typeof paymentLabels]}
                </span>

                {/* Order Status */}
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusStyle(
                    order.orderStatus
                  )}`}
                >
                  {statusLabels[order.orderStatus.toLowerCase() as keyof typeof statusLabels]}
                </span>

                {/* Amount */}
                <div className="text-right">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {text.totalAmount}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 flex justify-end">
              <Link
                href={`/orders/${order.id}`}
                className="text-sm font-medium hover:underline"
              >
                {text.viewDetails}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
