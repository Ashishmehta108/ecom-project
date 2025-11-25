  "use client";

  import { useTransition } from "react";
  import {
    addToCustomerCartAction,
    checkoutForCustomerAction,
    removeCartItemAction,
    updateCartItemQtyAction,
  } from "@/lib/customers/order/actions";
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
      startTransition(async () => {
        const redirectUrl = await checkoutForCustomerAction(customerId);

        if (redirectUrl) window.location.href = redirectUrl;
      });
    };

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
