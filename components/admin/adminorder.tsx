"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Loader2, Eye } from "lucide-react";
import { useLanguage } from "@/app/context/languageContext";

import {
  updateOrderStatus,
  getOrderDetails,
} from "@/lib/actions/order.actions";

export default function OrdersClient({ orders, refreshOrders }: any) {
  const { language } = useLanguage();

  const [loadingId, setLoadingId] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  async function showOrderDetails(orderId: string) {
    setDetailsLoading(true);
    const fullOrder = await getOrderDetails(orderId);
    setSelectedOrder(fullOrder);
    setDetailsLoading(false);
    setOpenDetails(true);
  }

  function askToConfirm(order: any, status: string) {
    setSelectedOrder(order);
    setPendingStatus(status);
    setOpenConfirm(true);
  }

  async function confirmStatusUpdate() {
    if (!selectedOrder) return;

    setLoadingId(selectedOrder.id);
    await updateOrderStatus(selectedOrder.id, pendingStatus);
    setLoadingId("");
    setOpenConfirm(false);

    // 🔥 no reload — let parent refresh SWR/state
    refreshOrders?.();
  }

  const statusColor = (status: string) => {
    const colors: any = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      shipped: "bg-blue-100 text-blue-800 border-blue-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
    };
    return colors[status] || "bg-neutral-100 text-neutral-700 border-neutral-300";
  };

  return (
    <>
      {/* Update Status Modal */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Mark order as{" "}
              <strong className="capitalize">{pendingStatus}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenConfirm(false)}>
              Cancel
            </Button>

            <Button
              onClick={confirmStatusUpdate}
              disabled={loadingId === selectedOrder?.id}
            >
              {loadingId === selectedOrder?.id ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-2xl rounded-xl">
          {detailsLoading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle>Order #{selectedOrder.id}</DialogTitle>
                  <DialogDescription>Order Breakdown</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Summary */}
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Status:</strong>{" "}
                      <Badge className={`capitalize border ${statusColor(selectedOrder.orderStatus)}`}>
                        {selectedOrder.orderStatus}
                      </Badge>
                    </p>

                    <p>
                      <strong>Placed:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>

                    <p>
                      <strong>Total:</strong> {selectedOrder.currency}{" "}
                      {selectedOrder.total}
                    </p>
                  </div>

                  <Separator />

                  {/* Products */}
                  <div>
                    <h3 className="font-medium">Products</h3>

                    <div className="space-y-4 mt-3">
                      {selectedOrder.items?.map((item: any) => {
                        const product = item.product;
                        const name =
                          product?.productName?.[language] ??
                          product?.productName?.en ??
                          "Unnamed";

                        const img =
                          product?.productImages?.[0]?.url ||
                          "/placeholder.png";

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-3 rounded-lg border bg-neutral-50"
                          >
                            <img
                              src={img}
                              className="w-14 h-14 rounded-md border object-cover"
                              alt={name}
                            />

                            <div className="flex-1">
                              <p className="font-medium">{name}</p>
                              <p className="text-sm text-neutral-600">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="font-medium">
                              {selectedOrder.currency} {item.price}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Shipping */}
                  {selectedOrder.shippingAddress && (
                    <div className="space-y-1 text-sm">
                      <h3 className="font-medium">Shipping Address</h3>
                      {Object.values(selectedOrder.shippingAddress).map(
                        (line: any, i: number) => (
                          line && <p key={i}>{line}</p>
                        )
                      )}
                    </div>
                  )}

                  {/* Status Update */}
                  {selectedOrder.orderStatus !== "delivered" && (
                    <>
                      <Separator />
                      <div className="flex gap-3">
                        <Button onClick={() => askToConfirm(selectedOrder, "shipped")}>
                          Mark Shipped
                        </Button>
                        <Button onClick={() => askToConfirm(selectedOrder, "delivered")}>
                          Mark Delivered
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )
          )}
        </DialogContent>
      </Dialog>

      {/* Orders List */}
      <div className="grid gap-6 mt-6 md:grid-cols-2">
        {orders.map((order: any) => (
          <Card key={order.id} className="rounded-xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between">
                <span>Order #{order.id}</span>
                <Badge className={`capitalize border ${statusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>Total:</strong> {order.currency} {order.total}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-between mt-4">
                <Button
                  variant="ghost"
                  onClick={() => showOrderDetails(order.id)}
                >
                  <Eye className="w-4 h-4 mr-2" /> View
                </Button>

                {order.orderStatus !== "delivered" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => askToConfirm(order, "shipped")}>
                      Ship
                    </Button>
                    <Button size="sm" onClick={() => askToConfirm(order, "delivered")}>
                      Deliver
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
