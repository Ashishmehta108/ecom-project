"use client";

import { useState } from "react";
import { PackageCheck, Clock, Truck } from "lucide-react";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "iQOO Neo 10",
      date: "14 Nov 2025",
      status: "Delivered",
      total: 18999,
      items: 1,
      image:
        "https://m.media-amazon.com/images/I/41XfwBsC7wL._SY300_SX300_QL70_FMwebp_.jpg",
      address: {
        name: "Abhishek",
        line1: "Lalru, Punjab, India",
        line2: "Lalru, Punjab",
        phone: "6284698424",
      },
      method: "COD",
      payment: "Paid",
    },
    {
      id: "acer Aspire Lite",
      date: "13 Nov 2025",
      status: "Shipped",
      total: 46999,
      items: 1,
      image:
        "https://m.media-amazon.com/images/I/51hgSf-zC-L._SY300_SX300_QL70_FMwebp_.jpg",
      address: {
        name: "Abhishek",
        line1: "Lalru, Punjab, India",
        line2: "Lalru, Punjab",
        phone: "6284698424",
      },
      method: "COD",
      payment: "Pending",
    },
    {
      id: "Boat Airdopes Joy",
      date: "12 Nov 2025",
      status: "Processing",
      total: 799,
      items: 1,
      image:
        "https://m.media-amazon.com/images/I/512jrg8-68L._AC_UY327_FMwebp_QL65_.jpg",
      address: {
        name: "Abhishek",
        line1: "Lalru, Punjab, India",
        line2: "Lalru, Punjab",
        phone: "6284698424",
      },
      method: "COD",
      payment: "Pending",
    },
  ]);

  // 👉 Format INR with commas
  const formatINR = (amount: number) => {
    return "₹" + amount.toLocaleString("en-IN");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "text-green-600 dark:text-green-400";
      case "Shipped":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <PackageCheck className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        My Orders
      </h1>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="
              flex flex-col 
              md:flex-row md:items-center md:justify-between 
              gap-6 md:gap-10 
              border-b pb-6 last:border-b-0 
              border-gray-200 dark:border-gray-700
              bg-white dark:bg-neutral-950 rounded-lg p-4 shadow-sm
            "
          >
            {/* LEFT: PRODUCT */}
            <div className="flex items-center gap-4 md:w-1/3">
              <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                <img
                  src={order.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {order.id} x {order.items}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Items: {order.items}
                </p>

                {/* Desktop price */}
                <p className="hidden md:block font-medium mt-2 text-gray-800 dark:text-gray-200">
                  {formatINR(order.total)}
                </p>
              </div>
            </div>

            {/* CENTER: ADDRESS */}
            <div className="text-left md:text-center md:w-1/3 text-sm text-gray-700 dark:text-gray-300 leading-5">
              <p className="font-semibold">{order.address.name}</p>
              <p>{order.address.line1}</p>
              <p>{order.address.line2}</p>
              <p>{order.address.phone}</p>
            </div>

            {/* RIGHT: DETAILS */}
            <div className="text-left md:text-right md:w-1/3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {/* Mobile price */}
              <p className="md:hidden font-medium text-gray-800 dark:text-gray-200 text-lg">
                {formatINR(order.total)}
              </p>

              <p>Method: {order.method}</p>
              <p>Date: {order.date}</p>
              <p>Payment: {order.payment}</p>

              <div
                className={`flex items-center gap-1 mt-2 ${statusColor(
                  order.status
                )}`}
              >
                {statusIcon(order.status)}
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
