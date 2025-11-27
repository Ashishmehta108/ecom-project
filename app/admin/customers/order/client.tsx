"use client";

import { useState, useTransition } from "react";
import {
  addToCustomerCartAction,
  checkoutForCustomerAction,
  removeCartItemAction,
  updateCartItemQtyAction,
} from "@/lib/customers/order/actions";

import { createAddress } from "@/lib/actions/address-action";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { ShoppingCart, Plus, Minus, Trash2, User } from "lucide-react";

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
};

type Product = {
  id: string;
  productName: string;
  brand: string;
  model: string;
  description: string;
  mainImage: string | null;
  price: number;
  currency: string;
};

type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  price: string;
  name: string;
  productName: string;
  brand: string;
  model: string;
};

type CartData = {
  cart: { id: string };
  items: CartItem[];
  subtotal: number;
} | null;

export function AdminCustomerOrderClient({
  customer,
  customerId,
  products,
  cartData,
}: {
  customer: Customer;
  customerId: string;
  products: Product[];
  cartData: CartData;
}) {
  const [isPending, startTransition] = useTransition();

  // ----------------------
  // ADDRESS FORM STATE
  // ----------------------
  const [addressForm, setAddressForm] = useState({
    fullName: customer?.name || "",
    phone: customer?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const updateAddressField = (field: string, value: string) =>
    setAddressForm((prev) => ({ ...prev, [field]: value }));

  const [savedAddressId, setSavedAddressId] = useState<string | null>(null);

  const handleSaveAddress = () => {
    startTransition(async () => {
      if (
        !addressForm.fullName ||
        !addressForm.phone ||
        !addressForm.line1 ||
        !addressForm.city ||
        !addressForm.state ||
        !addressForm.postalCode
      ) {
        alert("Please fill all required fields");
        return;
      }

      const res = await createAddress(addressForm);

      if (!res.success) {
        alert(res.error || "Failed to save address");
        return;
      }

      setSavedAddressId(res.addressId!);
      alert("Address saved successfully!");
    });
  };

  // ----------------------
  // ORDER ACTIONS
  // ----------------------

  const handleAddToCart = (productId: string) => {
    startTransition(() => addToCustomerCartAction(customerId, productId));
  };

  const handleQtyChange = (itemId: string, newQty: number) => {
    startTransition(() => updateCartItemQtyAction(customerId, itemId, newQty));
  };

  const handleRemove = (itemId: string) => {
    startTransition(() => removeCartItemAction(customerId, itemId));
  };

  const handleCheckout = () => {
    if (!savedAddressId) {
      alert("Please save an address before checkout.");
      return;
    }

    startTransition(async () => {
      const redirectUrl = await checkoutForCustomerAction(
        customerId,
        savedAddressId!
      );

      if (redirectUrl) window.location.href = redirectUrl;
    });
  };

  // ----------------------
  // UI
  // ----------------------

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* ------------------ CUSTOMER DETAILS ------------------ */}
      <Card className="p-6 space-y-3">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <User className="w-5 h-5" />
          Customer Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{customer?.name ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{customer?.email ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{customer?.phone ?? "N/A"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">
              {customer?.address ?? "No address added"}
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------ ADDRESS FORM ------------------ */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add / Update Address</h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1">Full Name *</label>
            <Input
              value={addressForm.fullName}
              onChange={(e) => updateAddressField("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block mb-1">Phone *</label>
            <Input
              value={addressForm.phone}
              onChange={(e) => updateAddressField("phone", e.target.value)}
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block mb-1">Address Line 1 *</label>
            <Input
              value={addressForm.line1}
              onChange={(e) => updateAddressField("line1", e.target.value)}
              placeholder="123 Street Name"
            />
          </div>

          <div>
            <label className="block mb-1">Address Line 2</label>
            <Input
              value={addressForm.line2}
              onChange={(e) => updateAddressField("line2", e.target.value)}
              placeholder="Apartment, Suite, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">City *</label>
              <Input
                value={addressForm.city}
                onChange={(e) => updateAddressField("city", e.target.value)}
                placeholder="Mumbai"
              />
            </div>

            <div>
              <label className="block mb-1">State *</label>
              <Input
                value={addressForm.state}
                onChange={(e) => updateAddressField("state", e.target.value)}
                placeholder="Maharashtra"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1">Postal Code *</label>
            <Input
              value={addressForm.postalCode}
              onChange={(e) => updateAddressField("postalCode", e.target.value)}
              placeholder="400001"
            />
          </div>

          <div>
            <label className="block mb-1">Country *</label>
            <Input
              value={addressForm.country}
              onChange={(e) => updateAddressField("country", e.target.value)}
            />
          </div>

          <Button
            onClick={handleSaveAddress}
            disabled={isPending}
            className="w-full h-11 rounded-xl"
          >
            {isPending ? "Saving..." : "Save Address"}
          </Button>
        </div>
      </Card>

      {/* ------------------ ORDER CREATION ------------------ */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create Order</h1>

        <div className="flex items-center gap-2 text-sm">
          <ShoppingCart className="w-4 h-4" />
          <span>
            Items: {cartData?.items.length ?? 0} | Subtotal: €
            {cartData?.subtotal ?? 0}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ------------------ PRODUCT LIST ------------------ */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-medium mb-2">Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <Card
                key={p.id}
                className="p-4 flex flex-col gap-2 border rounded-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{p.productName}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.brand} • {p.model}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">€{p.price}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.currency}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2">
                  {p.description}
                </p>

                <Button
                  size="sm"
                  disabled={isPending}
                  className="mt-1"
                  onClick={() => handleAddToCart(p.id)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to cart
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* ------------------ CART PANEL ------------------ */}
        <Card className="p-4 space-y-3">
          <h2 className="font-medium flex items-center justify-between">
            Customer Cart
            <span className="text-xs text-muted-foreground">
              {cartData?.items.length ?? 0} items
            </span>
          </h2>

          {(!cartData || cartData.items.length === 0) && (
            <p className="text-sm text-muted-foreground">No items yet.</p>
          )}

          {cartData && cartData.items.length > 0 && (
            <>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {cartData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 border rounded-md px-2 py-1"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {item.productName || item.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.brand} • {item.model}
                      </div>
                      <div className="text-xs">
                        €{Number(item.price)} x {item.quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>

                      <Input
                        className="w-12 h-7 text-center text-xs"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(item.id, Number(e.target.value) || 0)
                        }
                      />

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() =>
                          handleQtyChange(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{cartData.subtotal}</span>
                </div>

                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={handleCheckout}
                >
                  Checkout for Customer
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
