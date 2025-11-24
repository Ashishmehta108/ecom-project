"use client";

import { Order } from "@/lib/types/orders.types";
import { PackageCheck, Clock, Truck, MapPin, XCircle } from "lucide-react";

export default function OrdersClient({ orders }: any) {
  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <PackageCheck className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            When you place orders, they will appear here.
          </p>
        </div>
      </div>
    );
  }
  const getPaymentStatusConfig = (status: string) => {
    const s = status?.toLowerCase();

    switch (s) {
      case "successful":
        return {
          color:
            "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900",
          label: "Payment Successful",
          icon: <PackageCheck className="w-4 h-4" />,
        };

      case "failed":
        return {
          color:
            "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900",
          label: "Payment Failed",
          icon: <XCircle className="w-4 h-4" />,
        };

      default:
        return {
          color:
            "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900",
          label: "Payment Pending",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const getOrderStatusConfig = (status: string) => {
    const s = status?.toLowerCase() || "processing";

    switch (s) {
      case "order delivered":
      case "delivered":
        return {
          color:
            "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800",
          label: "Delivered",
          icon: <PackageCheck className="w-4 h-4" />,
        };

      case "shipped":
        return {
          color:
            "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900",
          label: "Shipped",
          icon: <Truck className="w-4 h-4" />,
        };

      default:
        return {
          color:
            "bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700",
          label: "Processing",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Orders
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order: Order) => {
          const firstItem = order.items[0];
          const image = firstItem?.product?.productImages?.[0]?.url;
          const address = order.shippingAddress;

          const paymentStatus = getPaymentStatusConfig(order.status);
          const orderStatus = getOrderStatusConfig(order.orderStatus);

          const additionalItems = order.items.length - 1;

          return (
            <div
              key={order.id}
              className="
                bg-white dark:bg-neutral-900 
                border border-gray-200 dark:border-gray-800
                rounded-xl shadow-sm hover:shadow-md 
                transition-shadow duration-200
                overflow-hidden
              "
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex gap-4 lg:flex-1">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 shadow-sm">
                      {image ? (
                        <img
                          src={image}
                          alt={firstItem?.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PackageCheck className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1 truncate">
                        {firstItem?.product?.name || "Product"}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                        {additionalItems > 0 && (
                          <span className="ml-1">
                            (+{additionalItems} more)
                          </span>
                        )}
                      </p>

                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="lg:flex-1 lg:px-6 lg:border-l lg:border-gray-200 lg:dark:border-gray-800">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />

                      <div className="text-sm">
                        {address ? (
                          <div className="space-y-0.5 text-gray-700 dark:text-gray-300">
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {address.fullName}
                            </p>
                            <p>{address.line1}</p>
                            {address.line2 && <p>{address.line2}</p>}
                            <p>
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              {address.phone}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">
                            No shipping address
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STATUS + PRICE */}
                  <div className="lg:w-48 flex lg:flex-col justify-between items-end gap-3">
                    {/* PAYMENT STATUS */}
                    <div className="lg:order-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${paymentStatus.color}`}
                      >
                        {paymentStatus.icon}
                        <span>{paymentStatus.label}</span>
                      </div>
                    </div>

                    {/* ORDER STATUS */}
                    <div className="lg:order-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${orderStatus.color}`}
                      >
                        {orderStatus.icon}
                        <span>{orderStatus.label}</span>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div className="lg:order-1 text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        €{order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
