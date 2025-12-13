"use client";

import { useState } from "react";
import { updatePosOrderStatus } from "@/lib/actions/pos-orders";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function OrderRow({ order }: any) {
  const [open, setOpen] = useState(false);

  const customerLabel =
    order.customerName ||
    order.customerEmail ||
    order.customerPhone ||
    "Walk-in Customer";

  return (
    <>
      <tr className="cursor-pointer hover:bg-muted/40">
        {/* ORDER ID */}
        <td className="p-2">{order.id}</td>

        {/* CUSTOMER SNAPSHOT */}
        <td className="p-2">
          <div className="font-medium">{customerLabel}</div>
          <div className="text-xs text-muted-foreground">
            {order.customerEmail || order.customerPhone || ""}
          </div>
        </td>

        {/* TOTAL */}
        <td className="p-2">€{Number(order.total).toFixed(2)}</td>

        {/* STATUS SELECT */}
        <td className="p-2">
          <span
            className={`
      px-2 py-1 rounded text-xs font-medium
      ${
        order.status === "paid"
          ? "bg-green-100 text-green-700"
          : order.status === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : order.status === "expired"
          ? "bg-red-100 text-red-700"
          : "bg-gray-200 text-gray-700"
      }
    `}
          >
            {order.status}
          </span>
        </td>

        {/* PAYMENT INFO */}
        <td className="p-2">
          {order.stripeCheckoutSessionId ? "Stripe Checkout" : "No Payment"}
        </td>

        {/* EXPAND/COLLAPSE */}
        <td className="p-2" onClick={() => setOpen(!open)}>
          {open ? <ChevronUp /> : <ChevronDown />}
        </td>
      </tr>

      {/* EXPANDED ITEM LIST */}
      {open && (
        <tr className="bg-muted/20">
          <td colSpan={6} className="p-4">
            <h3 className="font-semibold mb-2">Items</h3>
            <ul className="space-y-1">
              {order.items.map((i: any) => (
                <li key={i.id}>
                  {i.name} — {i.quantity} × €{i.price}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}
