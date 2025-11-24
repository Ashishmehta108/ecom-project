"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Loader2, Eye } from "lucide-react";

import {
  updateOrderStatus,
  getOrderDetails,
} from "@/lib/actions/order.actions";

export default function OrdersClient({ orders }: any) {
  const [loadingId, setLoadingId] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [pendingStatus, setPendingStatus] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  async function showOrderDetails(orderId: string) {
    setDetailsLoading(true);
    const full = await getOrderDetails(orderId);
    setSelectedOrder(full);
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
    window.location.reload();
  }

  return (
    <>
      {/* STATUS CONFIRMATION MODAL */}
      <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <DialogContent className="max-w-sm border-neutral-200 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Confirm Update
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this order as{" "}
              <strong className="capitalize">{pendingStatus}</strong>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpenConfirm(false)}>
              Cancel
            </Button>

            <Button
              onClick={confirmStatusUpdate}
              disabled={loadingId === selectedOrder?.id}
              className="bg-neutral-900 text-white"
            >
              {loadingId === selectedOrder?.id ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Continue"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FULL DETAILS MODAL */}
      <Dialog open={openDetails} onOpenChange={setOpenDetails}>
        <DialogContent className="max-w-2xl border-neutral-200 rounded-xl p-6">
          {!selectedOrder || detailsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-neutral-900">
                  Order #{selectedOrder.id}
                </DialogTitle>
                <DialogDescription className="text-neutral-600">
                  Full order breakdown including products & shipping details.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* ORDER SUMMARY */}
                <div>
                  <h3 className="font-medium text-neutral-900">
                    Order Summary
                  </h3>

                  <div className="mt-2 text-sm">
                    <p>
                      <strong>Status:</strong>{" "}
                      <Badge className="capitalize">
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
                </div>

                <Separator />

                {/* PRODUCTS */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-3">
                    Products
                  </h3>

                  <div className="space-y-4">
                    {selectedOrder.items?.map((item: any) => {
                      const img =
                        item.product?.productImages?.[0]?.url ||
                        "/placeholder.png";

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 border border-neutral-200 rounded-lg"
                        >
                          <img
                            src={img}
                            className="w-14 h-14 object-cover rounded-md border"
                          />

                          <div className="flex-1">
                            <p className="font-medium text-neutral-900">
                              {item.product?.productName}
                            </p>
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

                {/* SHIPPING ADDRESS */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h3 className="font-medium text-neutral-900">
                      Shipping Address
                    </h3>

                    <div className="text-sm text-neutral-700 mt-2">
                      <p>{selectedOrder.shippingAddress.fullName}</p>
                      <p>{selectedOrder.shippingAddress.line1}</p>
                      {selectedOrder.shippingAddress.line2 && (
                        <p>{selectedOrder.shippingAddress.line2}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress.city},{" "}
                        {selectedOrder.shippingAddress.state}
                      </p>
                      <p>{selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* UPDATE STATUS */}
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">
                    Update Status
                  </h3>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => askToConfirm(selectedOrder, "shipped")}
                      className="bg-neutral-100 text-neutral-800 border border-neutral-300"
                    >
                      Mark Shipped
                    </Button>

                    <Button
                      onClick={() => askToConfirm(selectedOrder, "delivered")}
                      className="bg-neutral-100 text-neutral-800 border border-neutral-300"
                    >
                      Mark Delivered
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ORDERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order: any) => (
          <Card
            key={order.id}
            className="border border-neutral-200 shadow-sm hover:shadow-md transition-all bg-white rounded-xl"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-neutral-900">Order #{order.id}</span>

                <Badge
                  variant="outline"
                  className="capitalize border-neutral-300 text-neutral-700"
                >
                  {order.orderStatus}
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm">
                <strong>User:</strong> {order.userId}
              </p>

              <p className="text-sm">
                <strong>Total:</strong> {order.currency} {order.total}
              </p>

              <p className="text-sm">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => showOrderDetails(order.id)}
                  className="text-neutral-700 hover:bg-neutral-100"
                >
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </Button>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => askToConfirm(order, "shipped")}
                    className="border-neutral-300 bg-neutral-100"
                  >
                    Ship
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => askToConfirm(order, "delivered")}
                    className="border-neutral-300 bg-neutral-100"
                  >
                    Deliver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
