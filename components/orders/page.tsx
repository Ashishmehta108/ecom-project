"use client";

import { Order } from "@/lib/types/orders.types";
import { PackageCheck, Clock, Truck } from "lucide-react";

export default function OrdersClient({ orders }: any) {
  if (!orders || orders.length === 0)
    return (
      <div className="p-6 text-gray-600 dark:text-gray-300">
        No orders found.
      </div>
    );

  const statusColor = (status: string) => {
    switch (status) {
      case "delivered":
      case "Delivered":
        return "text-green-600 dark:text-green-400";
      case "shipped":
      case "Shipped":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
      case "delivered":
        return <PackageCheck className="w-4 h-4" />;
      case "Shipped":
      case "shipped":
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      <div className="space-y-6">
        {orders.map((order: Order) => {
          const firstItem = order.items[0];

          const image = firstItem?.product?.productImages[0].url;
          const address = order.shippingAddress;
          console.log(firstItem, image, order,address);

          return (
            <div
              key={order.id}
              className="
                flex flex-col 
                md:flex-row md:items-center md:justify-between 
                gap-6 md:gap-10 
                border border-gray-200 dark:border-gray-700
                bg-white dark:bg-neutral-950 rounded-lg p-4 shadow-sm
              "
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 md:w-1/3">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img
                    src={image}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {firstItem?.product?.name} x {order.items.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Items: {order.items.length}
                  </p>

                  <p className="hidden md:block font-medium mt-2 text-gray-800 dark:text-gray-200">
                    ₹{order.total}
                  </p>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="text-left md:text-center md:w-1/3 text-sm text-gray-700 dark:text-gray-300 leading-5">
                {address ? (
                  <>
                    <p className="font-semibold">{address.fullName}</p>
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>
                      {address.city}, {address.state}
                    </p>
                    <p>{address.phone}</p>
                  </>
                ) : (
                  <p className="italic text-gray-500 dark:text-gray-400">
                    No shipping address
                  </p>
                )}
              </div>

              {/* RIGHT INFO */}
              <div className="text-left md:text-right md:w-1/3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p className="md:hidden font-medium text-gray-800 dark:text-gray-200 text-lg">
                  ₹{order.total}
                </p>

                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

                <div
                  className={`flex items-center gap-1 mt-2 ${statusColor(
                    order.status
                  )}`}
                >
                  {statusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
